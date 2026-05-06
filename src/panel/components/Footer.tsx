import { SettingsPopover } from './SettingsPopover';
import type { Settings } from '../hooks/useSettings';

interface Props {
  count: number;
  selectedCount: number;
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export function Footer({ count, selectedCount, settings, setSetting }: Props) {
  return (
    <div id="footer">
      <div id="cookies-count-container">
        Total cookies: <span id="cookies-count">{count}</span>
        {selectedCount >= 2 && (
          <>
            {' • '}
            Selected: <span id="selected-count">{selectedCount}</span>
          </>
        )}
      </div>
      <SettingsPopover settings={settings} setSetting={setSetting} />
    </div>
  );
}
