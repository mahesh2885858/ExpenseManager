import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, ProgressBar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import RenderTransactions from '../../components/RenderTransactions';
import useTransactions from '../../hooks/useTransactions';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import useBudgetStore from '../../stores/budgetStore';
import { TRootStackParamList } from '../../types';

const BudgetDetails = () => {
  const { colors } = useAppTheme();
  const route = useRoute<RouteProp<TRootStackParamList, 'BudgetDetails'>>();
  const styles = createStyles(colors);
  const { top } = useSafeAreaInsets();
  const { getFormattedAmount, filteredTransactions } = useTransactions();
  const removeBudget = useBudgetStore(state => state.removeBudget);
  const navigation = useNavigation();
  const animHeight = useSharedValue(0);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const getProgressColor = (progress: number) => {
    if (progress <= 0.5) return colors.success;
    if (progress <= 0.8) return colors.primary;
    return colors.error;
  };

  const expand = useCallback(() => {
    if (isDeleteAlertOpen) {
      animHeight.value = withTiming(0);
      setIsDeleteAlertOpen(false);
    } else {
      animHeight.value = withTiming(100);
      setIsDeleteAlertOpen(true);
    }
  }, [animHeight, isDeleteAlertOpen]);

  const collapse = useCallback(() => {
    animHeight.value = withTiming(0);
    setIsDeleteAlertOpen(false);
  }, [animHeight]);

  const deleteItem = useCallback(() => {
    removeBudget(route.params.budget.id);
    navigation.goBack();
  }, [route, removeBudget, navigation]);

  const budgetName = route.params.budget.name ?? 'Unknown';

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
        <PressableWithFeedback onPress={expand}>
          <Icon
            source={isDeleteAlertOpen ? 'close' : 'delete'}
            size={textSize.xl}
            color={colors.onBackground}
          />
        </PressableWithFeedback>
      </View>
      {/*header ends*/}

      {/*Delete confirmation starts*/}
      <Animated.View
        style={[
          styles.deleteBox,
          {
            height: animHeight,
          },
        ]}
      >
        <Text style={[styles.deleteBoxText]}>This can not be undone.</Text>
        <Text style={[styles.deleteBoxText]}>
          Are you sure you want to delete this budget?
        </Text>
        <View style={[styles.deleteBtnBox]}>
          <PressableWithFeedback
            onPress={collapse}
            style={[styles.deleteBtn, styles.cancelBtn]}
          >
            <Text style={[styles.cancelBtnText]}>Cancel</Text>
          </PressableWithFeedback>
          <PressableWithFeedback
            onPress={deleteItem}
            style={[styles.deleteBtn, styles.dltBtn]}
          >
            <Text style={[styles.dltBtnText]}>Delete</Text>
          </PressableWithFeedback>
        </View>
      </Animated.View>
      {/*Delete confirmation ends*/}

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
      <View style={[styles.budgetCard]}>
        <View style={[styles.budgetBottomRow]}>
          <View style={[styles.budgetRemaining]}>
            <Text style={[styles.budgetRemainText, styles.mutedText]}>
              Budget Period -
            </Text>
            <Text style={[styles.budgetRemainText, styles.mutedText]}>
              Monthly -
            </Text>
            <Text style={[styles.budgetRemainText, styles.mutedText]}>
              Mar 15, 2026
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.budgetCard]}>
        <Text style={[styles.spendingText]}>Spendings</Text>
      </View>
      {/*Budget details ends*/}
      {/*Transactions for this budget starts*/}
      <View style={[gs.fullFlex]}>
        <RenderTransactions transactions={filteredTransactions} />
      </View>
      {/*Transactions for this budget ends*/}
    </View>
  );
};
export default BudgetDetails;
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
      marginBottom: spacing.xs,
      gap: spacing.sm,
    },
    headerText: {
      fontSize: textSize.lg,
      fontWeight: 'bold',
      flex: 1,
      color: colors.onBackground,
    },
    deleteBox: {
      alignItems: 'center',
      marginTop: spacing.sm,
      overflow: 'hidden',
    },
    deleteBoxText: {
      color: colors.error,
    },
    deleteBtnBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.xxl,
      marginTop: spacing.md,
    },
    deleteBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    cancelBtn: {
      backgroundColor: colors.primary,
    },
    cancelBtnText: {
      color: colors.onPrimary,
      fontSize: textSize.md,
    },
    dltBtn: {
      backgroundColor: colors.error,
    },
    dltBtnText: {
      color: colors.onError,
      fontSize: textSize.md,
    },
    budgetCard: {
      gap: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
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
    mutedText: {
      color: colors.onSurfaceDisabled,
    },
    spendingText: {
      fontSize: textSize.md,
      fontWeight: '500',
      color: colors.onBackground,
    },
  });
  return styles;
};
