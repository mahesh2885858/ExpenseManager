import { useCallback } from 'react';
import { catRepo } from '../db/repositories/categories.repo';
import { walletRepo } from '../db/repositories/wallets.repo';
import useCategoriesStore from '../stores/categoriesStore';
import useProfileStore from '../stores/profileStore';
import useTransactionsStore from '../stores/transactionsStore';
import useWalletStore from '../stores/walletsStore';
import { TCategories, TWallet } from '../types';
import { useRecentTransactions } from './useRecentTransactions';
import { budgetRepo } from '../db/repositories/budgets.repo';
import useBudgetStore from '../stores/budgetStore';
import { profileRepository } from '../db/repositories/profiles.repo';

const useFetchRecords = () => {
  const selectedProfileId = useProfileStore(state => state.selectedProfileId);
  const setProfiles = useProfileStore(state => state.setProfiles);
  const setWallets = useWalletStore(state => state.setWallets);
  const setCategories = useCategoriesStore(state => state.setCategories);
  const { getRecentTransactions } = useRecentTransactions();
  const setRecents = useTransactionsStore(state => state.setRecents);
  const setBudgets = useBudgetStore(state => state.setBudgets);

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
      const txs = await getRecentTransactions(selectedProfileId);
      setRecents(txs);
    } catch (e) {
      console.log('Error fetching Recents: ', e);
    }
  }, [getRecentTransactions, setRecents, selectedProfileId]);
  const fetchBudgets = useCallback(async () => {
    const rows = await budgetRepo.getAll(selectedProfileId);
    setBudgets(rows);
  }, [selectedProfileId, setBudgets]);
  const fetchProfiles = useCallback(async () => {
    const rows = await profileRepository.getAll();
    setProfiles(rows.rows);
  }, [setProfiles]);
  return {
    fetchWallets,
    fetchCategories,
    fetchRecents,
    fetchProfiles,
    fetchBudgets,
  };
};
export default useFetchRecords;
