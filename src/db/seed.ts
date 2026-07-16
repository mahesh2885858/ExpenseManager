import { CATEGORY_ICONS } from '../common';
import { TCategory, TTransaction, TWallet } from '../types';
import { generateRecordId, getCurrentUTCTimeStamp, getRandomInt } from '../utils';
import { catRepo } from './repositories/categories.repo';
import { profileRepository } from './repositories/profiles.repo';
import { txnRepo } from './repositories/transactions.repo';
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
  console.log("seeding profiles data....")

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
  console.log("seeding wallets data....")
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
  console.log('categories are being seeded...')
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

const seedTransactionsData = async () => {
  console.log('transactions are being seeded...')

  const generateRandomDate = () => {
    return new Date(
      getRandomInt(2025, 2027),
      getRandomInt(1, 12),
      getRandomInt(1, 28),
      getRandomInt(1, 12),
      getRandomInt(1, 60),
    );
  };
  for (let i = 0; i <= 1000; i++) {
    const item: TTransaction = {
      id: generateRecordId(),
      amount: getRandomInt(100, 10000),
      category_id: categories[getRandomInt(0, categories.length)].id,
      created_at: getCurrentUTCTimeStamp(),
      profileId: seedPrfoiles[0].id,
      transaction_date: generateRandomDate().getTime(),
      type: ['income', 'expense'][getRandomInt(0, 2)],
      wallet_id: seedWallets[getRandomInt(0, seedWallets.length)].id,
    };
 const t=   await txnRepo.create({
      amount: item.amount,
      category_id: item.category_id,
      created_at: item.created_at,
      id: item.id,
      profileId: item.profileId,
      transaction_date: item.transaction_date,
      type: item.type,
      wallet_id: item.wallet_id,

    })
  console.log({t})
  }
}


export const seedDummyData = async () => {
  try {

 await seedProfileData()
 await seedWalletsData()
 await seedCategoryData()
 await seedTransactionsData()
  } catch (err) {
    console.log(err)
  }
}
