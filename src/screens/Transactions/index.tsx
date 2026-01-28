import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AccountSelectionModal from '../../components/organisms/AccountSelectionModal';
import CommonHeader from '../../components/organisms/CommonHeader';
import RenderTransactions from '../../components/RenderTransactions';
import useAccounts from '../../hooks/useAccounts';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useTransactions from '../../hooks/useTransactions';
import useTransactionsStore from '../../stores/transactionsStore';
import { formatAmount, getDateFilterText } from '../../utils';
import useCategories from '../../hooks/useCategories';

const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const { colors } = theme;
  const filters = useTransactionsStore(state => state.filters);
  const setFilters = useTransactionsStore(state => state.setFilters);
  const [search, setSearch] = useState('');
  const { selectedAccount, setSelectedAccountId } = useAccounts();
  const { totalExpenses, totalIncome, filteredTransactions } = useTransactions({
    filter: { ...filters, accId: selectedAccount?.id },
  });

  const navigation = useNavigation();

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();
  const { categories } = useCategories();

  const accountName = useMemo(() => {
    return selectedAccount?.name ?? '';
  }, [selectedAccount]);

  const navigateToFilters = useCallback(() => {
    navigation.navigate('TransactionFilters');
  }, [navigation]);

  const transactionsToRender = useMemo(() => {
    return search.trim().length === 0
      ? filteredTransactions
      : filteredTransactions.filter(
          t =>
            t.amount.toString().includes(search) ||
            t.description?.toLowerCase().includes(search.toLowerCase()),
        );
  }, [filteredTransactions, search]);

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
      <CommonHeader />

      {/* active filters section */}
      <View
        style={[
          gs.flexRow,
          {
            paddingHorizontal: spacing.md,
            marginTop: spacing.sm,
            gap: spacing.sm,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: spacing.sm,
          }}
        >
          <PressableWithFeedback
            onPress={() => navigation.navigate('TransactionFilters')}
            style={[
              gs.flexRow,
              gs.itemsCenter,
              {
                borderRadius: borderRadius.pill,
                backgroundColor: colors.inverseOnSurface,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                gap: spacing.sm,
              },
            ]}
          >
            <Icon
              source={'calendar-range'}
              color={colors.inverseSurface}
              size={textSize.md}
            />
            <Text style={[{ color: colors.inverseSurface }]}>
              {dateFilterText}
            </Text>
          </PressableWithFeedback>
          <PressableWithFeedback
            onPress={resetTypeFilter}
            hidden={typeFilterText.length <= 0}
            style={[
              gs.flexRow,
              gs.itemsCenter,
              {
                borderRadius: borderRadius.pill,
                backgroundColor: colors.inverseOnSurface,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                gap: spacing.sm,
              },
            ]}
          >
            <Icon
              source={'calendar-range'}
              color={colors.inverseSurface}
              size={textSize.md}
            />
            <Text style={[{ color: colors.inverseSurface }]}>
              {typeFilterText}
            </Text>
            <Icon
              source={'close'}
              color={colors.inverseSurface}
              size={textSize.md}
            />
          </PressableWithFeedback>
          <PressableWithFeedback
            onPress={resetCategoryFilter}
            hidden={categoryFilterText.length <= 0}
            style={[
              gs.flexRow,
              gs.itemsCenter,
              {
                borderRadius: borderRadius.pill,
                backgroundColor: colors.inverseOnSurface,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                gap: spacing.sm,
              },
            ]}
          >
            <Icon
              source={'calendar-range'}
              color={colors.inverseSurface}
              size={textSize.md}
            />
            <Text style={[{ color: colors.inverseSurface }]}>
              {categoryFilterText}
            </Text>
            <Icon
              source={'close'}
              color={colors.inverseSurface}
              size={textSize.md}
            />
          </PressableWithFeedback>
        </ScrollView>
      </View>

      {/* summary */}
      <View
        style={[
          styles.summary,
          {
            backgroundColor: colors.inverseOnSurface,
            marginTop: spacing.md,
          },
        ]}
      >
        <PressableWithFeedback
          onPress={handlePresent}
          style={[
            styles.account,
            {
              backgroundColor: colors.tertiary,
              gap: spacing.xs,
            },
          ]}
        >
          <Icon
            source={'wallet-bifold'}
            size={textSize.md}
            color={colors.onTertiary}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              gs.fullFlex,
              {
                color: colors.onTertiary,
              },
            ]}
          >
            {accountName}
          </Text>
          <Icon
            source={'chevron-down'}
            size={textSize.md}
            color={colors.onTertiary}
          />
        </PressableWithFeedback>
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

      {/* search and filter section */}
      <View
        style={[
          styles.searchAndFilter,
          { paddingHorizontal: spacing.md, marginTop: spacing.md },
        ]}
      >
        <View
          style={[styles.search, { backgroundColor: colors.inverseOnSurface }]}
        >
          <Icon source={'magnify'} size={textSize.md} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.onSurfaceDisabled}
            style={[
              styles.searchInput,
              {
                color: colors.inverseSurface,
              },
            ]}
            placeholder="Search transactions"
          />
        </View>
        <PressableWithFeedback
          onPress={navigateToFilters}
          style={[styles.filter, { backgroundColor: colors.inverseOnSurface }]}
        >
          <Icon
            source="filter"
            size={textSize.md}
            color={colors.inverseSurface}
          />
          <Text style={[{ color: colors.inverseSurface }]}>Filter</Text>
        </PressableWithFeedback>
      </View>

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
                  color: theme.colors.inverseSurface,
                  fontSize: textSize.lg,
                  marginTop: spacing.lg,
                },
              ]}
            >
              No transactions yet!!
            </Text>
          ) : (
            <RenderTransactions transactions={transactionsToRender} />
          )}
        </View>
      </View>

      <AccountSelectionModal
        handleSheetChanges={handleSheetChange}
        onAccountChange={id => setSelectedAccountId(id)}
        ref={btmShtRef}
        selectedAccountId={selectedAccount?.id ?? ''}
      />
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
  account: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
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
  searchAndFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  searchInput: {
    flex: 1,
    width: '100%',
    paddingRight: spacing.lg,
  },
  filter: {
    padding: spacing.sm,
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
