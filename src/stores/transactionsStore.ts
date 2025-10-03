import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TCategories, TCategory, TTransaction } from '../types';
import { DEFAULT_CATEGORY_ID } from '../common';

type TTransactionsStore = {
  transactions: TTransaction[];
  categories: TCategories;
};

type TTransactionsStoreActions = {
  addTransaction: (account: TTransaction) => void;
  addCategory: (category: TCategory) => void;
};

type PositionStore = TTransactionsStore & TTransactionsStoreActions;

const useTransactionsStore = create<PositionStore>()(
  persist(
    set => ({
      transactions: [],
      categories: [
        {
          name: 'General',
          id: DEFAULT_CATEGORY_ID,
        },
      ],
      addTransaction: transaction => {
        set(state => ({ transactions: [...state.transactions, transaction] }));
      },
      addCategory: category => {
        set(state => ({ categories: [...state.categories, category] }));
      },
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(zustandStorage),
    },
  ),
);

export default useTransactionsStore;
