export type TBudgetPeriods = 'weekly' | 'monthly' | 'yearly' | 'one time';

export type TBudgetPeriod =
  | {
      type: 'weekly' | 'monthly' | 'yearly';
    }
  | {
      type: 'one time';
      range: {
        start: Date;
        end: Date;
      };
    };

export type TBudget = {
  id: string;
  name: string;
  amount: number;
  categoryIds: string[];
  period: TBudgetPeriod;
  createdAt: string;
};
