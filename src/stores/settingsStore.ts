import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '../storage';

type TSettingsStore = {
  backupDirPath: string | null;
};

type TSettingsStoreActions = {
  setBackupDirPath: (path: string) => void;
  removeBackupDirPath: () => void;
};

type PositionStore = TSettingsStore & TSettingsStoreActions;

const useSettingsStore = create<PositionStore>()(
  persist(
    set => ({
      backupDirPath: null,
      setBackupDirPath(path) {
        set(() => ({
          backupDirPath: path,
        }));
      },
      removeBackupDirPath() {
        set(() => ({
          backupDirPath: null,
        }));
      },
    }),
    { name: 'Settings-Storage', storage: createJSONStorage(zustandStorage) },
  ),
);

export default useSettingsStore;
