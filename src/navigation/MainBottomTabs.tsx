import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import useAccountStore from '../stores/accountsStore';
import { TBottomTabParamList } from '../types';
const BottomTab = createBottomTabNavigator<TBottomTabParamList>();
const HomeScreen = () => {
  const setIsInitialSetupDone = useAccountStore(
    state => state.setIsInitialSetupDone,
  );
  const deleteAllAccounts = useAccountStore(state => state.deleteAllAccounts);
  return (
    <View>
      <Button
        onPress={() => {
          setIsInitialSetupDone(false);
          deleteAllAccounts();
        }}
      >
        Reset stack
      </Button>
    </View>
  );
};

const MainBottomTabs = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon(props) {
            return <Icon source={'home-outline'} size={30} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Transactions"
        component={HomeScreen}
        options={{
          tabBarIcon(props) {
            return <Icon source={'history'} size={30} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
};

export default MainBottomTabs;
