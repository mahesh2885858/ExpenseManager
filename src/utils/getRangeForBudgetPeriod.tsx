import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { TBudgetPeriod } from '../types';

export const getRangeForBudgetPeriod = (period: TBudgetPeriod) => {
  const periodRange: {
    start: CalendarDate;
    end: CalendarDate;
  } = {
    start: undefined,
    end: undefined,
  };
  switch (period.type) {
    case 'monthly':
      periodRange.end = endOfMonth(new Date());
      periodRange.start = startOfMonth(new Date());
      break;
    case 'weekly':
      periodRange.end = endOfWeek(new Date(), { weekStartsOn: 1 });
      periodRange.start = startOfWeek(new Date(), { weekStartsOn: 1 });
      break;
    case 'yearly':
      periodRange.end = endOfYear(new Date());
      periodRange.start = startOfYear(new Date());
      break;
    case 'one time':
      periodRange.end = period.range.end;
      periodRange.start = period.range.start;
      break;
    default:
      break;
  }
  return periodRange;
};
