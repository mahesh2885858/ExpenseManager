import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TAccount } from '../types';

type TAccountsState = { isInitialSetupDone: boolean; accounts: TAccount[] };

type TAccountsStoreActions = {
  setIsInitialSetupDone: (isInitialSetupDone: boolean) => void;
  addAccount: (account: TAccount) => void;
  deleteAllAccounts: () => void;
};

type PositionStore = TAccountsState & TAccountsStoreActions;

const useAccountStore = create<PositionStore>()(
  persist(
    set => ({
      isInitialSetupDone: false,
      accounts: [],
      setIsInitialSetupDone: (isInitialSetupDone: boolean) =>
        set({ isInitialSetupDone }),
      addAccount: (account: TAccount) =>
        set(state => ({ accounts: [...state.accounts, account] })),
      deleteAllAccounts: () => set({ accounts: [] }),
    }),
    { name: 'account-storage', storage: createJSONStorage(zustandStorage) },
  ),
);

export default useAccountStore;
