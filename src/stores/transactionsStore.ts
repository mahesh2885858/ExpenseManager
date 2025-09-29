import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TTransaction } from '../types';

type TTransactionsStore = { transactions: TTransaction[] };

type TTransactionsStoreActions = {
  addTransaction: (account: TTransaction) => void;
};

type PositionStore = TTransactionsStore & TTransactionsStoreActions;

const useTransactionsStore = create<PositionStore>()(
  persist(
    set => ({
      transactions: [
        {
          accountId: '1234',
          amount: 10,
          categoryIds: ['123'],
          createdAt: new Date().toString(),
          id: '1234',
          type: 'expense',
        },
      ],
      addTransaction: transaction => {
        set(state => ({ transactions: [...state.transactions, transaction] }));
      },
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(zustandStorage),
    },
  ),
);

export default useTransactionsStore;
