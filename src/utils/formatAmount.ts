import { formatDigits } from 'commonutil-core';
import { CURRENCY_SYMBOL } from '../common';

export const formatAmount = (
  amount: number | string,
  currency = CURRENCY_SYMBOL,
  format: 'indian' | 'international' = 'indian',
) => {
  try {
    let text = '';
    if (!amount) {
      text = '0';
    }
    const intAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    if (intAmount < 0) {
      const abs = Math.abs(intAmount);
      text = '-' + currency + formatDigits(String(abs), format);
    } else {
      text = currency + formatDigits(String(amount), format);
    }

    return text;
  } catch (e) {
    console.log({ e, enteredAmount: amount });
    return currency + 0;
  }
};
