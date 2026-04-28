import { create } from 'zustand';
import { TFilters, TSort, TTransaction } from '../types';

type Cursor = {
  date: number;
  id: string;
};

type TTransactionsStore = {
  // DATA (from SQLite - only current pages)
  transactions: TTransaction[];
  cursor: Cursor | null;
  hasMore: boolean;

  // UI STATE
  selectedIds: Set<string>;
  filters: TFilters;
  sort: TSort;
  pendingDelete: TTransaction | null;

  // LOADING STATE
  isLoading: boolean;
};

type TTransactionsStoreActions = {
  setTransactions: (txs: TTransaction[], cursor: Cursor | null) => void;
  appendTransactions: (txs: TTransaction[], cursor: Cursor | null) => void;
  addTransactionOptimistic: (tx: TTransaction) => void;
  updateTransactionLocal: (tx: TTransaction) => void;
  removeTransactionLocal: (id: string) => void;

  toggleSelection: (id: string) => void;
  clearSelection: () => void;

  setFilters: (filters: Partial<TFilters>) => void;
  resetFilters: () => void;
  setSort: (sort: TSort) => void;

  requestDelete: (t: TTransaction) => void;
  confirmDeleteLocal: () => void;
  undoDelete: () => void;

  setLoading: (loading: boolean) => void;
};

type Store = TTransactionsStore & TTransactionsStoreActions;

const useTransactionsStore = create<Store>((set, get) => ({
  // -------------------------
  // INITIAL STATE
  // -------------------------
  transactions: [],
  cursor: null,
  hasMore: true,

  selectedIds: new Set(),

  filters: {
    date: { isThisMonth: true },
    type: null,
    categoryId: null,
  },

  sort: 'dateNewFirst',
  pendingDelete: null,

  isLoading: false,

  // -------------------------
  // DATA HANDLING
  // -------------------------

  setTransactions: (txs, cursor) => {
    set({
      transactions: txs,
      cursor,
      hasMore: txs.length > 0,
    });
  },

  appendTransactions: (txs, cursor) => {
    set(state => ({
      transactions: [...state.transactions, ...txs],
      cursor,
      hasMore: txs.length > 0,
    }));
  },

  addTransactionOptimistic: tx => {
    set(state => ({
      transactions: [tx, ...state.transactions],
    }));
  },

  updateTransactionLocal: updated => {
    set(state => ({
      transactions: state.transactions.map(t =>
        t.id === updated.id ? updated : t
      ),
    }));
  },

  removeTransactionLocal: id => {
    set(state => ({
      transactions: state.transactions.filter(t => t.id !== id),
    }));
  },

  // -------------------------
  // SELECTION (UI ONLY)
  // -------------------------

  toggleSelection: id => {
    set(state => {
      const next = new Set(state.selectedIds);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return { selectedIds: next };
    });
  },

  clearSelection: () => {
    set({ selectedIds: new Set() });
  },

  // -------------------------
  // FILTERS / SORT (UI ONLY)
  // -------------------------

  setFilters: filters => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        date: { isThisMonth: true },
        type: null,
        categoryId: null,
      },
    });
  },

  setSort: sort => {
    set({ sort });
  },

  // -------------------------
  // DELETE FLOW (UI OPTIMISTIC)
  // -------------------------

  requestDelete: t => {
    set(state => ({
      pendingDelete: t,
      transactions: state.transactions.filter(tx => tx.id !== t.id),
    }));
  },

  confirmDeleteLocal: () => {
    set({ pendingDelete: null });
  },

  undoDelete: () => {
    const pending = get().pendingDelete;
    if (!pending) return;

    set(state => ({
      transactions: [pending, ...state.transactions],
      pendingDelete: null,
    }));
  },

  // -------------------------
  // LOADING
  // -------------------------

  setLoading: loading => {
    set({ isLoading: loading });
  },
}));

export default useTransactionsStore;
