import { StyleSheet, View } from 'react-native';
import { gs } from '../../common';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import AppText from '../molecules/AppText';
import CircularProgressBar from '../molecules/CircularProgressBar';
import useTransactions from '../../hooks/useTransactions';

const RenderBudget = () => {
  const { colors } = useAppTheme();
  const { getFormattedAmount } = useTransactions();
  const styles = createStyles(colors);
  return (
    <View style={[styles.container]}>
      <View style={[gs.fullFlex]}>
        <AppText.Regular style={[styles.budgetName]}>
          MonthlyGroceris
        </AppText.Regular>
        <AppText.Regular style={[styles.budgetAmount]}>
          {getFormattedAmount('123455') + '/' + getFormattedAmount('345678')}
        </AppText.Regular>
      </View>
      <View>
        <CircularProgressBar
          strokeWidth={5}
          height={45}
          width={45}
          progress={80}
          size={45}
          background={'transparent'}
          completedColor={colors.primary}
          remainingColor={colors.surfaceVariant}
        />
      </View>
    </View>
  );
};

export default RenderBudget;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceContainer,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    budgetName: {
      color: colors.onSurface,
      fontSize: textSize.xs,
    },
    budgetAmount: {
      color: colors.onSurface,
      fontSize: textSize.xs,
    },
  });
