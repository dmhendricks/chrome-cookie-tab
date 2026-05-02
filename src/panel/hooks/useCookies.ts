import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Socket } from '../socket';
import type { UICookie } from '../types';

interface ReadPayload { cookies: Array<Omit<UICookie, 'id'>>; }

export function useCookies(socket: Socket) {
  const [cookies, setCookies] = useState<UICookie[]>([]);
  const ctr = useRef(0);

  const nextId = () => {
    ctr.current += 1;
    return ctr.current;
  };

  useEffect(() => {
    const offRead = socket.on('cookies:read', (data) => {
      const list = (data as ReadPayload).cookies ?? [];
      setCookies(list.map((c) => ({ ...c, id: nextId() } as UICookie)));
    });

    const offCreate = socket.on('cookies:create', (data) => {
      const c = data as Omit<UICookie, 'id'>;
      if (!c) return;
      setCookies((prev) => [...prev, { ...c, id: nextId() } as UICookie]);
    });

    const offUpdate = socket.on('cookies:update', (data) => {
      const updated = data as (UICookie & { id: number }) | null;
      if (!updated) return;
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
