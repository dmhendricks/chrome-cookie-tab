import type { UICookie, SortColumn, SortDir } from './types';

export function cookieSize(c: UICookie): number {
  return (c.name ?? '').length + (c.value ?? '').length;
}

export function expirationDate(c: UICookie): Date | null {
  if (c.expirationDate === undefined || c.expirationDate === null) return null;
  return new Date(c.expirationDate * 1000);
}

export function isSession(c: UICookie): boolean {
  if (c.session !== undefined) return c.session;
  return c.expirationDate === undefined || c.expirationDate === null;
}

function sortKey(c: UICookie, col: SortColumn): string | number | null {
  switch (col) {
    case 'size':
      return cookieSize(c);
    case 'expires': {
      const d = expirationDate(c);
      return d ? d.getTime() : 0;
    }
    case 'httpOnly':
      return c.httpOnly ? 1 : 0;
    case 'secure':
      return c.secure ? 1 : 0;
    case 'name':
      return c.name ?? '';
    case 'value':
      return c.value ?? '';
    case 'domain':
      return c.domain ?? '';
    case 'path':
      return c.path ?? '';
  }
}

export function sortCookies(
  cookies: UICookie[],
  col: SortColumn,
  dir: SortDir,
): UICookie[] {
  const out = cookies.slice();
  out.sort((a, b) => {
    const ka = sortKey(a, col);
    const kb = sortKey(b, col);
    if (ka === kb) return 0;
    if (ka === null) return 1;
    if (kb === null) return -1;
    const cmp = ka < kb ? -1 : 1;
    return dir === 'asc' ? cmp : -cmp;
  });
  return out;
}
