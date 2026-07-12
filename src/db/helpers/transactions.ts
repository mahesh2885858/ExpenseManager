import {
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
} from 'date-fns';
import { TFilters, TSort } from '../../types';
import { endOfYear, startOfYear } from 'date-fns/fp';

export const getStartOfMonth = () => {
  return startOfMonth(new Date()).getTime();
};

export const getStartOfNextMonth = () => {
  return endOfMonth(new Date()).getTime();
};

export const buildWhereClauseForTxns = (
  filters?: TFilters,
  search?: string,
  walletId?: string,
) => {
  const where: string[] = [];
  const args: any[] = [];

  // Default: This Month
  // Date filters
  if (filters?.date?.isThisWeek) {
    where.push('t.transaction_date >= ? AND t.transaction_date < ?');
    args.push(
      startOfWeek(new Date()).getTime(),
      endOfWeek(new Date()).getTime(),
    );
  } else if (filters?.date?.isThisMonth) {
    where.push('t.transaction_date >= ? AND t.transaction_date < ?');
    args.push(getStartOfMonth(), getStartOfNextMonth());
  } else if (filters?.date?.isThisQuarter) {
    where.push('t.transaction_date >= ? AND t.transaction_date < ?');
    args.push(
      startOfQuarter(new Date()).getTime(),
      endOfQuarter(new Date()).getTime(),
    );
  } else if (filters?.date?.isThisYear) {
    where.push('t.transaction_date >= ? AND t.transaction_date < ?');
    args.push(
      startOfYear(new Date()).getTime(),
      endOfYear(new Date()).getTime(),
    );
  }

  if (walletId) {
    where.push('t.wallet_id = ?');
    args.push(walletId);
  }

  if (filters?.type) {
    where.push('t.type = ?');
    args.push(filters.type);
  }

  if (filters?.categoryId) {
    where.push('t.category_id = ?');
    args.push(filters.categoryId);
  }

  if (search) {
    where.push('t.description LIKE ?');
    args.push(`%${search}%`, `%${search}%`);
  }

  return {
    clause: where.length ? `WHERE ${where.join(' AND ')}` : '',
    args,
  };
};

export const buildOrderBy = (sort?: TSort) => {
  switch (sort) {
    case 'dateOldFirst':
      return 'ORDER BY transaction_date ASC, id ASC';
    case 'amountHighFirst':
      return 'ORDER BY amount DESC';
    case 'amountLowFirst':
      return 'ORDER BY amount ASC';
    default:
      return 'ORDER BY transaction_date DESC, id DESC';
  }
};

export const getCursor = (rows: any[]) => {
  if (!rows.length) return null;

  const last = rows[rows.length - 1];

  return {
    date: last.transactionDate,
    id: last.id,
  };
};
