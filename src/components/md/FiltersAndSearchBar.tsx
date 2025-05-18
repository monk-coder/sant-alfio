import React, { useState, useEffect } from 'react';
import { type FiltersAndSearchProps, type FilterOption, type Filter } from '@types/Filters.ts';
import { TextInput } from "@ui/inputs/TextInput.tsx";
import styles from './FiltersAndSearchBar.module.css';

const FiltersAndSearchBar: React.FC<FiltersAndSearchProps> = ({
  filters,
  searchPlaceholder = 'Search...',
  onSearch,
  onFilterChange,
}: FiltersAndSearchProps): React.ReactElement => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFilterChange = (title: string, e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onFilterChange(title, e.target.value);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filtersContainer}>
        {filters.map((filter: Filter) => (
          <div key={filter.title} className={styles.filter} style={{ width: 100 / filters.length + "%" }}>
            {filter.type === 'date' ? (
              <div className={styles.dateFilter}>
                <label className={styles.dateLabel}>{filter.title}</label>
                <input
                  type="date"
                  className={styles.dateInput}
                  onChange={(e) => handleFilterChange(filter.title, e)}
                />
              </div>
            ) : (
              <select
                className={styles.select}
                onChange={(e) => handleFilterChange(filter.title, e)}
                defaultValue=""
              >
                <option value="" disabled>
                  {filter.title}
                </option>
                {filter.options.map((option: FilterOption) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      <div className={styles.searchContainer}>
        <TextInput
          className={styles.searchInput}
          name={"search"}
          value={searchValue}
          placeholder={searchPlaceholder}
          onChange={handleSearchChange}
          required={false}
        />
      </div>
    </div>
  );
};

export default FiltersAndSearchBar;
