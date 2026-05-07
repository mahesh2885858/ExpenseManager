import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catRepo } from '../db/repositories/categories.repo';
import useCategoriesStore from '../stores/categoriesStore';
import useProfileStore from '../stores/profileStore';
import useTransactionsStore from '../stores/transactionsStore';
import { TCategoryIcon, TCategorySummary, TCategoryType } from '../types';
import useFetchRecords from './useFetchRecords';

const useCategories = () => {
  const { t } = useTranslation();
  const selectedProfileId = useProfileStore(state => state.selectedProfileId);
  const categories = useCategoriesStore(state => state.categories);
  const updateCategory = useCategoriesStore(state => state.updateCategory);
  const transactionIds = useTransactionsStore(state => state.transactionsIds);
  const transactionsByIds = useTransactionsStore(
    state => state.transactionsByIds,
  );
  const { fetchCategories } = useFetchRecords();
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

  const addNewCategory = async (
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
    const iconString = JSON.stringify(icon);
    await catRepo.create({
      icon: iconString,
      name,
      id: name.toLowerCase(),
      type,
      profileId: selectedProfileId,
    });

    await fetchCategories();

    if (makeDefault) {
      setDefaultCategoryId(name.toLowerCase());
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
        transactionIds.filter(
          id => transactionsByIds[id].categoryId === cat.id,
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
