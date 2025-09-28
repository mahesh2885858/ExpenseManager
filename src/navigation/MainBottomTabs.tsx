import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Icon } from 'react-native-paper';
import { TBottomTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
const BottomTab = createBottomTabNavigator<TBottomTabParamList>();

const tabBarIcon = (
  props: {
    focused: boolean;
    color: string;
    size: number;
  },
  iconName: string,
) => {
  return <Icon source={iconName} size={30} color={props.color} />;
};

const MainBottomTabs = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: props =>
            tabBarIcon(props, props.focused ? 'home' : 'home-outline'),
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Transactions"
        component={HomeScreen}
        options={{
          tabBarIcon: props => tabBarIcon(props, 'history'),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default MainBottomTabs;
