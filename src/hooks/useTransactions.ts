import {
  isAfter,
  isBefore,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
} from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import useTransactionsStore from '../stores/transactionsStore';
import { TFilters, TSort, TTransaction } from '../types';
import { formatAmount } from '../utils';
import useAccountStore from '../stores/accountsStore';
import useUIStore from '../stores/uiStore';

const useTransactions = (props?: { filter?: TFilters; sort?: TSort }) => {
  const transactions = useTransactionsStore(state => state.transactions);
  const addTransaction = useTransactionsStore(state => state.addTransaction);
  const currency = useAccountStore(state => state.currency);
  const numberFormat = useUIStore(state => state.numberFormat);
  const filters = props?.filter ?? undefined;
  const sort = props?.sort ?? undefined;

  const removeTransaction = useTransactionsStore(
    state => state.removeTransaction,
  );

  const [search, setSearch] = useState('');

  const matchesAcc = useCallback(
    (t: TTransaction) => {
      if (!filters || !filters.accId) return true;
      return t.accountId === filters.accId;
    },
    [filters],
  );

  const matchesType = useCallback(
    (t: TTransaction) => {
      if (!filters || !filters.type) return true;
      return t.type === filters.type;
    },
    [filters],
  );

  const matchesSearch = useCallback(
    (t: TTransaction) => {
      if (!search.trim()) return true;
      return (
        t.amount.toString().includes(search) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    },
    [search],
  );

  const matchesDate = useCallback(
    (t: TTransaction) => {
      if (!filters || !filters.date) return true;

      if (filters.date.isToday) return isToday(t.transactionDate);
      if (filters.date.isThisWeek) return isThisWeek(t.transactionDate);
      if (filters.date.isThisMonth) return isThisMonth(t.transactionDate);
      if (filters.date.isThisYear) return isThisYear(t.transactionDate);

      if (filters.date.range?.[0] && filters.date.range?.[1]) {
        const start = filters.date.range[0];
        const end = filters.date.range[1];
        return (
          !isBefore(t.transactionDate, start) &&
          !isAfter(t.transactionDate, end)
        );
      }

      return true;
    },
    [filters],
  );

  const matchesCategory = useCallback(
    (t: TTransaction) => {
      if (!filters || !filters.categoryId) return true;
      return t.categoryIds.includes(filters.categoryId);
    },
    [filters],
  );

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (filters) {
      filtered = transactions.filter(
        t =>
          matchesType(t) &&
          matchesDate(t) &&
          matchesSearch(t) &&
          matchesCategory(t) &&
          matchesAcc(t),
      );
    }

    switch (sort) {
      case 'dateNewFirst':
      case undefined:
        filtered.sort((a, b) => {
          return (
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
          );
        });

        break;
      case 'dateOldFirst':
        filtered.sort((a, b) => {
          return (
            new Date(a.transactionDate).getTime() -
            new Date(b.transactionDate).getTime()
          );
        });
        break;

      case 'amountHighFirst':
        filtered.sort((a, b) => {
          return b.amount - a.amount;
        });
        break;
      case 'amountLowFirst':
        filtered.sort((a, b) => {
          return a.amount - b.amount;
        });
        break;

      default:
        filtered.sort((a, b) => {
          return (
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
          );
        });
        break;
    }
    return filtered;
  }, [
    transactions,
    matchesType,
    matchesDate,
    matchesSearch,
    matchesCategory,
    matchesAcc,
    filters,
    sort,
  ]);

  const deleteTransaction = useCallback(
    (transactionId: string) => {
      removeTransaction(transactionId);
    },
    [removeTransaction],
  );

  const totalIncome = useMemo(() => {
    return filteredTransactions.reduce((prev, curr) => {
      if (curr.type === 'expense') {
        return prev;
      } else {
        return prev + curr.amount;
      }
    }, 0);
  }, [filteredTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions.reduce((prev, curr) => {
      if (curr.type === 'expense') {
        return prev + curr.amount;
      } else {
        return prev;
      }
    }, 0);
  }, [filteredTransactions]);

  const addNewTransaction = (transaction: TTransaction) => {
    addTransaction(transaction);
  };

  const getFormattedAmount = useCallback(
    (amount: number) => {
      return formatAmount(
        amount,
        currency.symbol,
        numberFormat === 'lakhs' ? 'indian' : 'international',
      );
    },
    [currency, numberFormat],
  );

  return {
    totalExpenses,
    totalIncome,
    filteredTransactions,
    search,
    setSearch,
    addNewTransaction,
    deleteTransaction,
    getFormattedAmount,
  };
};

export default useTransactions;
