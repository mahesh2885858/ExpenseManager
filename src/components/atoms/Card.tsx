import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppTheme, borderRadius, spacing, useAppTheme } from '../../../theme';
type TCardProps = {
  children: ReactNode;
};
const Card = (props: TCardProps) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return <View style={[styles.card]}>{props.children}</View>;
};
export default Card;
const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
  });
