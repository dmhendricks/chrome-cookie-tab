import type { Cookie } from '../background/cookie-service';

export type UICookie = Cookie & {
  id: number;
  hostOnly?: boolean;
  session?: boolean;
};

export type SortColumn = 'name' | 'value' | 'domain' | 'size' | 'path' | 'expires' | 'httpOnly' | 'secure';
export type SortDir = 'asc' | 'desc';

export interface SortState {
  column: SortColumn;
  dir: SortDir;
}
