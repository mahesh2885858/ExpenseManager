import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
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
    <FlashList
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      ListEmptyComponent={
        <Text
          style={[
            gs.fontBold,
            gs.centerText,
            {
              color: theme.colors.onSurfaceDisabled,
              fontSize: textSize.lg,
              marginTop: spacing.lg,
            },
          ]}
        >
          No transactions!!
        </Text>
      }
      data={transactions}
      showsVerticalScrollIndicator={false}
      renderItem={props => <RenderTransaction item={props.item} />}
      keyExtractor={item => item.id}
      ListFooterComponent={
        renderSeeAll && transactions.length === 10 ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Transactions');
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
