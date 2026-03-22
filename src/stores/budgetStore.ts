import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TBudget } from '../types';

type TBudgetStore = {
  budgets: TBudget[];
};

type TBudgetActions = {
  addBudget: (budget: TBudget) => void;
  removeBudget: (id: string) => void;
  updateBudget: (budget: TBudget) => void;
  updateMulitpleBudgets: (budgets: TBudget[]) => void;
  importBudgets: (budgets: TBudget[]) => void;
};

type PositionStore = TBudgetStore & TBudgetActions;

const useBudgetStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      budgets: [],
      addBudget(budget) {
        set(() => ({ budgets: [...get().budgets, budget] }));
      },
      removeBudget(id) {
        const remainig = get().budgets.filter(b => b.id !== id);
        set(() => ({ budgets: remainig }));
      },
      updateBudget(budget) {
        set(() => ({
          budgets: get().budgets.map(b =>
            b.id === budget.id ? { ...budget } : { ...b },
          ),
        }));
      },
      updateMulitpleBudgets(budgets) {
        set(() => ({
          budgets: get().budgets.map(b => {
            const found = budgets.find(budget => budget.id === b.id);
            return found ? found : b;
          }),
        }));
      },
      importBudgets(budgets) {
        set(() => ({ budgets }));
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(zustandStorage),
      partialize: state => ({
        budgets: state.budgets,
      }),
    },
  ),
);

export default useBudgetStore;
