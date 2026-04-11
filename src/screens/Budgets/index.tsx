import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, spacing, textSize, useAppTheme } from '../../../theme';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import RenderBudgetList from '../../components/organisms/RenderBudgetsList';
import useBudgetStore from '../../stores/budgetStore';

const Budget = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { top } = useSafeAreaInsets();
  const budgets = useBudgetStore(state => state.budgets);
  const navigate = useNavigation();

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
      <RenderBudgetList budgets={budgets} />
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
  });
  return styles;
};
