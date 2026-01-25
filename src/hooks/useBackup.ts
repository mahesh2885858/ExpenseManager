import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import { ToastAndroid } from 'react-native';
import * as ScopedStorage from 'react-native-scoped-storage';
import useAccountStore from '../stores/accountsStore';
import useSettingsStore from '../stores/settingsStore';
import useTransactionsStore from '../stores/transactionsStore';
import { TAccount, TCategories, TTransaction } from '../types';
import { getValidData } from '../utils/validateImportedData';
import useAccounts from './useAccounts';
import useCategories from './useCategories';
import useTransactions from './useTransactions';

const IMPORT_VERSION = '1';

const useBackup = () => {
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { filteredTransactions } = useTransactions({});
  const importCategories = useTransactionsStore(
    state => state.importCategories,
  );
  const importTransactions = useTransactionsStore(
    state => state.importTransactions,
  );
  const importAccounts = useAccountStore(state => state.importAccounts);
  const backupDirPath = useSettingsStore(state => state.backupDirPath);
  const setBackupDirPath = useSettingsStore(state => state.setBackupDirPath);
  const removeBackupDirPath = useSettingsStore(
    state => state.removeBackupDirPath,
  );

  const [dataToImport, setDataToImport] = useState<null | {
    accounts: TAccount[];
    categories: TCategories;
    transactions: TTransaction[];
  }>(null);

  const [isGettingData, setIsGettingData] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const resetDataToImport = () => {
    setDataToImport(null);
  };

  const pickTheDirectory = useCallback(async () => {
    return (await ScopedStorage.openDocumentTree(true)).uri;
  }, []);

  const exportData = useCallback(async () => {
    try {
      setIsExporting(true);
      const dataToExport = JSON.stringify({
        version: IMPORT_VERSION,
        backupCreatedDate: new Date(),
        accounts,
        transactions: filteredTransactions,
        categories,
      });
      let dir = backupDirPath;
      const persistedUris = await ScopedStorage.getPersistedUriPermissions();
      if (dir) {
        const isPersisted = persistedUris.some(uri =>
          dir ? dir.startsWith(uri) : false,
        );
        const exists = await ScopedStorage.listFiles(dir);

        if (!isPersisted || !exists || exists.length === 0) {
          dir = await pickTheDirectory();
          setBackupDirPath(dir);
        }
      } else {
        dir = await pickTheDirectory();
        setBackupDirPath(dir);
      }
      const date = format(new Date(), 'dd-MM-yyyy_HH-mm-ss');
      const filePath = `ExpenseManager-backup-${date}.json`;
      if (dir) {
        await ScopedStorage.writeFile(
          dir,
          dataToExport,
          filePath,
          'application/json',
          'utf8',
          false,
        );
        ToastAndroid.show('Exported successfully', ToastAndroid.SHORT);
      } else {
        throw new Error('Something went wrong!!');
      }
    } catch (e) {
      console.log({ e });
      removeBackupDirPath();
    } finally {
      setIsExporting(false);
    }
  }, [
    backupDirPath,
    removeBackupDirPath,
    setBackupDirPath,
    pickTheDirectory,
    filteredTransactions,
    accounts,
    categories,
  ]);

  const getDataToImport = useCallback(async () => {
    try {
      setIsGettingData(true);
      const dir = await ScopedStorage.openDocument(true);
      if (dir && dir.data) {
        const data = JSON.parse(dir.data);
        console.log({ data });
        const { validData } = getValidData(data);
        setDataToImport({
          accounts: validData.accounts ?? [],
          categories: validData.categories ?? [],
          transactions: validData.transactions ?? [],
        });
      } else {
        throw 'No data found';
      }
    } catch (e) {
      console.log({ e });
      setDataToImport(null);
    } finally {
      setIsGettingData(false);
    }
  }, []);

  const importData = useCallback(() => {
    if (dataToImport) {
      setIsImporting(true);
      importAccounts(dataToImport.accounts);
      importCategories(dataToImport.categories);
      importTransactions(dataToImport.transactions);
      setDataToImport(null);
      setIsImporting(false);
    }
  }, [dataToImport, importAccounts, importCategories, importTransactions]);

  return {
    exportData,
    getDataToImport,
    dataToImport,
    resetDataToImport,
    importData,
    isImporting,
    isGettingData,
    isExporting,
  };
};

export default useBackup;
