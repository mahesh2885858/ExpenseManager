import { useMemo, useState } from 'react';
import useTransactionsStore from '../stores/transactionsStore';
import { v4 as uuid } from 'uuid';
import { TCategorySummary } from '../types';

const useCategories = () => {
  const categories = useTransactionsStore(state => state.categories);
  const addCategory = useTransactionsStore(state => state.addCategory);
  const transactions = useTransactionsStore(state => state.transactions);
  const updateCategory = useTransactionsStore(state => state.updateCategory);
  const defaultCategoryId = useMemo(() => {
    return categories.filter(c => c.isDefault)[0]?.id ?? '';
  }, [categories]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategoryId,
  );

  const selectCategory = (id: string) => {
    setSelectedCategory(id);
  };

  const addNewCategory = (name: string, makeDefault = false) => {
    const id = uuid();

    addCategory(
      {
        id,
        name,
      },
      makeDefault,
    );
  };
  const categoriesSummary: TCategorySummary[] = useMemo(() => {
    return categories.map(cat => {
      const tr = transactions.filter(t => t.categoryIds.includes(cat.id));
      return {
        name: cat.name,
        id: cat.id,
        income: tr.reduce((prev, item) => {
          return item.type === 'income' ? prev + item.amount : prev;
        }, 0),
        expense: tr.reduce((prev, item) => {
          return item.type === 'expense' ? prev + item.amount : prev;
        }, 0),
      };
    });
  }, [categories, transactions]);

  return {
    categories,
    selectCategory,
    selectedCategory,
    addCategory: addNewCategory,
    defaultCategoryId,
    categoriesSummary,
    updateCategory,
  };
};

export default useCategories;
