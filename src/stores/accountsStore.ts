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
  updateAccount: (acc: TAccount) => void;
  deleteAllAccounts: () => void;
  removeAnAcc: (id: string) => void;
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
      updateAccount: acc => {
        const updatedAccounts = get().accounts.map(item => {
          if (item.id === acc.id) {
            console.log({ acc, item });
            return { ...acc };
          } else return item;
        });
        set({ accounts: updatedAccounts });
      },
      removeAnAcc: id => {
        const accnts = get().accounts.filter(a => a.id !== id);
        set({ accounts: accnts });
      },
    }),
    { name: 'account-storage', storage: createJSONStorage(zustandStorage) },
  ),
);

export default useAccountStore;
