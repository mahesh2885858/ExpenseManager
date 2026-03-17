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
import useBudgetStore from '../../stores/budgetStore';
import { FlashList } from '@shopify/flash-list';

const Budget = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { top } = useSafeAreaInsets();
  const { getFormattedAmount } = useTransactions();
  const budgets = useBudgetStore(state => state.budgets);
  const navigate = useNavigation();

  const getProgressColor = (progress: number) => {
    if (progress <= 0.5) return colors.success;
    if (progress <= 0.8) return colors.primary;
    return colors.error;
  };

  const onAddPress = useCallback(() => {
    navigate.navigate('AddOrEditBudget', { mode: 'new' });
  }, [navigate]);

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
      <FlashList
        ListEmptyComponent={
          <View style={[styles.emptyList]}>
            <Text style={[styles.emptyListText]}>
              No budget yet. Create by clicking on '+' icon above.
            </Text>
          </View>
        }
        data={budgets}
        contentContainerStyle={[gs.fullFlex]}
        keyExtractor={item => item.id}
        renderItem={({ item: budget }) => {
          const progress = roundValue(budget.spent / budget.amount, 2);
          return (
            <PressableWithFeedback
              onPress={() => {
                navigate.navigate('BudgetDetails', {
                  budget,
                });
              }}
              key={budget.id}
              style={[styles.budgetCard]}
            >
              <View style={[styles.budgetTopRow]}>
                <View style={[gs.fullFlex]}>
                  <Text style={[styles.budgetName]}>{budget.name}</Text>
                  <View style={[gs.flexRow, styles.budgetShortSummary]}>
                    <Text style={[styles.budgetSpentText]}>
                      {getFormattedAmount(budget.spent)}
                    </Text>
                    <Text
                      style={[styles.budgetTotalText]}
                    >{`of ${getFormattedAmount(budget.amount)}`}</Text>
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
                    {getFormattedAmount(budget.amount - budget.spent)}
                  </Text>
                  <Text style={[styles.budgetRemainTextPrep]}> Left</Text>
                </View>
              </View>
            </PressableWithFeedback>
          );
        }}
      />
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
      flex: 1,
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
    emptyList: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyListText: {
      fontSize: textSize.lg,
      color: colors.onSurfaceDisabled,
      fontWeight: 'bold',
      textAlign: 'center',
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
