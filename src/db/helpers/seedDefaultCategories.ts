import { DEFAULT_CATEGORIES } from '../../common';
import { db } from '../index';

export const seedDefaultCategories = async (profileId: string) => {
  try {
    console.log('seeding default categories');
    for (const category of DEFAULT_CATEGORIES) {
      await db.execute(
        `
          INSERT OR IGNORE INTO categories (
            id,
            name,
            icon,
            profile_id,
            type
          )
          VALUES (?, ?, ?, ?, ?)
          `,
        [
          category.id,
          category.name,
          JSON.stringify(category.icon),
          profileId,
          category.type,
        ],
      );
    }

    console.log('Default categories seeded');
  } catch (e) {
    console.log('Seed error:', e);
  }
};
