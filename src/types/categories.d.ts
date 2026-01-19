export type TCategory = {
  id: string;
  name: string;
  isDefault?: boolean;
};

export type TCategorySummary = {
  id: string;
  name: string;
  income: number;
  expense: number;
};

export type TCategories = TCategory[];
