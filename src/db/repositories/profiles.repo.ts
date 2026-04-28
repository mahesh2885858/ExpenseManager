import { db } from '..';
import { TProfile } from '../../types';
const tableName = 'profiles';

const addProfile = async (profile: TProfile) => {
  console.log({ profile });
  const stmt =
    db.prepareStatement(`INSERT INTO ${tableName} (id,name,created_at)
    VALUES (?, ?, ?)`);
  stmt.bind([profile.id, profile.name, profile.createdAt]);
  const result = await stmt.execute();
  return result;
};

const getProfiles = async () => {
  const result = await db.execute(`SELECT * FROM ${tableName}`);
  return result;
};

export const profileRepository = {
  add: addProfile,
  getAll: getProfiles,
};
