import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TTheme } from '../types';

type TUIStore = {
  theme: TTheme;
};

type TUIStoreActions = {
  setThem: (theme: TTheme) => void;
};

type PositionStore = TUIStore & TUIStoreActions;

const useUIStore = create<PositionStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setThem(theme) {
        set(() => ({
          theme,
        }));
      },
    }),
    { name: 'UI-Storage', storage: createJSONStorage(zustandStorage) },
  ),
);

export default useUIStore;
