export const money = {
  toStored(value: number | string): number {
    return Math.round(Number(value) * 100);
  },

  fromStored(value: number): number {
    return value / 100;
  },

  format(value: number): string {
    return (value / 100).toFixed(2);
  },
};
