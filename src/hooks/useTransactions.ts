import { isSameDay } from 'date-fns/fp';
import { useCallback, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { db } from '../db';
import { buildOrderBy, buildWhereClause } from '../db/helpers/transactions';
import { txnRepo } from '../db/repositories/transactions.repo';
import useTransactionsStore from '../stores/transactionsStore';
import { TTransaction, TTransactionRow } from '../types';
import { money } from '../utils';
type THeaderItem = {
  type: 'header';
  item: Date;
};
type TTransactionItem = {
  type: 'txn';
  item: TTransaction;
};
type TGroupedTransactions = Array<THeaderItem | TTransactionItem>;
const LIMIT = 5;

const useTransactions = (walletId?: string, search?: string) => {
  const [cursor, setCursor] = useState<TTransaction | null>(null);

  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setLoading] = useState(false);
  const filters = useTransactionsStore(s => s.filters);
  const sort = useTransactionsStore(s => s.sort);
  const updateTxn = useTransactionsStore(state => state.updateTransaction);
  const deleteTransaction = useTransactionsStore(state => state.delete);

  const [transactions, setTransactions] = useState<TGroupedTransactions>([]);

  const removeEmptyGroups = useCallback((txns: TGroupedTransactions) => {
    const result: TGroupedTransactions = [];
    txns.forEach((txn, i) => {
      if (txn.type === 'txn') {
        result.push(txn);
      } else {
        // check whether next item exist or not
        if (!!txns[i + 1] && txns[i + 1].type === 'txn') {
          result.push(txn);
        }
      }
    });
    return result;
  }, []);

  const appendTransactionsFromDB = useCallback(
    (existing: TGroupedTransactions, txns: TTransaction[]) => {
      const groupedItems: TGroupedTransactions = [...existing];

      let currentDate: Date | null = null;

      // If transactions already exist, initialize with last rendered txn date
      if (existing.length > 0) {
        const lastTxn = existing[existing.length - 1] as TTransactionItem;

        currentDate = new Date(lastTxn.item.transaction_date);
      }

      txns.forEach(t => {
        const tDate = new Date(t.transaction_date);

        const transformedTxn = {
          ...t,
          amount: t.amount,
        };

        const shouldCreateHeader =
          !currentDate || !isSameDay(tDate, currentDate);

        if (shouldCreateHeader) {
          currentDate = tDate;

          groupedItems.push({
            type: 'header',
            item: currentDate,
          });
        }

        groupedItems.push({
          type: 'txn',
          item: transformedTxn,
        });
      });

      return groupedItems;
    },
    [],
  );

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);

      const { clause, args } = buildWhereClause(filters, search, walletId);
      const orderBy = buildOrderBy(sort);

      const result = await db.execute(
        `
      SELECT
        t.*,

        json_object(
          'id', c.id,
          'name', c.name,
          'icon', c.icon
        ) as category

      FROM transactions t

      LEFT JOIN categories c
        ON c.id = t.category_id

      ${clause}
      ${orderBy}

      LIMIT ${LIMIT}
      `,
        args,
      );
      console.log({ result: result });
      const rows = (result.rows as unknown as TTransactionRow[]).map(row => {
        const category = JSON.parse(row.category);
        const icon = JSON.parse(category.icon);
        return {
          ...row,
          amount: money.fromStored(row.amount),
          category: { ...category, icon },
        };
      });
      setTransactions(() => appendTransactionsFromDB([], rows));
      console.log({ rows, LIMIT });
      if (rows.length < LIMIT) {
        setHasMore(false);
      }
      setCursor(rows[rows.length - 1]);
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    sort,
    walletId,
    setLoading,
    appendTransactionsFromDB,
    setTransactions,
    search,
  ]);
  const loadMore = useCallback(async () => {
    try {
      if (!cursor || !hasMore || isLoading) return;

      setLoading(true);

      const { clause, args } = buildWhereClause(
        { ...filters, date: null },
        search,
        walletId,
      );
      const orderBy = buildOrderBy(sort);
      const cursorClause = clause
        ? `AND (
            t.transaction_date < ?
            OR (
              t.transaction_date = ?
              AND t.id < ?
            )
          )`
        : `WHERE (
            t.transaction_date < ?
            OR (
              t.transaction_date = ?
              AND t.id < ?
            )
          )`;

      const result = await db.execute(
        `
        SELECT
          t.*,

          json_object(
            'id', c.id,
            'name', c.name,
            'icon', c.icon,
            'type', c.type
          ) as category

        FROM transactions t

        LEFT JOIN categories c
          ON c.id = t.category_id

        ${clause}
        ${cursorClause}

        ${orderBy}

        LIMIT ${LIMIT}
        `,
        [...args, cursor.transaction_date, cursor.transaction_date, cursor.id],
      );
      const rows = (result.rows as unknown as TTransactionRow[]).map(row => {
        const category = JSON.parse(row.category);
        const icon = JSON.parse(category.icon);
        return {
          ...row,
          amount: money.fromStored(row.amount),
          category: { ...category, icon },
        };
      });
      console.log({ cursor, rows });
      setTransactions(prev => {
        const t = appendTransactionsFromDB(prev, rows);
        console.log({ t });
        return t;
      });
      if (rows.length < LIMIT) {
        setHasMore(false);
      }
      if (rows.length > 0) {
        setCursor(rows[rows.length - 1]);
      }
    } catch (er) {
      console.log({ er });
    } finally {
      setLoading(false);
    }
  }, [
    cursor,
    hasMore,
    appendTransactionsFromDB,
    isLoading,
    filters,
    sort,
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
      });

      // 3. Optional: refresh if strict consistency needed
      // await loadInitial(); // uncomment if you want exact DB sync
    },
    [walletId, filters],
  );

  const updateTransaction = useCallback(
    async (txn: TTransaction) => {
      await txnRepo.update(txn.id, { ...txn });
      updateTxn(txn.id, txn);
    },
    [updateTxn],
  );

  const deleteTxn = useCallback(
    async (id: string) => {
      try {
        await txnRepo.delete(id);
        deleteTransaction(id);
        // Optimistic removal of txn
        setTransactions(prev => {
          const filtered = prev.filter(
            t => t.type === 'header' || (t.type === 'txn' && t.item.id !== id),
          );
          return removeEmptyGroups(filtered);
        });
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
    hasMore,
  };
};

export default useTransactions;
