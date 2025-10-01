import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InitialAccountAmountSetup from '../screens/InitialSetup/InitialAccountAmountSetup';
import InitialAccountNameSetup from '../screens/InitialSetup/InitialAccountNameSetup';
import useAccountStore from '../stores/accountsStore';
import { TRootStackParamList } from '../types';
import MainBottomTabs from './MainBottomTabs';
import AddTransaction from '../screens/AddTransaction';
const Stack = createNativeStackNavigator<TRootStackParamList>();

const MainStack = () => {
  const isInitialSetupDone = useAccountStore(state => state.isInitialSetupDone);
  return (
    <Stack.Navigator>
      {!isInitialSetupDone ? (
        <>
          <Stack.Screen
            name="NameInput"
            options={{ headerShown: false }}
            component={InitialAccountNameSetup}
          />
          <Stack.Screen
            name="AmountInput"
            options={{ headerShown: false }}
            component={InitialAccountAmountSetup}
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
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
