import { formatDigits } from 'commonutil-core';
import { CURRENCY_SYMBOL } from '../common';

export const formatAmount = (
  amount: number,
  currency = CURRENCY_SYMBOL,
  format: 'indian' | 'international' = 'indian',
) => {
  try {
    let text = '';
    if (!amount) {
      text = '0';
    }
    if (amount < 0) {
      const abs = Math.abs(amount);
      text = '-' + currency + formatDigits(String(abs), format);
    } else {
      text = currency + formatDigits(String(amount), format);
    }

    return text;
  } catch (e) {
    console.log({ e });
    return currency + 0;
  }
};
