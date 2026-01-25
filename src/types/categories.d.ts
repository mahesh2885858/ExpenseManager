export type TCategory = {
  id: string;
  name: string;
};

export type TCategorySummary = {
  id: string;
  name: string;
  income: number;
  expense: number;
};

export type TCategories = TCategory[];
