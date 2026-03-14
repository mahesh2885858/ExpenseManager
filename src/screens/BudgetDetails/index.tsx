import React from 'react';
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

const BudgetDetails = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { top } = useSafeAreaInsets();
  const { getFormattedAmount } = useTransactions();
  const navigation = useNavigation();

  const getProgressColor = (progress: number) => {
    if (progress <= 0.5) return colors.success;
    if (progress <= 0.8) return colors.primary;
    return colors.error;
  };

  const budgetName = 'Groceries';
  return (
    <View style={[styles.container, { marginTop: top }]}>
      {/*header starts*/}
      <View style={[styles.header]}>
        <PressableWithFeedback onPress={navigation.goBack}>
          <Icon
            source={'arrow-left'}
            size={textSize.xxl}
            color={colors.onBackground}
          />
        </PressableWithFeedback>
        <Text style={[styles.headerText]}>{budgetName}</Text>
      </View>
      {/*header ends*/}
      {/*Budget deatils starts*/}

      <View style={[styles.budgetCard]}>
        <View style={[styles.budgetTopRow]}>
          <View style={[gs.fullFlex, gs.flexRow, gs.itemsCenter]}>
            <Text style={[styles.budgetName]}>Monthly Budget</Text>
            <View style={[gs.flexRow, styles.budgetShortSummary]}>
              <Text style={[styles.budgetSpentText]}>
                {getFormattedAmount(8000)}
              </Text>
            </View>
          </View>
        </View>
        <ProgressBar
          style={[styles.budgetProgres]}
          progress={0.7}
          color={getProgressColor(0.8)}
        />
        <View style={[styles.budgetBottomRow]}>
          <View style={[styles.budgetRemaining]}>
            <Text style={[styles.budgetRemainText]}>
              {getFormattedAmount(12000)}
            </Text>
            <Text style={[styles.budgetRemainTextPrep]}>Spent</Text>
          </View>
          <Text style={[styles.budgetSpentPercentage]}>45%</Text>
        </View>
      </View>

      {/*Budget details ends*/}
    </View>
  );
};
export default BudgetDetails;
const createStyles = (colors: AppTheme['colors']) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
    },
    header: {
      paddingTop: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
      gap: spacing.sm,
    },
    headerText: {
      fontSize: textSize.lg,
      fontWeight: 'bold',
      flex: 1,
      color: colors.onBackground,
    },
    budgetCard: {
      gap: spacing.sm,
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
      flex: 1,
    },
    budgetShortSummary: {
      gap: spacing.xs,
      alignItems: 'center',
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
      gap: 4,
      flex: 1,
    },
    budgetSpentPercentage: {
      fontSize: textSize.sm,
      color: colors.onBackground,
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
