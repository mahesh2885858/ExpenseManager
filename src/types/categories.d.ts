export type TCategoryType = 'expense' | 'income';
export type TCategoryIcon = {
  id: string;
  icon: string;
  color: string;
};
export type TCategory = {
  id: string;
  name: string;
  icon: TCategoryIcon;
  type: TCategoryType;
};

export type TCategorySummary = TCategory & {
  income: number;
  expense: number;
};

export type TCategories = TCategory[];
