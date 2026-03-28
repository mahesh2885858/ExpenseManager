import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import WalletSetup from '../screens/InitialSetup/WalletSetup';
import WelcomeScreen from '../screens/InitialSetup/WelcomeScreen';
import useWalletStore from '../stores/walletsStore';
import { TRootStackParamList } from '../types';
import MainBottomTabs from './MainBottomTabs';
import AddTransaction from '../screens/AddTransaction';
import TransactionDetails from '../screens/TransactionDetails';
import TransactionFilters from '../screens/TransactionFilters';
import ManageAccounts from '../screens/ManageAccounts';
import Settings from '../screens/Settings';
import FilteredTransactions from '../screens/FilteredTransactions';
import ManageCategories from '../screens/ManageCategories';
import TransactionSort from '../screens/TransactionSort';
import BudgetDetails from '../screens/BudgetDetails';
import AddOrEditBudget from '../screens/AddOrEditBudget';
const Stack = createNativeStackNavigator<TRootStackParamList>();

const MainStack = () => {
  const isInitialSetupDone = useWalletStore(state => state.isInitialSetupDone);
  return (
    <Stack.Navigator>
      {!isInitialSetupDone ? (
        <>
          <Stack.Screen
            name="Welcome"
            options={{ headerShown: false }}
            component={WelcomeScreen}
          />
          <Stack.Screen
            name="WalletSetup"
            options={{ headerShown: false }}
            component={WalletSetup}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="MainBottomTabs"
            component={MainBottomTabs}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransaction}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TransactionDetails"
            component={TransactionDetails}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TransactionFilters"
            component={TransactionFilters}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TransactionSort"
            component={TransactionSort}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="ManageAccounts"
            component={ManageAccounts}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ManageCategories"
            component={ManageCategories}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FilteredTransactions"
            component={FilteredTransactions}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BudgetDetails"
            component={BudgetDetails}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddOrEditBudget"
            component={AddOrEditBudget}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
