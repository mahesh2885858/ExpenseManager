import { useCallback, useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import { walletRepo } from '../db/repositories/wallets.repo';
import useWalletStore from '../stores/walletsStore';
import { TWallet } from '../types';

const useWallets = () => {
  const wallets = useWalletStore(state => state.wallets);
  const addWallet = useWalletStore(state => state.addWallet);
  const removeWallet = useWalletStore(state => state.removeAWallet);

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
    [removeWallet, setDefaultWalletId, wallets, setSelectedWalletId],
  );

  const totalBalance = useMemo(() => {
    return wallets.reduce((prev, item) => {
      return prev + (item.initBalance ?? 0);
    }, 0);
  }, [wallets]);

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
