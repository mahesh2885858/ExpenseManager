import { RouteProp, useRoute } from '@react-navigation/native';
import { formatDigits } from 'commonutil-core';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import ScreenWithoutHeader from '../../components/molecules/ScreenWithoutHeader';
import useTransactionsStore from '../../stores/transactionsStore';
import { TRootStackParamList } from '../../types';

const TransactionDetails = () => {
  const route =
    useRoute<RouteProp<TRootStackParamList, 'TransactionDetails'>>();
  const transaction = route.params.transaction;
  const { colors } = useAppTheme();
  const categories = useTransactionsStore(state => state.categories);

  const categoryName = useMemo(() => {
    const category = categories.find(c => c.id === transaction.categoryIds[0]);
    return category?.name ?? 'General';
  }, [categories, transaction]);

  return (
    <ScreenWithoutHeader>
      {/* Header */}
      {/* <View style={[gs.flexRow, gs.itemsCenter, styles.header]}>
        <View
          style={[gs.flexRow, gs.itemsCenter, gs.fullFlex, styles.headerLeft]}
        >
          <PressableWithFeedback onPress={navigation.goBack}>
            <Icon source="arrow-left" size={ICON_SIZE} />
          </PressableWithFeedback>
          <Text
            style={[
              gs.fontBold,
              styles.headerTitle,
              { color: colors.onBackground },
            ]}
          >
            {transaction.type === 'expense' ? 'Expense' : 'Income'}
          </Text>
        </View>
        <Avatar.Icon
          icon={'pencil'}
          size={AVATAR_SIZE}
          style={{ backgroundColor: colors.primaryContainer }}
        />
      </View> */}
      <View style={styles.screenContainer}>
        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.onSurfaceDisabled,
              },
            ]}
          >
            Amount
          </Text>
          <Text
            style={[
              styles.amountText,
              {
                color: colors.success,
              },
            ]}
          >
            {transaction.type === 'expense'
              ? `-₹${formatDigits(transaction.amount.toString())}`
              : `₹${formatDigits(transaction.amount.toString())}`}
          </Text>
        </View>
        <View
          style={[
            {
              gap: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: colors.onSurfaceDisabled,
              },
            ]}
          >
            Type
          </Text>
          <View style={[gs.flexRow]}>
            <Text
              style={[
                styles.amountText,
                {
                  color: colors.onPrimaryContainer,
                  backgroundColor: colors.primaryContainer,
                  borderRadius: borderRadius.xxl,
                  paddingHorizontal: spacing.md,
                },
              ]}
            >
              {transaction.type === 'expense' ? 'Expense' : 'Income'}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.onSurfaceDisabled,
              },
            ]}
          >
            Date
          </Text>
          <Text
            style={[
              styles.amountText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            {format(transaction.transactionDate, 'MMM d, yyyy')}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.onSurfaceDisabled,
              },
            ]}
          >
            Category
          </Text>
          <Text
            style={[
              styles.amountText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            {categoryName}
          </Text>
        </View>
      </View>
    </ScreenWithoutHeader>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  headerLeft: {
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: textSize.lg,
  },
  screenContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: textSize.lg,
    fontWeight: 'semibold',
  },
  amountText: {
    fontSize: textSize.xl,
    fontWeight: 'bold',
  },
});
