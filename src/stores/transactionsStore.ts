import { create } from 'zustand';
import { TFilters, TSort, TTransaction } from '../types';

export type Cursor = {
  date: number;
  id: string;
};

type TTransactionsStore = {
  transactions: TTransaction[];
  recents: TTransaction[];
  cursor: Cursor | null;
  hasMore: boolean;

  filters: TFilters;
  sort: TSort;

  selectedIds: Set<string>;
  pendingDelete: TTransaction | null;

  isLoading: boolean;
};

type Actions = {
  setTransactions: (txs: TTransaction[], cursor: Cursor | null) => void;
  setRecents: (txs: TTransaction[]) => void;
  appendTransactions: (txs: TTransaction[], cursor: Cursor | null) => void;
  reset: () => void;

  setFilters: (filters: Partial<TFilters>) => void;
  setSort: (sort: TSort) => void;

  toggleSelection: (id: string) => void;
  clearSelection: () => void;

  requestDelete: (t: TTransaction) => void;
  undoDelete: () => void;
  confirmDeleteLocal: () => void;
  updateTransaction: (id: string, txn: TTransaction) => void;
  setLoading: (loading: boolean) => void;
  delete: (id: string) => void;
};

const useTransactionsStore = create<TTransactionsStore & Actions>(
  (set, get) => ({
    transactions: [],
    recents: [],
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

    setTransactions: (txs, cursor) =>
      set({
        transactions: txs,
        cursor,
        hasMore: txs.length > 0,
      }),
    setRecents: txns => set({ recents: txns }),

    appendTransactions: (txs, cursor) =>
      set(state => ({
        transactions: [...state.transactions, ...txs],
        cursor,
        hasMore: txs.length > 0,
      })),

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

    requestDelete: t =>
      set(state => ({
        pendingDelete: t,
        transactions: state.transactions.filter(tx => tx.id !== t.id),
      })),
    updateTransaction: (id, txn) => {
      set(state => ({
        transactions: state.transactions.map(t => (t.id === id ? txn : t)),
      }));
    },

    undoDelete: () => {
      const pending = get().pendingDelete;
      if (!pending) return;

      set(state => ({
        transactions: [pending, ...state.transactions],
        pendingDelete: null,
      }));
    },

    confirmDeleteLocal: () => set({ pendingDelete: null }),

    setLoading: v => set({ isLoading: v }),
    delete: id =>
      set({ transactions: get().transactions.filter(t => t.id !== id) }),
  }),
);

export default useTransactionsStore;
