import { useState } from 'react';
import useTransactionsStore from '../stores/transactionsStore';
import { v4 as uuid } from 'uuid';
import { DEFAULT_CATEGORY_ID } from '../common';

const useCategories = () => {
  const categories = useTransactionsStore(state => state.categories);
  const addCategory = useTransactionsStore(state => state.addCategory);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    DEFAULT_CATEGORY_ID,
  );

  const selectCategory = (id: string) => {
    setSelectedCategory(id);
  };

  const addNewCategory = (name: string) => {
    const id = uuid();
    addCategory({
      id,
      name,
    });
  };

  return {
    categories,
    selectCategory,
    selectedCategory,
    addCategory: addNewCategory,
  };
};

export default useCategories;
