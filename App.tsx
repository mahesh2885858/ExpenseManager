import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './src/Main';
import './src/translations/i18n';
import { StatusBar, useColorScheme } from 'react-native';
import { CombinedDarkTheme, CombinedDefaultTheme } from './theme';

const App = () => {
  const theme = useColorScheme();
  return (
    <SafeAreaProvider>
      <PaperProvider
        theme={theme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Main />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
