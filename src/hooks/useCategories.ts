import { useMemo, useState } from 'react';
import useTransactionsStore from '../stores/transactionsStore';
import { v4 as uuid } from 'uuid';

const useCategories = () => {
  const categories = useTransactionsStore(state => state.categories);
  const addCategory = useTransactionsStore(state => state.addCategory);
  const defaultCategoryId = useMemo(() => {
    return categories.filter(c => c.isDefault)[0]?.id ?? '';
  }, [categories]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategoryId,
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
    defaultCategoryId,
  };
};

export default useCategories;
