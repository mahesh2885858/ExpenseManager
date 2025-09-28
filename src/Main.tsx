import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MainStack from './navigation/MainStack';
import { useColorScheme } from 'react-native';
import { CombinedDarkTheme, CombinedDefaultTheme } from '../theme';

const Main = () => {
  const theme = useColorScheme();

  return (
    <NavigationContainer
      theme={theme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}
    >
      <MainStack />
    </NavigationContainer>
  );
};

export default Main;
