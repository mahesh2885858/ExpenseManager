import { TCategory } from '../../types';
import { db } from '../index';
//Insert
export const addCategory = async (category: TCategory) => {
  await db.execute(
    `INSERT INTO categories (id, name, icon, type)
     VALUES (?, ?, ?, ?, ?)`,
    [
      category.id,
      category.name,
      category.icon.id,
      category.type,
    ]
  );
};

// 📄 Get all
export const getCategories = async () => {
  const res = await db.execute(`SELECT * FROM categories`);
  return res.rows;
};
