export type TBudgetPeriods = 'weekly' | 'monthly' | 'yearly' | 'one time';

export type TBudget = {
  id: string;
  name: string;
  amount: number;
  categoryIds: string[];

  period:
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
  createdAt: string;
};
