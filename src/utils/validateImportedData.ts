import { TWallet, TCategories, TTransaction, TBudget } from '../types';
import { getUniqueData } from './getUniqueData';

type TData = {
  wallets?: TWallet[];
  transactions?: TTransaction[];
  categories?: TCategories;
  budgets?: TBudget[];
};

type TItemsSkipped = {
  wallets: number;
  transactions: number;
  categories: number;
  budgets: number;
};

type TReturnResults = {
  validData: TData;
  itemsSkipped: TItemsSkipped;
};

export const getValidData = (data: TData): TReturnResults => {
  const validData: TData = {
    wallets: [],
    categories: [],
    transactions: [],
    budgets: [],
  };
  const itemsSkipped: TItemsSkipped = {
    wallets: 0,
    categories: 0,
    transactions: 0,
    budgets: 0,
  };

  if (
    !data ||
    ((!data.wallets || data.wallets.length === 0) &&
      (!data.categories || data.categories.length === 0) &&
      (!data.transactions || data.transactions.length === 0) &&
      (!data.budgets || data.budgets.length === 0))
  ) {
    throw new Error('No valid data provided');
  }

  if (data.wallets && data.wallets.length > 0) {
    const uniqueAccData = getUniqueData(data.wallets, 'id');
    uniqueAccData.forEach(acc => {
      if (acc.id && acc.name) {
        validData.wallets?.push(acc);
      } else {
        itemsSkipped.wallets += 1;
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
      if (tr.id && tr.walletId && tr.type && tr.transactionDate) {
        validData.transactions?.push({ ...tr, walletId: tr.walletId });
      } else {
        itemsSkipped.transactions += 1;
      }
    });
  }

  if (data.budgets && data.budgets.length > 0) {
    const uniqueBudgetData = getUniqueData(data.budgets, 'id');
    uniqueBudgetData.forEach(budget => {
      if (budget.id && budget.name) {
        validData.budgets?.push(budget);
      } else {
        itemsSkipped.budgets += 1;
      }
    });
  }

  return {
    itemsSkipped,
    validData,
  };
};
