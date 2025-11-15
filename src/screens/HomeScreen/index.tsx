import { formatDigits } from 'commonutil-core';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import RenderTransactions from '../../components/RenderTransactions';
import useGetTransactions from '../../hooks/useGetTransactions';
import useAccountStore from '../../stores/accountsStore';

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);
  const transactions = useGetTransactions();

  const selectedAccount = useMemo(() => {
    return getSelectedAccount();
  }, [getSelectedAccount]);

  const totalIncome = useMemo(() => {
    return transactions.reduce((prev, curr) => {
      if (curr.type === 'expense') {
        return prev;
      } else {
        return prev + curr.amount;
      }
    }, 0);
  }, [transactions]);
  const totalExpenses = useMemo(() => {
    return transactions.reduce((prev, curr) => {
      if (curr.type === 'expense') {
        return prev + curr.amount;
      } else {
        return prev;
      }
    }, 0);
  }, [transactions]);

  const totalBalance = useMemo(() => {
    return selectedAccount.balance + totalIncome - totalExpenses;
  }, [selectedAccount, totalExpenses, totalIncome]);

  console.log({ totalExpenses });

  transactions.sort(
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
          gap: spacing.lg,
        },
      ]}
    >
      {/* header section */}
      <View style={[{ paddingHorizontal: spacing.lg }, gs.flexRow]}>
        <Pressable
          style={[
            {
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: borderRadius.round,
            },
            styles.avatar,
            gs.centerItems,
          ]}
        >
          <Text
            style={{
              color: theme.colors.onPrimaryContainer,
              fontSize: textSize.lg,
            }}
          >
            {selectedAccount.name.charAt(0).toUpperCase()}
          </Text>
        </Pressable>
      </View>
      {/* Total balance section */}
      <View style={{ paddingHorizontal: spacing.lg }}>
        <Card mode="contained">
          <Card.Content
            style={[
              styles.totalBalance,
              {
                backgroundColor: theme.colors.primaryContainer,
                borderRadius: borderRadius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                gap: spacing.xs,
              },
            ]}
          >
            <Text
              style={{
                color: theme.colors.onPrimaryContainer,
                fontSize: textSize.md,
              }}
            >
              Total Balance
            </Text>
            <Text
              style={[
                styles.amountText,
                {
                  color: theme.colors.onPrimaryContainer,
                  fontSize: textSize.xxxl,
                },
              ]}
            >
              ₹ {totalBalance < 0 && '-'}
              {formatDigits(
                totalBalance < 0
                  ? Math.abs(totalBalance).toString()
                  : totalBalance.toString(),
              )}
            </Text>
          </Card.Content>
        </Card>
      </View>
      {/* income and expense section */}
      <View
        style={[gs.flexRow, { paddingHorizontal: spacing.lg, gap: spacing.md }]}
      >
        <View
          style={[
            styles.ieBox,
            {
              backgroundColor: theme.colors.surfaceVariant,
              padding: spacing.sm,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Text
            style={[
              styles.ieBanner,
              {
                color: theme.colors.onBackground,
                fontSize: textSize.md,
              },
            ]}
          >
            Income
          </Text>
          <Text
            style={[
              gs.fontBold,
              {
                color: theme.colors.success,
                fontSize: textSize.xl,
              },
            ]}
          >
            ₹ {formatDigits((selectedAccount.balance + totalIncome).toString())}
          </Text>
        </View>
        <View
          style={[
            styles.ieBox,
            {
              backgroundColor: theme.colors.surfaceVariant,
              padding: spacing.sm,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Text
            style={[
              styles.ieBanner,
              {
                color: theme.colors.onBackground,
                fontSize: textSize.md,
              },
            ]}
          >
            Expense
          </Text>
          <Text
            style={[
              gs.fontBold,
              {
                color: theme.colors.error,
                fontSize: textSize.xl,
              },
            ]}
          >
            -₹ {formatDigits(totalExpenses.toString())}
          </Text>
        </View>
      </View>
      {/* recent transactions section */}
      <View
        style={[
          {
            paddingHorizontal: spacing.lg,
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
          Recent transactions
        </Text>
        <View style={[gs.fullFlex]}>
          {transactions.length === 0 ? (
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
              transactions={transactions.slice(0, 10)}
              renderSeeAll
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
  },
  amountText: {
    fontWeight: '500',
  },
  ieBox: {
    flex: 1,
    paddingLeft: spacing.lg,
    gap: spacing.xs,
  },
  ieBanner: {
    fontWeight: 'semibold',
  },
});
