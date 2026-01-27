import { format } from 'date-fns';
import { TDateFilter } from '../types';

export const getDateFilterText = (filter: TDateFilter) => {
  if (filter.isThisMonth) return 'This Month';
  if (filter.isThisWeek) return 'This Week';
  if (filter.isThisYear) return 'This Year';
  if (filter.isToday) return 'Today';
  if (filter.range && filter.range.length === 2) {
    return (
      format(filter.range[0] ?? new Date(), 'dd MMM yyyy') +
      ' - ' +
      format(filter.range[1] ?? new Date(), 'dd MMM yyyy')
    );
  }
};
