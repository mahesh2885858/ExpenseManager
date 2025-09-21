import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InitialLoadingScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <ActivityIndicator size={'large'} />
    </View>
  );
};

export default InitialLoadingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
