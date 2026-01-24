import { TAccount, TCategories, TTransaction } from '../types';
import { getUniqueData } from './getUniqueData';

type TData = {
  accounts?: TAccount[];
  transactions?: TTransaction[];
  categories?: TCategories;
};

type TItemsSkipped = {
  accounts: number;
  transactions: number;
  categories: number;
};

type TReturnResults = {
  validData: TData;
  itemsSkipped: TItemsSkipped;
};

export const getValidData = (data: TData): TReturnResults => {
  const validData: TData = {
    accounts: [],
    categories: [],
    transactions: [],
  };
  const itemsSkipped: TItemsSkipped = {
    accounts: 0,
    categories: 0,
    transactions: 0,
  };

  if (
    !data ||
    ((!data.accounts || data.accounts.length === 0) &&
      (!data.categories || data.categories.length === 0) &&
      (!data.transactions || data.transactions.length === 0))
  ) {
    throw 'No valid data provided';
  }

  if (data.accounts && data.accounts.length > 0) {
    const uniqueAccData = getUniqueData(data.accounts, 'id');
    uniqueAccData.forEach(acc => {
      if (acc.id && acc.name) {
        validData.accounts?.push(acc);
      } else {
        itemsSkipped.accounts += 1;
      }
    });
  }

  if (data.categories && data.categories.length > 0) {
    const uniqueCatData = getUniqueData(data.categories, 'id');
    uniqueCatData.forEach(cat => {
      if (cat.id && cat.name) {
        validData.categories?.push(cat);
      } else {
        itemsSkipped.categories += 1;
      }
    });
  }

  if (data.transactions && data.transactions.length > 0) {
    const uniqueTransactions = getUniqueData(data.transactions, 'id');
    uniqueTransactions.forEach(tr => {
      if (tr.id && tr.accountId && tr.type && tr.transactionDate) {
        validData.transactions?.push(tr);
      } else {
        itemsSkipped.transactions += 1;
      }
    });
  }

  return {
    itemsSkipped,
    validData,
  };
};
