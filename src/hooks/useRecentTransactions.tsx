import { useCallback } from 'react';
import { db } from '../db';
import {
  getStartOfMonth,
  getStartOfNextMonth,
} from '../db/helpers/transactions';
import { TTransactionRow } from '../types';
import { money } from '../utils';

export const useRecentTransactions = () => {
  const getRecentTransactions = useCallback(
    async (profileId: string, walletId?: string) => {
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
        ${walletId ? 'AND t.wallet_id = ?' : ''}
        ${profileId ? 'AND t.profile_id = ?' : ''}

        ORDER BY t.transaction_date DESC
        LIMIT 10
        `,
          [
            getStartOfMonth(),
            getStartOfNextMonth(),
            ...(walletId ? [walletId] : []),
            ...(profileId ? [profileId] : []),
          ],
        );
        console.log({ profileId, t: result.rows });
        const rows = result.rows as unknown as TTransactionRow[];
        return rows.map(t => {
          const category = JSON.parse(t.category);
          const icon = JSON.parse(category.icon);
          return {
            ...t,
            amount: money.fromStored(t.amount),
            category: { ...category, icon },
          };
        });
      } catch (err) {
        console.log('Error while fetching recent transactions: ', err);
        return []; //safely return empty array
      }
    },
    [],
  );

  const getMonthlySummary = useCallback(
    async (profileId: string, walletId?: string) => {
      const result = await db.execute(
        `
        SELECT
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense

        FROM transactions

        WHERE transaction_date >= ?
        AND transaction_date < ?
        ${walletId ? 'AND wallet_id = ?' : ''}
        ${profileId ? 'AND profile_id = ?' : ''}
      `,
        [
          getStartOfMonth(),
          getStartOfNextMonth(),
          ...(walletId ? [walletId] : []),
          ...(profileId ? [profileId] : []),
        ],
      );

      return {
        income: money.fromStored(result.rows[0].income),
        expense: money.fromStored(result.rows[0].expense),
      };
    },
    [],
  );

  const getBalance = useCallback(
    async (profileId: string, walletId?: string) => {
      const result = await db.execute(
        `
      SELECT
        COALESCE(SUM(balance), 0) as balance
      FROM (

        SELECT init_balance as balance
        FROM wallets
        ${walletId ? 'WHERE id = ?' : ''}

        UNION ALL

        SELECT
          CASE
            WHEN type='income' THEN amount
            WHEN type='expense' THEN -amount
            ELSE 0
          END as balance

        FROM transactions
        WHERE 1=1
        ${walletId ? 'AND wallet_id = ?' : ''}
        ${profileId ? 'AND profile_id = ?' : ''}
      )
      `,
        [
          ...(walletId ? [walletId] : []),
          ...(walletId ? [walletId] : []),
          ...(profileId ? [profileId] : []),
        ],
      );
      console.log({ result });
      return money.fromStored(Number(result.rows[0]?.balance ?? 0));
    },
    [],
  );

  return {
    getRecentTransactions,
    getMonthlySummary,
    getBalance,
  };
};
