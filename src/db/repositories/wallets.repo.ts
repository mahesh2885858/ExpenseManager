import { TWallet } from '../../types';
import { db } from '../index';
const table = 'wallets';
const addWallet = async (wallet: TWallet) => {
  await db.execute(
    `INSERT INTO ${table} (id, name, init_balance, created_at,profile_id)
     VALUES (?, ?, ?, ?,?)`,
    [wallet.id, wallet.name, wallet.initBalance, wallet.profileId],
  );
};

const getWallets = async () => {
  const res = await db.execute(`SELECT * FROM ${table}`);
  return res.rows;
};

const updateWalletBalance = async (id: string, balance: number) => {
  await db.execute(`UPDATE ${table} SET balance = ? WHERE id = ?`, [
    balance,
    id,
  ]);
};

const deleteWallet = async (id: string) => {
  await db.execute(`DELETE ${table} WHERE id=?`, [id]);
};

export const walletRepo = {
  get: getWallets,
  delete: deleteWallet,
  update: updateWalletBalance,
  create: addWallet,
};
