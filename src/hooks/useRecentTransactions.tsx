import { useCallback } from 'react';
import {
  getStartOfMonth,
  getStartOfNextMonth,
} from '../db/helpers/transactions';
import { db } from '../db';
import { TTransaction } from '../types';
type TTransactionRow = Omit<TTransaction, 'category'> & {
  category: string;
};
export const useRecentTransactions = () => {
  const getRecentTransactions = useCallback(async (walletId?: string) => {
    try {
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
      ON t.category_id = c.id

      WHERE t.transaction_date >= ?
      AND t.transaction_date < ?

      ORDER BY t.transaction_date DESC
      LIMIT 20
        `,
        walletId
          ? [getStartOfMonth(), getStartOfNextMonth(), walletId]
          : [getStartOfMonth(), getStartOfNextMonth()],
      );
      const rows = result.rows as unknown as TTransactionRow[];
      return rows.map(t => ({ ...t, category: JSON.parse(t.category) }));
    } catch (err) {
      console.log('Error while fetching recent transactions: ', err);
      return []; //safely return empty array
    }
  }, []);

  const getMonthlySummary = useCallback(async (walletId?: string) => {
    const result = await db.execute(
      `
      SELECT
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE transaction_date >= ? AND transaction_date < ?
      ${walletId ? 'AND wallet_id = ?' : ''}
      `,
      walletId
        ? [getStartOfMonth(), getStartOfNextMonth(), walletId]
        : [getStartOfMonth(), getStartOfNextMonth()],
    );

    return result.rows[0];
  }, []);

  return {
    getRecentTransactions,
    getMonthlySummary,
  };
};
