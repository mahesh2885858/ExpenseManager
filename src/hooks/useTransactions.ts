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
import useWalletStore from '../stores/walletsStore';
import useUIStore from '../stores/uiStore';
import useBudgets from './useBudgets';

const useTransactions = (props?: { filter?: TFilters; sort?: TSort }) => {
  const addTransaction = useTransactionsStore(state => state.addTransaction);
  const deSelectTransaction = useTransactionsStore(
    state => state.deSelectTransaction,
  );
  const currency = useWalletStore(state => state.currency);
  const numberFormat = useUIStore(state => state.numberFormat);
  const filters = props?.filter ?? undefined;
  const sort = props?.sort ?? undefined;

  const removeTransaction = useTransactionsStore(state => state.requestDelete);
  const undoDelete = useTransactionsStore(state => state.undoDelete);
  const pendingDelete = useTransactionsStore(state => state.pendingDelete);

  const updateTransaction = useTransactionsStore(
    state => state.updateTransaction,
  );

  const [search, setSearch] = useState('');
  const transactionsIds = useTransactionsStore(state => state.transactionsIds);
  const transactionsByIds = useTransactionsStore(
    state => state.transactionsByIds,
  );
  const { updateBudgetSpentForTransaction, updateBudgetForTransactionUpdate } =
    useBudgets();

  const matchesAcc = useCallback(
    (t: TTransaction) => {
      if (!filters || !filters.accId) return true;
      return t.walletId === filters.accId;
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
    if (!transactionsByIds) return [];
    let filtered = transactionsIds;

    if (filters) {
      filtered = transactionsIds.filter(id => {
        const t = transactionsByIds[id];
        return (
          t &&
          matchesType(t) &&
          matchesDate(t) &&
          matchesSearch(t) &&
          matchesCategory(t) &&
          matchesAcc(t)
        );
      });
    }

    switch (sort) {
      case 'dateNewFirst':
      case undefined:
        filtered.sort((a, b) => {
          return (
            new Date(transactionsByIds[b].transactionDate).getTime() -
            new Date(transactionsByIds[a].transactionDate).getTime()
          );
        });

        break;
      case 'dateOldFirst':
        filtered.sort((a, b) => {
          return (
            new Date(transactionsByIds[a].transactionDate).getTime() -
            new Date(transactionsByIds[b].transactionDate).getTime()
          );
        });
        break;

      case 'amountHighFirst':
        filtered.sort((a, b) => {
          return transactionsByIds[b].amount - transactionsByIds[a].amount;
        });
        break;
      case 'amountLowFirst':
        filtered.sort((a, b) => {
          return transactionsByIds[a].amount - transactionsByIds[b].amount;
        });
        break;

      default:
        filtered.sort((a, b) => {
          return (
            new Date(transactionsByIds[b].transactionDate).getTime() -
            new Date(transactionsByIds[a].transactionDate).getTime()
          );
        });
        break;
    }
    return filtered;
  }, [
    matchesType,
    matchesDate,
    matchesSearch,
    matchesCategory,
    matchesAcc,
    filters,
    sort,
    transactionsByIds,
    transactionsIds,
  ]);

  const deleteTransaction = useCallback(
    (transactionId: string) => {
      if (!transactionsByIds) return;
      const t = transactionsByIds[transactionId];
      updateBudgetSpentForTransaction(t, 'delete');
      removeTransaction(t);
      deSelectTransaction(transactionId);
    },
    [
      removeTransaction,
      deSelectTransaction,
      transactionsByIds,
      updateBudgetSpentForTransaction,
    ],
  );

  const totalIncome = useMemo(() => {
    if (!transactionsByIds) return 0;
    return filteredTransactions.reduce((prev, curr) => {
      if (transactionsByIds[curr].type === 'expense') {
        return prev;
      } else {
        return prev + transactionsByIds[curr].amount;
      }
    }, 0);
  }, [filteredTransactions, transactionsByIds]);

  const totalExpenses = useMemo(() => {
    if (!transactionsByIds) return 0;

    return filteredTransactions.reduce((prev, curr) => {
      if (transactionsByIds[curr].type === 'expense') {
        return prev + transactionsByIds[curr].amount;
      } else {
        return prev;
      }
    }, 0);
  }, [transactionsByIds, filteredTransactions]);

  const addNewTransaction = (transaction: TTransaction) => {
    addTransaction(transaction);
    updateBudgetSpentForTransaction(transaction);
  };

  const getFormattedAmount = useCallback(
    (amount: number | string, keepCurrencySymbol = true) => {
      return formatAmount(
        amount,
        currency.symbol,
        numberFormat === 'lakhs' ? 'indian' : 'international',
        keepCurrencySymbol,
      );
    },
    [currency, numberFormat],
  );

  const updateATransaction = useCallback(
    (id: string, updated: TTransaction, original: TTransaction) => {
      updateBudgetForTransactionUpdate(updated, original);
      updateTransaction(id, updated);
    },
    [updateTransaction, updateBudgetForTransactionUpdate],
  );

  const undoTransactionDelete = useCallback(() => {
    if (!pendingDelete) return;
    undoDelete();
    updateBudgetSpentForTransaction(pendingDelete);
  }, [undoDelete, pendingDelete, updateBudgetSpentForTransaction]);

  return {
    totalExpenses,
    totalIncome,
    filteredTransactions,
    search,
    setSearch,
    addNewTransaction,
    updateATransaction,
    deleteTransaction,
    getFormattedAmount,
    transactionsByIds,
    undoTransactionDelete,
  };
};

export default useTransactions;
