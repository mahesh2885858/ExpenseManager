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
import { APP_NAME_EXPORT_DATA, BACKUP_VERSION } from '../common';
import { sha256 } from 'js-sha256';
import Stringify from 'fast-json-stable-stringify';
import useCategoriesStore from '../stores/categoriesStore';

const useBackup = () => {
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { filteredTransactions: transactions } = useTransactions({});
  const importCategories = useCategoriesStore(state => state.importCategories);
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

      const dataToExport = {
        accounts,
        transactions: transactions,
        categories,
      };

      const serialized = Stringify(dataToExport);
      const checksum = sha256(serialized);

      const meta = {
        app: APP_NAME_EXPORT_DATA,
        backupVersion: BACKUP_VERSION,
        createdAt: new Date().toISOString(),
        checksum: `sha256:${checksum}`,
      };
      const data = Stringify({
        meta,
        data: dataToExport,
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
          data,
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
    transactions,
    accounts,
    categories,
  ]);

  const getDataToImport = useCallback(async () => {
    try {
      setIsGettingData(true);
      const dir = await ScopedStorage.openDocument(true);
      if (dir && dir.data) {
        const data = JSON.parse(dir.data);

        if (!data || !data.meta || !data.data)
          throw new Error('Broken or Invalid data');
        if (!data.meta.app || data.meta.app !== APP_NAME_EXPORT_DATA)
          throw new Error('This backup does not belong to this app');
        if (
          !data.meta.backupVersion ||
          data.meta.backupVersion !== BACKUP_VERSION
        )
          throw new Error('This backup version is not supported');
        if (!data.meta.checksum)
          throw new Error('No signature found in backup.');

        const stored = data.meta.checksum?.replace('sha256:', '');
        const actual = sha256(Stringify(data.data));

        if (stored !== actual) {
          throw new Error('Backup file is corrupted or modified.');
        }

        const { validData, itemsSkipped } = getValidData(data.data);

        const accountIds = new Set(validData.accounts?.map(a => a.id));

        validData.transactions = validData.transactions?.filter(t => {
          if (!accountIds.has(t.accountId)) {
            itemsSkipped.transactions += 1;
            return false;
          }
          return true;
        });

        setDataToImport({
          accounts: validData.accounts ?? [],
          categories: validData.categories ?? [],
          transactions: validData.transactions ?? [],
        });
      } else {
        throw new Error('No data found');
      }
    } catch (e: any) {
      console.log({ e });
      ToastAndroid.show(String(e?.message ?? e), ToastAndroid.LONG);
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
      ToastAndroid.show('Imported successfully', ToastAndroid.LONG);
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
