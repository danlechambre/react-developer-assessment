import React from 'react';
import { Category } from './App';
import { mapValues } from 'lodash';
import styles from '../styles/CategoryFilter.module.css';

interface CategoryFilterProps {
  categories: Category[];
  filter: Record<string, boolean>;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const CategoryFilter = ({ categories, filter, setFilter }: CategoryFilterProps) => {
  const handleUpdateCategoryFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFilter((prevState) => ({
      ...prevState,
      [value]: checked,
    }));
  };

  const handleClearSelection = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const resetObj = mapValues({ ...filter }, () => false);
    setFilter(resetObj);
  };

  return (
    <div className={styles.wrapper}>
      <fieldset className={styles.fieldSet}>
        <legend className={styles.legend}>Filter by category: </legend>
        <div className={styles.flexWrapper}>
          {categories.map((category) => (
            <div key={category.id} className={styles.inputWrapper}>
              <input
                type="checkbox"
                id={category.id}
                name="categories"
                value={category.name}
                onChange={handleUpdateCategoryFilter}
                checked={filter[category.name] ?? false}
                className={styles.checkbox}
              />
              <label htmlFor={category.id} className={styles.inputLabel}>
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <button className={styles.button} type="button" onClick={handleClearSelection}>
        Clear Selection
      </button>
    </div>
  );
};

export default CategoryFilter;
