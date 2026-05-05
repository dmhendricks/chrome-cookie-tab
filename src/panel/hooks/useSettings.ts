import { useEffect, useState, useCallback } from 'preact/hooks';

export type FilterBy = 'name' | 'value' | 'name-value';

export interface Settings {
  showCopyIcons: boolean;
  showFilterBar: boolean;
  filterBy: FilterBy;
}

const DEFAULTS: Settings = {
  showCopyIcons: true,
  showFilterBar: true,
  filterBy: 'name',
};

const FILTER_BY_VALUES: readonly FilterBy[] = ['name', 'value', 'name-value'];

const KEYS = Object.keys(DEFAULTS) as (keyof Settings)[];

function isFilterBy(v: unknown): v is FilterBy {
  return typeof v === 'string' && (FILTER_BY_VALUES as readonly string[]).includes(v);
}

function resolve(raw: Record<string, unknown>): Settings {
  const out: Settings = { ...DEFAULTS };
  if (typeof raw.showCopyIcons === 'boolean') out.showCopyIcons = raw.showCopyIcons;
  if (typeof raw.showFilterBar === 'boolean') out.showFilterBar = raw.showFilterBar;
  if (isFilterBy(raw.filterBy)) out.filterBy = raw.filterBy;
  return out;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    chrome.storage.sync.get(KEYS, (raw) => {
      setSettings(resolve(raw));
    });
    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area !== 'sync') return;
      const relevant = KEYS.some((key) => key in changes);
      if (!relevant) return;
      chrome.storage.sync.get(KEYS, (raw) => {
        setSettings(resolve(raw));
      });
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const setSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    chrome.storage.sync.set({ [key]: value });
  }, []);

  return { settings, setSetting };
}
