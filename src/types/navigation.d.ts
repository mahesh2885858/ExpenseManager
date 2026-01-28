import { NavigatorScreenParams } from '@react-navigation/native';
import { TTransaction } from './transactions';

export type TBottomTabParamList = {
  Home: undefined;
  CustomButton: undefined;
  Transactions: undefined;
  Reports: undefined;
};

export type TRootStackParamList = {
  NameInput: undefined;
  AmountInput: {
    userName: string;
  };
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
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TRootStackParamList {}
  }
}
