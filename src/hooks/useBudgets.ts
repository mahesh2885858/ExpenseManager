import { useCallback } from 'react';
import useBudgetStore from '../stores/budgetStore';
import useTransactionsStore from '../stores/transactionsStore';
import { TBudget, TBudgetPayload, TTransaction } from '../types';
import { getRangeForBudgetPeriod } from '../utils/getRangeForBudgetPeriod';
import useHelpers from './useHelpers';
import { budgetRepo } from '../db/repositories/budgets.repo';
import useCategories from './useCategories';
import useFetchRecords from './useFetchRecords';

const useBudgets = () => {
  const allBudgets = useBudgetStore(state => state.budgets);
  const addBudget = useBudgetStore(state => state.addBudget);
  const { fetchBudgets } = useFetchRecords();

  const updateMultipleBudgets = useBudgetStore(
    state => state.updateMulitpleBudgets,
  );
  const transactionsIds = useTransactionsStore(state => state.transactionsIds);
  const transactionsByIds = useTransactionsStore(
    state => state.transactionsByIds,
  );
  const { categories } = useCategories();

  const addNewBudget = useCallback(
    async (budget: TBudgetPayload) => {
      await budgetRepo.create({ ...budget });
      const selectedCats = budget.category_ids
        .map(id => categories.find(cat => cat.id === id))
        .filter(c => !!c);
      addBudget({ ...budget, category_ids: selectedCats });
    },
    [addBudget, categories],
  );

  const getBudgetForAGivenTransactions = useCallback(
    (t: TTransaction) => {
      if (t.type === 'income') return [];
      const budgetsForThiT: TBudget[] = [];
      allBudgets.forEach(b => {
        const period = getRangeForBudgetPeriod(b.period);
        if (!period.end || !period.start) return;
        const tDate = new Date(t.transaction_date);
        if (
          b.categoryIds.includes(t.category_id) &&
          period.start.getTime() <= tDate.getTime() &&
          period.end.getTime() >= tDate.getTime()
        ) {
          budgetsForThiT.push(b);
        }
      });
      return budgetsForThiT;
    },
    [allBudgets],
  );

  const getUpdatedBudgetsAfterATransaction = useCallback(
    (
      transaction: TTransaction,
      operation: 'create' | 'delete' = 'create',
      budgets: TBudget[],
    ) => {
      if (transaction.type === 'income') return budgets;
      const budgetsForThisCat = budgets.filter(b =>
        b.categoryIds.includes(transaction.category_id),
      );
      if (budgetsForThisCat.length > 0) {
        // does this budget covers the given transaction period

        const updatedBudgets: TBudget[] = [];
        const trDate = new Date(transaction.transaction_date);
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

        return budgets.map(b => {
          const find = updatedBudgets.find(u => u.id === b.id);
          return find ? { ...find } : { ...b };
        });
      } else return budgets;
    },
    [],
  );

  const updateBudgetSpentForTransaction = useCallback(
    (transaction: TTransaction, operation: 'create' | 'delete' = 'create') => {
      const result = getUpdatedBudgetsAfterATransaction(
        transaction,
        operation,
        allBudgets,
      );
      updateMultipleBudgets(result);
    },
    [allBudgets, updateMultipleBudgets, getUpdatedBudgetsAfterATransaction],
  );

  const updateBudgetForTransactionUpdate = useCallback(
    (updated: TTransaction, original: TTransaction) => {
      const result = getUpdatedBudgetsAfterATransaction(
        original,
        'delete',
        allBudgets,
      );
      const updatedBudgets = getUpdatedBudgetsAfterATransaction(
        updated,
        'create',
        result,
      );
      updateMultipleBudgets(updatedBudgets);
    },
    [getUpdatedBudgetsAfterATransaction, allBudgets, updateMultipleBudgets],
  );

  const getBudgetById = useCallback(
    (id: string) => {
      return allBudgets.find(b => b.id === id);
    },
    [allBudgets],
  );

  const deleteABudget = useCallback(
    async (id: string) => {
      await budgetRepo.delete(id);
      await fetchBudgets();
    },
    [fetchBudgets],
  );

  return {
    updateBudgetSpentForTransaction,
    updateBudgetForTransactionUpdate,
    getBudgetForAGivenTransactions,
    getBudgetById,
    addNewBudget,
    deleteABudget,
  };
};
export default useBudgets;
