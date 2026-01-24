import { useCallback, useMemo } from 'react';
import useAccountStore from '../stores/accountsStore';
import useTransactionsStore from '../stores/transactionsStore';

const useAccounts = () => {
  const accounts = useAccountStore(state => state.accounts);
  const removeAcc = useAccountStore(state => state.removeAnAcc);
  const deleteTransactionForAnAcc = useTransactionsStore(
    state => state.deleteForAnAcc,
  );

  const deleteAcc = useCallback(
    (id: string) => {
      deleteTransactionForAnAcc(id);
      removeAcc(id);
    },
    [deleteTransactionForAnAcc, removeAcc],
  );

  const totalBalance = useMemo(() => {
    return accounts.reduce((prev, item) => {
      return prev + (item.balance ?? 0);
    }, 0);
  }, [accounts]);

  return {
    totalBalance,
    deleteAcc,
    accounts,
  };
};

export default useAccounts;
