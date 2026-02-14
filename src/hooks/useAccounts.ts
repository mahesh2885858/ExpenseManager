import { useCallback, useMemo } from 'react';
import useAccountStore from '../stores/accountsStore';
import useTransactionsStore from '../stores/transactionsStore';
import useTransactions from './useTransactions';

const useAccounts = () => {
  const accounts = useAccountStore(state => state.accounts);
  const removeAcc = useAccountStore(state => state.removeAnAcc);
  const deleteTransactionForAnAcc = useTransactionsStore(
    state => state.deleteForAnAcc,
  );
  const { filteredTransactions: transactions } = useTransactions({});
  const defaultAccId = useAccountStore(state => state.defaultAccountId);
  const setDefaultAccountId = useAccountStore(
    state => state.setDefaultAccountId,
  );

  const setSelectedAccountId = useAccountStore(
    state => state.setSelectedAccountId,
  );

  const selectedAccountId = useAccountStore(state => state.selectedAccountId);
  const currency = useAccountStore(state => state.currency);

  const selectedAccount = useMemo(
    () => accounts.find(acc => acc.id === selectedAccountId),
    [accounts, selectedAccountId],
  );

  const deleteAcc = useCallback(
    (id: string) => {
      const remainingAccounts = accounts.filter(acc => acc.id !== id);
      deleteTransactionForAnAcc(id);
      setDefaultAccountId(null);
      setSelectedAccountId(
        remainingAccounts.length === 0 ? null : remainingAccounts[0].id,
      );
      removeAcc(id);
    },
    [
      deleteTransactionForAnAcc,
      removeAcc,
      setDefaultAccountId,
      accounts,
      setSelectedAccountId,
    ],
  );

  const totalBalance = useMemo(() => {
    return accounts.reduce((prev, item) => {
      return prev + (item.initBalance ?? 0);
    }, 0);
  }, [accounts]);

  const getIncomeExpenseForAcc = useCallback(
    (id: string) => {
      const acc = accounts.find(a => a.id === id);
      const transactionsForAcc = transactions.filter(t => t.accountId === id);
      let expense = 0;
      let income = 0;
      let balance = 0;
      if (acc) {
        transactionsForAcc.forEach(t => {
          if (t.type === 'expense') {
            expense += t.amount;
          } else {
            income += t.amount;
          }
        });
        balance = acc.initBalance ?? 0 + income - expense;
      }

      return {
        expense,
        income,
        balance,
      };
    },
    [accounts, transactions],
  );

  return {
    totalBalance,
    deleteAcc,
    currency,
    accounts,
    selectedAccount,
    setSelectedAccountId,
    getIncomeExpenseForAcc,
    defaultAccountId: defaultAccId
      ? defaultAccId
      : accounts.length > 0
      ? accounts[0].id
      : '',
  };
};

export default useAccounts;
