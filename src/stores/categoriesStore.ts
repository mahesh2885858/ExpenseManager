import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CATEGORY_ID } from '../common';
import zustandStorage from '../storage';
import { TCategories, TCategory } from '../types';

type TTransactionsStore = {
  categories: TCategories;
  defaultCategoryId: string | null;
};

type TTransactionsStoreActions = {
  addCategory: (category: TCategory) => void;

  updateCategory: (cat: TCategory) => void;
  removeCategory: (catId: string) => void;
  importCategories: (cats: TCategories) => void;
  setDefaultCategoryId: (catId: string | null) => void;
};

type PositionStore = TTransactionsStore & TTransactionsStoreActions;

const useCategoriesStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      categories: [
        {
          name: 'General',
          id: DEFAULT_CATEGORY_ID,
        },
      ],
      defaultCategoryId: DEFAULT_CATEGORY_ID,

      addCategory: category => {
        set(state => {
          return { categories: [...state.categories, category] };
        });
      },

      updateCategory: cat => {
        const updatedCats = get().categories.map(c => {
          if (c.id === cat.id) {
            return { ...cat };
          } else return c;
        });
        set({ categories: updatedCats });
      },

      removeCategory: catId => {
        set(state => ({
          categories: state.categories.filter(c => c.id !== catId),
        }));
      },

      importCategories: cats => {
        set({ categories: cats });
      },
      setDefaultCategoryId: catId => {
        set({ defaultCategoryId: catId });
      },
    }),
    {
      name: 'categories-storage',
      storage: createJSONStorage(zustandStorage),
    },
  ),
);

export default useCategoriesStore;
