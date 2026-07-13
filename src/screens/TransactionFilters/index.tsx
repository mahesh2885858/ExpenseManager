import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon, Snackbar } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import CategorySelectionModal from '../../components/organisms/CategorySelectionModal';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import useTransactionsStore from '../../stores/transactionsStore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AppText from '../../components/molecules/AppText';
import withOpacity from '../../utils/withOpacity';
import { useTranslation } from 'react-i18next';
import { getDateFilterText } from '../../utils';
import { TDateFilter, TTypeFilter } from '../../types';
import { setDate } from 'date-fns/fp';

type TProps = {
  visible: boolean;
  onClose: () => void;
};

const TransactionFilters = (props: TProps) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const styles = createStyles(colors);
  const filters = [
    'This month',
    'This week',
    'Today',
    'This year',
    'Range',
  ] as const;
  const [dateFilter, setDateFilter] = useState<TDateFilter>({
    isThisMonth: true,
  });
  const [txnType, setTxnType] = useState<TTypeFilter | null>(null);
  const categoryFilter = useTransactionsStore(
    state => state.filters.categoryId,
  );
  const setFilters = useTransactionsStore(state => state.setFilters);
  const { categories } = useCategories();

  const [renderCustomDatePicker, setRenderCustomDatePicker] = useState(false);
  const [renderSnack, setRenderSnack] = useState(false);

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();

  const isAnyFilterApplied = useMemo(() => {
    return (
      (!!dateFilter && !dateFilter.isThisMonth) || !!txnType || !!categoryFilter
    );
  }, [dateFilter, txnType, categoryFilter]);

  const selectedFilter = useMemo(() => {
    if (!dateFilter) return 'This month';
    if (dateFilter.isThisWeek) return 'This week';
    if (dateFilter.isThisMonth) return 'This month';
    if (dateFilter.isThisQuarter) return 'This quarter';
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
    if (!txnType) return 'All';
    return txnType === 'expense' ? 'Expense' : 'Income';
  }, [txnType]);

  const setDateFilterLocal = useCallback(
    (item: string, givenRange?: CalendarDate[]) => {
      switch (item) {
        case 'This quarter':
          setDateFilter({ isThisQuarter: true });
          break;
        case 'This week':
          setDateFilter({ isThisWeek: true });

          break;
        case 'This month':
          setDateFilter({ isThisMonth: true });

          break;
        case 'This year':
          setDateFilter({ isThisYear: true });

          break;
        case 'Range':
          setDateFilter({ range: givenRange });

          break;

        default:
          setDateFilter({ isThisMonth: true });

          break;
      }
    },
    [setDateFilter],
  );

  const setTypeFilter = (type: string) => {
    switch (type) {
      case 'Income':
        setTxnType('income');
        break;
      case 'Expense':
        setTxnType('expense');

        break;

      default:
        setTxnType(null);

        break;
    }
  };

  const resetCategoryFilter = useCallback(() => {
    setFilters({ categoryId: null });
  }, [setFilters]);

  const setCatFilter = (categoryId: string) => {
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
      setDateFilterLocal('Range', [startDate, endDate]);
    },
    [setRenderCustomDatePicker, setDateFilterLocal],
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

  const applyFilters = useCallback(() => {
    setFilters({
      date: dateFilter,
      type: txnType,
    });
  }, [dateFilter, txnType, setFilters]);

  const resetFilters = useCallback(() => {
    setDateFilter({
      isThisMonth: true,
    });
    setTxnType(null);
    setFilters({
      date: {
        isThisMonth: true,
      },
      type: null,
    });
  }, [setFilters]);

  return (
    <Modal
      visible={props.visible}
      onRequestClose={props.onClose}
      animationType="slide"
      backdropColor={withOpacity(colors.surface, 0.15)}
    >
      <View style={[styles.container]}>
        <View style={[styles.filtersBox]}>
          <View style={[styles.titleBox]}>
            <AppText.Bold style={[styles.title]}>
              {t('filters.filters')}
            </AppText.Bold>
            <PressableWithFeedback
              onPress={resetFilters}
              style={[styles.reset]}
            >
              <AppText.Regular style={[styles.title]}>
                {t('filters.reset')}
              </AppText.Regular>
              <Icon
                size={textSize.lg}
                color={colors.onSurfaceVariant}
                source={'reload'}
              />
            </PressableWithFeedback>
          </View>

          {/*Date range starts*/}
          <View style={[styles.dateContainer]}>
            <View style={[styles.filterTitle]}>
              <Icon
                source={'clock'}
                size={textSize.lg}
                color={colors.onSurface}
              />
              <AppText.Medium style={[styles.dateText]}>
                {t('filters.dateRange')}
              </AppText.Medium>
            </View>
            <PressableWithFeedback
              onPress={() => {
                setRenderCustomDatePicker(true);
              }}
              style={[styles.dateBox]}
            >
              <AppText style={[styles.selectedDateText]}>
                {getDateFilterText(dateFilter)}
              </AppText>
              <Icon
                source={'chevron-down'}
                color={colors.onSurface}
                size={textSize.lg}
              />
            </PressableWithFeedback>
            <View style={[styles.datePillContainer]}>
              <PressableWithFeedback
                onPress={() => setDateFilterLocal('This week')}
                style={[
                  styles.datePill,
                  dateFilter.isThisWeek && styles.datePillSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.datePillText,
                    dateFilter.isThisWeek && styles.datePillTextSelected,
                  ]}
                >
                  {t('filters.thisWeek')}
                </AppText>
              </PressableWithFeedback>
              <PressableWithFeedback
                onPress={() => setDateFilterLocal('This month')}
                style={[
                  styles.datePill,
                  dateFilter.isThisMonth && styles.datePillSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.datePillText,
                    dateFilter.isThisMonth && styles.datePillTextSelected,
                  ]}
                >
                  {t('filters.thisMonth')}
                </AppText>
              </PressableWithFeedback>
              <PressableWithFeedback
                onPress={() => setDateFilterLocal('This quarter')}
                style={[
                  styles.datePill,
                  dateFilter.isThisQuarter && styles.datePillSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.datePillText,
                    dateFilter.isThisQuarter && styles.datePillTextSelected,
                  ]}
                >
                  {t('filters.thisQuarter')}
                </AppText>
              </PressableWithFeedback>
              <PressableWithFeedback
                onPress={() => setDateFilterLocal('This year')}
                style={[
                  styles.datePill,
                  dateFilter.isThisYear && styles.datePillSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.datePillText,
                    dateFilter.isThisYear && styles.datePillTextSelected,
                  ]}
                >
                  {t('filters.thisYear')}
                </AppText>
              </PressableWithFeedback>
            </View>
          </View>
          {/*Date range ends*/}

          {/*Txn type starts*/}
          <View style={[styles.txnTypeContainer]}>
            <View style={[styles.filterTitle]}>
              <Icon
                source={'tag'}
                size={textSize.lg}
                color={colors.onSurface}
              />
              <AppText.Medium style={[styles.dateText]}>
                {t('filters.type')}
              </AppText.Medium>
            </View>
            <View style={[styles.txnBtnContainer]}>
              <PressableWithFeedback
                onPress={() => setTypeFilter('Income')}
                style={[
                  styles.txnTypeBtn,
                  txnType === 'income' && styles.txnTypeBtnSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.txnTypeText,
                    txnType === 'income' && styles.txnTypeSelectedText,
                  ]}
                >
                  {t('common.income')}
                </AppText>
              </PressableWithFeedback>
              <PressableWithFeedback
                onPress={() => setTypeFilter('Expense')}
                style={[
                  styles.txnTypeBtn,
                  txnType === 'expense' && styles.txnTypeBtnSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.txnTypeText,
                    txnType === 'expense' && styles.txnTypeSelectedText,
                  ]}
                >
                  {t('common.expense')}
                </AppText>
              </PressableWithFeedback>
              <PressableWithFeedback
                onPress={() => setTypeFilter('Both')}
                style={[
                  styles.txnTypeBtn,
                  !txnType && styles.txnTypeBtnSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.txnTypeText,
                    !txnType && styles.txnTypeSelectedText,
                  ]}
                >
                  {t('common.both')}
                </AppText>
              </PressableWithFeedback>
            </View>
          </View>
          {/*Txn type ends*/}

          {/*Buttons starts*/}
          <View style={[styles.buttonContainer]}>
            <PressableWithFeedback
              onPress={props.onClose}
              style={[styles.button, styles.cancel]}
            >
              <AppText style={[styles.cancelText]}>
                {t('common.cancel')}
              </AppText>
            </PressableWithFeedback>
            <PressableWithFeedback
              onPress={applyFilters}
              style={[styles.button]}
            >
              <AppText>{t('filters.applyFilters')}</AppText>
            </PressableWithFeedback>
          </View>
          {/*Buttons ends*/}
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
    </Modal>
  );
};

