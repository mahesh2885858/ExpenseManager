import { NavigatorScreenParams } from '@react-navigation/native';
import { TTransaction } from './transactions';
import { TBudget } from './budget';

export type TBottomTabParamList = {
  Home: undefined;
  CustomButton: undefined;
  Transactions: undefined;
  Budgets: undefined;
  Reports: undefined;
};

export type TRootStackParamList = {
  Welcome: undefined;
  WalletSetup: undefined;
  MainBottomTabs: NavigatorScreenParams<TBottomTabParamList>;
  AddTransaction:
    | {
        mode: 'new';
        type?: 'INCOME' | 'EXPENSE';
      }
    | {
        mode: 'edit';
        transaction: TTransaction;
      };
  TransactionDetails: {
    transaction: TTransaction;
  };
  TransactionFilters: undefined;
  TransactionSort: undefined;
  ManageAccounts: undefined;
  ManageCategories: undefined;
  Settings: undefined;
  FilteredTransactions: {
    type: 'account' | 'category';
    id: string;
  };
  BudgetDetails: {
    budget: TBudget;
  };
  AddOrEditBudget: { mode: 'new' } | { mode: 'edit'; budget: TBudget };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TRootStackParamList {}
  }
}
