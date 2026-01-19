import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ColorSchemeName } from 'react-native';
import { CombinedDarkTheme, CombinedDefaultTheme } from '../theme';
import MainStack from './navigation/MainStack';

const Main = (props: { theme: ColorSchemeName }) => {
  const { theme } = props;

  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        // This maps 1:1 to your TRootStackParamList
        AddTransaction: {
          path: 'add-transaction/:type',
          parse: {
            widgetMode: (value: string) => value,
          },
        },

        MainBottomTabs: {
          screens: {
            Home: 'home',
            Transactions: 'transactions',
            CustomButton: 'custom-button',
          },
        },

        NameInput: 'name-input',
        AmountInput: 'amount-input',
        TransactionDetails: 'transaction-details',
        TransactionFilters: 'transaction-filters',
      },
    },
  };

  return (
    <NavigationContainer
      linking={linking}
      theme={theme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}
    >
      <MainStack />
    </NavigationContainer>
  );
};

export default Main;
