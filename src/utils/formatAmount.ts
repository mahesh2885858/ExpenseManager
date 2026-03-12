import { formatDigits } from 'commonutil-core';
import { CURRENCY_SYMBOL } from '../common';

export const formatAmount = (
  amount: number | string,
  currency = CURRENCY_SYMBOL,
  format: 'indian' | 'international' = 'indian',
  keepCurrencySymbol = true,
) => {
  try {
    let text = '';
    if (!amount) {
      text = '0';
    }
    const intAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    if (intAmount < 0) {
      const abs = Math.abs(intAmount);
      text = keepCurrencySymbol
        ? '-' + currency + formatDigits(String(abs), format)
        : '-' + formatDigits(String(abs), format);
    } else {
      text =
        (keepCurrencySymbol ? currency : '') +
        formatDigits(String(amount), format);
    }

    return text;
  } catch (e) {
    console.log({ e, enteredAmount: amount });
    return (keepCurrencySymbol ? currency : '') + 0;
  }
};
