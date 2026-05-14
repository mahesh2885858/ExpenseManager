import { useCallback } from 'react';
import { budgetRepo } from '../db/repositories/budgets.repo';
import { TBudgetPayload } from '../types';
import useFetchRecords from './useFetchRecords';

const useBudgets = () => {
  const { fetchBudgets } = useFetchRecords();

  const addNewBudget = useCallback(
    async (budget: TBudgetPayload) => {
      await budgetRepo.create({ ...budget });
      await fetchBudgets();
    },
    [fetchBudgets],
  );

  const deleteABudget = useCallback(
    async (id: string) => {
      await budgetRepo.delete(id);
      await fetchBudgets();
    },
    [fetchBudgets],
  );

  return {
    addNewBudget,
    deleteABudget,
  };
};
export default useBudgets;
