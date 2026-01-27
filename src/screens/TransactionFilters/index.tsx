import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon, Snackbar } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import CategorySelectionModal from '../../components/organisms/CategorySelectionModal';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import useTransactionsStore from '../../stores/transactionsStore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const TransactionFilters = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const filters = [
    'This month',
    'This week',
    'Today',
    'This year',
    'Range',
  ] as const;
  const transactionType = ['Income', 'Expense', 'All'];
  const dateFilter = useTransactionsStore(state => state.filters.date);
  const typeFilter = useTransactionsStore(state => state.filters.type);
  const categoryFilter = useTransactionsStore(
    state => state.filters.categoryId,
  );
  const setFilters = useTransactionsStore(state => state.setFilters);
  const resetFilters = useTransactionsStore(state => state.resetFilters);
  const { categories } = useCategories();

  const [renderCustomDatePicker, setRenderCustomDatePicker] = useState(false);
  const [renderSnack, setRenderSnack] = useState(false);

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();

  const isAnyFilterApplied = useMemo(() => {
    return !!dateFilter || !!typeFilter || !!categoryFilter;
  }, [dateFilter, typeFilter, categoryFilter]);

  const selectedFilter = useMemo(() => {
    if (!dateFilter) return 'This month';
    if (dateFilter.isThisWeek) return 'This week';
    if (dateFilter.isThisMonth) return 'This month';
    if (dateFilter.isToday) return 'Today';
    if (dateFilter.isThisYear) return 'This year';
    if (dateFilter.range) return 'Range';
    return 'This month';
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
      switch (item) {
        case 'Today':
          setFilters({
            date: {
              isToday: true,
            },
          });
          break;
        case 'This week':
          setFilters({
            date: {
              isThisWeek: true,
            },
          });
          break;
        case 'This month':
          setFilters({
            date: {
              isThisMonth: true,
            },
          });
          break;
        case 'This year':
          setFilters({
            date: {
              isThisYear: true,
            },
          });
          break;
        case 'Range':
          setFilters({
            date: {
              range: givenRange,
            },
          });
          break;

        default:
          setFilters({
            date: null,
          });
          break;
      }
    },
    [setFilters],
  );

  const setTypeFilter = (type: string) => {
    switch (type) {
      case 'Income':
        setFilters({
          type: 'income',
        });
        break;
      case 'Expense':
        setFilters({
          type: 'expense',
        });
        break;

      default:
        setFilters({
          type: null,
        });
        break;
    }
  };

  const resetCategoryFilter = useCallback(() => {
    setFilters({ categoryId: null });
  }, [setFilters]);

  const setCatFilter = (categoryId: string) => {
    console.log('Category filter is being set here: ', categoryId);
    setFilters({
      categoryId: categoryId,
    });
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
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
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
            {/* category filter */}
            <View
              style={[
                gs.flexRow,
                gs.itemsCenter,
                {
                  gap: spacing.sm,
                },
              ]}
            >
              <View
                style={[
                  styles.categoryBox,
                  gs.fullFlex,

                  {
                    borderColor: colors.onPrimaryContainer,
                  },
                ]}
              >
                <PressableWithFeedback
                  onPress={() => handlePresent()}
                  style={[gs.flexRow, gs.justifyBetween, gs.itemsCenter]}
                >
                  <Text
                    style={[
                      {
                        color: colors.onPrimaryContainer,
                      },
                    ]}
                  >
                    {categoryFilter === null
                      ? 'All'
                      : categories.filter(c => c.id === categoryFilter)[0]
                          ?.name ?? ''}
                  </Text>
                  <Icon source={'chevron-down'} size={spacing.md} />
                </PressableWithFeedback>
              </View>
              <PressableWithFeedback
                onPress={resetCategoryFilter}
                hidden={categoryFilter === null}
              >
                <Icon source={'restart'} size={textSize.xl} />
              </PressableWithFeedback>
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

          <CategorySelectionModal
            handleSheetChanges={handleSheetChange}
            ref={btmShtRef}
            selectCategory={id => {
              setCatFilter(id);
            }}
            selectedCategory={categoryFilter}
            forFilter
          />
          <Snackbar
            visible={renderSnack}
            onDismiss={() => {
              setRenderSnack(false);
            }}
          >
            <Text>Please select both start and end date.</Text>
          </Snackbar>
        </KeyboardAvoidingView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default TransactionFilters;

const styles = StyleSheet.create({
  filterBox: {
    position: 'absolute',
    bottom: 0,
    height: 400,
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
  categoryBox: {
    marginVertical: spacing.sm,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
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
