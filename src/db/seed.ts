import { db } from '.';
import { CATEGORY_ICONS } from '../common';
import { TCategory, TWallet } from '../types';
import { generateRecordId, getCurrentUTCTimeStamp } from '../utils';
import { catRepo } from './repositories/categories.repo';
import { profileRepository } from './repositories/profiles.repo';
import { walletRepo } from './repositories/wallets.repo';
const seedPrfoiles = [
  {
    id: generateRecordId(),
    name: 'Main',
    createdAt: getCurrentUTCTimeStamp(),
  },
  {
    id: generateRecordId(),
    name: 'Bank',
    createdAt: getCurrentUTCTimeStamp(),
  },
  {
    id: generateRecordId(),
    name: 'Secondary',
    createdAt: getCurrentUTCTimeStamp(),
  },
];

const seedProfileData = async () => {
  for (const { createdAt, id, name } of seedPrfoiles) {
    await profileRepository.create({
      createdAt,
      id,
      name,
    });
  }
};

const seedWallets: TWallet[] = [
  {
    id: generateRecordId(),
    initBalance: 0,
    name: 'SBI Bank',
    profileId: seedPrfoiles[0].id,
  },
  {
    id: generateRecordId(),
    initBalance: 0,
    name: 'Cash',
    profileId: seedPrfoiles[0].id,
  },
  {
    id: generateRecordId(),
    initBalance: 0,
    name: 'Credit Card',
    profileId: seedPrfoiles[0].id,
  },
];

const seedWalletsData = async () => {
  for (const { id, initBalance, name, profileId } of seedWallets) {
    await walletRepo.create({
      id,
      name,
      initBalance,
      profileId,
    });
  }
};

const categories: (Omit<TCategory, 'icon'> & { icon: string })[] = [
  {
    id: generateRecordId(),
    name: 'Food',
    type: 'expense',
    icon: JSON.stringify(CATEGORY_ICONS.find(i => i.id === 'food')),
  },
  {
    id: generateRecordId(),
    name: 'Transport',
    type: 'expense',
    icon: JSON.stringify(CATEGORY_ICONS.find(i => i.id === 'car')),
  },
  {
    id: generateRecordId(),
    name: 'Shopping',
    type: 'expense',
    icon: JSON.stringify(CATEGORY_ICONS.find(i => i.id === 'shopping')),
  },
  {
    id: generateRecordId(),
    name: 'Bills',
    type: 'expense',
    icon: JSON.stringify(CATEGORY_ICONS.find(i => i.id === 'bills')),
  },
  {
    id: generateRecordId(),
    name: 'Entertainment',
    type: 'expense',
    icon: JSON.stringify(CATEGORY_ICONS.find(i => i.id === 'movies')),
  },
  {
    id: generateRecordId(),
    name: 'Salary',
    type: 'income',
    icon: JSON.stringify(CATEGORY_ICONS.find(i => i.id === 'salary')),
  },
  {
    id: generateRecordId(),
    name: 'Investment',
    type: 'income',
    icon: JSON.stringify(CATEGORY_ICONS.find(i => i.id === 'investment')),
  },
];

const seedCategoryData = async () => {
  for (const { icon, id, name, type } of categories) {
    await catRepo.create({
      icon,
      id,
      name,
      type,
      profileId: seedPrfoiles[0].id,
    });
  }
};
