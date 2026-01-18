import { useMemo } from 'react';
import useAccountStore from '../stores/accountsStore';

const useAccounts = () => {
  const accounts = useAccountStore(state => state.accounts);
  const totalBalance = useMemo(() => {
    return accounts.reduce((prev, item) => {
      return prev + (item.balance ?? 0);
    }, 0);
  }, [accounts]);

  return {
    totalBalance,
  };
};

export default useAccounts;
