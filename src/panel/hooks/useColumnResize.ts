import { useState, useCallback } from 'preact/hooks';

const DEFAULT_WIDTHS = [14.8, 40, 10, 5, 5, 15, 5, 5];

export function useColumnResize() {
  const [widths, setWidths] = useState<number[]>(DEFAULT_WIDTHS);

  const resize = useCallback((index: number, deltaPercent: number) => {
    setWidths((prev) => {
      const a = (prev[index] ?? 0) - deltaPercent;
      const b = (prev[index + 1] ?? 0) + deltaPercent;
      if (a < 3 || b < 3) return prev;
      const next = prev.slice();
      next[index] = a;
      next[index + 1] = b;
      return next;
    });
  }, []);

  return { widths, resize };
}
