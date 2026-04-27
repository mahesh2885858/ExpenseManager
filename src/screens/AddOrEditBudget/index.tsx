import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { roundValue, uCFirst } from 'commonutil-core';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import {
  CalendarDate,
  RangeChange,
} from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuid } from 'uuid';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AmountInputBoard from '../../components/organisms/AmountInputBoard';
import BudgetPeriodSelectionModal from '../../components/organisms/BudgetPeriodSelection';
import CategorySelectionModal from '../../components/organisms/CategorySelectionModal';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import useTransactions from '../../hooks/useTransactions';
import useBudgetStore from '../../stores/budgetStore';
import {
  TBudget,
  TBudgetPeriod,
  TBudgetPeriods,
  TRootStackParamList,
} from '../../types';
import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import AppText from '../../components/molecules/AppText';
import { useTranslation } from 'react-i18next';

const dateFormatString = 'do MMM yyyy';
const AddOrEditBudget = () => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const route = useRoute<RouteProp<TRootStackParamList, 'AddOrEditBudget'>>();
  const { getFormattedAmount } = useTransactions();
  const navigation = useNavigation();
  const { categories } = useCategories();
  const addBudget = useBudgetStore(state => state.addBudget);

  const [name, setName] = useState('');
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState<TBudgetPeriods>('monthly');
  const [customRange, setCustomRange] = useState<{
    start: CalendarDate;
    end: CalendarDate;
  }>({
    start: undefined,
    end: undefined,
  });
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [renderCategoryList, setRenderCategoryList] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    category: '',
    amount: '',
    period: '',
  });

  const periodInfo: Record<TBudgetPeriods, string> = useMemo(
    () => ({
      'one time': '',
      monthly: 'Starts 1st of the month',
      weekly: 'Strats on every Monday',
      yearly: 'Starts on 1st January of year',
    }),
    [],
  );
  const {
    btmShtRef: amtShtRef,
    handlePresent: amtShtPresent,
    handleSheetChange: amtShtChange,
  } = useBottomSheetModal();

  const {
    btmShtRef: periodShtRef,
    handlePresent: periodShtPresent,
    handleSheetChange: periodShtChange,
  } = useBottomSheetModal();

  const removeError = useCallback((field: keyof typeof errors) => {
    setErrors(p => ({ ...p, [field]: '' }));
  }, []);

  const onCatSelected = useCallback(
    (id: string) => {
      removeError('category');
      setSelectedCatIds(p =>
        p.find(cat => cat === id) ? p.filter(cat => cat !== id) : [...p, id],
      );
    },
    [removeError],
  );

  const onCatRemove = useCallback((id: string) => {
    setSelectedCatIds(p => p.filter(cat => cat !== id));
  }, []);

  const onConfirmRange: RangeChange = useCallback(params => {
    setCustomRange({
      start: params.startDate,
      end: params.endDate,
    });
    setOpenDatePicker(false);
  }, []);

  const validateInputData = useCallback(() => {
    const err: typeof errors = {
      amount: '',
      category: '',
      name: '',
      period: '',
    };

    if (name.trim().length < 3) {
      err.name = 'Name field should be more than 3 characters.';
    }
    if (selectedCatIds.length === 0) {
      err.category = 'Select at least one category';
    }
    if (budgetAmount.trim().length === 0) {
      err.amount = 'Amount can not be empty';
    }
    if (
      budgetPeriod === 'one time' &&
      (!customRange.end || !customRange.start)
    ) {
      err.period = 'Both start and end date is required for one time budget';
    }
    setErrors(err);
    if (Object.keys(err).some(k => err[k as keyof typeof err].length > 0))
      return false;
    return true;
  }, [name, selectedCatIds, budgetAmount, budgetPeriod, customRange]);

  const onNameChange = useCallback(
    (text: string) => {
      removeError('name');
      setName(text);
    },
    [removeError],
  );

  const onAmountChange = useCallback(
    (amount: string) => {
      removeError('amount');
      setBudgetAmount(amount);
    },
    [removeError],
  );

  const addNew = useCallback(() => {
    const id = uuid();
    const amount = roundValue(parseFloat(budgetAmount), 2);
    let period: TBudgetPeriod = {} as TBudgetPeriod;
    if (budgetPeriod === 'one time' && customRange.start && customRange.end) {
      period = {
        type: 'one time',
        range: {
          start: customRange.start,
          end: customRange.end,
        },
      };
    } else {
      period.type = budgetPeriod;
    }
    const budget: TBudget = {
      id,
      amount,
      categoryIds: selectedCatIds,
      createdAt: new Date().toISOString(),
      name,
      period,
      spent: 0,
    };
    addBudget(budget);
  }, [
    budgetAmount,
    name,
    selectedCatIds,
    budgetPeriod,
    customRange,
    addBudget,
  ]);

  const onSave = useCallback(() => {
    if (validateInputData()) {
      addNew();
      navigation.goBack();
    }
  }, [validateInputData, addNew, navigation]);

  const heading = useMemo(() => {
    return route.params.mode === 'new'
      ? t('budget.createBudget')
      : t('budget.updateBudget');
  }, [route.params, t]);

  const periodInfoText = useMemo(() => {
    if (budgetPeriod === 'one time') {
      if (!customRange.end && !customRange.start) {
        return 'Select start and end dates';
      } else if (customRange.end && !customRange.start) {
        return (
          'Select start date - ' + format(customRange.end, dateFormatString)
        );
      } else if (!customRange.end && customRange.start) {
        return (
          format(customRange.start, dateFormatString) + ' - Select end date'
        );
      } else if (customRange.end && customRange.start) {
        return (
          format(customRange.start, dateFormatString) +
          ' - ' +
          format(customRange.end, dateFormatString)
        );
      } else return 'Select start and end dates';
    } else {
      return periodInfo[budgetPeriod];
    }
  }, [periodInfo, budgetPeriod, customRange]);

  return (
    <ScreenWrapper style={[styles.container]}>
      {/*header starts*/}
      <View style={[styles.header]}>
        <PressableWithFeedback onPress={navigation.goBack}>
          <Icon
            source={'arrow-left'}
            size={textSize.xl}
            color={colors.onBackground}
          />
        </PressableWithFeedback>
        <AppText.Bold style={[styles.headerText]}>{heading}</AppText.Bold>
      </View>
      {/*header ends*/}

      {/*Budget name starts*/}
      <View>
        <AppText.Medium style={[styles.selectCatText]}>
          {t('budget.budgetName')}
        </AppText.Medium>
        <TextInput
          value={name}
          onChangeText={onNameChange}
          placeholder={t('budget.budgetNamePlaceholder')}
          placeholderTextColor={colors.onSurfaceDisabled}
          style={[styles.budgetNameInput]}
        />
        {errors.name && <Text style={[styles.errorText]}>{errors.name}</Text>}
      </View>
      {/*Budget name ends*/}

      {/*Category selections starts*/}
      <View>
        <View style={[styles.categorySelectionBox]}>
          <AppText.Medium style={[styles.selectCatText]}>
            {t('budget.selectCat')}
          </AppText.Medium>
          <PressableWithFeedback
            onPress={() => setRenderCategoryList(true)}
            style={[styles.addCatBox]}
          >
            {selectedCatIds.length > 0 ? (
              <View style={[gs.fullFlex, gs.flexRow, gs.itemsCenter]}>
                <FlashList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={selectedCatIds}
                  keyExtractor={item => item}
                  renderItem={({ item }) => {
                    return (
                      <PressableWithFeedback
                        onPress={() => onCatRemove(item)}
                        style={[styles.selectedCatChip]}
                      >
                        <AppText.Regular style={[styles.selectedChipText]}>
                          {categories.find(cat => cat.id === item)?.name ??
                            'unknown'}
                        </AppText.Regular>
                        <Icon
                          source={'close'}
                          size={textSize.sm}
                          color={colors.onPrimary}
                        />
                      </PressableWithFeedback>
                    );
                  }}
                />
              </View>
            ) : (
              <AppText.Regular style={[gs.fullFlex, styles.addCatText]}>
                {t('budget.addCat')}
              </AppText.Regular>
            )}
            <Icon
              source={'plus'}
              size={textSize.xxl}
              color={colors.onBackground}
            />
          </PressableWithFeedback>
        </View>
        {errors.category && (
          <AppText.Regular style={[styles.errorText]}>
            {errors.category}
          </AppText.Regular>
        )}
      </View>
      {/*Category selections ends*/}

      {/*Budget Amount starts*/}
      <View>
        <View style={[styles.budgetAmtBox]}>
          <AppText.Medium style={[styles.selectCatText]}>
            {t('budget.setBudgetAmt')}
          </AppText.Medium>
          <PressableWithFeedback
            onPress={amtShtPresent}
            style={[styles.addCatBox]}
          >
            <AppText.Regular style={[styles.budgetAmtText]}>
              {getFormattedAmount(budgetAmount)}
            </AppText.Regular>
          </PressableWithFeedback>
        </View>
        {errors.amount && (
          <AppText.Regular style={[styles.errorText]}>
            {errors.amount}
          </AppText.Regular>
        )}
      </View>
      {/*Budget Amount ends*/}

      {/*Budget Period starts*/}
      <View>
        <View style={[styles.budgetAmtBox]}>
          <AppText.Medium style={[styles.selectCatText]}>
            {t('budget.budgetPeriod')}
          </AppText.Medium>
          <PressableWithFeedback
            onPress={periodShtPresent}
            style={[styles.addCatBox]}
          >
            <AppText.Regular style={[styles.budgetPeriodText]}>
              {uCFirst(budgetPeriod)}
            </AppText.Regular>
            {budgetPeriod === 'one time' ? (
              <PressableWithFeedback
                onPress={() => setOpenDatePicker(true)}
                style={[styles.customDateBox]}
              >
                <AppText.Regular
                  style={[styles.periodTextInfo, styles.customDateText]}
                >
                  {periodInfoText}
                </AppText.Regular>
              </PressableWithFeedback>
            ) : (
              <AppText.Regular style={[styles.periodTextInfo]}>
                {periodInfoText}
              </AppText.Regular>
            )}
          </PressableWithFeedback>
        </View>
        {errors.period && (
          <AppText.Regular style={[styles.errorText]}>
            {errors.period}
          </AppText.Regular>
        )}
      </View>
      {/*Budget Period ends*/}

      <PressableWithFeedback onPress={onSave} style={[styles.saveButton]}>
        <AppText.Medium style={[styles.saveButtonText]}>
          {route.params.mode === 'new' ? t('common.create') : t('common.save')}
        </AppText.Medium>
      </PressableWithFeedback>

      {/*All modals used*/}
      <CategorySelectionModal
        onClose={() => setRenderCategoryList(false)}
        selectCategory={onCatSelected}
        visible={renderCategoryList}
        allowMultiple={true}
        selectedCategories={selectedCatIds}
      />
      <AmountInputBoard
        ref={amtShtRef}
        amountInput={budgetAmount}
        handleSheetChanges={amtShtChange}
        setAmountInput={onAmountChange}
      />
      <BudgetPeriodSelectionModal
        ref={periodShtRef}
        handleSheetChanges={periodShtChange}
        selectBudgetPeriod={setBudgetPeriod}
        selectedPeriod={budgetPeriod}
      />
      <DatePickerModal
        label="Select transaction date"
        animationType="fade"
        presentationStyle="pageSheet"
        locale="en"
        mode="range"
        visible={openDatePicker}
        onDismiss={() => {
          setOpenDatePicker(false);
        }}
        endDate={customRange.end}
        startDate={customRange.start}
        // date={new Date()}
        onConfirm={onConfirmRange}
        saveLabel="Save"
      />
    </ScreenWrapper>
  );
};
export default AddOrEditBudget;
const createStyles = (colors: AppTheme['colors']) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      flex: 1,
    },
    header: {
      paddingTop: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    headerText: {
      fontSize: textSize.lg,
      fontWeight: 'bold',
      flex: 1,
      color: colors.onBackground,
    },
    budgetNameInput: {
      backgroundColor: colors.surfaceContainer,
      color: colors.onSurfaceVariant,
      fontSize: textSize.md,
      padding: spacing.sm,
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
      borderRadius: borderRadius.sm,
      fontFamily: 'Inter-Regular',
    },
    categorySelectionBox: {
      marginTop: spacing.md,
    },
    selectCatText: {
      fontSize: textSize.md,
      fontWeight: 500,
      color: colors.onSurface,
    },
    addCatBox: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.sm,
      paddingVertical: spacing.md,
      backgroundColor: colors.surfaceContainer,
      marginTop: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    addCatText: {
      fontSize: textSize.md,
      color: colors.onBackground,
    },
    selectedCatChip: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      gap: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    selectedChipText: {
      color: colors.onPrimary,
    },
    budgetAmtBox: {
      marginTop: spacing.md,
    },
    budgetAmtText: {
      fontSize: textSize.md,
      color: colors.onSurfaceVariant,
    },
    budgetPeriodText: {
      fontSize: textSize.md,
      color: colors.onSurfaceVariant,
      flex: 1,
    },
    periodTextInfo: {
      fontSize: textSize.md,
      color: colors.onSurfaceDisabled,
    },
    customDateBox: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      height: 31,
      justifyContent: 'center',
    },
    customDateText: {
      color: colors.onPrimary,
      fontSize: textSize.sm,
    },
    saveButton: {
      marginTop: spacing.md,
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderRadius: borderRadius.md,
      position: 'absolute',
      width: '100%',
      left: spacing.md,
      bottom: 50,
    },
    saveButtonText: {
      fontSize: textSize.md,
      color: colors.onPrimary,
    },
    errorText: {
      color: colors.error,
      fontSize: textSize.xs,
    },
  });
  return styles;
};
