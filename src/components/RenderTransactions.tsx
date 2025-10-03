import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { spacing, textSize, useAppTheme } from '../../theme';
import { gs } from '../common';
import { TBottomTabParamList, TTransaction } from '../types';
import RenderTransaction from './RenderTransaction';

const RenderTransactions = ({
  transactions,
  renderSeeAll = false,
}: {
  transactions: TTransaction[];
  renderSeeAll?: boolean;
}) => {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<TBottomTabParamList>>();
  return (
    <FlatList
      scrollEnabled={false}
      data={transactions}
      renderItem={props => <RenderTransaction item={props.item} />}
      keyExtractor={item => item.id}
      ListFooterComponent={
        renderSeeAll ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Transactions');
            }}
            style={{
              marginTop: spacing.lg,
            }}
          >
            <Text
              style={[
                gs.fontBold,
                gs.centerText,
                {
                  fontSize: textSize.lg,
                  color: theme.colors.primary,
                },
              ]}
            >
              See all
            </Text>
          </TouchableOpacity>
        ) : null
      }
    />
  );
};

export default RenderTransactions;
