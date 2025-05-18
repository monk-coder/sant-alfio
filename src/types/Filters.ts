export interface FilterOption {
  value: string | number;
  label: string;
}

export interface Filter {
  title: string;
  options: FilterOption[];
  state?: FilterOption;
  type?: 'select' | 'date';
  paramName?: string;
}

export interface FiltersAndSearchProps {
  filters: Filter[];
  searchPlaceholder?: string;
  onSearch: (value: string) => void;
  onFilterChange: (filterTitle: string, value: string | number) => void;
}
