import { useState } from 'preact/hooks';
import type { UICookie } from '../types';
import { cookieSize, expirationDate, isSession } from '../util';

interface Props {
  cookie: UICookie;
  onContextMenu: (e: MouseEvent, c: UICookie) => void;
  onDoubleClick: (c: UICookie) => void;
}

function CopyAffordance({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    });
  };
  return (
    <span
      className="copy-affordance"
      title="Copy"
      onClick={onClick}
      onDblClick={(e) => e.stopPropagation()}
    >
      {copied ? '✓' : '⧉'}
    </span>
  );
}

export function CookieRow({ cookie, onContextMenu, onDoubleClick }: Props) {
  const session = isSession(cookie);
  const expires = expirationDate(cookie);
  return (
    <tr
      className="cookie-row"
      onContextMenu={(e) => onContextMenu(e as unknown as MouseEvent, cookie)}
      onDblClick={() => onDoubleClick(cookie)}
    >
      <td>
        <div className="copy-cell">
          <span className="cell-text">{cookie.name}</span>
          <CopyAffordance value={cookie.name} />
        </div>
      </td>
      <td>
        <div className="copy-cell">
          <span className="cell-text">{cookie.value}</span>
          <CopyAffordance value={cookie.value} />
        </div>
      </td>
      <td><div className="domain">{cookie.domain}</div></td>
      <td><div className="size">{cookieSize(cookie)} B</div></td>
      <td><div>{cookie.path}</div></td>
      <td>
        {session ? (
          <div className="green">Session</div>
        ) : (
          <div>{expires ? expires.toString() : ''}</div>
        )}
      </td>
      <td>{cookie.httpOnly ? <div className="green">True</div> : null}</td>
      <td>{cookie.secure ? <div className="green">True</div> : null}</td>
      <td></td>
    </tr>
  );
}
