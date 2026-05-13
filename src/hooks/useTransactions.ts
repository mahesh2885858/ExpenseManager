import { useCallback } from 'react';
import useTransactionsStore from '../stores/transactionsStore';
import {
  buildOrderBy,
  buildWhereClause,
  getCursor,
} from '../db/helpers/transactions';
import { db } from '../db';
import { TTransaction } from '../types';
import { txnRepo } from '../db/repositories/transactions.repo';
import { ToastAndroid } from 'react-native';

const LIMIT = 50;

const useTransactions = (walletId?: string, search?: string) => {
  const {
    transactions,
    cursor,
    hasMore,
    filters,
    sort,
    setTransactions,
    appendTransactions,
    isLoading,
    setLoading,
  } = useTransactionsStore();
  const updateTxn = useTransactionsStore(state => state.updateTransaction);
  const deleteTransaction = useTransactionsStore(state => state.delete);
  const loadInitial = useCallback(async () => {
    setLoading(true);

    const { clause, args } = buildWhereClause(filters, search, walletId);
    const orderBy = buildOrderBy(sort);

    const result = await db.execute(
      `
      SELECT * FROM transactions
      ${clause}
      ${orderBy}
      LIMIT ${LIMIT}
      `,
      args,
    );

    setTransactions(result.rows, getCursor(result.rows));
    setLoading(false);
  }, [filters, sort, walletId, setLoading, setTransactions, search]);
  const loadMore = useCallback(async () => {
    if (!cursor || !hasMore || isLoading) return;

    setLoading(true);

    const { clause, args } = buildWhereClause(filters, search, walletId);
    const orderBy = buildOrderBy(sort);

    const result = await db.execute(
      `
      SELECT * FROM transactions
      ${clause}
      AND (transactionDate < ? OR (transactionDate = ? AND id < ?))
      ${orderBy}
      LIMIT ${LIMIT}
      `,
      [...args, cursor.date, cursor.date, cursor.id],
    );

    appendTransactions(result.rows, getCursor(result.rows));
    setLoading(false);
  }, [
    cursor,
    hasMore,
    isLoading,
    filters,
    sort,
    appendTransactions,
    search,
    setLoading,
    walletId,
  ]);

  const addTransaction = useCallback(
    async (tx: TTransaction) => {
      console.log({ tx });
      // 1. Optimistic UI update (only if it matches current list)
      const shouldShow =
        (!walletId || tx.wallet_id === walletId) &&
        (!filters?.type || filters.type === tx.type);

      if (shouldShow) {
        // Insert at top (since default sort is date desc)
        useTransactionsStore.setState(state => ({
          transactions: [tx, ...state.transactions],
        }));
      }

      // 2. Persist to DB
      await txnRepo.create({
        ...tx,
        amount: tx.amount * 100,
      });

      // 3. Optional: refresh if strict consistency needed
      // await loadInitial(); // uncomment if you want exact DB sync
    },
    [walletId, filters],
  );

  const updateTransaction = useCallback(
    async (txn: TTransaction) => {
      await txnRepo.update(txn.id, { ...txn, amount: txn.amount * 100 });
      updateTxn(txn.id, txn);
    },
    [updateTxn],
  );

  const deleteTxn = useCallback(
    async (id: string) => {
      try {
        await txnRepo.delete(id);
        deleteTransaction(id);
      } catch (e) {
        console.log('Error while deleting the transaction: ', e);
        ToastAndroid.show(
          e instanceof Error ? e.message : 'Error while deleting transaction',
          2000,
        );
      }
    },
    [deleteTransaction],
  );

  return {
    transactions,
    loadInitial,
    loadMore,
    refresh: loadInitial,
    addTransaction,
    updateTransaction,
    deleteTxn,
  };
};

export default useTransactions;
