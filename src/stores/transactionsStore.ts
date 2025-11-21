import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CATEGORY_ID } from '../common';
import zustandStorage from '../storage';
import { TCategories, TCategory, TFilters, TTransaction } from '../types';

type TTransactionsStore = {
  transactions: TTransaction[];
  categories: TCategories;
  filters: TFilters;
};

type TTransactionsStoreActions = {
  addTransaction: (account: TTransaction) => void;
  updateTransaction: (id: string, transaction: TTransaction) => void;
  addCategory: (category: TCategory) => void;
  toggleSelection: (id: string) => void;
  removeTransaction: (id: string) => void;
  setFilters: (filter: TFilters) => void;
  resetFilters: () => void;
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
      filters: {
        date: null,
        type: null,
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
        set(state => ({ categories: [...state.categories, category] }));
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
          set(() => ({ filters: filter }));
        }
      },
      resetFilters: () => {
        set(() => ({
          filters: {
            date: null,
            type: null,
          },
        }));
      },
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(zustandStorage),
    },
  ),
);

export default useTransactionsStore;
