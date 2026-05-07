import { useCallback } from 'react';
import { formatAmount } from '../utils';
import useWalletStore from '../stores/walletsStore';
import useUIStore from '../stores/uiStore';

const useHelpers = () => {
  const currency = useWalletStore(state => state.currency);
  const numberFormat = useUIStore(state => state.numberFormat);
  const getFormattedAmount = useCallback(
    (amount: number | string, keepCurrencySymbol = true) => {
      return formatAmount(
        amount,
        currency.symbol,
        numberFormat === 'lakhs' ? 'indian' : 'international',
        keepCurrencySymbol,
      );
    },
    [currency, numberFormat],
  );
  return {
    getFormattedAmount,
  };
};
export default useHelpers;
