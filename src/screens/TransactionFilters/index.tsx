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
    return (
      (!!dateFilter && !dateFilter.isThisMonth) ||
      !!typeFilter ||
      !!categoryFilter
    );
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
            <PressableWithFeedback style={[styles.reset]}>
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
          <View></View>
          {/*Date range ends*/}
        </View>
      </View>
    </Modal>
  );
};

export default TransactionFilters;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    filtersBox: {
      alignSelf: 'flex-end',
      backgroundColor: colors.surfaceContainerHigh,
      flex: 1,
      paddingHorizontal: spacing.md,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      paddingTop: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    titleBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
      flex: 1,
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
  });
