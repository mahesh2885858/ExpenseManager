import {
  isAfter,
  isBefore,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
} from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import useAccountStore from '../stores/accountsStore';
import useTransactionsStore from '../stores/transactionsStore';
import { TTransaction } from '../types';

const useGetTransactions = () => {
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);
  const transactions = useTransactionsStore(state => state.transactions);
  const filters = useTransactionsStore(state => state.filters);

  const [search, setSearch] = useState('');

  const selectedAccount = useMemo(() => {
    return getSelectedAccount();
  }, [getSelectedAccount]);

  const totalIncome = useMemo(() => {
    return transactions.reduce((prev, curr) => {
      if (curr.type === 'expense') {
        return prev;
      } else {
        return prev + curr.amount;
      }
    }, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions.reduce((prev, curr) => {
      if (curr.type === 'expense') {
        return prev + curr.amount;
      } else {
        return prev;
      }
    }, 0);
  }, [transactions]);

  const matchesType = useCallback(
    (t: TTransaction) => {
      if (!filters.type) return true;
      return t.type === filters.type;
    },
    [filters.type],
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
      if (!filters.date) return true;

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
    [filters.date],
  );

  const matchesCategory = useCallback(
    (t: TTransaction) => {
      if (!filters.categoryId) return true;
      return t.categoryIds.includes(filters.categoryId);
    },
    [filters],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      t =>
        matchesType(t) &&
        matchesDate(t) &&
        matchesSearch(t) &&
        matchesCategory(t),
    );
  }, [transactions, matchesType, matchesDate, matchesSearch, matchesCategory]);

  return {
    transactions: transactions.filter(t => t.accountId === selectedAccount.id),
    totalExpenses,
    totalIncome,
    filteredTransactions,
    search,
    setSearch,
  };
};

export default useGetTransactions;
