import { useCallback } from 'react';
import { walletRepo } from '../db/repositories/wallets.repo';
import useProfileStore from '../stores/profileStore';
import useWalletStore from '../stores/walletsStore';
import { TCategories, TWallet } from '../types';
import { catRepo } from '../db/repositories/categories.repo';
import useCategoriesStore from '../stores/categoriesStore';

const useFetchRecords = () => {
  const selectedProfileId = useProfileStore(state => state.selectedProfileId);
  const setWallets = useWalletStore(state => state.setWallets);
  const setCategories = useCategoriesStore(state => state.setCategories);
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
      console.log({ categories: result });
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
  return {
    fetchWallets,
    fetchCategories,
  };
};
export default useFetchRecords;
