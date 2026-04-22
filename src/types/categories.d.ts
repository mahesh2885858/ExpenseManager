export type CategoryType = 'expense' | 'income';
export type TCategory = {
  id: string;
  name: string;
  icon: string; // MDI icon name
  color: string; // background color
  type: CategoryType;
};

export type TCategorySummary = {
  id: string;
  name: string;
  income: number;
  expense: number;
};

export type TCategories = TCategory[];
