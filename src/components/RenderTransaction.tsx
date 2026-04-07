import { getMaxText } from 'commonutil-core';
import { format, getDate } from 'date-fns';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { borderRadius, spacing, textSize, useAppTheme } from '../../theme';
import { gs } from '../common';
import useTransactions from '../hooks/useTransactions';
import useCategoriesStore from '../stores/categoriesStore';
import useTransactionsStore from '../stores/transactionsStore';
import { TTransaction } from '../types';
import PressableWithFeedback from './atoms/PressableWithFeedback';
import Card from './atoms/Card';
import withOpacity from '../utils/withOpacity';
import AppText from './molecules/AppText';

const RenderTransaction = (props: {
  item: string;
  onItemPress: (t: TTransaction) => void;
}) => {
  const theme = useAppTheme();
  const categories = useCategoriesStore(state => state.categories);
  const { getFormattedAmount } = useTransactions({});
  const requestDelete = useTransactionsStore(state => state.requestDelete);

  const transactionsByIds = useTransactionsStore(
    state => state.transactionsByIds,
  );
  const selectedTransactions = useTransactionsStore(
    state => state.selectedTransactionIds,
  );

  const categoryName = useMemo(() => {
    if (!transactionsByIds) return 'Unknown';
    const cId = transactionsByIds[props.item].categoryIds[0];
    const category = categories.find(c => c.id === cId);
    return category?.name ?? 'Unknown';
  }, [props, categories, transactionsByIds]);

  if (!transactionsByIds) return <View>No Transaction found</View>;
  const transaction = transactionsByIds[props.item];
  return (
    <PressableWithFeedback
      onPress={() => {
        props.onItemPress(transaction);
      }}
      style={[{ marginBottom: spacing.sm }]}
    >
      <Card>
        <View style={[gs.flexRow]}>
          <View
            style={[
              {
                backgroundColor: withOpacity(theme.colors.primary, 0.15),
                borderRadius: borderRadius.round,
                padding: spacing.sm,
              },
            ]}
          >
            <Icon
              source={'gas-station-outline'}
              size={28}
              color={theme.colors.primary}
            />
          </View>
          <View style={[gs.fullFlex, { marginLeft: spacing.sm }]}>
            <AppText.Regular
              style={[
                {
                  color: theme.colors.onSurface,
                  fontSize: textSize.sm,
                },
              ]}
            >
              {categoryName}
            </AppText.Regular>
            <AppText.Regular
              style={[
                {
                  color: theme.colors.onSurfaceVariant,
                  fontSize: textSize.xs,
                },
              ]}
            >
              {categoryName}
            </AppText.Regular>
          </View>
          <AppText.Medium
            style={[
              {
                fontSize: textSize.sm,
                color: theme.colors.onSurface,
                textAlignVertical: 'center',
              },
            ]}
          >
            {getFormattedAmount(transaction.amount)}
          </AppText.Medium>
        </View>
      </Card>
    </PressableWithFeedback>
  );
};

export default RenderTransaction;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 3,
    left: 3,
  },
  actionsBox: {
    gap: spacing.xs,
  },
  action: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
});
