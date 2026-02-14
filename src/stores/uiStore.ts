import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';
import { TNumberFormat, TTheme } from '../types';

type TUIStore = {
  theme: TTheme;
  numberFormat: TNumberFormat;
};

type TUIStoreActions = {
  setThem: (theme: TTheme) => void;
  setNumberFormat: (format: TNumberFormat) => void;
};

type PositionStore = TUIStore & TUIStoreActions;

const useUIStore = create<PositionStore>()(
  persist(
    set => ({
      theme: 'system',
      numberFormat: 'lakhs',
      setThem(theme) {
        set(() => ({
          theme,
        }));
      },
      setNumberFormat(format) {
        set({ numberFormat: format });
      },
    }),
    { name: 'UI-Storage', storage: createJSONStorage(zustandStorage) },
  ),
);

export default useUIStore;
