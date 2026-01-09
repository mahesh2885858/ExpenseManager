import { startOfWeek, endOfWeek, addDays } from 'date-fns';
import { TTransaction } from '../types';

export const getDatesOfWeek = (day: Date) => {
  const start = startOfWeek(day);
  const end = endOfWeek(day);
  const datesArray = [start];
  for (let i = 0; i < 5; i++) {
    const next = addDays(start, i + 1);
    datesArray.push(next);
  }
  datesArray.push(end);

  return datesArray;
};

export const getNetForGivenTransactions = (transactions: TTransaction[]) => {
  return transactions.reduce((prev, item) => {
    return prev + item.amount;
  }, 0);
};
