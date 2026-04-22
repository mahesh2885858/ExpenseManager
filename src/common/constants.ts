import { TCategory, TCurrency } from '../types';

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

export const CATEGORIES: TCategory[] = [
  // general
  {
    id: 'general',
    name: 'General',
    icon: 'shape-outline',
    color: '#9E9E9E',
    type: 'expense',
  },
  // 🍔 Food & Dining
  {
    id: 'food',
    name: 'Food',
    icon: 'silverware-fork-knife',
    color: '#FF7043',
    type: 'expense',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    icon: 'coffee',
    color: '#6D4C41',
    type: 'expense',
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: 'cart',
    color: '#66BB6A',
    type: 'expense',
  },

  // 🚗 Transport
  { id: 'fuel', name: 'Fuel', icon: 'fuel', color: '#FFA726', type: 'expense' },
  { id: 'car', name: 'Car', icon: 'car', color: '#42A5F5', type: 'expense' },
  {
    id: 'public_transport',
    name: 'Public Transport',
    icon: 'bus',
    color: '#26C6DA',
    type: 'expense',
  },
  {
    id: 'flight',
    name: 'Flights',
    icon: 'airplane',
    color: '#29B6F6',
    type: 'expense',
  },

  // 🏠 Home
  { id: 'rent', name: 'Rent', icon: 'home', color: '#AB47BC', type: 'expense' },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'lightbulb',
    color: '#FFCA28',
    type: 'expense',
  },
  {
    id: 'internet',
    name: 'Internet',
    icon: 'wifi',
    color: '#26A69A',
    type: 'expense',
  },

  // 🛍️ Shopping
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'shopping',
    color: '#EC407A',
    type: 'expense',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    icon: 'hanger',
    color: '#8D6E63',
    type: 'expense',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'laptop',
    color: '#5C6BC0',
    type: 'expense',
  },

  // 🧾 Bills & Finance
  {
    id: 'bills',
    name: 'Bills',
    icon: 'file-document',
    color: '#78909C',
    type: 'expense',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: 'receipt',
    color: '#7E57C2',
    type: 'expense',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: 'shield-check',
    color: '#66BB6A',
    type: 'expense',
  },

  // 🏥 Health
  {
    id: 'health',
    name: 'Health',
    icon: 'hospital',
    color: '#EF5350',
    type: 'expense',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    icon: 'pill',
    color: '#EC407A',
    type: 'expense',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: 'dumbbell',
    color: '#26A69A',
    type: 'expense',
  },

  // 🎮 Entertainment
  {
    id: 'movies',
    name: 'Movies',
    icon: 'movie',
    color: '#5C6BC0',
    type: 'expense',
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'music',
    color: '#AB47BC',
    type: 'expense',
  },
  {
    id: 'games',
    name: 'Games',
    icon: 'gamepad-variant',
    color: '#42A5F5',
    type: 'expense',
  },

  // 🎓 Education
  {
    id: 'education',
    name: 'Education',
    icon: 'school',
    color: '#29B6F6',
    type: 'expense',
  },
  {
    id: 'books',
    name: 'Books',
    icon: 'book-open-variant',
    color: '#8D6E63',
    type: 'expense',
  },

  // 💰 Income
  {
    id: 'salary',
    name: 'Salary',
    icon: 'cash-plus',
    color: '#66BB6A',
    type: 'income',
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'briefcase',
    color: '#42A5F5',
    type: 'income',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: 'laptop',
    color: '#26A69A',
    type: 'income',
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: 'trending-up',
    color: '#AB47BC',
    type: 'income',
  },
  {
    id: 'gifts',
    name: 'Gifts',
    icon: 'gift',
    color: '#EC407A',
    type: 'income',
  },
];
