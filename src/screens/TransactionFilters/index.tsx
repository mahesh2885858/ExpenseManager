import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { Icon, Snackbar } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import useTransactionsStore from '../../stores/transactionsStore';

const TransactionFilters = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const filters = [
    'All',
    'Today',
    'This week',
    'This month',
    'This year',
    'Range',
  ] as const;
  const transactionType = ['Income', 'Expense', 'All'];
  const dateFilter = useTransactionsStore(state => state.filters.date);
  const typeFilter = useTransactionsStore(state => state.filters.type);

  const setFilters = useTransactionsStore(state => state.setFilters);
  const resetFilters = useTransactionsStore(state => state.resetFilters);
  const [renderCustomDatePicker, setRenderCustomDatePicker] = useState(false);
  const [renderSnack, setRenderSnack] = useState(false);

  const isAnyFilterApplied = useMemo(() => {
    console.log({ dateFilter, typeFilter });
    return !!dateFilter || !!typeFilter;
  }, [dateFilter, typeFilter]);

  const selectedFilter = useMemo(() => {
    if (!dateFilter) return 'All';
    if (dateFilter.isThisWeek) return 'This week';
    if (dateFilter.isThisMonth) return 'This month';
    if (dateFilter.isToday) return 'Today';
    if (dateFilter.isThisYear) return 'This year';
    if (dateFilter.range) return 'Range';
    return 'All';
  }, [dateFilter]);

  const range = useMemo(() => {
    if (selectedFilter === 'Range') {
      return dateFilter?.range;
    }
  }, [selectedFilter, dateFilter]);

  const selectedType = useMemo(() => {
    if (!typeFilter) return 'All';
    return typeFilter === 'expense' ? 'Expense' : 'Income';
  }, [typeFilter]);

  const setDateFilter = useCallback(
    (item: string, givenRange?: CalendarDate[]) => {
      console.log('Date filter is being set here: ', item);
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
        case 'Range':
          setFilters({
            type: typeFilter,
            date: {
              range: givenRange,
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
    },
    [setFilters, typeFilter],
  );

  const setTypeFilter = (type: string) => {
    console.log('Type filter is being set here: ', type);
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

  const onConfirm = useCallback(
    ({
      startDate,
      endDate,
    }: {
      startDate: CalendarDate;
      endDate: CalendarDate;
    }) => {
      setRenderCustomDatePicker(false);
      if (!startDate || !endDate) {
        setRenderSnack(true);
        return;
      }
      setDateFilter('Range', [startDate, endDate]);
    },
    [setRenderCustomDatePicker, setDateFilter],
  );

  useFocusEffect(
    useCallback(() => {
      let t: number;
      if (renderSnack) {
        t = setTimeout(() => {
          setRenderSnack(false);
          clearTimeout(t);
        }, 1000);
      }
      return () => {
        clearTimeout(t);
      };
    }, [renderSnack]),
  );

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
            style={{
              paddingVertical: spacing.sm,
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
            const isRange = item === 'Range';
            return (
              <PressableWithFeedback
                onPress={() => {
                  if (isRange) {
                    setRenderCustomDatePicker(true);
                  } else {
                    setDateFilter(item);
                  }
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
            onPress={navigation.goBack}
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
      {renderCustomDatePicker && (
        <DatePickerModal
          startDate={range ? range[0] : undefined}
          label="Select Custom date range"
          animationType="fade"
          presentationStyle="pageSheet"
          locale="en"
          mode="range"
          visible={renderCustomDatePicker}
          endDate={range ? range[0] : undefined}
          onConfirm={onConfirm}
          onDismiss={() => {
            setRenderCustomDatePicker(false);
          }}
        />
      )}
      <Snackbar
        visible={renderSnack}
        onDismiss={() => {
          setRenderSnack(false);
        }}
      >
        <Text>Please select both start and end date.</Text>
      </Snackbar>
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
