import { useLayoutEffect, useRef, useState } from 'preact/hooks';

export interface ContextMenuActions {
  onAddNew: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onRemoveAll: () => void;
  onExport: () => void;
  onImport: () => void;
  onRefresh: () => void;
}

interface Props {
  x: number;
  y: number;
  isInRow: boolean;
  actions: ContextMenuActions;
  onDismiss: () => void;
}

export function ContextMenu({ x, y, isInRow, actions, onDismiss }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: y, left: x });

  useLayoutEffect(() => {
    ref.current?.focus();
    const body = bodyRef.current;
    if (!body) return;
    const { offsetWidth: w, offsetHeight: h } = body;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 4;
    let left = x;
    let top = y;
    if (left + w + margin > vw) left = Math.max(margin, x - w);
    if (left + w + margin > vw) left = Math.max(margin, vw - w - margin);
    if (top + h + margin > vh) top = Math.max(margin, y - h);
    if (top + h + margin > vh) top = Math.max(margin, vh - h - margin);
    setPos({ top, left });
  }, [x, y]);

  const item = (id: string, label: string, fn: () => void) => (
    <div
      id={id}
      className="context-menu-item"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        fn();
        onDismiss();
      }}
    >
      {label}
    </div>
  );

  return (
    <div
      id="context-menu-view"
      ref={ref}
      tabIndex={0}
      onBlur={onDismiss}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onDismiss();
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onDismiss();
      }}
    >
      <div id="context-menu-body" ref={bodyRef} style={{ top: pos.top, left: pos.left }}>
        {item('add-new-cookie', 'Add New Cookie', actions.onAddNew)}
        {isInRow && (
          <>
            {item('edit-cookie', 'Edit Cookie', actions.onEdit)}
            {item('remove-cookie', 'Remove Cookie', actions.onRemove)}
          </>
        )}
        <div className="context-menu-item-separator"></div>
        {item('remove-all-cookies', 'Remove All Cookies', actions.onRemoveAll)}
        {item('refresh-cookies', 'Refresh', actions.onRefresh)}
        <div className="context-menu-item-separator"></div>
        {item('export-all-cookies', 'Export All Cookies', actions.onExport)}
        {item('import-all-cookies', 'Import Cookies', actions.onImport)}
      </div>
    </div>
  );
}
