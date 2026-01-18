import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import CommonHeader from '../../components/organisms/CommonHeader';
import RenderTransactions from '../../components/RenderTransactions';
import useTransactions from '../../hooks/useTransactions';
import { formatAmount } from '../../utils';

const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const { colors } = theme;
  const {
    totalExpenses,
    totalIncome,
    filteredTransactions,
    search,
    setSearch,
  } = useTransactions();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top + 5,
        },
      ]}
    >
      {/* header section */}
      <CommonHeader search={search} setSearch={setSearch} />

      {/* summary */}
      <View
        style={[
          styles.summary,
          {
            backgroundColor: colors.inverseOnSurface,
          },
        ]}
      >
        <Text
          style={[
            styles.summaryText,
            {
              color: colors.onPrimaryContainer,
            },
          ]}
        >
          Summary
        </Text>
        <View style={[styles.tTypeBox, gs.flexRow, gs.itemsCenter]}>
          <View
            style={[
              gs.fullFlex,
              styles.tType,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
          >
            <Text
              style={[
                {
                  color: colors.onSurfaceVariant,
                },
              ]}
            >
              Income
            </Text>
            <Text
              style={[
                styles.amountText,

                {
                  color: colors.onPrimaryContainer,
                  fontSize: textSize.md,
                },
              ]}
            >
              {formatAmount(totalIncome)}
            </Text>
          </View>
          <View
            style={[
              gs.fullFlex,
              styles.tType,
              {
                backgroundColor: colors.surfaceVariant,
              },
            ]}
          >
            <Text
              style={[
                {
                  color: colors.onSurfaceVariant,
                },
              ]}
            >
              Expense
            </Text>
            <Text
              style={[
                styles.amountText,
                {
                  color: colors.onPrimaryContainer,
                  fontSize: textSize.md,
                },
              ]}
            >
              {formatAmount(totalExpenses)}
            </Text>
          </View>
        </View>
      </View>
      {/* summary */}

      {/* transactions section */}
      <View
        style={[
          gs.fullFlex,
          {
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <View
          style={[
            gs.fullFlex,
            {
              marginTop: spacing.md,
            },
          ]}
        >
          {filteredTransactions.length === 0 ? (
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
              No transactions yet!!
            </Text>
          ) : (
            <RenderTransactions transactions={filteredTransactions} />
          )}
        </View>
      </View>
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 200,
    flex: 1,
  },
  avatar: {
    height: 45,
    width: 45,
  },

  totalBalance: {
    width: '100%',
    marginTop: -10,
  },
  amountText: {
    fontWeight: '700',
  },
  ieBox: {
    flex: 1,
    paddingLeft: spacing.lg,
    gap: spacing.xs,
  },
  ieBanner: {
    fontWeight: 'semibold',
  },
  summary: {
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  summaryText: {
    fontSize: textSize.lg,
  },
  tTypeBox: {
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  tType: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
});
