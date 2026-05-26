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
  profileId?: string;
};
export type TCategoryPayload = Omit<TCategory, 'icon'> & {
  icon: string;
};

export type TCategorySummary = TCategory & {
  income: number;
  expense: number;
};

export type TCategories = TCategory[];
