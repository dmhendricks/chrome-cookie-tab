import type { FilterBy } from '../hooks/useSettings';

interface Props {
  value: string;
  filterBy: FilterBy;
  onChange: (value: string) => void;
}

const PLACEHOLDERS: Record<FilterBy, string> = {
  name: 'Filter by name',
  value: 'Filter by value',
  'name-value': 'Filter by name or value',
};

export function FilterBar({ value, filterBy, onChange }: Props) {
  return (
    <div id="filter-bar">
      <input
        type="search"
        className="filter-input"
        placeholder={PLACEHOLDERS[filterBy]}
        value={value}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
      />
    </div>
  );
}
