export type TAccount = {
  id: string;
  name: string;
  balance: number;
  isSelected?: boolean;
  isDefault?: boolean;
  expense?: number;
  income?: number;
};
