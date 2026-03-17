import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { useCallback } from 'react';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import useBudgetStore from '../stores/budgetStore';
import useTransactionsStore from '../stores/transactionsStore';
import { TTransaction } from '../types';
import { getRangeForBudgetPeriod } from '../utils/getRangeForBudgetPeriod';

const useBudgets = () => {
  const budgets = useBudgetStore(state => state.budgets);
  const updateBudget = useBudgetStore(state => state.updateBudget);
  const transactionsIds = useTransactionsStore(state => state.transactionsIds);
  const transactionsByIds = useTransactionsStore(
    state => state.transactionsByIds,
  );

  const getTransactionIdsForBudget = useCallback(
    (id: string) => {
      if (!transactionsByIds) return [];
      const budget = budgets.find(b => b.id === id);
      if (!budget) return [];
      const periodRange = getRangeForBudgetPeriod(budget.period);

      if (!periodRange.end || !periodRange.start) return [];
      const budgetTransactionIds: string[] = [];

      transactionsIds.forEach(trId => {
        const tr = transactionsByIds[trId];
        if (tr && periodRange.start && periodRange.end) {
          const trDate = tr.transactionDate;
          if (
            trDate >= periodRange.start?.toISOString() &&
            trDate <= periodRange.end?.toISOString()
          ) {
            if (budget.categoryIds.includes(tr.categoryIds[0])) {
              budgetTransactionIds.push(trId);
            }
          }
        }
      });
      return budgetTransactionIds;
    },
    [budgets, transactionsIds, transactionsByIds],
  );
  const updateBudgetSpentForTransaction = useCallback(
    (
      transaction: TTransaction,
      operation: 'create' | 'delete' | 'update' = 'create',
    ) => {
      if (transaction.type === 'income') return;
      const budgetsForThisCat = budgets.filter(b =>
        b.categoryIds.includes(transaction.categoryIds[0]),
      );
      if (budgetsForThisCat.length > 0) {
        // does this budget covers the given transaction period
        budgetsForThisCat.forEach(b => {
          const period = getRangeForBudgetPeriod(b.period);
          if (
            transaction.transactionDate >= period.start?.toISOString() &&
            transaction.transactionDate <= period.end?.toISOString()
          ) {
            const newAmountSpent =
              operation === 'create'
                ? b.spent + transaction.amount
                : b.spent - transaction.amount;

            updateBudget({ ...b, spent: newAmountSpent });
          }
        });
      }
    },
    [budgets, updateBudget],
  );

  return {
    getTransactionIdsForBudget,
    updateBudgetSpentForTransaction,
  };
};
export default useBudgets;
