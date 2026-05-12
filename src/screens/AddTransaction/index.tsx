import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FAB, Icon } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AppText, { fontsMap } from '../../components/molecules/AppText';
import AmountInputBoard from '../../components/organisms/AmountInputBoard';
import CategorySelectionModal from '../../components/organisms/CategorySelectionModal';
import TransactionTypeSwitch from '../../components/organisms/TransactionTypeSwitch';
import WalletSelectionModal from '../../components/organisms/WalletSelectionModal';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import useHelpers from '../../hooks/useHelpers';
import { useTransactionForm } from '../../hooks/useTransactionForm';
import useTransactions from '../../hooks/useTransactions';
import useWallets from '../../hooks/useWallets';
import useProfileStore from '../../stores/profileStore';
const DATE_FORMAT = 'dd MMM yyyy';
const ICON_SIZE = 24;

const AddTransaction = () => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  const style = createStyles(colors);

  const { categories, defaultCategoryId } = useCategories();

  const { wallets, defaultWalletId } = useWallets();

  const { getFormattedAmount } = useHelpers();

  const { addTransaction, updateTransaction } = useTransactions();

  const selectedProfileId = useProfileStore(state => state.selectedProfileId);

  const {
    form,
    errorFields,
    updateField,
    clearError,
    saveTransaction,
    mergedDate,
  } = useTransactionForm({
    categories,
    defaultCategoryId,
    defaultWalletId,
    addTransaction,
    updateTransaction,
    selectedProfileId,
  });

  const {
    btmShtRef: bottomSheetModalRef,
    handlePresent: handlePresentModalPress,
    handleSheetChange: handleSheetChanges,
  } = useBottomSheetModal();

  const {
    btmShtRef: amountInputSheetRef,
    handlePresent: handleAmountInputPresent,
    handleSheetChange: handleAmountSheetChange,
  } = useBottomSheetModal();

  const navigation = useNavigation();

  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [openTimePicker, setOpenTimePicker] = useState(false);

  const [renderCategoryList, setRenderCategoryList] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find(c => c.id === form.categoryId),
    [categories, form.categoryId],
  );

  const selectedWallet = useMemo(
    () => wallets.find(wallet => wallet.id === form.walletId),
    [wallets, form.walletId],
  );
  const categoryContainerStyle = useMemo(() => {
    const hasError = errorFields?.includes('category');

    return {
      marginTop: spacing.md,
      backgroundColor: colors.surfaceContainer,
      borderColor: hasError ? colors.error : 'transparent',
      borderWidth: hasError ? 1 : 0,
    };
  }, [colors, errorFields]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[
        gs.fullFlex,
        {
          paddingTop: top,
        },
      ]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={style.scrollViewContent}
      >
        <View style={[gs.flexRow, gs.itemsCenter, style.header]}>
          <View
            style={[gs.flexRow, gs.itemsCenter, gs.fullFlex, style.headerLeft]}
          >
            <PressableWithFeedback onPress={navigation.goBack}>
              <Icon
                source="arrow-left"
                size={ICON_SIZE}
                color={colors.onSurface}
              />
            </PressableWithFeedback>
            <Text style={[gs.fontBold, style.headerTitle]}>
              {t('add.addTransaction')}
            </Text>
          </View>
        </View>

        <View
          style={[
            {
              marginTop: spacing.sm,
            },
          ]}
        >
          <TransactionTypeSwitch
            type={form.type}
            onChange={type => updateField('type', type)}
          />
        </View>
        {/*amount input*/}
        <PressableWithFeedback onPress={handleAmountInputPresent}>
          <View
            style={[
              style.amountInputContainer,
              {
                borderColor: errorFields.includes('amount')
                  ? colors.error
                  : colors.outline,
              },
            ]}
          >
            <AppText.Regular
              style={[
                gs.fullFlex,
                {
                  fontSize: textSize.md,
                  color: colors.onSurfaceVariant,
                },
              ]}
            >
              {t('common.amount')}
            </AppText.Regular>

            <AppText.SemiBold style={style.textInput}>
              {getFormattedAmount(
                form.amountInput ? parseFloat(form.amountInput) : 0,
              )}
            </AppText.SemiBold>
          </View>
        </PressableWithFeedback>
        {/*Category selection*/}
        <PressableWithFeedback onPress={() => setRenderCategoryList(true)}>
          <View
            style={[{ ...categoryContainerStyle }, style.categoryContainer]}
          >
            <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
              <Icon
                source={'shape'}
                size={textSize.md}
                color={colors.onSurfaceDisabled}
              />
              <View style={[gs.flexRow, gs.fullFlex]}>
                <AppText.Regular
                  style={[
                    gs.fullFlex,
                    {
                      fontSize: textSize.md,
                      color: colors.onSurfaceDisabled,
                    },
                  ]}
                >
                  {t('add.category')}
                </AppText.Regular>
              </View>
            </View>
            <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
              <AppText.Regular
                style={[
                  gs.fullFlex,
                  style.categoryText,
                  {
                    color: errorFields?.some(f => f === 'category')
                      ? colors.error
                      : colors.onSurface,
                  },
                ]}
              >
                {selectedCategory?.name ?? t('add.selectCategory')}
              </AppText.Regular>
              <Icon
                color={colors.onSurface}
                source="chevron-right"
                size={textSize.lg}
              />
            </View>
          </View>
        </PressableWithFeedback>
        {/*Wallet selection*/}
        <PressableWithFeedback onPress={() => handlePresentModalPress()}>
          <View
            style={[
              {
                marginTop: spacing.md,

                backgroundColor: colors.surfaceContainer,
              },
              style.categoryContainer,
            ]}
          >
            <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
              <Icon
                color={colors.onSurfaceDisabled}
                source={'wallet'}
                size={textSize.md}
              />
              <View style={[gs.flexRow, gs.fullFlex]}>
                <AppText.Regular
                  style={[
                    gs.fullFlex,
                    {
                      fontSize: textSize.md,
                      color: colors.onSurfaceDisabled,
                    },
                  ]}
                >
                  {t('add.wallet')}
                </AppText.Regular>
                {errorFields?.some(f => f === 'wallet') && (
                  <AppText.Thin
                    style={[
                      {
                        fontSize: textSize.sm,
                        color: colors.error,
                      },
                    ]}
                  >
                    {t('add.required')}
                  </AppText.Thin>
                )}
              </View>
            </View>
            <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
              <AppText.Regular
                style={[
                  gs.fullFlex,
                  style.categoryText,
                  {
                    color: colors.onBackground,
                  },
                ]}
              >
                {selectedWallet?.name ?? 'Select a wallet'}
              </AppText.Regular>
              <Icon
                color={colors.onSurface}
                source="chevron-right"
                size={textSize.lg}
              />
            </View>
          </View>
        </PressableWithFeedback>

        <View
          style={[
            // gs.flexRow,
            {
              gap: spacing.md,
            },
          ]}
        >
          {/*Date and time selection*/}
          <View
            style={[
              gs.flexRow,
              gs.itemsCenter,
              {
                marginTop: spacing.md,
                gap: spacing.md,
              },
            ]}
          >
            <PressableWithFeedback
              onPress={() => setOpenDatePicker(true)}
              style={[
                gs.fullFlex,
                {
                  backgroundColor: colors.surfaceContainer,
                },
                style.categoryContainer,
              ]}
            >
              <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
                <Icon
                  color={colors.onSurfaceDisabled}
                  source="calendar"
                  size={textSize.md}
                />
                <AppText.Regular
                  style={[
                    {
                      color: colors.onSurfaceDisabled,
                      fontSize: textSize.md,
                    },
                  ]}
                >
                  Date
                </AppText.Regular>
              </View>
              <AppText.Regular
                style={[
                  {
                    color: colors.onSurface,
                    fontSize: textSize.md,
                  },
                ]}
              >
                {format(mergedDate ?? new Date(), DATE_FORMAT).toUpperCase()}
              </AppText.Regular>
            </PressableWithFeedback>
            <PressableWithFeedback
              onPress={() => setOpenTimePicker(true)}
              style={[
                gs.fullFlex,
                {
                  backgroundColor: colors.surfaceContainer,
                },
                style.categoryContainer,
              ]}
            >
              <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
                <Icon
                  color={colors.onSurfaceDisabled}
                  source="clock"
                  size={textSize.md}
                />

                <AppText.Regular
                  style={[
                    {
                      color: colors.onSurfaceDisabled,
                      fontSize: textSize.md,
                    },
                  ]}
                >
                  Time
                </AppText.Regular>
              </View>
              <AppText.Regular
                style={[
                  {
                    color: colors.onSurface,
                    fontSize: textSize.md,
                  },
                ]}
              >
                {format(mergedDate ?? new Date(), 'hh:mm aa').toUpperCase()}
              </AppText.Regular>
            </PressableWithFeedback>
          </View>
        </View>

        <TextInput
          value={form.description}
          onChangeText={text => updateField('description', text)}
          placeholder={t('add.additional')}
          multiline
          style={style.descBox}
        />
      </ScrollView>

      <FAB icon="check" style={style.fab} onPress={saveTransaction} />

      <DatePickerModal
        locale="en"
        visible={openDatePicker}
        mode="single"
        date={form.date}
        onDismiss={() => setOpenDatePicker(false)}
        onConfirm={({ date }) => {
          updateField('date', date);
          setOpenDatePicker(false);
        }}
      />

      <TimePickerModal
        visible={openTimePicker}
        hours={form.time.hours}
        minutes={form.time.minutes}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={value => {
          updateField('time', value);

          setOpenTimePicker(false);
        }}
      />

      <CategorySelectionModal
        visible={renderCategoryList}
        allowMultiple={false}
        selectedCategory={form.categoryId}
        onClose={() => setRenderCategoryList(false)}
        selectCategory={id => {
          clearError('category');

          updateField('categoryId', id);
        }}
      />

      <WalletSelectionModal
        handleSheetChanges={handleSheetChanges}
        selectedWalletId={form.walletId}
        onWalletChange={id => {
          clearError('wallet');

          updateField('walletId', id);
        }}
        ref={bottomSheetModalRef}
      />

      <AmountInputBoard
        ref={amountInputSheetRef}
        handleSheetChanges={handleAmountSheetChange}
        amountInput={form.amountInput}
        setAmountInput={text => {
          clearError('amount');

          updateField('amountInput', text);
        }}
      />
    </KeyboardAvoidingView>
  );
};
export default AddTransaction;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    scrollViewContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: 50,
    },
    header: {
      paddingVertical: spacing.sm,
    },
    headerLeft: {
      gap: spacing.sm,
    },
    headerTitle: {
      fontSize: textSize.lg,
      color: colors.onSurface,
    },
    transactionTypeContainer: {
      flexDirection: 'row',
      gap: spacing.lg,
      marginTop: spacing.md,
    },
    tractionTypeButton: {
      width: 100,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    },
    pill: {
      borderWidth: 1,
      borderRadius: borderRadius.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
    },
    amountInputContainer: {
      marginTop: spacing.md,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      paddingLeft: spacing.sm,
      paddingTop: spacing.xs,
    },
    textInput: {
      fontSize: textSize.lg,
      paddingVertical: spacing.sm,
      color: colors.onBackground,
    },
    categoryContainer: {
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.sm,
    },
    categoryText: {
      fontSize: textSize.lg,
    },

    dateAttachmentContainer: {
      gap: spacing.lg,
    },
    dateButton: {
      marginTop: spacing.lg,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
      flex: 2,
    },
    dateTextContainer: {
      gap: spacing.md,
    },
    dateText: {
      fontSize: textSize.md,
    },
    attachmentButton: {
      marginTop: spacing.lg,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
    },
    attachmentContainer: {
      marginTop: spacing.xs,
      paddingVertical: spacing.sm,
    },
    descBox: {
      marginTop: spacing.lg,
      paddingVertical: spacing.sm,
      minHeight: 100,
      borderWidth: 1,
      textAlignVertical: 'top',
      borderRadius: borderRadius.md,
      paddingLeft: spacing.sm,
      fontSize: textSize.md,
      borderColor: colors.outlineVariant,
      color: colors.onSurface,
      fontFamily: fontsMap.Regular,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 5,
      bottom: 40,
    },
    cameraToolbar: {
      bottom: 0,
      height: 200,
      position: 'absolute',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
  });
