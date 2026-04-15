import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { gs } from '../../common';
import { TBudget } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import EmptyBudgetComponent from './EmptyBudgetsComponent';
import RenderBudget from './RenderBudget';

type TProps = {
  budgets: TBudget[];
};

const RenderBudgetList = (props: TProps) => {
  const { budgets } = props;
  const navigation = useNavigation();
  return (
    <FlashList
      data={budgets}
      ListEmptyComponent={EmptyBudgetComponent}
      contentContainerStyle={[gs.fullFlex]}
      keyExtractor={item => item.id}
      renderItem={({ item: budget }) => {
        return (
          <PressableWithFeedback
            onPress={() => {
              navigation.navigate('BudgetDetails', {
                budget,
              });
            }}
            key={budget.id}
          >
            <RenderBudget />
          </PressableWithFeedback>
        );
      }}
    />
  );
};
export default RenderBudgetList;
