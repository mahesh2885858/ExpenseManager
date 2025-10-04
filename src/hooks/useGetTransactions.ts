import { useMemo } from 'react';
import useAccountStore from '../stores/accountsStore';
import useTransactionsStore from '../stores/transactionsStore';

const useGetTransactions = () => {
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);
  const transactions = useTransactionsStore(state => state.transactions);
  const selectedAccount = useMemo(() => {
    return getSelectedAccount();
  }, [getSelectedAccount]);

  return transactions.filter(t => t.accountId === selectedAccount.id);
};

export default useGetTransactions;
