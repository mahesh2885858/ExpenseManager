import React from 'react';
import AppText from '../molecules/AppText';
import { AppTheme, textSize, useAppTheme } from '../../../theme';
import { StyleSheet } from 'react-native';

type TProps = {
  header: string;
};

const HeaderText = ({ header }: TProps) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return <AppText.Bold style={[styles.header]}>{header}</AppText.Bold>;
};

export default HeaderText;
const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    header: {
      color: colors.onSurface,
      fontSize: textSize.lg,
    },
  });
