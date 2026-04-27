import { TTransaction } from "../../types";
import { db } from "../index";

//  Insert
export const addTransaction = async (tx: TTransaction) => {
  await db.execute(
    `INSERT INTO transactions
     (id, amount, category_id, wallet_id, type, description, transaction_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tx.id,
      tx.amount,
      tx.categoryId,
      tx.walletId,
      tx.type,
      tx.description??"",
      tx.transactionDate,
      tx.createdAt,
    ]
  );
};

//  Cursor-based pagination
export const getTransactions = async ({
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
      [limit]
    );

    return res.rows;
  }

  const res = await db.execute(
    `SELECT * FROM transactions
     WHERE (date < ? OR (date = ? AND id < ?))
     ORDER BY date DESC, id DESC
     LIMIT ?`,
    [cursor.date, cursor.date, cursor.id, limit]
  );

  return res.rows;
};

//Delete
export const deleteTransaction = async (id: string) => {
  await db.execute(`DELETE FROM transactions WHERE id = ?`, [id]);
};
