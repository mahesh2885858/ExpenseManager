import { TWallet } from '../../types';
import { db } from '../index';

export const addWallet = async (wallet: TWallet) => {
  await db.execute(
    `INSERT INTO wallets (id, name, init_balance, created_at,is_default)
     VALUES (?, ?, ?, ?,?)`,
    [wallet.id, wallet.name, wallet.initBalance,wallet.isDefault??0]
  );
};


export const getWallets = async () => {
  const res = await db.execute(`SELECT * FROM wallets`);
  return res.rows;
};

export const updateWalletBalance = async (
  id: string,
  balance: number
) => {
  await db.execute(
    `UPDATE wallets SET balance = ? WHERE id = ?`,
    [balance, id]
  );
};
