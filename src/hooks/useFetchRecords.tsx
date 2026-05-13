import { useCallback } from 'react';
import { catRepo } from '../db/repositories/categories.repo';
import { walletRepo } from '../db/repositories/wallets.repo';
import useCategoriesStore from '../stores/categoriesStore';
import useProfileStore from '../stores/profileStore';
import useTransactionsStore from '../stores/transactionsStore';
import useWalletStore from '../stores/walletsStore';
import { TCategories, TWallet } from '../types';
import { useRecentTransactions } from './useRecentTransactions';

const useFetchRecords = () => {
  const selectedProfileId = useProfileStore(state => state.selectedProfileId);
  const setWallets = useWalletStore(state => state.setWallets);
  const setCategories = useCategoriesStore(state => state.setCategories);
  const { getRecentTransactions } = useRecentTransactions();
  const setRecents = useTransactionsStore(state => state.setRecents);

  const fetchWallets = useCallback(async () => {
    try {
      const result = await walletRepo.getAll(selectedProfileId);
      console.log({ wallets: result });
      setWallets(result as TWallet[]);
    } catch (e) {
      console.log({ e });
    }
  }, [selectedProfileId, setWallets]);
  const fetchCategories = useCallback(async () => {
    try {
      const result = await catRepo.getAll();
      setCategories(
        (result as unknown as TCategories).map(cat => ({
          ...cat,
          icon: JSON.parse(cat.icon as unknown as string),
        })),
      );
    } catch (e) {
      console.log({ e });
    }
  }, [setCategories]);
  const fetchRecents = useCallback(async () => {
    try {
      const txs = await getRecentTransactions();
      setRecents(txs);
    } catch (e) {
      console.log('Error fetching Recents: ', e);
    }
  }, [getRecentTransactions, setRecents]);
  return {
    fetchWallets,
    fetchCategories,
    fetchRecents,
  };
};
export default useFetchRecords;
