import React, { useMemo } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
import Main from './src/Main';
import useUIStore from './src/stores/uiStore';
import './src/translations/i18n';
import { CombinedDarkTheme, CombinedDefaultTheme } from './theme';
const App = () => {
  const theme = useUIStore(state => state.theme);
  const systemTheme = useColorScheme();
  const combinedTheme = useMemo(() => {
    if (theme === 'system') {
      return systemTheme;
    } else {
      return theme;
    }
  }, [theme, systemTheme]);

  return (
    <SafeAreaProvider>
      <PaperProvider
        theme={
          combinedTheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme
        }
      >
        <StatusBar
          barStyle={combinedTheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Main theme={combinedTheme} />
        <ToastManager />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
