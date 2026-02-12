import { getMaxText } from 'commonutil-core';
import { format, getDate } from 'date-fns';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { borderRadius, spacing, textSize, useAppTheme } from '../../theme';
import { gs } from '../common';
import useTransactions from '../hooks/useTransactions';
import useTransactionsStore from '../stores/transactionsStore';
import { TTransaction } from '../types';
import { formatAmount } from '../utils';
import PressableWithFeedback from './atoms/PressableWithFeedback';
import useCategoriesStore from '../stores/categoriesStore';

const RenderTransaction = (props: {
  item: TTransaction;
  onItemPress: (t: TTransaction) => void;
}) => {
  const theme = useAppTheme();
  const categories = useCategoriesStore(state => state.categories);
  const toggleSelection = useTransactionsStore(state => state.toggleSelection);
  const { deleteTransaction } = useTransactions({});
  const transactions = useTransactionsStore(state => state.transactions);

  const selectedTransactions = useMemo(
    () => transactions.filter(d => d.isSelected),
    [transactions],
  );

  const categoryName = useMemo(() => {
    const cId = props.item.categoryIds[0];
    const category = categories.find(c => c.id === cId);
    return category?.name ?? 'Unknown';
  }, [props, categories]);

  return (
    <PressableWithFeedback
      onLongPress={() => toggleSelection(props.item.id)}
      onPress={() => {
        if (props.item.isSelected) {
          toggleSelection(props.item.id);
        } else {
          if (selectedTransactions.length > 0) {
            toggleSelection(props.item.id);
            return;
          }
          // navigation.navigate('TransactionDetails', {
          //   transaction: props.item,
          // });
          props.onItemPress(props.item);
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
        {(props.item.attachments?.length ?? 0) > 0 && (
          <View style={styles.icon}>
            <Icon source={'paperclip'} size={10} />
          </View>
        )}

        <Text
          style={[
            {
              color: theme.colors.onSurfaceVariant,
              fontSize: textSize.md,
            },
            gs.fontBold,
          ]}
        >
          {format(props.item.transactionDate, 'MMM')}
        </Text>
        <Text
          style={[
            {
              color: theme.colors.onSurfaceVariant,
              fontSize: textSize.md,
            },
            gs.fontBold,
          ]}
        >
          {getDate(props.item.transactionDate)}
        </Text>
      </View>
      <View style={[gs.fullFlex, gs.justifyCenter]}>
        <Text
          style={[
            {
              fontSize: textSize.lg,
              color: theme.colors.onSurface,
            },
          ]}
        >
          {categoryName}
        </Text>
        {props.item.description && (
          <Text
            style={[
              {
                fontSize: textSize.md,
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {getMaxText(
              props.item.description.replace(/[\r\n]+/g, ' ') ?? '',
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
          props.item.isSelected && styles.actionsBox,
        ]}
      >
        <Text
          style={[
            gs.fontBold,
            {
              fontSize: textSize.lg,
              color:
                props.item.type === 'expense'
                  ? theme.colors.error
                  : theme.colors.tertiary,
            },
          ]}
        >
          {formatAmount(props.item.amount)}
        </Text>
        {props.item.isSelected && (
          <Animated.View
            entering={ZoomIn}
            exiting={ZoomOut}
            style={[gs.flexRow, { gap: spacing.xs }]}
          >
            <PressableWithFeedback
              onPress={() => deleteTransaction(props.item.id)}
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
