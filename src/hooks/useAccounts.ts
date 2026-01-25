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

  const deleteAcc = useCallback(
    (id: string) => {
      deleteTransactionForAnAcc(id);
      removeAcc(id);
    },
    [deleteTransactionForAnAcc, removeAcc],
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
    accounts,
    getIncomeExpenseForAcc,
  };
};

export default useAccounts;
