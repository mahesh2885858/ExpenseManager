import {
  startOfWeek,
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  max,
  min,
  addWeeks,
  startOfYear,
  endOfYear,
  addMonths,
} from 'date-fns';
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

export const getWeekRangesOfMonth = (
  date: Date,
  weekStartsOn: 0 | 1 = 0, // 0 = Sunday, 1 = Monday
) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  let currentWeekStart = startOfWeek(monthStart, { weekStartsOn });
  const weeks: [Date, Date][] = [];

  while (currentWeekStart <= monthEnd) {
    const weekStart = max([currentWeekStart, monthStart]);

    const weekEnd = min([
      endOfWeek(currentWeekStart, { weekStartsOn }),
      monthEnd,
    ]);

    weeks.push([weekStart, weekEnd]);

    currentWeekStart = addWeeks(currentWeekStart, 1);
  }

  return weeks;
};

export const getMonthRangesOfYear = (date: Date): [Date, Date][] => {
  const yearStart = startOfYear(date);
  const yearEnd = endOfYear(date);

  const months: [Date, Date][] = [];
  let currentMonth = yearStart;

  while (currentMonth <= yearEnd) {
    months.push([startOfMonth(currentMonth), endOfMonth(currentMonth)]);

    currentMonth = addMonths(currentMonth, 1);
  }

  return months;
};
