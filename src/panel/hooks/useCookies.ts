import { useEffect, useMemo, useState } from 'preact/hooks';
import * as v from 'valibot';
import type { Socket } from '../socket';
import { cookieKey, type UICookie } from '../types';
import {
  IncomingCookieSchema,
  IncomingCookieListSchema,
} from '../../shared/cookie-schema';

const UpdateResponseSchema = v.intersect([
  IncomingCookieSchema,
  v.object({ id: v.string() }),
]);

export function useCookies(socket: Socket) {
  const [cookies, setCookies] = useState<UICookie[]>([]);

  useEffect(() => {
    const offRead = socket.on('cookies:read', (data) => {
      const result = v.safeParse(IncomingCookieListSchema, data);
      if (!result.success) return;
      setCookies((prev) => {
        const byId = new Map(prev.map((c) => [c.id, c]));
        return result.output.cookies.map((c) => {
          const id = cookieKey(c);
          const existing = byId.get(id);
          if (!existing) return { ...c, id };
          const e = existing as unknown as Record<string, unknown>;
          const n = c as unknown as Record<string, unknown>;
          for (const k of Object.keys(n)) {
            if (e[k] !== n[k]) return { ...existing, ...c, id };
          }
          return existing;
        });
      });
    });

    const offCreate = socket.on('cookies:create', (data) => {
      const result = v.safeParse(IncomingCookieSchema, data);
      if (!result.success) return;
      const id = cookieKey(result.output);
      setCookies((prev) => {
        const idx = prev.findIndex((c) => c.id === id);
        if (idx >= 0) {
          const next = prev.slice();
          next[idx] = { ...prev[idx], ...result.output, id };
          return next;
        }
        return [...prev, { ...result.output, id }];
      });
    });

    const offUpdate = socket.on('cookies:update', (data) => {
      const result = v.safeParse(UpdateResponseSchema, data);
      if (!result.success) return;
      const updated = result.output;
      setCookies((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
      );
    });

    const offRemoveAll = socket.on('removeAllCookies', () => {
      setCookies([]);
    });

    const offNavigate = socket.on('navigate', () => {
      setCookies([]);
    });

    socket.saveListener();
    socket.read();

    return () => {
      offRead();
      offCreate();
      offUpdate();
      offRemoveAll();
      offNavigate();
    };
  }, [socket]);

  const api = useMemo(
    () => ({
      refresh: () => socket.read(),
      create: (cookie: Parameters<Socket['create']>[0]) => socket.create(cookie),
      remove: (cookie: UICookie) => {
        setCookies((prev) => prev.filter((c) => c.id !== cookie.id));
        socket.remove(cookie);
      },
      removeAll: () => {
        setCookies([]);
        socket.removeAll();
      },
      importAll: (cookies: Parameters<Socket['import']>[0]) => {
        setCookies([]);
        socket.import(cookies);
      },
      update: (
        previous: UICookie,
        changed: Partial<UICookie> & { session?: boolean; hostOnly?: boolean },
      ) => {
        setCookies((prev) =>
          prev.map((c) =>
            c.id === previous.id ? ({ ...c, ...changed } as UICookie) : c,
          ),
        );
        socket.update(previous, changed);
      },
    }),
    [socket],
  );

  return { cookies, ...api };
}
