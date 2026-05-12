import { roundValue } from 'commonutil-core';
import { useCallback, useEffect, useMemo } from 'react';
import useWalletStore from '../stores/walletsStore';
import useTransactions from './useTransactions';
import { walletRepo } from '../db/repositories/wallets.repo';
import { TWallet } from '../types';
import { ToastAndroid } from 'react-native';

const useWallets = () => {
  const wallets = useWalletStore(state => state.wallets);
  const setWallets = useWalletStore(state => state.setWallets);
  const addWallet = useWalletStore(state => state.addWallet);
  const removeWallet = useWalletStore(state => state.removeAWallet);
  const deleteTransactionForAWallet = useCallback(() => {}, []);
  const { filteredTransactions: transactions, transactionsByIds } =
    useTransactions({});
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
    async (id: string) => {
      await walletRepo.delete(id);
      // Todo instead of recalculatinga everything we can refetch walelts and transactions again the deletion is handlded by db
      const remainingWallets = wallets.filter(acc => acc.id !== id);
      // Todo:deleteTransactionForAWallet();
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
      if (!transactionsByIds)
        return {
          expense: 0,
          income: 0,
          balance: wallet?.initBalance ?? 0,
        };

      const transactionsForWallet = transactions.filter(
        t => transactionsByIds[t].walletId === id,
      );
      let expense = 0;
      let income = 0;
      let balance = 0;
      if (wallet) {
        transactionsForWallet.forEach(t => {
          if (transactionsByIds[t].type === 'expense') {
            expense += transactionsByIds[t].amount;
          } else {
            income += transactionsByIds[t].amount;
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
    [wallets, transactionsByIds, transactions],
  );

  const getWalletNameById = useCallback(
    (id: string) => {
      return wallets.find(wallet => wallet.id === id)?.name ?? '';
    },
    [wallets],
  );

  const createNewWallet = useCallback(
    async (wallet: TWallet) => {
      try {
        await walletRepo.create(wallet);
        addWallet(wallet);
      } catch (e) {
        console.log('Error while creating a new wallet', e);
        ToastAndroid.show(
          e instanceof Error ? e.message : 'error while creating new wallet',
          2000,
        );
      }
    },
    [addWallet],
  );

  return {
    totalBalance,
    deleteWallet,
    createNewWallet,
    currency,
    wallets,
    selectedWallet,
    setSelectedWalletId,
    getIncomeExpenseForWallet,
    getWalletNameById,
    setDefaultWalletId,
    defaultWalletId: defaultWalletId
      ? defaultWalletId
      : wallets.length > 0
      ? wallets[0].id
      : '',
  };
};

export default useWallets;
