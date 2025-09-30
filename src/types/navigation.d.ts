import { NavigatorScreenParams } from '@react-navigation/native';

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
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TRootStackParamList {}
  }
}
