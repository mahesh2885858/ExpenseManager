import { db } from './index';

export const initDB = async () => {
  console.log('running migrations');
  // Profiles
  console.log('creating profiles.....');
  await db.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  // Wallets
  console.log('creating wallets');
  await db.execute(`
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      init_balance REAL NOT NULL DEFAULT 0,
      profile_id TEXT NOT NULL,
      is_default INTEGER CHECK(is_default IN (1, 0)) NOT NULL,
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE

    );
  `);

  // Categories
  console.log('creating categories.....');
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      profile_id TEXT NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );
  `);

  // Transactions
  console.log('creating transactions.....');
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL,
      category_id TEXT NOT NULL,
      wallet_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      transaction_date INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
      FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );
  `);

  // Index for pagination
  console.log('creating indexes.....');
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_transactions_date_id
    ON transactions(transaction_date DESC, id DESC);
  `);
};
