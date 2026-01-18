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
import { TAccount, TFilters, TTransaction } from '../types';

const useTransactions = (props: { filter?: TFilters }) => {
  const transactions = useTransactionsStore(state => state.transactions);
  const addTransaction = useTransactionsStore(state => state.addTransaction);
  const filters = props?.filter ?? undefined;
  const accounts = useAccountStore(state => state.accounts);
  const updateAccountBalance = useAccountStore(state => state.updateAccount);
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

    // Sort once
    return filtered.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime(),
    );
  }, [
    transactions,
    matchesType,
    matchesDate,
    matchesSearch,
    matchesCategory,
    matchesAcc,
    filters,
  ]);

  const deleteTransaction = useCallback(
    (transactionId: string) => {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;
      const { type, amount } = transaction;
      const acc = accounts.find(acc => acc.id === transaction.accountId);
      if (!acc) return;
      const currentBal = acc?.balance;

      const updatedBal =
        type === 'expense' ? currentBal + amount : currentBal - amount;

      const updatedAcc: TAccount = {
        ...acc,
        balance: updatedBal,
        expense: type === 'expense' ? (acc.expense ?? 0) - amount : acc.expense,
        income: type === 'income' ? (acc.income ?? 0) - amount : acc.income,
      };
      updateAccountBalance(updatedAcc);
      removeTransaction(transaction.id);
    },
    [transactions, accounts, updateAccountBalance, removeTransaction],
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
    const { accountId, amount, type } = transaction;

    const acc = accounts.filter(item => item.id === accountId)[0];
    const currentBal = acc?.balance;

    const updatedBal =
      type === 'expense' ? currentBal - amount : currentBal + amount;

    const updatedAcc: TAccount = {
      ...acc,
      balance: updatedBal,
      expense: type === 'expense' ? (acc.expense ?? 0) + amount : acc.expense,
      income: type === 'income' ? (acc.income ?? 0) + amount : acc.income,
    };

    console.log({ updatedAcc });

    addTransaction(transaction);
    updateAccountBalance(updatedAcc);
  };

  return {
    totalExpenses,
    totalIncome,
    filteredTransactions,
    search,
    setSearch,
    addNewTransaction,
    deleteTransaction,
  };
};

export default useTransactions;
