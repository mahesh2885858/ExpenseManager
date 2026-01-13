import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { CombinedDarkTheme } from '../theme';
import MainStack from './navigation/MainStack';

const Main = () => {
  // const theme = useColorScheme();

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
      theme={CombinedDarkTheme}
      // theme={theme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}
    >
      <MainStack />
    </NavigationContainer>
  );
};

export default Main;
