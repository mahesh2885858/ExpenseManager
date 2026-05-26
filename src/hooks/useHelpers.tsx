import { useCallback } from 'react';
import { formatAmount } from '../utils';
import useWalletStore from '../stores/walletsStore';
import useUIStore from '../stores/uiStore';
import { ToastAndroid } from 'react-native';

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

  const showToast = useCallback((message: string, duration = 2000) => {
    ToastAndroid.show(message, duration);
  }, []);
  const showErrorToast = useCallback((error: unknown, duration = 2000) => {
    const message = error instanceof Error ? error.message : 'Unknown Error';
    ToastAndroid.show(message, duration);
  }, []);
  return {
    getFormattedAmount,
    showToast,
    showErrorToast,
  };
};
export default useHelpers;
