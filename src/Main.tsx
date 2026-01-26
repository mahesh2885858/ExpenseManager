import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ColorSchemeName, View } from 'react-native';
import { CombinedDarkTheme, CombinedDefaultTheme, useAppTheme } from '../theme';
import MainStack from './navigation/MainStack';
import { gs } from './common';

const Main = (props: { theme: ColorSchemeName }) => {
  const { theme } = props;
  const { colors } = useAppTheme();

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
      <View style={[gs.fullFlex, { backgroundColor: colors.background }]}>
        <MainStack />
      </View>
    </NavigationContainer>
  );
};

export default Main;
