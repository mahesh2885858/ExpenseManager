/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-get-random-values';
import App from './App';
import { name as appName } from './app.json';

function saveCrashLog(message, error) {
  const log = `
==== JS CRASH ====
Time: ${new Date().toISOString()}
Message: ${message}
Error: ${error?.stack || error}
------------------
`;
  console.log({ log });
}

ErrorUtils.setGlobalHandler((error, isFatal) => {
  saveCrashLog(isFatal ? 'Fatal JS error' : 'Non-fatal JS error', error);

  // (Optional) crash the app for fatal errors
  if (isFatal) {
    console.log('Fatal JS Error - forcing app crash');
  }
});

AppRegistry.registerComponent(appName, () => App);
