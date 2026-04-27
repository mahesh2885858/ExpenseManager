import { db } from './index';

export const initDB = async () => {
  // Transactions
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL,
      category_id TEXT NOT NULL,
      wallet_id TEXT NOT NULL,
      transaction_date INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
    );
  `);

  // Categories
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
    );
  `);

  // Wallets
  await db.execute(`
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      init_balance REAL NOT NULL DEFAULT 0,
    );
  `);

  // Index for pagination
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_transactions_date_id
    ON transactions(transaction_date DESC, id DESC);
  `);

};
