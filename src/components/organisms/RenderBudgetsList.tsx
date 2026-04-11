import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import { TBudget } from '../../types';
import { gs } from '../../common';
import { AppTheme, useAppTheme } from '../../../theme';
import { roundValue } from 'commonutil-core';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { useNavigation } from '@react-navigation/native';
import RenderBudget from './RenderBudget';
import EmptyBudgetComponent from './EmptyBudgetsComponent';

type TProps = {
  budgets: TBudget[];
};

const RenderBudgetList = (props: TProps) => {
  const { budgets } = props;
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  return (
    <FlashList
      data={budgets}
      ListEmptyComponent={EmptyBudgetComponent}
      contentContainerStyle={[gs.fullFlex]}
      keyExtractor={item => item.id}
      renderItem={({ item: budget }) => {
        const progress = roundValue(budget.spent / budget.amount, 2);
        return (
          <PressableWithFeedback
            onPress={() => {
              navigation.navigate('BudgetDetails', {
                budget,
              });
            }}
            key={budget.id}
            // style={[styles.budgetCard]}
          >
            <RenderBudget />
          </PressableWithFeedback>
        );
      }}
    />
  );
};
export default RenderBudgetList;
const createStyles = (colors: AppTheme['colors']) => StyleSheet.create({});
