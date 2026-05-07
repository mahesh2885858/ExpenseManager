import { TWallet } from '../../types';
import { getCurrentUTCTimeStamp } from '../../utils';
import { db } from '../index';
const table = 'wallets';
const addWallet = async (wallet: TWallet) => {
  await db.execute(
    `INSERT INTO ${table} (id, name, init_balance, created_at,profile_id)
     VALUES (?, ?, ?, ?,?)`,
    [
      wallet.id,
      wallet.name,
      wallet.initBalance,
      getCurrentUTCTimeStamp(),
      wallet.profileId,
    ],
  );
};

const getWallets = async (profileId: string) => {
  const res = await db.execute(`SELECT * FROM ${table}`, [profileId]);
  console.log({ res });
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
  getAll: getWallets,
  delete: deleteWallet,
  update: updateWallet,
  create: addWallet,
};
