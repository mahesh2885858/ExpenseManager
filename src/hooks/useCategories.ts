import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import useCategoriesStore from '../stores/categoriesStore';
import useTransactionsStore from '../stores/transactionsStore';
import { TCategoryIcon, TCategorySummary, TCategoryType } from '../types';

const useCategories = () => {
  const { t } = useTranslation();
  const categories = useCategoriesStore(state => state.categories);
  const addCategory = useCategoriesStore(state => state.addCategory);
  const updateCategory = useCategoriesStore(state => state.updateCategory);
  const transactionIds = useTransactionsStore(state => state.transactionsIds);
  const transactionsByIds = useTransactionsStore(
    state => state.transactionsByIds,
  );
  const setDefaultCategoryId = useCategoriesStore(
    state => state.setDefaultCategoryId,
  );
  const defaultCategoryId = useCategoriesStore(
    state => state.defaultCategoryId,
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategoryId,
  );

  const selectCategory = (id: string) => {
    setSelectedCategory(id);
  };

  const addNewCategory = (
    name: string,
    icon: TCategoryIcon,
    type: TCategoryType,
    makeDefault = false,
  ) => {
    const categoryExists = categories.find(
      c => c.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    if (categoryExists) {
      throw new Error(t('newCat.catExists'));
    }
    const id = uuid();
    addCategory({
      id,
      name,
      icon,
      type,
    });
    if (makeDefault) {
      setDefaultCategoryId(id);
    }
  };
  const categoriesSummary: TCategorySummary[] = useMemo(() => {
    return categories.map(cat => {
      if (!transactionsByIds)
        return {
          ...cat,
          name: cat.name,
          id: cat.id,
          income: 0,
          expense: 0,
        };
      const ids =
        transactionsByIds &&
        transactionIds.filter(id =>
          transactionsByIds[id].categoryId ===cat.id,
        );
      return {
        ...cat,
        name: cat.name,
        id: cat.id,
        income: ids.reduce((prev, item) => {
          return transactionsByIds[item].type === 'income'
            ? prev + transactionsByIds[item].amount
            : prev;
        }, 0),
        expense: ids.reduce((prev, item) => {
          return transactionsByIds[item].type === 'expense'
            ? prev + transactionsByIds[item].amount
            : prev;
        }, 0),
      };
    });
  }, [categories, transactionsByIds, transactionIds]);

  const getCategoryNameById = useCallback(
    (id: string) => {
      return categories.find(cat => cat.id === id)?.name ?? '';
    },
    [categories],
  );

  return {
    categories,
    selectCategory,
    selectedCategory,
    addCategory: addNewCategory,
    defaultCategoryId,
    categoriesSummary,
    updateCategory,
    getCategoryNameById,
  };
};

export default useCategories;
