import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TAccount, TCurrency } from '../types';

type TAccountsState = {
  userName: string;
  isInitialSetupDone: boolean;
  accounts: TAccount[];
  defaultAccountId: string | null;
  selectedAccountId: string | null;
  currency: TCurrency;
};

type TAccountsStoreActions = {
  setIsInitialSetupDone: (isInitialSetupDone: boolean) => void;
  setUsername: (name: string) => void;
  addAccount: (account: TAccount) => void;
  updateAccount: (acc: TAccount) => void;
  deleteAllAccounts: () => void;
  removeAnAcc: (id: string) => void;
  getSelectedAccount: () => TAccount | undefined;
  selectAccount: (id: string) => void;
  setDefaultAccountId: (id: string | null) => void;
  importAccounts: (accounts: TAccount[]) => void;
  setSelectedAccountId: (id: string | null) => void;
  setCurrency: (cur: TCurrency) => void;
};

type PositionStore = TAccountsState & TAccountsStoreActions;

const useAccountStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      isInitialSetupDone: false,
      userName: '',
      defaultAccountId: null,
      selectedAccountId: null,
      accounts: [],
      currency: {
        code: 'INR',
        name: 'Indian Rupee',
        symbol: '₹',
        decimal_digits: 2,
        countries: ['India'],
      },
      setIsInitialSetupDone: (isInitialSetupDone: boolean) =>
        set({ isInitialSetupDone }),
      addAccount: (account: TAccount) =>
        set(state => ({ accounts: [...state.accounts, account] })),
      deleteAllAccounts: () => set({ accounts: [] }),
      getSelectedAccount: () =>
        get().accounts.find(a => a.id === (get().selectedAccountId ?? '')),
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
      importAccounts: accounts => {
        set({ accounts });
      },
      setDefaultAccountId: id => {
        set({ defaultAccountId: id });
      },
      setSelectedAccountId: id => {
        set({ selectedAccountId: id });
      },
      setCurrency: cur => {
        set({ currency: cur });
      },
    }),
    { name: 'account-storage', storage: createJSONStorage(zustandStorage) },
  ),
);

export default useAccountStore;
