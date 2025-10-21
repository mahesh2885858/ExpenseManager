import { NavigatorScreenParams } from '@react-navigation/native';
import { TTransaction } from './transactions';

export type TBottomTabParamList = {
  Home: undefined;
  CustomButton: undefined;
  Transactions: undefined;
};

export type TRootStackParamList = {
  NameInput: undefined;
  AmountInput: {
    name: string;
  };
  MainBottomTabs: NavigatorScreenParams<TBottomTabParamList>;
  AddTransaction: undefined;
  TransactionDetails: {
    transaction: TTransaction;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TRootStackParamList {}
  }
}
