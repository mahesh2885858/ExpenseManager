import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { TCategory } from './categories';

export type TTransactionType = 'income' | 'expense';

export type TAttachment = {
  name: string;
  path: string;
  size: number; // Size in bytes, max 5MB
  extension: string;
};

export type TTransactionsIds = string[];

export type TTransaction = {
  id: string;
  wallet_id: string; // ID associated with wallet to which this transaction is added
  type: TTransactionType; // Only either income or expense
  amount: number;
  created_at: string; // ISO string format - when the transaction record created
  transaction_date: string; // ISO string format - when the transaction took place
  category_id: string; // Category IDs (initially single category per transaction)
  category?: TCategory;
  description?: string; // Optional field
  attachments?: TAttachment[]; // Array of attachments (images and PDFs)
  isSelected?: boolean;
  profileId: string;
};

export type TTransactionByIds = Record<string, TTransaction> | null;

export type TFilterTypes = 'date' | 'type' | 'category';

export type TSelectedTransactionIds = Set<string>;

export type TDateFilter = {
  isToday?: boolean;
  isThisWeek?: boolean;
  isThisMonth?: boolean;
  isThisYear?: boolean;

  range?: CalendarDate[];
};

export type TTypeFilter = 'income' | 'expense';

export type TFilters = {
  date: TDateFilter | null;
  type: TTypeFilter | null;
  categoryId?: null | string;
  accId?: null | string;
};

export type TGroupBy = 'week' | 'month' | 'year';

export type TSort =
  | 'dateNewFirst'
  | 'dateOldFirst'
  | 'amountHighFirst'
  | 'amountLowFirst';
