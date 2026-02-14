export type TTheme = 'light' | 'dark' | 'system';

export type TCurrency = {
  code: string;
  name: string;
  symbol: string;
  decimal_digits: number;
  countries: string[];
};

export type TNumberFormat = 'lakhs' | 'millions';
