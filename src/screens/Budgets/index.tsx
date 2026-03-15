import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import { Icon, ProgressBar } from 'react-native-paper';
import { gs } from '../../common';
import useTransactions from '../../hooks/useTransactions';
import { roundValue } from 'commonutil-core';
import { useNavigation } from '@react-navigation/native';

const Budget = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { top } = useSafeAreaInsets();
  const { getFormattedAmount } = useTransactions();
  const navigate = useNavigation();

  const getProgressColor = (progress: number) => {
    if (progress <= 0.5) return colors.success;
    if (progress <= 0.8) return colors.primary;
    return colors.error;
  };

  const onAddPress = useCallback(() => {
    navigate.navigate('AddOrEditBudget', { mode: 'new' });
  }, [navigate]);

  const budgets = [
    {
      total: 10000,
      spent: 3000,
    },
    {
      total: 10400,
      spent: 5700,
    },
    {
      total: 23000,
      spent: 22300,
    },
  ];

  return (
    <View style={[styles.container, { marginTop: top }]}>
      {/*header starts*/}
      <View style={[styles.header]}>
        <Text style={[styles.headerText]}>Budget</Text>
        <PressableWithFeedback onPress={onAddPress}>
          <Icon
            source={'plus'}
            size={textSize.xxl}
            color={colors.onBackground}
          />
        </PressableWithFeedback>
      </View>
      {/*header ends*/}
      {/*BudgetCard starts*/}
      {budgets.map(budget => {
        const left = budget.total - budget.spent;
        const progress = roundValue(budget.spent / budget.total, 2);
        return (
          <PressableWithFeedback
            onPress={() => {
              navigate.navigate('BudgetDetails', {
                id: '123',
              });
            }}
            key={budget.total}
            style={[styles.budgetCard]}
          >
            <View style={[styles.budgetTopRow]}>
              <View style={[gs.fullFlex]}>
                <Text style={[styles.budgetName]}>Groceries</Text>
                <View style={[gs.flexRow, styles.budgetShortSummary]}>
                  <Text style={[styles.budgetSpentText]}>
                    {getFormattedAmount(left)}
                  </Text>
                  <Text
                    style={[styles.budgetTotalText]}
                  >{`of ${getFormattedAmount(budget.total)}`}</Text>
                </View>
              </View>
              <View>
                <Icon source={'chevron-right'} size={textSize.xl} />
              </View>
            </View>
            <View style={[styles.budgetBottomRow]}>
              <View style={[gs.fullFlex]}>
                <ProgressBar
                  style={[styles.budgetProgres]}
                  progress={progress}
                  color={getProgressColor(progress)}
                />
              </View>
              <View style={[styles.budgetRemaining]}>
                <Text style={[styles.budgetRemainText]}>
                  {getFormattedAmount(12000)}
                </Text>
                <Text style={[styles.budgetRemainTextPrep]}>Left</Text>
              </View>
            </View>
          </PressableWithFeedback>
        );
      })}

      {/*BudgetCard ends*/}
    </View>
  );
};
export default Budget;
const createStyles = (colors: AppTheme['colors']) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
    },
    header: {
      paddingTop: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    headerText: {
      fontSize: textSize.lg,
      fontWeight: 'bold',
      flex: 1,
      color: colors.onBackground,
    },
    budgetCard: {
      gap: spacing.sm,
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
    },
    budgetTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    budgetName: {
      fontSize: textSize.md,
      color: colors.onBackground,
    },
    budgetShortSummary: {
      gap: spacing.xs,
    },
    budgetSpentText: {
      fontSize: textSize.sm,
      color: colors.onBackground,
    },
    budgetTotalText: {
      fontSize: textSize.sm,
      color: colors.onSurfaceDisabled,
    },
    budgetBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    budgetProgres: {
      height: 10,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backdrop,
    },
    budgetRemaining: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    budgetRemainText: {
      fontSize: textSize.sm,
      color: colors.onBackground,
    },
    budgetRemainTextPrep: {
      fontSize: textSize.sm,
      color: colors.onSurfaceDisabled,
    },
  });
  return styles;
};
