import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_CATEGORY_ID } from '../common';
import zustandStorage from '../storage';
import {
  TFilters,
  TSelectedTransactionIds,
  TSort,
  TTransaction,
  TTransactionByIds,
  TTransactionsIds,
} from '../types';

type TTransactionsStore = {
  transactionsByIds: TTransactionByIds;
  filters: TFilters;
  sort: TSort;
  pendingDelete: TTransaction | null;
  transactionsIds: TTransactionsIds;
  selectedTransactionIds: TSelectedTransactionIds;
};

type TTransactionsStoreActions = {
  addTransaction: (transaction: TTransaction) => void;
  updateTransaction: (id: string, transaction: TTransaction) => void;
  toggleSelection: (id: string) => void;
  selectTransaction: (id: string) => void;
  deSelectTransaction: (id: string) => void;
  removeTransaction: (id: string) => void;
  setFilters: (filter: Partial<TFilters>) => void;
  resetFilters: () => void;
  deleteForAnAcc: (accId: string) => void;
  importTransactions: (ids: TTransactionsIds, data: TTransactionByIds) => void;
  setSort: (sort: TSort) => void;
  requestDelete: (t: TTransaction) => void;
  undoDelete: () => void;
  confirmDelete: () => void;
};

type PositionStore = TTransactionsStore & TTransactionsStoreActions;

const useTransactionsStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      transactionsIds: [],
      selectedTransactionIds: new Set(),
      categories: [
        {
          name: 'General',
          id: DEFAULT_CATEGORY_ID,
        },
      ],
      transactionsByIds: null,
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
        set(state => ({
          transactionsIds: [...state.transactionsIds, transaction.id],
          transactionsByIds: state.transactionsByIds
            ? {
                ...state.transactionsByIds,
                [transaction.id]: { ...transaction },
              }
            : { [transaction.id]: { ...transaction } },
        }));
      },
      updateTransaction: (id, transaction) => {
        set(state => ({
          ...state,

          transactionsByIds: {
            ...state.transactionsByIds,
            [id]: { ...transaction },
          },
        }));
      },

      toggleSelection: id => {
        set(state => {
          const selectedIds = new Set(state.selectedTransactionIds);
          const isSelected = state.selectedTransactionIds.has(id);
          if (isSelected) {
            selectedIds.delete(id);
          } else {
            selectedIds.add(id);
          }

          return {
            selectedTransactionIds: selectedIds,
          };
        });
      },
      removeTransaction: id => {
        const updatedTransactionIds = get().transactionsIds.filter(
          t => t !== id,
        );
        const updatedTransactionByIds = { ...get().transactionsByIds };

        delete updatedTransactionByIds[id];
        set(() => ({
          transactionsByIds: updatedTransactionByIds,
          transactionsIds: updatedTransactionIds,
        }));
      },
      selectTransaction: id => {
        set(() => ({
          selectedTransactionIds: get().selectedTransactionIds.add(id),
        }));
      },
      deSelectTransaction: id => {
        set(() => {
          const t = new Set(get().selectedTransactionIds);
          t.delete(id);
          return {
            selectedTransactionIds: t,
          };
        });
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
        const totalTransactionByIds = get().transactionsByIds;
        const updatedTransactionIds: TTransactionsIds = [];
        const updatedTransactionsByIds: TTransactionByIds = {};
        get().transactionsIds.forEach(id => {
          const t = totalTransactionByIds ? totalTransactionByIds[id] : null;

          if (t && t.walletId !== accId) {
            updatedTransactionIds.push(id);
            updatedTransactionsByIds[id] = t;
          }
        });
        set({
          transactionsByIds: updatedTransactionsByIds,
          transactionsIds: updatedTransactionIds,
        });
      },

      importTransactions: (transactionsIds, transactionsByIds) => {
        set({ transactionsIds, transactionsByIds });
      },

      setSort: sort => {
        set({ sort });
      },
      requestDelete: transaction => {
        set({
          pendingDelete: transaction,
          transactionsIds: get().transactionsIds.filter(
            t => t !== transaction.id,
          ),
        });
      },
      confirmDelete: () => {
        const pending = get().pendingDelete;
        if (!pending) return;
        const t = { ...get().transactionsByIds };
        delete t[pending.id];
        set({
          pendingDelete: null,
          transactionsByIds: t,
        });
      },
      undoDelete: () => {
        const pending = get().pendingDelete;
        if (!pending) return;
        const ids = [...get().transactionsIds, pending.id];
        set({
          transactionsIds: ids,
          pendingDelete: null,
        });
      },
    }),
    {
      name: 'transactions-storage',
      storage: createJSONStorage(zustandStorage),
      partialize: state => ({
        transactionsIds: state.transactionsIds,
        transactionsByIds: state.transactionsByIds,
        filters: state.filters,
        sort: state.sort,
      }),
    },
  ),
);

export default useTransactionsStore;
