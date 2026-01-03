import { formatDigits } from 'commonutil-core';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import CommonHeader from '../../components/organisms/CommonHeader';
import RenderTransactions from '../../components/RenderTransactions';
import useGetTransactions from '../../hooks/useGetTransactions';
import useAccountStore from '../../stores/accountsStore';

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);
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

  const totalBalance = useMemo(() => {
    return selectedAccount.balance + totalIncome - totalExpenses;
  }, [selectedAccount, totalExpenses, totalIncome]);

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
          gap: spacing.lg,
        },
      ]}
    >
      {/* header section */}
      <CommonHeader search={search} setSearch={setSearch} />
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
        <PressableWithFeedback
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
        </PressableWithFeedback>
        <PressableWithFeedback
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
            ₹ {formatDigits(totalExpenses.toString())}
          </Text>
        </PressableWithFeedback>
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
          Transactions
        </Text>
        <View style={[gs.fullFlex]}>
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
