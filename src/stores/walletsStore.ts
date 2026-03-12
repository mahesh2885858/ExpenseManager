import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TWallet, TCurrency } from '../types';

type TWalletState = {
  userName: string;
  isInitialSetupDone: boolean;
  wallets: TWallet[];
  defaultWalletId: string | null;
  selectedWalletId: string | null;
  currency: TCurrency;
};

type TWalletStoreActions = {
  setIsInitialSetupDone: (isInitialSetupDone: boolean) => void;
  setUsername: (name: string) => void;
  addWallet: (wallet: TWallet) => void;
  updateWallet: (wallet: TWallet) => void;
  deleteAllWallets: () => void;
  removeAWallet: (id: string) => void;
  getSelectedWallet: () => TWallet | undefined;
  selectWallet: (id: string) => void;
  setDefaultWalletId: (id: string | null) => void;
  importWallets: (wallets: TWallet[]) => void;
  setSelectedWalletId: (id: string | null) => void;
  setCurrency: (cur: TCurrency) => void;
};

type PositionStore = TWalletState & TWalletStoreActions;

const useWalletStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      isInitialSetupDone: false,
      userName: '',
      defaultWalletId: null,
      selectedWalletId: null,
      wallets: [],
      currency: {
        code: 'INR',
        name: 'Indian Rupee',
        symbol: '₹',
        decimal_digits: 2,
        countries: ['India'],
      },
      setIsInitialSetupDone: (isInitialSetupDone: boolean) =>
        set({ isInitialSetupDone }),
      addWallet: (wallet: TWallet) =>
        set(state => ({ wallets: [...state.wallets, wallet] })),
      deleteAllWallets: () => set({ wallets: [] }),
      getSelectedWallet: () =>
        get().wallets.find(a => a.id === (get().selectedWalletId ?? '')),
      selectWallet: id => {
        const newWallets: TWallet[] = get().wallets.map(acc => {
          if (acc.id === id) return { ...acc, isSelected: true };
          else return { ...acc, isSelected: false };
        });
        set({ wallets: newWallets });
      },
      setUsername: name => {
        return set({ userName: name });
      },
      updateWallet: acc => {
        const updatedWallets = get().wallets.map(item => {
          if (item.id === acc.id) {
            return { ...acc };
          } else return item;
        });
        set({ wallets: updatedWallets });
      },
      removeAWallet: id => {
        const wallets = get().wallets.filter(a => a.id !== id);
        set({ wallets: wallets });
      },
      importWallets: wallets => {
        set({ wallets: wallets });
      },
      setDefaultWalletId: id => {
        set({ defaultWalletId: id });
      },
      setSelectedWalletId: id => {
        set({ selectedWalletId: id });
      },
      setCurrency: cur => {
        set({ currency: cur });
      },
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(zustandStorage),
      version: 1,
    },
  ),
);

export default useWalletStore;
