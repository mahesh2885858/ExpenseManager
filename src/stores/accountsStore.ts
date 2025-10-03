import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TAccount, TTransactionType } from '../types';

type TAccountsState = { isInitialSetupDone: boolean; accounts: TAccount[] };

type TAccountsStoreActions = {
  setIsInitialSetupDone: (isInitialSetupDone: boolean) => void;
  addAccount: (account: TAccount) => void;
  deleteAllAccounts: () => void;
  getSelectedAccount: () => TAccount;
  selectAccount: (id: string) => void;
  updateAccountBalance: (
    id: string,
    type: TTransactionType,
    amount: number,
  ) => void;
};

type PositionStore = TAccountsState & TAccountsStoreActions;

const useAccountStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      isInitialSetupDone: false,
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
      updateAccountBalance: (id, type, amount) => {
        set(state => ({
          ...state,
          accounts: state.accounts.map(acc => {
            if (acc.id === id) {
              if (type === 'expense') {
                return { ...acc, balance: acc.balance - amount };
              } else {
                return { ...acc, balance: acc.balance + amount };
              }
            }
            return acc;
          }),
        }));
      },
    }),
    { name: 'account-storage', storage: createJSONStorage(zustandStorage) },
  ),
);

export default useAccountStore;
