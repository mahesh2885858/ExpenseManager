import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainStack from './navigation/MainStack';

const Main = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default Main;
