import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { gs } from '../../common';
import { TBudget } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import EmptyBudgetComponent from './EmptyBudgetsComponent';
import BudgetItem from './BudgetItem';

type TProps = {
  budgets: TBudget[];
};

const BudgetsList = (props: TProps) => {
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
            <BudgetItem budget={budget} />
          </PressableWithFeedback>
        );
      }}
    />
  );
};
export default BudgetsList;
