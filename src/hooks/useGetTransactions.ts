import { useMemo } from 'react';
import useAccountStore from '../stores/accountsStore';
import useTransactionsStore from '../stores/transactionsStore';

const useGetTransactions = () => {
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);
  const transactions = useTransactionsStore(state => state.transactions);
  const selectedAccount = useMemo(() => {
    return getSelectedAccount();
  }, [getSelectedAccount]);
  const totalIncome = useMemo(() => {
    return transactions.reduce((prev, curr) => {
      if (curr.type === 'expense') {
        return prev;
      } else {
        return prev + curr.amount;
      }
    }, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions.reduce((prev, curr) => {
      if (curr.type === 'expense') {
        return prev + curr.amount;
      } else {
        return prev;
      }
    }, 0);
  }, [transactions]);

  return {
    transactions: transactions.filter(t => t.accountId === selectedAccount.id),
    totalExpenses,
    totalIncome,
  };
};

export default useGetTransactions;
