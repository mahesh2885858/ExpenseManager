import { useCallback, useMemo } from 'react';
import useWalletStore from '../stores/walletsStore';
import useTransactionsStore from '../stores/transactionsStore';
import useTransactions from './useTransactions';
import { roundValue } from 'commonutil-core';

const useWallets = () => {
  const wallets = useWalletStore(state => state.wallets);
  const removeWallet = useWalletStore(state => state.removeAWallet);
  const deleteTransactionForAWallet = useTransactionsStore(
    state => state.deleteForAnAcc,
  );
  const { filteredTransactions: transactions } = useTransactions({});
  const defaultWalletId = useWalletStore(state => state.defaultWalletId);
  const setDefaultWalletId = useWalletStore(state => state.setDefaultWalletId);

  const setSelectedWalletId = useWalletStore(
    state => state.setSelectedWalletId,
  );

  const selectedWalletId = useWalletStore(state => state.selectedWalletId);
  const currency = useWalletStore(state => state.currency);

  const selectedWallet = useMemo(
    () => wallets.find(acc => acc.id === selectedWalletId),
    [wallets, selectedWalletId],
  );

  const deleteWallet = useCallback(
    (id: string) => {
      const remainingWallets = wallets.filter(acc => acc.id !== id);
      deleteTransactionForAWallet(id);
      setDefaultWalletId(null);
      setSelectedWalletId(
        remainingWallets.length === 0 ? null : remainingWallets[0].id,
      );
      removeWallet(id);
    },
    [
      deleteTransactionForAWallet,
      removeWallet,
      setDefaultWalletId,
      wallets,
      setSelectedWalletId,
    ],
  );

  const totalBalance = useMemo(() => {
    return wallets.reduce((prev, item) => {
      return prev + (item.initBalance ?? 0);
    }, 0);
  }, [wallets]);

  const getIncomeExpenseForWallet = useCallback(
    (id: string) => {
      const wallet = wallets.find(w => w.id === id);
      const transactionsForWallet = transactions.filter(t => t.walletId === id);
      let expense = 0;
      let income = 0;
      let balance = 0;
      if (wallet) {
        transactionsForWallet.forEach(t => {
          if (t.type === 'expense') {
            expense += t.amount;
          } else {
            income += t.amount;
          }
        });
        balance = (wallet.initBalance ?? 0) + income - expense;
      }

      return {
        expense,
        income,
        balance: roundValue(balance, 2),
      };
    },
    [wallets, transactions],
  );

  const getWalletNameById = useCallback(
    (id: string) => {
      return wallets.find(wallet => wallet.id === id)?.name ?? '';
    },
    [wallets],
  );

  return {
    totalBalance,
    deleteWallet,
    currency,
    wallets,
    selectedWallet,
    setSelectedWalletId,
    getIncomeExpenseForWallet,
    getWalletNameById,
    defaultWalletId: defaultWalletId
      ? defaultWalletId
      : wallets.length > 0
      ? wallets[0].id
      : '',
  };
};

export default useWallets;
