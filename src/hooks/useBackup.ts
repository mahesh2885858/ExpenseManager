import { format } from 'date-fns';
import Stringify from 'fast-json-stable-stringify';
import { sha256 } from 'js-sha256';
import { useCallback, useState } from 'react';
import { ToastAndroid } from 'react-native';
import * as ScopedStorage from 'react-native-scoped-storage';
import { APP_NAME_EXPORT_DATA, BACKUP_VERSION } from '../common';
import useCategoriesStore from '../stores/categoriesStore';
import useSettingsStore from '../stores/settingsStore';
import useTransactionsStore from '../stores/transactionsStore';
import useWalletStore from '../stores/walletsStore';
import {
  TBudget,
  TCategories,
  TTransaction,
  TTransactionByIds,
  TWallet,
} from '../types';
import { getValidData } from '../utils/validateImportedData';
import useWallets from './useAccounts';
import useCategories from './useCategories';
import useBudgets from './useBudgets';
import useBudgetStore from '../stores/budgetStore';

const useBackup = () => {
  const { wallets } = useWallets();
  const { categories } = useCategories();
  const budgets = useBudgetStore(state => state.budgets);
  const importBudgets = useBudgetStore(state => state.importBudgets);
  const transactionsIds = useTransactionsStore(state => state.transactionsIds);
  const transactionsByIds = useTransactionsStore(
    state => state.transactionsByIds,
  );
  const importCategories = useCategoriesStore(state => state.importCategories);
  const importTransactions = useTransactionsStore(
    state => state.importTransactions,
  );
  const importWallets = useWalletStore(state => state.importWallets);
  const backupDirPath = useSettingsStore(state => state.backupDirPath);
  const setBackupDirPath = useSettingsStore(state => state.setBackupDirPath);
  const removeBackupDirPath = useSettingsStore(
    state => state.removeBackupDirPath,
  );

  const [dataToImport, setDataToImport] = useState<null | {
    wallets: TWallet[];
    categories: TCategories;
    transactions: TTransaction[];
    budgets: TBudget[];
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
      const transactions: TTransaction[] = [];
      if (transactionsByIds) {
        transactionsIds.forEach(id => {
          transactions.push(transactionsByIds[id]);
        });
      }
      const dataToExport = {
        wallets,
        transactions,
        categories,
        budgets,
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
    transactionsIds,
    wallets,
    categories,
    transactionsByIds,
    budgets,
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

        const accountIds = new Set(validData.wallets?.map(a => a.id));

        validData.transactions = validData.transactions?.filter(t => {
          if (!accountIds.has(t.walletId)) {
            itemsSkipped.transactions += 1;
            return false;
          }
          return true;
        });

        setDataToImport({
          wallets: validData.wallets ?? [],
          categories: validData.categories ?? [],
          transactions: validData.transactions ?? [],
          budgets: validData.budgets ?? [],
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
      importWallets(dataToImport.wallets);
      importCategories(dataToImport.categories);
      importBudgets(dataToImport.budgets);
      let data: TTransactionByIds = null;
      const ids: string[] = [];
      dataToImport.transactions.forEach(tr => {
        if (!data) {
          data = { [tr.id]: tr };
        } else {
          data[tr.id] = tr;
        }
        ids.push(tr.id);
      });
      importTransactions(ids, data);
      setDataToImport(null);
      setIsImporting(false);
      ToastAndroid.show('Imported successfully', ToastAndroid.LONG);
    }
  }, [
    dataToImport,
    importWallets,
    importCategories,
    importTransactions,
    importBudgets,
  ]);

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
