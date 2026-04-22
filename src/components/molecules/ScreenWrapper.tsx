import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, useAppTheme } from '../../../theme';

const ScreenWrapper = (props: ViewProps) => {
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <View
      {...props}
      style={[styles.container, props.style, { paddingTop: top }]}
    >
      {props.children}
    </View>
  );
};

export default ScreenWrapper;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
    },
  });
