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

const dateFormatString = 'do MMM yyyy';
const AddOrEditBudget = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { top } = useSafeAreaInsets();
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
    return route.params.mode === 'new' ? 'Create Budget' : 'Update Budget';
  }, [route.params]);

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
    <View style={[styles.container, { marginTop: top }]}>
      {/*header starts*/}
      <View style={[styles.header]}>
        <PressableWithFeedback onPress={navigation.goBack}>
          <Icon
            source={'arrow-left'}
            size={textSize.xl}
            color={colors.onBackground}
          />
        </PressableWithFeedback>
        <Text style={[styles.headerText]}>{heading}</Text>
      </View>
      {/*header ends*/}

      {/*Budget name starts*/}
      <View>
        <Text style={[styles.selectCatText]}>Budget Name</Text>
        <TextInput
          value={name}
          onChangeText={onNameChange}
          placeholder="Choose a name for this budget"
          placeholderTextColor={colors.onSurfaceDisabled}
          style={[styles.budgetNameInput]}
        />
        {errors.name && <Text style={[styles.errorText]}>{errors.name}</Text>}
      </View>
      {/*Budget name ends*/}

      {/*Category selections starts*/}
      <View>
        <View style={[styles.categorySelectionBox]}>
          <Text style={[styles.selectCatText]}>Select Category</Text>
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
                        <Text style={[styles.selectedChipText]}>
                          {categories.find(cat => cat.id === item)?.name ??
                            'unknown'}
                        </Text>
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
              <Text style={[gs.fullFlex, styles.addCatText]}>
                Add a category
              </Text>
            )}
            <Icon
              source={'plus'}
              size={textSize.xxl}
              color={colors.onBackground}
            />
          </PressableWithFeedback>
        </View>
        {errors.category && (
          <Text style={[styles.errorText]}>{errors.category}</Text>
        )}
      </View>
      {/*Category selections ends*/}

      {/*Budget Amount starts*/}
      <View>
        <View style={[styles.budgetAmtBox]}>
          <Text style={[styles.selectCatText]}>Set Budget Amount</Text>
          <PressableWithFeedback
            onPress={amtShtPresent}
            style={[styles.addCatBox]}
          >
            <Text style={[styles.budgetAmtText]}>
              {getFormattedAmount(budgetAmount)}
            </Text>
          </PressableWithFeedback>
        </View>
        {errors.amount && (
          <Text style={[styles.errorText]}>{errors.amount}</Text>
        )}
      </View>
      {/*Budget Amount ends*/}

      {/*Budget Period starts*/}
      <View>
        <View style={[styles.budgetAmtBox]}>
          <Text style={[styles.selectCatText]}>Budget Period</Text>
          <PressableWithFeedback
            onPress={periodShtPresent}
            style={[styles.addCatBox]}
          >
            <Text style={[styles.budgetPeriodText]}>
              {uCFirst(budgetPeriod)}
            </Text>
            {budgetPeriod === 'one time' ? (
              <PressableWithFeedback
                onPress={() => setOpenDatePicker(true)}
                style={[styles.customDateBox]}
              >
                <Text style={[styles.periodTextInfo, styles.customDateText]}>
                  {periodInfoText}
                </Text>
              </PressableWithFeedback>
            ) : (
              <Text style={[styles.periodTextInfo]}>{periodInfoText}</Text>
            )}
          </PressableWithFeedback>
        </View>
        {errors.period && (
          <Text style={[styles.errorText]}>{errors.period}</Text>
        )}
      </View>
      {/*Budget Period ends*/}

      <PressableWithFeedback onPress={onSave} style={[styles.saveButton]}>
        <Text style={[styles.saveButtonText]}>
          {route.params.mode === 'new' ? 'Create' : 'Save'}
        </Text>
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
    </View>
  );
};
export default AddOrEditBudget;
const createStyles = (colors: AppTheme['colors']) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      flex: 1,
    },
    header: {
      paddingTop: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
      gap: spacing.sm,
    },
    headerText: {
      fontSize: textSize.lg,
      fontWeight: 'bold',
      flex: 1,
      color: colors.onBackground,
    },
    budgetNameInput: {
      backgroundColor: colors.surfaceVariant,
      color: colors.onSurfaceVariant,
      fontSize: textSize.md,
      padding: spacing.sm,
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    categorySelectionBox: {
      marginTop: spacing.md,
    },
    selectCatText: {
      fontSize: textSize.md,
      fontWeight: 500,
      color: colors.onBackground,
    },
    addCatBox: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.sm,
      paddingVertical: spacing.md,
      backgroundColor: colors.surfaceVariant,
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
