import { StyleSheet, View } from 'react-native';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import useHelpers from '../../hooks/useHelpers';
import AppText from '../molecules/AppText';
import CircularProgressBar from '../molecules/CircularProgressBar';
import { TBudget } from '../../types';
type TProps = {
  budget: TBudget;
};
const RenderBudget = (props: TProps) => {
  const { colors } = useAppTheme();
  const { getFormattedAmount } = useHelpers();
  const styles = createStyles(colors);
  return (
    <View style={[styles.container]}>
      <View style={[gs.fullFlex, gs.justifyCenter, { gap: spacing.xs }]}>
        <AppText.Regular style={[styles.budgetName]}>
          {props.budget.name}
        </AppText.Regular>
        <View style={[gs.flexRow, gs.itemsCenter]}>
          <AppText.Regular style={[styles.budgetAmount]}>
            {getFormattedAmount(props.budget.spent ?? 0)}
          </AppText.Regular>
          <AppText.Regular
            style={[styles.budgetAmount, styles.budgetAmountTotal]}
          >
            {' / ' + getFormattedAmount(props.budget.amount)}
          </AppText.Regular>
        </View>
      </View>
      <View
        style={[
          {
            paddingVertical: spacing.xs,
          },
        ]}
      >
        <CircularProgressBar
          strokeWidth={5}
          progress={(props.budget.spent / props.budget.amount) * 100}
          size={40}
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
      fontSize: textSize.sm,
    },
    budgetAmount: {
      color: colors.onSurface,
      fontSize: textSize.sm,
    },
    budgetAmountTotal: {
      color: colors.onSurfaceDisabled,
    },
  });
