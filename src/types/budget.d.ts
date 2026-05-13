import { TCategory } from './categories';

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

  recurring_type: TBudgetPeriods;

  start_date: number;
  end_date?: number | null;

  profile_id: string;

  category_ids: TCategory[];
  spent: number;
  remaining: number;
};

export type TBudgetPayload = {
  id: string;
  name: string;
  amount: number;

  recurring_type: TBudgetPeriods;

  start_date: number;
  end_date?: number | null;

  profile_id: string;

  category_ids: string[];
};
