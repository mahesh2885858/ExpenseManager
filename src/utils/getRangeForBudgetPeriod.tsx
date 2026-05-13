import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { TBudgetPeriod } from '../types';

export const getRangeForBudgetPeriod = (period: TBudgetPeriod) => {
  const periodRange: {
    start: number;
    end: number;
  } = {
    start: 0,
    end: 0,
  };
  switch (period.type) {
    case 'monthly':
      periodRange.end = endOfMonth(new Date()).getTime();
      periodRange.start = startOfMonth(new Date()).getTime();
      break;
    case 'weekly':
      periodRange.end = endOfWeek(new Date(), { weekStartsOn: 1 }).getTime();
      periodRange.start = startOfWeek(new Date(), {
        weekStartsOn: 1,
      }).getTime();
      break;
    case 'yearly':
      periodRange.end = endOfYear(new Date()).getTime();
      periodRange.start = startOfYear(new Date()).getTime();
      break;
    case 'one time':
      periodRange.end = new Date(period.range.end).getTime();
      periodRange.start = new Date(period.range.start).getTime();
      break;
    default:
      break;
  }
  return periodRange;
};
