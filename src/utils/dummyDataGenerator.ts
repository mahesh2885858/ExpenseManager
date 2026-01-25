import { TTransaction, TTransactionType } from '../types';

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomAmount = (type: TTransactionType) =>
  type === 'income' ? randomBetween(500, 5000) : randomBetween(50, 2000);

const randomDateWithinLastMonths = (months: number) => {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - months);

  const date = new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );

  return date.toISOString();
};

const randomFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

type GenerateDummyTransactionsArgs = {
  count?: number;
  accountIds: string[];
  categoryIds: string[];
};

export const generateDummyTransactions = ({
  count = 50,
  accountIds,
  categoryIds,
}: GenerateDummyTransactionsArgs): TTransaction[] => {
  if (!accountIds.length) {
    throw new Error('accountIds array cannot be empty');
  }

  if (!categoryIds.length) {
    throw new Error('categoryIds array cannot be empty');
  }

  return Array.from({ length: count }, (_, index) => {
    const type: TTransactionType = Math.random() > 0.5 ? 'income' : 'expense';
    const transactionDate = randomDateWithinLastMonths(12);

    return {
      id: `txn_${index + 1}`,
      accountId: randomFromArray(accountIds),
      type,
      amount: randomAmount(type),
      createdAt: transactionDate,
      transactionDate,
      categoryIds: [randomFromArray(categoryIds)],
      description: type === 'income' ? 'Monthly income' : 'Daily expense',
      isSelected: false,
    };
  });
};
