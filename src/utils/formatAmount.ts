import { formatDigits } from 'commonutil-core';
import { CURRENCY_SYMBOL } from '../common';

export const formatAmount = (amount: number, currency = CURRENCY_SYMBOL) => {
  try {
    let text = '';
    if (!amount) {
      text = '0';
    }
    if (amount < 0) {
      const abs = Math.abs(amount);
      text = '-' + currency + formatDigits(String(abs));
    } else {
      text = currency + formatDigits(String(amount));
    }

    return text;
  } catch (e) {
    console.log({ e });
    return currency + 0;
  }
};
