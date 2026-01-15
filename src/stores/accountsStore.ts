import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TAccount } from '../types';

type TAccountsState = {
  userName: string;
  isInitialSetupDone: boolean;
  accounts: TAccount[];
};

type TAccountsStoreActions = {
  setIsInitialSetupDone: (isInitialSetupDone: boolean) => void;
  setUsername: (name: string) => void;
  addAccount: (account: TAccount) => void;
  updateAccountBalance: (id: string, amount: number) => void;
  deleteAllAccounts: () => void;
  getSelectedAccount: () => TAccount;
  selectAccount: (id: string) => void;
};

type PositionStore = TAccountsState & TAccountsStoreActions;

const useAccountStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      isInitialSetupDone: false,
      userName: '',
      accounts: [],
      setIsInitialSetupDone: (isInitialSetupDone: boolean) =>
        set({ isInitialSetupDone }),
      addAccount: (account: TAccount) =>
        set(state => ({ accounts: [...state.accounts, account] })),
      deleteAllAccounts: () => set({ accounts: [] }),
      getSelectedAccount: () => get().accounts.filter(a => a.isSelected)[0],
      selectAccount: id => {
        const newAccounts: TAccount[] = get().accounts.map(acc => {
          if (acc.id === id) return { ...acc, isSelected: true };
          else return { ...acc, isSelected: false };
        });
        set({ accounts: newAccounts });
      },
      setUsername: name => {
        return set({ userName: name });
      },
      updateAccountBalance: (id, amount) => {
        const updatedAccounts = get().accounts.map(item => {
          if (item.id === id) return { ...item, balance: amount };
          else return item;
        });
        set({ accounts: updatedAccounts });
      },
    }),
    { name: 'account-storage', storage: createJSONStorage(zustandStorage) },
  ),
);

export default useAccountStore;
