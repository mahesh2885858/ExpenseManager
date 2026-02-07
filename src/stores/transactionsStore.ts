import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CATEGORY_ID } from '../common';
import zustandStorage from '../storage';
import { TFilters, TSort, TTransaction } from '../types';

type TTransactionsStore = {
  transactions: TTransaction[];
  filters: TFilters;
  sort: TSort;
  pendingDelete: TTransaction | null;
};

type TTransactionsStoreActions = {
  addTransaction: (account: TTransaction) => void;
  updateTransaction: (id: string, transaction: TTransaction) => void;
  toggleSelection: (id: string) => void;
  removeTransaction: (id: string) => void;
  setFilters: (filter: Partial<TFilters>) => void;
  resetFilters: () => void;
  deleteForAnAcc: (accId: string) => void;
  importTransactions: (t: TTransaction[]) => void;
  setSort: (sort: TSort) => void;
  requestDelete: (t: TTransaction) => void;
  undoDelete: () => void;
  confirmDelete: () => void;
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
        date: {
          isThisMonth: true,
        },
        type: null,
        categoryId: null,
      },
      sort: 'dateNewFirst',
      pendingDelete: null,
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
            date: {
              isThisMonth: true,
            },
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

      importTransactions: transactions => {
        set({ transactions });
      },

      setSort: sort => {
        set({ sort });
      },
      requestDelete: transaction => {
        set({
          pendingDelete: transaction,
          transactions: get().transactions.filter(t => t.id !== transaction.id),
        });
      },
      confirmDelete: () => {
        const pending = get().pendingDelete;
        if (!pending) return;
        set({
          pendingDelete: null,
        });
      },
      undoDelete: () => {
        const pending = get().pendingDelete;
        if (!pending) return;
        set({
          transactions: [pending, ...get().transactions],
          pendingDelete: null,
        });
      },
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(zustandStorage),
    },
  ),
);

export default useTransactionsStore;
