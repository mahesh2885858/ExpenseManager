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

const RenderTransaction = (props: {
  item: string;
  onItemPress: (t: TTransaction) => void;
}) => {
  const theme = useAppTheme();
  const categories = useCategoriesStore(state => state.categories);
  const toggleSelection = useTransactionsStore(state => state.toggleSelection);
  const { deleteTransaction, getFormattedAmount } = useTransactions({});
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
      onLongPress={() => toggleSelection(props.item)}
      onPress={() => {
        if (selectedTransactions.has(props.item)) {
          toggleSelection(props.item);
        } else {
          if (selectedTransactions.size > 0) {
            toggleSelection(props.item);
            return;
          }

          props.onItemPress(transaction);
        }
      }}
      style={[
        gs.flexRow,
        {
          gap: spacing.md,
          marginBottom: spacing.md,
        },
      ]}
    >
      <View
        style={[
          {
            padding: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: borderRadius.lg,
            backgroundColor: theme.colors.surfaceVariant,
          },
          gs.centerItems,
        ]}
      >
        {(transaction.attachments?.length ?? 0) > 0 && (
          <View style={styles.icon}>
            <Icon source={'paperclip'} size={10} />
          </View>
        )}

        <Text
          style={[
            {
              color: theme.colors.onSurfaceVariant,
              fontSize: textSize.sm,
            },
            gs.fontBold,
          ]}
        >
          {format(transaction.transactionDate, 'MMM')}
        </Text>
        <Text
          style={[
            {
              color: theme.colors.onSurfaceVariant,
              fontSize: textSize.sm,
            },
            gs.fontBold,
          ]}
        >
          {getDate(transaction.transactionDate)}
        </Text>
      </View>
      <View style={[gs.fullFlex, gs.justifyCenter]}>
        <Text
          style={[
            {
              fontSize: textSize.md,
              color: theme.colors.onSurface,
            },
          ]}
        >
          {categoryName}
        </Text>
        {transaction.description && (
          <Text
            style={[
              {
                fontSize: textSize.sm,
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {getMaxText(
              transaction.description.replace(/[\r\n]+/g, ' ') ?? '',
              20,
            )}
          </Text>
        )}
      </View>
      <View
        style={[
          gs.flexRow,
          // gs.centerItems,
          gs.itemsCenter,
          transaction.isSelected && styles.actionsBox,
        ]}
      >
        <Text
          style={[
            gs.fontBold,
            {
              fontSize: textSize.md,
              color:
                transaction.type === 'expense'
                  ? theme.colors.error
                  : theme.colors.tertiary,
            },
          ]}
        >
          {getFormattedAmount(transaction.amount)}
        </Text>
        {selectedTransactions.has(props.item) && (
          <Animated.View
            entering={ZoomIn}
            exiting={ZoomOut}
            style={[gs.flexRow, { gap: spacing.xs }]}
          >
            <PressableWithFeedback
              onPress={() => requestDelete(transaction)}
              style={[
                styles.action,
                {
                  backgroundColor: theme.colors.errorContainer,
                },
              ]}
            >
              <Icon
                source={'delete'}
                size={25}
                color={theme.colors.onErrorContainer}
              />
            </PressableWithFeedback>
          </Animated.View>
        )}
      </View>
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
