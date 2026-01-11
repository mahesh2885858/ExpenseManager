import { formatDigits } from 'commonutil-core';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import CommonHeader from '../../components/organisms/CommonHeader';
import RenderTransactions from '../../components/RenderTransactions';
import useGetTransactions from '../../hooks/useGetTransactions';
import useAccountStore from '../../stores/accountsStore';

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const { colors } = theme;
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);
  const accounts = useAccountStore(state => state.accounts);
  const {
    totalExpenses,
    totalIncome,
    filteredTransactions,
    search,
    setSearch,
  } = useGetTransactions();

  const selectedAccount = useMemo(() => {
    return getSelectedAccount();
  }, [getSelectedAccount]);

  filteredTransactions.sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime(),
  );

  return (
    <ScrollView
      nestedScrollEnabled={true}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: top + 5,
        },
      ]}
    >
      {/* header section */}
      <CommonHeader search={search} setSearch={setSearch} />
      {/* Accounts summary */}

      <View
        style={[
          styles.summary,
          {
            backgroundColor: colors.inverseOnSurface,
            marginTop: spacing.md,
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.summaryText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            Balance
          </Text>
          <Text
            style={[
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            Balance
          </Text>
        </View>

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
              ₹
              {formatDigits((selectedAccount.balance + totalIncome).toString())}
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
              ₹ {formatDigits(totalExpenses.toString())}
            </Text>
          </View>
        </View>
      </View>

      {/* recent transactions section */}
      <View
        style={[
          {
            paddingHorizontal: spacing.lg,
            marginTop: spacing.md,
          },
        ]}
      >
        <Text
          style={[
            gs.fontBold,
            {
              color: theme.colors.onBackground,
              fontSize: textSize.lg,
            },
          ]}
        >
          Recent Transactions
        </Text>
        <View style={[gs.fullFlex, { marginTop: spacing.md }]}>
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
            <RenderTransactions
              transactions={filteredTransactions.slice(undefined, 10)}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 200,
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
