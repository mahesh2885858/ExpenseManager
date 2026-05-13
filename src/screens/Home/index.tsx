import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AppText from '../../components/molecules/AppText';
import CommonHeader from '../../components/organisms/CommonHeader';
import RenderBudgetList from '../../components/organisms/RenderBudgetsList';
import RenderTransactionList from '../../components/RenderTransactionList';
import useFetchRecords from '../../hooks/useFetchRecords';
import useHelpers from '../../hooks/useHelpers';
import { useRecentTransactions } from '../../hooks/useRecentTransactions';
import useBudgetStore from '../../stores/budgetStore';
import useProfileStore from '../../stores/profileStore';
import useTransactionsStore from '../../stores/transactionsStore';
const Home = () => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const selectedProfileId = useProfileStore(state => state.selectedProfileId);
  const { t } = useTranslation();
  const { colors } = theme;
  const styles = createStyles(colors, insets);
  const { fetchWallets, fetchCategories, fetchRecents, fetchBudgets } =
    useFetchRecords();

  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [balance, setBalance] = useState(0);
  const { getMonthlySummary, getBalance } = useRecentTransactions();
  const recents = useTransactionsStore(state => state.recents);
  const { getFormattedAmount } = useHelpers();
  const budgets = useBudgetStore(state => state.budgets);

  useEffect(() => {
    const load = async () => {
      try {
        const sum = await getMonthlySummary();
        const bal = await getBalance();

        setSummary(sum as unknown as typeof summary);
        setBalance(bal);
      } catch (e) {
        console.log({ e, ma: 'mah' });
      }
    };
    load();
    fetchWallets();
    fetchRecents();
    fetchCategories();
    fetchBudgets();
  }, [
    selectedProfileId,
    fetchWallets,
    setBalance,
    getBalance,
    getMonthlySummary,
    fetchCategories,
    fetchRecents,
    fetchBudgets,
  ]);

  return (
    <View style={[styles.container]}>
      {/* header section */}
      <CommonHeader heading={t('home.appName')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer]}
      >
        {/* active filters section starts */}
        <View
          style={[
            gs.flexRow,
            gs.itemsCenter,
            { paddingHorizontal: spacing.lg },
          ]}
        >
          {/*<PressableWithFeedback
            style={[
              {
                backgroundColor: colors.surfaceContainer,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Icon
              color={colors.onSurface}
              source={'chevron-left'}
              size={textSize.xl}
            />
          </PressableWithFeedback>*/}
          {/*<AppText.SemiBold
            style={[
              gs.fullFlex,
              gs.centerText,
              {
                color: colors.onSurface,
              },
            ]}
          >
            This Month
          </AppText.SemiBold>*/}
          {/*<PressableWithFeedback
            style={[
              {
                backgroundColor: colors.surfaceContainer,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Icon
              source={'chevron-right'}
              color={colors.onSurface}
              size={textSize.xl}
            />
          </PressableWithFeedback>*/}
        </View>
        {/* active filters section ends */}

        {/* summary starts */}
        <View style={[styles.summary]}>
          <AppText.Regular
            style={[
              {
                fontSize: textSize.sm,
                color: colors.onSurface,
                lineHeight: 16,
              },
            ]}
          >
            {t('home.totalBalance')}
          </AppText.Regular>
          <AppText.Bold
            style={[{ fontSize: textSize.lg, color: colors.onSurface }]}
          >
            {getFormattedAmount(balance)}
          </AppText.Bold>
          <View
            style={[
              {
                marginTop: spacing.md,
              },
            ]}
          >
            <AppText.Regular
              style={[
                gs.fullFlex,
                {
                  color: colors.onSurface,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              This Month
            </AppText.Regular>
            <View
              style={[
                gs.flexRow,
                {
                  gap: spacing.md,
                },
              ]}
            >
              <PressableWithFeedback
                style={[
                  gs.fullFlex,
                  {
                    backgroundColor: colors.surfaceContainerHighest,
                    padding: spacing.sm,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              >
                <AppText.Regular
                  style={[
                    {
                      fontSize: textSize.sm,
                      color: colors.onSurface,
                      lineHeight: 14,
                    },
                  ]}
                >
                  Income
                </AppText.Regular>
                <AppText.Bold
                  style={[
                    {
                      fontSize: textSize.lg,
                      color: colors.onSurface,
                    },
                  ]}
                >
                  {getFormattedAmount(summary.income / 100 ?? 0)}
                </AppText.Bold>
              </PressableWithFeedback>
              <PressableWithFeedback
                style={[
                  gs.fullFlex,
                  {
                    backgroundColor: colors.surfaceContainerHighest,
                    padding: spacing.sm,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              >
                <AppText.Regular
                  style={[
                    {
                      fontSize: textSize.sm,
                      color: colors.onSurface,
                      lineHeight: 14,
                    },
                  ]}
                >
                  Expense
                </AppText.Regular>
                <AppText.Bold
                  style={[
                    {
                      fontSize: textSize.lg,
                      color: colors.onSurface,
                    },
                  ]}
                >
                  {getFormattedAmount(summary.expense / 100 ?? 0)}
                </AppText.Bold>
              </PressableWithFeedback>
            </View>
          </View>
        </View>
        {/* summary ends */}
        {/*Budget Start*/}
        <View style={[styles.budgets]}>
          <View style={[gs.flexRow, gs.itemsCenter]}>
            <AppText.Medium
              style={[
                gs.fullFlex,
                {
                  color: colors.onSurface,
                  fontSize: textSize.sm,
                },
              ]}
            >
              {t('common.budgets')}
            </AppText.Medium>
            <PressableWithFeedback style={[gs.flexRow, gs.itemsCenter]}>
              <AppText.Medium
                style={[
                  {
                    color: colors.onSurface,
                    fontSize: textSize.sm,
                  },
                ]}
              >
                {t('common.viewAll')}
              </AppText.Medium>
              <Icon
                source={'chevron-right'}
                size={textSize.xl}
                color={colors.onSurface}
              />
            </PressableWithFeedback>
          </View>
          <RenderBudgetList budgets={budgets} />
        </View>
        {/*Budget ends*/}

        {/* transactions section */}
        <View
          style={[
            gs.fullFlex,
            {
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <View
            style={[
              gs.flexRow,
              gs.itemsCenter,
              {
                marginTop: spacing.lg,
              },
            ]}
          >
            <AppText.Medium
              style={[
                gs.fullFlex,
                {
                  color: colors.onSurface,
                  fontSize: textSize.sm,
                },
              ]}
            >
              {t('home.recentTransactions')}
            </AppText.Medium>
            <PressableWithFeedback style={[gs.flexRow, gs.itemsCenter]}>
              <AppText.Medium
                style={[
                  {
                    color: colors.onSurface,
                    fontSize: textSize.sm,
                  },
                ]}
              >
                {t('common.viewAll')}
              </AppText.Medium>
              <Icon
                source={'chevron-right'}
                size={textSize.xl}
                color={colors.onSurface}
              />
            </PressableWithFeedback>
          </View>
          <View style={[gs.fullFlex]}>
            <RenderTransactionList
              scrollDisabled={true} // since we are rendering upto 10 transactions it should be fine to disable flashlist's virtualization
              transactions={recents}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const createStyles = (colors: AppTheme['colors'], insets: EdgeInsets) =>
  StyleSheet.create({
    contentContainer: { paddingBottom: 100 },
    container: {
      paddingTop: insets.top + 5,
      backgroundColor: colors.surface,
      flex: 1,
    },
    avatar: {
      height: 45,
      width: 45,
    },
    account: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      maxHeight: 35,
      width: '40%',
      elevation: 3,
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
      backgroundColor: colors.surfaceContainer,
      marginHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      paddingBottom: spacing.md,
      marginTop: spacing.md,
    },
    budgets: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.md,
      gap: spacing.xs,
    },
    summaryText: {
      fontSize: textSize.lg,
    },
    tTypeBox: {
      borderRadius: borderRadius.md,
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      marginTop: spacing.md,
    },
    tType: {
      paddingLeft: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      gap: spacing.xs,
    },
    searchAndFilter: {
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      gap: spacing.md,
    },
    text: {
      fontSize: textSize.md,
      fontWeight: '600',
    },
    search: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.pill,
    },
    filterBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    searchInput: {
      flex: 1,
      width: '100%',
      paddingRight: spacing.lg,
      borderRadius: borderRadius.pill,
    },
    filter: {
      padding: spacing.sm,
      borderRadius: borderRadius.pill,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      position: 'relative',
    },
    balanceTitle: {
      fontSize: textSize.sm,
    },
    balanceText: {
      fontSize: textSize.lg,
      fontWeight: 'bold',
    },
  });
