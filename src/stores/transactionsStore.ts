import { create } from 'zustand';
import {
  TFilters,
  TGroupedTransactions,
  TSort,
  TSummary,
  TTransaction,
} from '../types';

export type Cursor = {
  date: number;
  id: string;
};

type TTransactionsStore = {
  transactions: TGroupedTransactions;
  recents: TTransaction[];
  cursor: Cursor | null;
  hasMore: boolean;
  summary: TSummary;
  filters: TFilters;
  sort: TSort;

  selectedIds: Set<string>;
  pendingDelete: TTransaction | null;

  isLoading: boolean;
};

type Actions = {
  setTransactions: (txs: TGroupedTransactions) => void;
  setRecents: (txs: TTransaction[]) => void;
  reset: () => void;

  setFilters: (filters: Partial<TFilters>) => void;
  setSort: (sort: TSort) => void;

  toggleSelection: (id: string) => void;
  clearSelection: () => void;

  confirmDeleteLocal: () => void;
  updateTransaction: (id: string, txn: TTransaction) => void;
  setLoading: (loading: boolean) => void;
  setSummary: (summary: TSummary) => void;
};

const useTransactionsStore = create<TTransactionsStore & Actions>(
  (set, get) => ({
    transactions: [],
    recents: [],
    summary: {
      balance: 0,
      expense: 0,
      income: 0,
    },
    cursor: null,
    hasMore: true,

    filters: {
      date: { isThisMonth: true },
      type: null,
      categoryId: null,
    },

    sort: 'dateNewFirst',

    selectedIds: new Set(),
    pendingDelete: null,

    isLoading: false,

    setTransactions: txs =>
      set({
        transactions: txs,
      }),
    setRecents: txns => set({ recents: txns }),
    updateTransaction: (id, txn) =>
      set({
        transactions: get().transactions.map(t => {
          if (t.type === 'header') return t;
          return id === t.item.id ? { ...t, item: { ...txn } } : t;
        }),
      }),
    reset: () =>
      set({
        transactions: [],
        cursor: null,
        hasMore: true,
      }),

    setFilters: filters =>
      set(state => ({
        filters: { ...state.filters, ...filters },
      })),

    setSort: sort => set({ sort }),

    toggleSelection: id =>
      set(state => {
        const next = new Set(state.selectedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        return { selectedIds: next };
      }),

    clearSelection: () => set({ selectedIds: new Set() }),

    confirmDeleteLocal: () => set({ pendingDelete: null }),

    setLoading: v => set({ isLoading: v }),
    setSummary(summary) {
      set({ summary });
    },
  }),
);

export default useTransactionsStore;
