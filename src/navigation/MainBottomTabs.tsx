import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import { Icon } from 'react-native-paper';
import { TBottomTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import MyTabBar from '../components/organisms/MyTabBar';
import Transactions from '../screens/Transactions';
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

const renderTabBar = (props: BottomTabBarProps) => <MyTabBar {...props} />;

const MainBottomTabs = () => {
  return (
    <BottomTab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
        },
        animation: 'shift',
      }}
    >
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
        name="CustomButton"
        component={() => null}
        options={{ tabBarButton: () => null }}
      />

      <BottomTab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarIcon: props => tabBarIcon(props, 'history'),
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
};

export default MainBottomTabs;
