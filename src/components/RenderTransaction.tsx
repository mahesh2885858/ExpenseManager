import { View, Text, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { gs } from '../common';
import { borderRadius, spacing, textSize, useAppTheme } from '../../theme';
import { format, getDate } from 'date-fns';
import { formatDigits, getMaxText } from 'commonutil-core';
import { TTransaction } from '../types';
import useTransactionsStore from '../stores/transactionsStore';
import { Icon } from 'react-native-paper';

const RenderTransaction = (props: { item: TTransaction }) => {
  const theme = useAppTheme();
  const categories = useTransactionsStore(state => state.categories);
  const categoryName = useMemo(() => {
    const cId = props.item.categoryIds[0];
    const category = categories.filter(c => c.id === cId);
    console.log({ cId, category });
    return category[0]?.name ?? 'General';
  }, [props, categories]);
  return (
    <View style={[gs.flexRow, { gap: spacing.md, marginTop: spacing.lg }]}>
      <View
        style={[
          {
            padding: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: borderRadius.lg,
            backgroundColor: theme.colors.secondaryContainer,
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
              color: theme.colors.onSecondaryContainer,
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
              color: theme.colors.onSecondaryContainer,
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
              color: theme.colors.onBackground,
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
                color: theme.colors.onSurfaceDisabled,
              },
            ]}
          >
            {getMaxText(props.item.description ?? '', 35)}
          </Text>
        )}
      </View>
      <View style={[gs.centerItems]}>
        <Text
          style={[
            gs.fontBold,
            {
              fontSize: textSize.lg,
              color:
                props.item.type === 'expense'
                  ? theme.colors.error
                  : theme.colors.success,
            },
          ]}
        >
          {props.item.type === 'expense'
            ? `-₹${formatDigits(props.item.amount.toString())}`
            : `₹${formatDigits(props.item.amount.toString())}`}
        </Text>
      </View>
    </View>
  );
};

export default RenderTransaction;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 3,
    left: 3,
  },
});
