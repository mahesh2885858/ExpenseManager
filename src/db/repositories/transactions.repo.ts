import { TTransaction } from '../../types';
import { money } from '../../utils';
import { db } from '../index';

const addTransaction = async (tx: TTransaction) => {
  return await db.execute(
    `INSERT INTO transactions
     (id, amount, category_id, wallet_id, type, description, transaction_date, created_at,profile_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
    [
      tx.id,
      money.toStored(tx.amount),
      tx.category_id,
      tx.wallet_id,
      tx.type,
      tx.description ?? '',
      tx.transaction_date,
      tx.created_at,
      tx.profileId,
    ],
  );
};

//  Cursor-based pagination
const getTransactions = async ({
  limit = 20,
  cursor,
}: {
  limit?: number;
  cursor?: { date: number; id: string } | null;
}) => {
  if (!cursor) {
    const res = await db.execute(
      `SELECT * FROM transactions
       ORDER BY date DESC, id DESC
       LIMIT ?`,
      [limit],
    );

    return res.rows;
  }

  const res = await db.execute(
    `SELECT * FROM transactions
     WHERE (date < ? OR (date = ? AND id < ?))
     ORDER BY date DESC, id DESC
     LIMIT ?`,
    [cursor.date, cursor.date, cursor.id, limit],
  );

  return res.rows;
};

const deleteTransaction = async (id: string) => {
  await db.execute(`DELETE FROM transactions WHERE id = ?`, [id]);
};

const updateTransaction = async (
  id: string,
  transaction: Partial<TTransaction>,
) => {
  const entries = Object.entries(transaction).filter(entry => {
    const key = entry[0];
    const ignoredKeys = [
      'id',
      'created_at',
      'category',
      'attachments',
      'profile_id',
    ];
    if (ignoredKeys.includes(key)) {
      return false;
    } else return true;
  });

  if (entries.length === 0) {
    return;
  }

  const setClause = entries.map(([key]) => `${key} = ?`).join(', ');

  const values = entries.map(([key, value]) =>
    key === 'amount' ? money.toStored(value as number) : value,
  );
  await db.execute(
    `
    UPDATE transactions
    SET ${setClause}
    WHERE id = ?
    `,
    [...values, id],
  );
};

export const txnRepo = {
  create: addTransaction,
  delete: deleteTransaction,
  get: getTransactions,
  update: updateTransaction,
};
