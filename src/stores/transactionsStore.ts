import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CATEGORY_ID } from '../common';
import zustandStorage from '../storage';
import { TCategories, TCategory, TFilters, TTransaction } from '../types';

type TTransactionsStore = {
  transactions: TTransaction[];
  categories: TCategories;
  filters: TFilters;
  defaultCategoryId: string | null;
};

type TTransactionsStoreActions = {
  addTransaction: (account: TTransaction) => void;
  updateTransaction: (id: string, transaction: TTransaction) => void;
  addCategory: (category: TCategory) => void;
  toggleSelection: (id: string) => void;
  removeTransaction: (id: string) => void;
  setFilters: (filter: Partial<TFilters>) => void;
  resetFilters: () => void;
  deleteForAnAcc: (accId: string) => void;
  updateCategory: (cat: TCategory) => void;
  removeCategory: (catId: string) => void;
  importTransactions: (t: TTransaction[]) => void;
  importCategories: (cats: TCategories) => void;
  setDefaultCategoryId: (catId: string | null) => void;
};

type PositionStore = TTransactionsStore & TTransactionsStoreActions;

const useTransactionsStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [
        {
          name: 'General',
          id: DEFAULT_CATEGORY_ID,
        },
      ],
      defaultCategoryId: DEFAULT_CATEGORY_ID,
      filters: {
        date: null,
        type: null,
        categoryId: null,
      },
      addTransaction: transaction => {
        set(state => ({ transactions: [...state.transactions, transaction] }));
      },
      updateTransaction: (id, transaction) => {
        set(state => ({
          ...state,
          transactions: state.transactions.map(t => {
            if (t.id === id) return { ...t, ...transaction };
            return t;
          }),
        }));
      },
      addCategory: category => {
        set(state => {
          return { categories: [...state.categories, category] };
        });
      },
      toggleSelection: id => {
        set(state => ({
          transactions: state.transactions.map(t => {
            if (t.id === id) {
              return { ...t, isSelected: !t.isSelected };
            } else {
              return t;
            }
          }),
        }));
      },
      removeTransaction: id => {
        const updatedTransactions = get().transactions.filter(t => t.id !== id);
        set(() => ({
          transactions: updatedTransactions,
        }));
      },
      setFilters: filter => {
        if (filter) {
          set(state => ({ filters: { ...state.filters, ...filter } }));
        }
      },
      resetFilters: () => {
        set(() => ({
          filters: {
            date: null,
            type: null,
            categoryId: null,
          },
        }));
      },
      deleteForAnAcc: accId => {
        const updatedTransaction = get().transactions.filter(
          t => t.accountId !== accId,
        );
        set({
          transactions: updatedTransaction,
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
      importTransactions: transactions => {
        set({ transactions });
      },
      importCategories: cats => {
        set({ categories: cats });
      },
      setDefaultCategoryId: catId => {
        set({ defaultCategoryId: catId });
      },
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(zustandStorage),
    },
  ),
);

export default useTransactionsStore;
