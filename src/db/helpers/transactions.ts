import { addMonths, endOfMonth, startOfMonth } from 'date-fns';
import { TFilters, TSort } from '../../types';

export const getStartOfMonth = () => {
  return startOfMonth(new Date()).getTime();
};

export const getStartOfNextMonth = () => {
  return endOfMonth(new Date()).getTime();
};

export const buildWhereClause = (
  filters?: TFilters,
  search?: string,
  walletId?: string,
) => {
  const where: string[] = [];
  const args: any[] = [];

  // Month filter (default)
  if (filters?.date?.isThisMonth) {
    where.push('transactionDate >= ? AND transactionDate < ?');
    args.push(getStartOfMonth(), getStartOfNextMonth());
  }

  if (walletId) {
    where.push('wallet_id = ?');
    args.push(walletId);
  }

  if (filters?.type) {
    where.push('type = ?');
    args.push(filters.type);
  }

  if (filters?.categoryId) {
    where.push('categoryIds LIKE ?');
    args.push(`%${filters.categoryId}%`);
  }

  if (search) {
    where.push('(description LIKE ? OR amount LIKE ?)');
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
      return 'ORDER BY transactionDate ASC, id ASC';
    case 'amountHighFirst':
      return 'ORDER BY amount DESC';
    case 'amountLowFirst':
      return 'ORDER BY amount ASC';
    default:
      return 'ORDER BY transactionDate DESC, id DESC';
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
