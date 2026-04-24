import { TCategory, TCategoryIcon, TCurrency } from '../types';

export const MAX_AMOUNT = 100000000;
export const DEFAULT_CATEGORY_ID = 'default_category_327065';
export const CURRENCY_SYMBOL = '₹';
export const MAX_DESCRIPTION_LIMIT = 150;
export const MAX_AMOUNT_LENGTH_INCLUDING_SYMBOL = 15;
export const APP_NAME_EXPORT_DATA = 'ExpenseManager';
export const BACKUP_VERSION = 1;
export const currencies: TCurrency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimal_digits: 2,
    countries: ['United States', 'Ecuador', 'El Salvador'],
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimal_digits: 2,
    countries: ['Germany', 'France', 'Italy', 'Spain', 'Netherlands'],
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimal_digits: 2,
    countries: ['United Kingdom'],
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    decimal_digits: 0,
    countries: ['Japan'],
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    decimal_digits: 2,
    countries: ['Switzerland', 'Liechtenstein'],
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    decimal_digits: 2,
    countries: ['Australia'],
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    decimal_digits: 2,
    countries: ['Canada'],
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    decimal_digits: 2,
    countries: ['China'],
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    decimal_digits: 2,
    countries: ['India'],
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    decimal_digits: 2,
    countries: ['Mexico'],
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    decimal_digits: 2,
    countries: ['Brazil'],
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    decimal_digits: 0,
    countries: ['South Korea'],
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    decimal_digits: 2,
    countries: ['Singapore'],
  },
  {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    decimal_digits: 2,
    countries: ['Hong Kong'],
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    decimal_digits: 2,
    countries: ['Norway'],
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    decimal_digits: 2,
    countries: ['Sweden'],
  },
  {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr',
    decimal_digits: 2,
    countries: ['Denmark'],
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    decimal_digits: 2,
    countries: ['New Zealand'],
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    decimal_digits: 2,
    countries: ['South Africa'],
  },
  {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    decimal_digits: 2,
    countries: ['Russia'],
  },
  {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    decimal_digits: 2,
    countries: ['Turkey'],
  },
  {
    code: 'PLN',
    name: 'Polish Zloty',
    symbol: 'zł',
    decimal_digits: 2,
    countries: ['Poland'],
  },
  {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    decimal_digits: 2,
    countries: ['Thailand'],
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    decimal_digits: 0,
    countries: ['Indonesia'],
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    decimal_digits: 2,
    countries: ['Malaysia'],
  },
  {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    decimal_digits: 2,
    countries: ['Philippines'],
  },
  {
    code: 'CZK',
    name: 'Czech Koruna',
    symbol: 'Kč',
    decimal_digits: 2,
    countries: ['Czech Republic'],
  },
  {
    code: 'ILS',
    name: 'Israeli Shekel',
    symbol: '₪',
    decimal_digits: 2,
    countries: ['Israel'],
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    decimal_digits: 2,
    countries: ['United Arab Emirates'],
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    decimal_digits: 2,
    countries: ['Saudi Arabia'],
  },
];

export const CATEGORY_ICONS: TCategoryIcon[] = [
  { id: 'general', icon: 'shape-outline', color: '#9E9E9E' },

  // Food & Dining
  { id: 'food', icon: 'silverware-fork-knife', color: '#FF7043' },
  { id: 'coffee', icon: 'coffee', color: '#6D4C41' },
  { id: 'groceries', icon: 'cart', color: '#66BB6A' },

  // Transport
  { id: 'fuel', icon: 'fuel', color: '#FFA726' },
  { id: 'car', icon: 'car', color: '#42A5F5' },
  { id: 'bus', icon: 'bus', color: '#26C6DA' },
  { id: 'flight', icon: 'airplane', color: '#29B6F6' },

  // Home
  { id: 'home', icon: 'home', color: '#AB47BC' },
  { id: 'utilities', icon: 'lightbulb', color: '#FFCA28' },
  { id: 'internet', icon: 'wifi', color: '#26A69A' },

  // Shopping
  { id: 'shopping', icon: 'shopping', color: '#EC407A' },
  { id: 'clothing', icon: 'hanger', color: '#8D6E63' },
  { id: 'electronics', icon: 'laptop', color: '#5C6BC0' },

  // Bills
  { id: 'bills', icon: 'file-document', color: '#78909C' },
  { id: 'subscriptions', icon: 'receipt', color: '#7E57C2' },
  { id: 'insurance', icon: 'shield-check', color: '#66BB6A' },

  // Health
  { id: 'health', icon: 'hospital', color: '#EF5350' },
  { id: 'pharmacy', icon: 'pill', color: '#EC407A' },
  { id: 'fitness', icon: 'dumbbell', color: '#26A69A' },

  // Entertainment
  { id: 'movies', icon: 'movie', color: '#5C6BC0' },
  { id: 'music', icon: 'music', color: '#AB47BC' },
  { id: 'games', icon: 'gamepad-variant', color: '#42A5F5' },

  // Education / Work
  { id: 'education', icon: 'school', color: '#29B6F6' },
  { id: 'books', icon: 'book-open-variant', color: '#8D6E63' },
  { id: 'work', icon: 'briefcase', color: '#42A5F5' },

  // Finance / Income visuals (still useful visually)
  { id: 'salary', icon: 'cash-plus', color: '#66BB6A' },
  { id: 'investment', icon: 'trending-up', color: '#AB47BC' },
  { id: 'gift', icon: 'gift', color: '#EC407A' },
];

export const CATEGORY_ICON_MAP = Object.fromEntries(
  CATEGORY_ICONS.map(icon => [icon.id, icon]),
);

export const DEFAULT_CATEGORIES: TCategory[] = [
  //Core expenses
  {
    id: 'food',
    name: 'Food',
    icon: CATEGORY_ICON_MAP.food,
    type: 'expense',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: CATEGORY_ICON_MAP.car,
    type: 'expense',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: CATEGORY_ICON_MAP.shopping,
    type: 'expense',
  },
  {
    id: 'bills',
    name: 'Bills',
    icon: CATEGORY_ICON_MAP.bills,
    type: 'expense',
  },

  //Living
  {
    id: 'rent',
    name: 'Rent',
    icon: CATEGORY_ICON_MAP.home,
    type: 'expense',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: CATEGORY_ICON_MAP.utilities,
    type: 'expense',
  },

  //Health & lifestyle
  {
    id: 'health',
    name: 'Health',
    icon: CATEGORY_ICON_MAP.health,
    type: 'expense',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: CATEGORY_ICON_MAP.movies,
    type: 'expense',
  },

  //Personal growth
  {
    id: 'education',
    name: 'Education',
    icon: CATEGORY_ICON_MAP.education,
    type: 'expense',
  },

  //Income
  {
    id: 'salary',
    name: 'Salary',
    icon: CATEGORY_ICON_MAP.salary,
    type: 'income',
  },
  {
    id: 'business',
    name: 'Business',
    icon: CATEGORY_ICON_MAP.work,
    type: 'income',
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: CATEGORY_ICON_MAP.investment,
    type: 'income',
  },
  {
    id: 'gifts',
    name: 'Gifts',
    icon: CATEGORY_ICON_MAP.gift,
    type: 'income',
  },

  //Fallback (important)
  {
    id: 'general',
    name: 'General',
    icon: CATEGORY_ICON_MAP.general,
    type: 'expense',
  },
];
