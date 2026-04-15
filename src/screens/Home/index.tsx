import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Badge, Icon } from 'react-native-paper';
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
import CommonHeader from '../../components/organisms/CommonHeader';
import WalletSelectionModal from '../../components/organisms/WalletSelectionModal';
import RenderTransactionList from '../../components/RenderTransactionList';
import useWallets from '../../hooks/useAccounts';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import useTransactions from '../../hooks/useTransactions';
import useTransactionsStore from '../../stores/transactionsStore';
import { TTypeFilter } from '../../types';
import { getDateFilterText } from '../../utils';
import { useTranslation } from 'react-i18next';
import AppText from '../../components/molecules/AppText';
import {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Svg,
} from 'react-native-svg';
import CircularProgressBar from '../../components/molecules/CircularProgressBar';
import RenderBudget from '../../components/organisms/RenderBudget';
import RenderBudgetList from '../../components/organisms/RenderBudgetsList';
import useBudgets from '../../hooks/useBudgets';
import useBudgetStore from '../../stores/budgetStore';
const Home = () => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { colors } = theme;
  const styles = createStyles(colors, insets);
  const filters = useTransactionsStore(state => state.filters);
  const setFilters = useTransactionsStore(state => state.setFilters);
  const selectedSort = useTransactionsStore(state => state.sort);
  const onSortChange = useTransactionsStore(state => state.setSort);
  const transactionByIds = useTransactionsStore(
    state => state.transactionsByIds,
  );
  const [search, setSearch] = useState('');

  const {
    selectedWallet: selectedAccount,
    setSelectedWalletId: setSelectedAccountId,
    getIncomeExpenseForWallet: getIncomeExpenseForAcc,
  } = useWallets();

  const budgets = useBudgetStore(state => state.budgets);
  const {
    totalExpenses,
    totalIncome,
    filteredTransactions,
    getFormattedAmount,
  } = useTransactions({
    filter: { ...filters, accId: selectedAccount?.id },
    sort: selectedSort,
  });

  const navigation = useNavigation();

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();

  const { categories } = useCategories();

  const accountName = useMemo(() => {
    return selectedAccount?.name ?? 'None';
  }, [selectedAccount]);

  const accountBalance = useMemo(() => {
    return getIncomeExpenseForAcc(selectedAccount?.id ?? '').balance;
  }, [selectedAccount, getIncomeExpenseForAcc]);

  const navigateToFilters = useCallback(() => {
    navigation.navigate('TransactionFilters');
  }, [navigation]);

  const transactionsToRender = useMemo(() => {
    if (!transactionByIds) return [];
    return search.trim().length === 0
      ? filteredTransactions
      : filteredTransactions.filter(
          t =>
            transactionByIds[t].amount.toString().includes(search) ||
            transactionByIds[t].description
              ?.toLowerCase()
              .includes(search.toLowerCase()),
        );
  }, [filteredTransactions, search, transactionByIds]);

  const dateFilterText = useMemo(() => {
    if (filters.date) {
      return getDateFilterText(filters.date);
    } else return 'This Month';
  }, [filters]);

  const categoryFilterText = useMemo(() => {
    if (filters.categoryId) {
      return categories.find(cat => cat.id === filters.categoryId)?.name ?? '';
    } else return '';
  }, [filters, categories]);

  const typeFilterText = useMemo(() => {
    return filters.type === 'income'
      ? 'Income'
      : filters.type === 'expense'
      ? 'Expense'
      : '';
  }, [filters]);

  const resetTypeFilter = useCallback(() => {
    setFilters({
      type: null,
    });
  }, [setFilters]);

  const resetCategoryFilter = useCallback(() => {
    setFilters({
      categoryId: null,
    });
  }, [setFilters]);

  const isExpenseFilterOn = useMemo(() => {
    return filters.type === 'expense';
  }, [filters]);

  const isIncomeFilterOn = useMemo(() => {
    return filters.type === 'income';
  }, [filters]);

  const toggleTypeFilter = useCallback(
    (type: TTypeFilter) => {
      if (type === filters.type) {
        setFilters({ type: null });
      } else {
        setFilters({
          type: type,
        });
      }
    },
    [setFilters, filters],
  );

  const isAnyFilterApplied = useMemo(() => {
    const { date, type, categoryId } = filters;
    return (!!date && !date.isThisMonth) || !!type || !!categoryId;
  }, [filters]);

  const isSortApplied = useMemo(() => {
    return selectedSort && selectedSort !== 'dateNewFirst';
  }, [selectedSort]);

  const navigateToSort = useCallback(() => {
    navigation.navigate('TransactionSort');
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={[styles.contentContainer]}
      style={[styles.container]}
    >
      {/* header section */}
      <CommonHeader heading={t('home.appName')} />

      {/* active filters section starts */}
      <View
        style={[gs.flexRow, gs.itemsCenter, { paddingHorizontal: spacing.lg }]}
      >
        <PressableWithFeedback
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
        </PressableWithFeedback>
        <AppText.SemiBold
          style={[
            gs.fullFlex,
            gs.centerText,
            {
              color: colors.onSurface,
            },
          ]}
        >
          This Month
        </AppText.SemiBold>
        <PressableWithFeedback
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
        </PressableWithFeedback>
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
          style={[{ fontSize: textSize.md, color: colors.onSurface }]}
        >
          {getFormattedAmount('1233423')}
        </AppText.Bold>
        <View
          style={[
            gs.flexRow,
            {
              marginTop: spacing.md,
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
                  fontSize: textSize.md,
                  color: colors.onSurface,
                },
              ]}
            >
              {getFormattedAmount('23456')}
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
                  fontSize: textSize.md,
                  color: colors.onSurface,
                },
              ]}
            >
              {getFormattedAmount('23456')}
            </AppText.Bold>
          </PressableWithFeedback>
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
            transactions={transactionsToRender}
          />
        </View>
      </View>

      <WalletSelectionModal
        handleSheetChanges={handleSheetChange}
        onWalletChange={id => setSelectedAccountId(id)}
        ref={btmShtRef}
        selectedWalletId={selectedAccount?.id ?? ''}
      />
    </ScrollView>
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