export default TransactionFilters;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
    },

    filtersBox: {
      width: '100%',
      minHeight: 200,
      backgroundColor: colors.surfaceContainerHigh,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
    },
    titleBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    title: {
      color: colors.onSurface,
      fontSize: textSize.md,
    },
    reset: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    dateContainer: {
      gap: spacing.sm,
    },
    filterTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    dateText: {
      color: colors.onSurface,
      fontSize: textSize.md,
    },
    dateBox: {
      borderColor: colors.outline,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      padding: spacing.xs,
      paddingHorizontal: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedDateText: {
      color: colors.onSurface,
      fontSize: textSize.md,
      flex: 1,
    },
    datePillContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    datePill: {
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm1,
      paddingVertical: spacing.xs,
      backgroundColor: colors.surfaceContainer,
    },
    datePillSelected: {
      backgroundColor: colors.onSurface,
    },
    datePillText: {
      color: colors.onSurface,
      fontSize: textSize.xs,
    },
    datePillTextSelected: {
      color: colors.surface,
    },
    txnTypeContainer: {
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    txnBtnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    txnTypeBtn: {
      flex: 1,
      backgroundColor: colors.surfaceContainer,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm1,
      paddingVertical: spacing.xs,
    },
    txnTypeBtnSelected: {
      backgroundColor: colors.inverseSurface,
    },
    txnTypeText: {
      fontSize: textSize.md,
      color: colors.onSurface,
    },

    txnTypeSelectedText: {
      color: colors.inverseOnSurface,
    },

    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
      gap: spacing.sm,
      paddingRight: spacing.xs,
      marginBottom: spacing.sm,
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.md,
      backgroundColor: colors.primary,
      width: '50%',
      borderRadius: borderRadius.md,
    },
    cancel: {
      backgroundColor: colors.surfaceBright,
    },
    cancelText: {
      color: colors.onSurface,
    },
  });
