import { useCallback } from 'react';
import useBudgetStore from '../stores/budgetStore';
import useTransactionsStore from '../stores/transactionsStore';
import { TBudget, TTransaction } from '../types';
import { getRangeForBudgetPeriod } from '../utils/getRangeForBudgetPeriod';

const useBudgets = () => {
  const budgets = useBudgetStore(state => state.budgets);
  const updateMultipleBudgets = useBudgetStore(
    state => state.updateMulitpleBudgets,
  );
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
        if (tr) {
          const trDate = new Date(tr.transactionDate);
          if (
            trDate.getTime() >= periodRange.start.getTime() &&
            trDate.getTime() <= periodRange.end.getTime()
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

  const getBudgetForAGivenTransactions = useCallback(
    (t: TTransaction) => {
      if (t.type === 'income') return [];
      const budgetsForThiT: TBudget[] = [];
      budgets.forEach(b => {
        const period = getRangeForBudgetPeriod(b.period);
        if (!period.end || !period.start) return;
        const tDate = new Date(t.transactionDate);
        if (
          b.categoryIds.includes(t.categoryIds[0]) &&
          period.start.getTime() <= tDate.getTime() &&
          period.end.getTime() >= tDate.getTime()
        ) {
          budgetsForThiT.push(b);
        }
      });
      return budgetsForThiT;
    },
    [budgets],
  );

  const updateBudgetSpentForTransaction = useCallback(
    (transaction: TTransaction, operation: 'create' | 'delete' = 'create') => {
      if (transaction.type === 'income') return;
      const budgetsForThisCat = budgets.filter(b =>
        b.categoryIds.includes(transaction.categoryIds[0]),
      );
      if (budgetsForThisCat.length > 0) {
        // does this budget covers the given transaction period
        //
        const updatedBudgets: TBudget[] = [];
        const trDate = new Date(transaction.transactionDate);
        budgetsForThisCat.forEach(b => {
          const period = getRangeForBudgetPeriod(b.period);
          if (!period.start || !period.end) return;
          if (
            trDate.getTime() >= period.start.getTime() &&
            trDate.getTime() <= period.end.getTime()
          ) {
            const newAmountSpent =
              operation === 'create'
                ? b.spent + transaction.amount
                : b.spent - transaction.amount;

            updatedBudgets.push({ ...b, spent: newAmountSpent });
          }
        });
        if (updatedBudgets.length > 0) {
          updateMultipleBudgets(updatedBudgets);
        }
      }
    },
    [budgets, updateMultipleBudgets],
  );

  const updateBudgetForTransactionUpdate = useCallback(
    (updated: TTransaction, original: TTransaction) => {
      updateBudgetSpentForTransaction(original, 'delete');
      updateBudgetSpentForTransaction(updated, 'create');
    },
    [updateBudgetSpentForTransaction],
  );

  return {
    getTransactionIdsForBudget,
    updateBudgetSpentForTransaction,
    updateBudgetForTransactionUpdate,
    getBudgetForAGivenTransactions,
  };
};
export default useBudgets;
