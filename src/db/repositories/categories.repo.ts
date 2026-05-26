import { TCategoryPayload } from '../../types';
import { db } from '../index';

const addCategory = async (category: TCategoryPayload) => {
  return await db.execute(
    `INSERT INTO categories (id, name, icon, type,profile_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      category.id,
      category.name,
      category.icon,
      category.type,
      category.profileId ?? '',
    ],
  );
};

const getCategories = async () => {
  const res = await db.execute(`SELECT * FROM categories`);
  return res.rows;
};

export const catRepo = {
  getAll: getCategories,
  create: addCategory,
};
