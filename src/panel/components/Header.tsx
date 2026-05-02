import type { SortState, SortColumn } from '../types';

interface Col {
  key: SortColumn;
  label: string;
}

const COLS: Col[] = [
  { key: 'name', label: 'Name' },
  { key: 'value', label: 'Value' },
  { key: 'domain', label: 'Domain' },
  { key: 'size', label: 'Size' },
  { key: 'path', label: 'Path' },
  { key: 'expires', label: 'Expires (GMT)' },
  { key: 'httpOnly', label: 'HTTP' },
  { key: 'secure', label: 'Secure' },
];

interface Props {
  widths: number[];
  sort: SortState | null;
  onSort: (col: SortColumn) => void;
}

export function Header({ widths, sort, onSort }: Props) {
  return (
    <div id="header">
      <table style={{ width: '100%', height: '100%' }}>
        <colgroup>
          {COLS.map((c, i) => (
            <col key={c.key} style={{ width: `${widths[i]}%` }} />
          ))}
          <col style={{ width: '14px' }} />
        </colgroup>
        <tbody>
          <tr>
            {COLS.map((c) => {
              const cls = sort?.column === c.key ? sort.dir : '';
              return (
                <th
                  key={c.key}
                  data-col={c.key}
                  className={cls}
                  onClick={() => onSort(c.key)}
                >
                  <div>{c.label}</div>
                </th>
              );
            })}
            <th className="corner"></th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { COLS };
