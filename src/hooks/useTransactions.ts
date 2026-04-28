import { useCallback, useEffect } from 'react';
import useTransactionsStore from '../stores/transactionsStore';
import {
  getTransactions,
  deleteTransaction,
} from '../db/repositories/transactions.repo';
import useBudgets from './useBudgets';

const PAGE_SIZE = 20;

const useTransactions = () => {
  const {
    transactions,
    cursor,
    setTransactions,
    appendTransactions,
    addTransactionOptimistic,
    removeTransactionLocal,
    updateTransactionLocal,
    setLoading,
    isLoading,
  } = useTransactionsStore();

  const { updateBudgetSpentForTransaction, updateBudgetForTransactionUpdate } =
    useBudgets();

  // -------------------------
  // INITIAL LOAD
  // -------------------------
  const loadInitial = useCallback(async () => {
    setLoading(true);

    const rows = await getTransactions({ limit: PAGE_SIZE });

    setTransactions(rows, rows.length ? rows[rows.length - 1] : null);

    setLoading(false);
  }, [setTransactions, setLoading]);

  // -------------------------
  // LOAD MORE (pagination)
  // -------------------------
  const loadMore = useCallback(async () => {
    if (!cursor || isLoading) return;

    setLoading(true);

    const rows = await getTransactions({
      limit: PAGE_SIZE,
      cursor,
    });

    appendTransactions(rows, rows.length ? rows[rows.length - 1] : null);

    setLoading(false);
  }, [cursor, appendTransactions, isLoading, setLoading]);

  // -------------------------
  // ADD
  // -------------------------
  const addNewTransaction = useCallback(
    async tx => {
      // 1. Insert into DB
      await addTransaction(tx);

      // 2. Optimistic UI update
      addTransactionOptimistic(tx);

      updateBudgetSpentForTransaction(tx);
    },
    [addTransactionOptimistic, updateBudgetSpentForTransaction],
  );

  // -------------------------
  // UPDATE
  // -------------------------
  const updateATransaction = useCallback(
    async (updated, original) => {
      await updateTransaction(updated.id, updated);

      updateTransactionLocal(updated);
      updateBudgetForTransactionUpdate(updated, original);
    },
    [updateTransactionLocal, updateBudgetForTransactionUpdate],
  );

  // -------------------------
  // DELETE
  // -------------------------
  const deleteTransaction = useCallback(
    async tx => {
      await deleteTransaction(tx.id);

      removeTransactionLocal(tx.id);
      updateBudgetSpentForTransaction(tx, 'delete');
    },
    [removeTransactionLocal, updateBudgetSpentForTransaction],
  );

  // -------------------------
  // INITIAL FETCH
  // -------------------------
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return {
    transactions,
    loadMore,
    isLoading,
    addNewTransaction,
    updateATransaction,
    deleteTransaction,
  };
};

export default useTransactions;
