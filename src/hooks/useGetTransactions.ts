import {
  add,
  isAfter,
  isBefore,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  sub,
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

  const checkTypeFilter = useCallback(
    (t: TTransaction) => {
      if (!filters.type) return false;
      return t.type === (filters.type === 'expense' ? 'expense' : 'income');
    },
    [filters],
  );

  const checkDateFilter = useCallback(
    (t: TTransaction) => {
      let filterMatch = false;
      if (filters.date?.isToday && isToday(t.transactionDate)) {
        filterMatch = true;
      } else if (filters.date?.isThisWeek && isThisWeek(t.transactionDate)) {
        filterMatch = true;
      } else if (filters.date?.isThisMonth && isThisMonth(t.transactionDate)) {
        filterMatch = true;
      } else if (filters.date?.isThisYear && isThisYear(t.transactionDate)) {
        filterMatch = true;
      } else if (
        filters.date?.range &&
        filters.date.range[0] &&
        filters.date.range[1]
      ) {
        // because date-fn excludes the given dates, only gives results from before and after. So, we are offsetting by adding and subtracting one day
        const startDate = sub(filters.date?.range[0], { days: 1 });
        const endDate = add(filters.date?.range[1], { days: 1 });
        if (
          isBefore(startDate, t.transactionDate) &&
          isAfter(endDate, t.transactionDate)
        ) {
          filterMatch = true;
        }
      }
      return filterMatch;
    },
    [filters],
  );

  const checkSearchFilter = useCallback(
    (t: TTransaction) => {
      if (
        t.amount.toString().includes(search) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    },
    [search],
  );

  const filteredTransactions = useMemo(() => {
    const filtered: TTransaction[] = [];
    // we assume at least one of them is true otherwise don't call this function
    const isSearchActive = search.trim().length > 0;
    const isDateFilterActive = !!filters.date;
    const isTypeFilterActive = !!filters.type;

    if (!isSearchActive && !isDateFilterActive && !isTypeFilterActive) {
      return transactions;
    }

    for (const t of transactions) {
      // check for transaction type filter
      if (isTypeFilterActive) {
        const isTypeMatch = checkTypeFilter(t);
        if (isTypeMatch) {
          if (isDateFilterActive) {
            const isDateMatch = checkDateFilter(t);
            if (isDateMatch) {
              if (isSearchActive) {
                const isSearchMatch = checkSearchFilter(t);
                if (isSearchMatch) {
                  filtered.push(t);
                } else {
                  continue;
                }
              } else {
                filtered.push(t);
              }
            } else {
              continue;
            }
          } else {
            if (isSearchActive) {
              const isSearchMatch = checkSearchFilter(t);
              if (isSearchMatch) {
                filtered.push(t);
              } else {
                continue;
              }
            } else {
              filtered.push(t);
            }
          }
        } else {
          continue;
        }
      } else {
        if (isDateFilterActive) {
          const isDateMatch = checkDateFilter(t);
          if (isDateMatch) {
            if (isSearchActive) {
              const isSearchMatch = checkSearchFilter(t);
              if (isSearchMatch) {
                filtered.push(t);
              } else {
                continue;
              }
            } else {
              filtered.push(t);
            }
          } else {
            continue;
          }
        } else {
          if (isSearchActive) {
            const isSearchMatch = checkSearchFilter(t);
            if (isSearchMatch) {
              filtered.push(t);
            } else {
              continue;
            }
          } else {
            filtered.push(t);
          }
        }
      }
    }

    return filtered;
  }, [
    filters,
    search,
    transactions,
    checkTypeFilter,
    checkSearchFilter,
    checkDateFilter,
  ]);

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
