import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import MaterialTheme from './theme_one.json';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 30,
  xxl: 34,
  xxxl: 40,
};

export const textSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
};

const CustomLight: MD3Theme = {
  ...MD3LightTheme,
  version: 3,
  colors: {
    ...MD3LightTheme.colors,
    ...MaterialTheme.light,
  },
};

const CustomDark: MD3Theme = {
  ...MD3DarkTheme,
  version: 3,
  colors: {
    ...MD3DarkTheme.colors,
    ...MaterialTheme.dark,
  },
};

export { CustomLight, CustomDark };
