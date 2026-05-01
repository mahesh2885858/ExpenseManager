import { TProfile, TWallet } from '../../types';
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

const updateWallet = async (
  id: string,
  profile: Partial<Omit<TWallet, 'id'>>,
) => {
  const keys = Object.keys(profile);
  const values: (string | number)[] = [];
  let query = '';

  keys.forEach(key => {
    query += `${key}=? `;
    values.push([profile[key]]);
  });

  await db.execute(`UPDATE ${table} SET ${query} WHERE id = ?`, [
    ...values,
    id,
  ]);
};

const deleteWallet = async (id: string) => {
  await db.execute(`DELETE ${table} WHERE id=?`, [id]);
};

export const walletRepo = {
  get: getWallets,
  delete: deleteWallet,
  update: updateWallet,
  create: addWallet,
};
