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
          id: '1',
          accountId: 'acc_001',
          type: 'expense',
          amount: 350,
          createdAt: '2025-09-30T10:30:00.000Z',
          categoryIds: ['cat_food'],
          description: 'Grocery shopping at supermarket',
        },
        {
          id: '2',
          accountId: 'acc_001',
          type: 'income',
          amount: 5000,
          createdAt: '2025-09-29T09:00:00.000Z',
          categoryIds: ['cat_salary'],
          description: 'Monthly salary deposit',
        },
        {
          id: '3',
          accountId: 'acc_001',
          type: 'expense',
          amount: 120,
          createdAt: '2025-09-28T18:45:00.000Z',
          categoryIds: ['cat_transport'],
          description: 'Uber ride to office',
        },
        {
          id: '4',
          accountId: 'acc_001',
          type: 'expense',
          amount: 2500,
          createdAt: '2025-09-27T14:20:00.000Z',
          categoryIds: ['cat_rent'],
          description: 'Monthly apartment rent',
        },
        {
          id: '5',
          accountId: 'acc_001',
          type: 'income',
          amount: 800,
          createdAt: '2025-09-26T16:30:00.000Z',
          categoryIds: ['cat_freelance'],
          description: 'Freelance project payment',
        },
        {
          id: '6',
          accountId: 'acc_001',
          type: 'expense',
          amount: 450,
          createdAt: '2025-09-25T20:15:00.000Z',
          categoryIds: ['cat_food'],
          description: 'Dinner at restaurant',
        },
        {
          id: '7',
          accountId: 'acc_001',
          type: 'expense',
          amount: 75,
          createdAt: '2025-09-24T11:00:00.000Z',
          categoryIds: ['cat_utilities'],
          description: 'Mobile phone recharge',
        },
        {
          id: '8',
          accountId: 'acc_001',
          type: 'income',
          amount: 200,
          createdAt: '2025-09-23T08:30:00.000Z',
          categoryIds: ['cat_investment'],
          description: 'Stock dividend received',
        },
        {
          id: '9',
          accountId: 'acc_001',
          type: 'expense',
          amount: 1200,
          createdAt: '2025-09-22T15:45:00.000Z',
          categoryIds: ['cat_shopping'],
          description: 'New laptop accessories',
        },
        {
          id: '10',
          accountId: 'acc_001',
          type: 'expense',
          amount: 180,
          createdAt: '2025-09-21T12:20:00.000Z',
          categoryIds: ['cat_health'],
          description: 'Doctor consultation fee',
        },
        {
          id: '11',
          accountId: 'acc_001',
          type: 'income',
          amount: 1500,
          createdAt: '2025-09-20T17:00:00.000Z',
          categoryIds: ['cat_bonus'],
          description: 'Performance bonus',
        },
        {
          id: '12',
          accountId: 'acc_001',
          type: 'expense',
          amount: 95,
          createdAt: '2025-09-19T19:30:00.000Z',
          categoryIds: ['cat_entertainment'],
          description: 'Movie tickets',
        },
        {
          id: '13',
          accountId: 'acc_001',
          type: 'expense',
          amount: 300,
          createdAt: '2025-09-18T13:15:00.000Z',
          categoryIds: ['cat_utilities'],
          description: 'Electricity bill payment',
        },
        {
          id: '14',
          accountId: 'acc_001',
          type: 'income',
          amount: 350,
          createdAt: '2025-09-17T10:45:00.000Z',
          categoryIds: ['cat_gift'],
          description: 'Birthday gift money',
        },
        {
          id: '15',
          accountId: 'acc_001',
          type: 'expense',
          amount: 220,
          createdAt: '2025-09-16T16:00:00.000Z',
          categoryIds: ['cat_food'],
          description: 'Weekly groceries',
        },
        {
          id: '16',
          accountId: 'acc_001',
          type: 'expense',
          amount: 500,
          createdAt: '2025-09-15T21:30:00.000Z',
          categoryIds: ['cat_fuel'],
          description: 'Petrol fill-up',
        },
        {
          id: '17',
          accountId: 'acc_001',
          type: 'income',
          amount: 600,
          createdAt: '2025-09-14T14:20:00.000Z',
          categoryIds: ['cat_refund'],
        },
        {
          id: '18',
          accountId: 'acc_001',
          type: 'expense',
          amount: 150,
          createdAt: '2025-09-13T11:10:00.000Z',
          categoryIds: ['cat_subscriptions'],
          description: 'Netflix subscription',
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
