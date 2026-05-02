import type { UICookie } from '../types';
import { CookieRow } from './CookieRow';

interface Props {
  cookies: UICookie[];
  widths: number[];
  onRowContextMenu: (e: MouseEvent, c: UICookie) => void;
  onFillerContextMenu: (e: MouseEvent) => void;
  onRowDoubleClick: (c: UICookie) => void;
}

export function Content({
  cookies,
  widths,
  onRowContextMenu,
  onFillerContextMenu,
  onRowDoubleClick,
}: Props) {
  return (
    <div id="content">
      <table style={{ width: '100%', height: '100%' }}>
        <colgroup>
          {widths.map((w, i) => (
            <col key={i} style={{ width: `${w}%` }} />
          ))}
          <col style={{ width: '14px' }} />
        </colgroup>
        <tbody>
          {cookies.map((c) => (
            <CookieRow
              key={c.id}
              cookie={c}
              onContextMenu={onRowContextMenu}
              onDoubleClick={onRowDoubleClick}
            />
          ))}
          <tr
            className="filler"
            onContextMenu={(e) => onFillerContextMenu(e as unknown as MouseEvent)}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <td key={i}></td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
