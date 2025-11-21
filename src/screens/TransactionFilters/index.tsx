import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import useTransactionsStore from '../../stores/transactionsStore';

const TransactionFilters = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const filters = [
    'Today',
    'This week',
    'This month',
    'This year',
    'All',
  ] as const;
  const transactionType = ['Income', 'Expense', 'All'];
  const dateFilter = useTransactionsStore(state => state.filters.date);
  const typeFilter = useTransactionsStore(state => state.filters.type);

  const setFilters = useTransactionsStore(state => state.setFilters);
  const resetFilters = useTransactionsStore(state => state.resetFilters);

  const isAnyFilterApplied = useMemo(() => {
    return !!dateFilter || !!typeFilter;
  }, [dateFilter, typeFilter]);

  const selectedFilter = useMemo(() => {
    if (!dateFilter) return 'All';
    if (dateFilter.isThisWeek) return 'This week';
    if (dateFilter.isThisMonth) return 'This month';
    if (dateFilter.isToday) return 'Today';
    if (dateFilter.isThisYear) return 'This year';
    if (dateFilter.range) return 'range';
    return 'All';
  }, [dateFilter]);

  const selectedType = useMemo(() => {
    if (!typeFilter) return 'All';
    return typeFilter === 'expense' ? 'Expense' : 'Income';
  }, [typeFilter]);

  const setDateFilter = (item: string) => {
    switch (item) {
      case 'Today':
        setFilters({
          type: typeFilter,
          date: {
            isToday: true,
          },
        });
        break;
      case 'This week':
        setFilters({
          type: typeFilter,
          date: {
            isThisWeek: true,
          },
        });
        break;
      case 'This month':
        setFilters({
          type: typeFilter,
          date: {
            isThisMonth: true,
          },
        });
        break;
      case 'This year':
        setFilters({
          type: typeFilter,
          date: {
            isThisYear: true,
          },
        });
        break;
      case 'range':
        setFilters({
          type: typeFilter,
          date: {
            isToday: true,
          },
        });
        break;

      default:
        setFilters({
          type: typeFilter,
          date: null,
        });
        break;
    }
  };

  const setTypeFilter = (type: string) => {
    switch (type) {
      case 'Income':
        setFilters({
          date: dateFilter,
          type: 'income',
        });
        break;
      case 'Expense':
        setFilters({
          date: dateFilter,
          type: 'expense',
        });
        break;

      default:
        setFilters({
          date: dateFilter,
          type: null,
        });
        break;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        gs.centerItems,
        gs.fullFlex,
        {
          backgroundColor: colors.backdrop,
        },
      ]}
    >
      <View
        style={[
          styles.filterBox,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            gs.flexRow,
            gs.itemsCenter,
            gs.justifyBetween,

            {
              paddingHorizontal: spacing.sm,
              paddingTop: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              {
                color: colors.onBackground,
                fontSize: textSize.lg,
              },
            ]}
          >
            Filters
          </Text>
          <PressableWithFeedback
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon source={'close'} size={textSize.lg} />
          </PressableWithFeedback>
        </View>
        {/* date filters */}
        <View
          style={[
            styles.dateFilter,
            gs.flexRow,
            {
              borderColor: colors.onSurfaceDisabled,
            },
          ]}
        >
          {filters.map(item => {
            const isSelected = selectedFilter === item;
            return (
              <PressableWithFeedback
                onPress={() => {
                  setDateFilter(item);
                }}
                style={[
                  styles.filterItem,
                  {
                    borderColor: isSelected
                      ? colors.secondaryContainer
                      : colors.onSecondaryContainer,
                    backgroundColor: isSelected
                      ? colors.secondaryContainer
                      : colors.surface,
                  },
                ]}
                key={item}
              >
                <Text
                  style={{
                    color: colors.onPrimaryContainer,
                    fontSize: textSize.sm,
                  }}
                >
                  {item}
                </Text>
              </PressableWithFeedback>
            );
          })}
        </View>
        {/* transaction type filters */}
        <View
          style={[
            styles.dateFilter,
            gs.flexRow,
            {
              borderColor: colors.onSurfaceDisabled,
            },
          ]}
        >
          {transactionType.map(item => {
            const isSelected = selectedType === item;
            return (
              <PressableWithFeedback
                onPress={() => setTypeFilter(item)}
                style={[
                  styles.filterItem,
                  {
                    borderColor: isSelected
                      ? colors.secondaryContainer
                      : colors.onSecondaryContainer,
                    backgroundColor: isSelected
                      ? colors.secondaryContainer
                      : colors.surface,
                  },
                ]}
                key={item}
              >
                <Text
                  style={{
                    color: colors.onPrimaryContainer,
                    fontSize: textSize.sm,
                  }}
                >
                  {item}
                </Text>
              </PressableWithFeedback>
            );
          })}
        </View>
        <View style={[gs.flexRow, gs.centerItems, styles.filterButtonBox]}>
          <PressableWithFeedback
            hidden={!isAnyFilterApplied}
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.secondaryContainer,
              },
            ]}
            onPress={resetFilters}
          >
            <Text
              style={{
                fontSize: textSize.md,
                color: colors.onSecondaryContainer,
              }}
            >
              Reset
            </Text>
          </PressableWithFeedback>
          <PressableWithFeedback
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.secondaryContainer,
              },
            ]}
          >
            <Text
              style={{
                fontSize: textSize.md,
                color: colors.onSecondaryContainer,
              }}
            >
              Done
            </Text>
          </PressableWithFeedback>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TransactionFilters;

const styles = StyleSheet.create({
  filterBox: {
    position: 'absolute',
    bottom: 0,
    height: 340,
    width: '96%',
    borderTopEndRadius: borderRadius.xxl,
    borderTopStartRadius: borderRadius.xxl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  dateFilter: {
    gap: spacing.sm,
    flexWrap: 'wrap',
    overflow: 'hidden',
    borderBottomWidth: 0,
    padding: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  filterItem: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  dropdown: {
    padding: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  dropdownText: {
    fontSize: textSize.sm,
  },
  filterButtonBox: {
    gap: spacing.md,
  },
  filterButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.lg,
  },
});
