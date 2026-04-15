import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FAB, Icon } from 'react-native-paper';
import {
  DatePickerModal,
  DatePickerModalSingleProps,
  TimePickerModal,
} from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

import { useSharedValue, withTiming } from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

import { v4 as uuid } from 'uuid';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs, MAX_DESCRIPTION_LIMIT } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AmountInputBoard from '../../components/organisms/AmountInputBoard';
import CategorySelectionModal from '../../components/organisms/CategorySelectionModal';
import TransactionTypeSwitch from '../../components/organisms/TransactionTypeSwitch';
import WalletSelectionModal from '../../components/organisms/WalletSelectionModal';
import useWallets from '../../hooks/useAccounts';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import useGetKeyboardHeight from '../../hooks/useGetKeyboardHeight';
import useTransactions from '../../hooks/useTransactions';
import {
  TAttachment,
  TRootStackParamList,
  TTransaction,
  TTransactionType,
  TWallet,
} from '../../types';
import { useTranslation } from 'react-i18next';
import AppText from '../../components/molecules/AppText';
const DATE_FORMAT = 'dd MMM yyyy';
const ICON_SIZE = 24;

type TValidatedInputs = {
  selectedWallet: TWallet;
  selectedCategoryId: string;
  amount: number;
};

const AddTransaction = () => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const insets = useSafeAreaInsets();
  const style = createStyles(colors, insets);
  const route = useRoute<RouteProp<TRootStackParamList, 'AddTransaction'>>();
  const { categories, defaultCategoryId } = useCategories();
  const { addNewTransaction, getFormattedAmount, updateATransaction } =
    useTransactions({});

  const { wallets, defaultWalletId } = useWallets();

  const initData: {
    type: TTransactionType;
    amountInput: string;
    date: CalendarDate;
    desc: string;
    attachments: TAttachment[];
    walletId: string;
    selectedCatId: string | null;
    time: {
      hours: number;
      minutes: number;
    };
  } = useMemo(() => {
    if (route.params.mode === 'edit') {
      const tr = route.params.transaction;
      return {
        type: tr.type,
        amountInput: tr.amount.toString(),
        date: new Date(tr.transactionDate),
        desc: tr.description ?? '',
        attachments: tr.attachments ?? [],
        selectedCatId: tr.categoryIds[0],
        walletId: tr.walletId,
        time: {
          hours: new Date(tr.transactionDate).getHours(),
          minutes: new Date(tr.transactionDate).getMinutes(),
        },
      };
    } else {
      return {
        type: route.params.type
          ? route.params.type === 'EXPENSE'
            ? 'expense'
            : 'income'
          : 'expense',
        amountInput: '',
        date: new Date(),
        desc: '',
        walletId: defaultWalletId,

        attachments: [],
        selectedCatId:
          categories.length === 1
            ? categories[0]?.id ?? defaultCategoryId
            : defaultCategoryId
            ? defaultCategoryId
            : null,
        time: {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
        },
      };
    }
  }, [route, defaultWalletId, categories, defaultCategoryId]);

  // State
  const [transactionType, setTransactionType] = useState<TTransactionType>(
    initData.type,
  );
  const [amountInput, setAmountInput] = useState(initData.amountInput);
  const [date, setDate] = useState<CalendarDate>(initData.date);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [time, setTime] = useState<{ hours: number; minutes: number }>(
    initData.time,
  );
  const [desc, setDesc] = useState(initData.desc);
  const [attachments] = useState<TAttachment[]>(initData.attachments);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initData.selectedCatId,
  );
  const { kbHeight } = useGetKeyboardHeight();
  const [walletId, setWalletId] = useState(initData.walletId);
  const [errorFields, setErrorFields] = useState<Array<
    'amount' | 'wallet' | 'category' | 'date' | 'time'
  > | null>(null);

  const progress = useSharedValue(0);

  const selectedWallet = useMemo(() => {
    if (walletId.trim().length <= 0) {
      return null;
    } else {
      const fitleredWallets = wallets.filter(wallet => wallet.id === walletId);
      return fitleredWallets[0] ?? null;
    }
  }, [walletId, wallets]);

  const onDismissSingle = useCallback(() => {
    setOpenDatePicker(false);
  }, [setOpenDatePicker]);

  const onConfirmSingle: DatePickerModalSingleProps['onConfirm'] = useCallback(
    params => {
      setDate(params.date);
      setOpenDatePicker(false);
    },
    [setDate],
  );

  const dateToRender = useMemo(() => {
    date?.setHours(time.hours);
    date?.setMinutes(time.minutes);
    return date;
  }, [date, time]);

  const validateInputs = () => {
    const errors: typeof errorFields = [];
    let amount = 0;
    if (!selectedWallet) {
      errors.push('wallet');
    }
    if (!selectedCategoryId) {
      errors.push('category');
    }

    if (amountInput.trim().length === 0) {
      errors.push('amount');
    } else {
      amount = parseFloat(amountInput);

      if (amount <= 0) {
        errors.push('amount');
      }
    }

    if (errors.length > 0) {
      setErrorFields(errors);
      return null;
    } else {
      return {
        selectedWallet,
        selectedCategoryId,
        amount,
      } satisfies TValidatedInputs;
    }
  };

  const saveTransaction = () => {
    try {
      const id =
        route.params.mode === 'edit' ? route.params.transaction.id : uuid();

      const result = validateInputs();
      if (!result) return;

      const selectedWalletId = result?.selectedWallet?.id;

      const dateToAdd = date ?? new Date();
      dateToAdd?.setHours(time.hours);
      dateToAdd?.setMinutes(time.minutes);
      if (route.params.mode === 'edit') {
        const original = route.params.transaction;
        const updated: TTransaction = {
          ...route.params.transaction,
          amount: result.amount,
          categoryIds: [selectedCategoryId],
          transactionDate: dateToAdd.toISOString(),
          type: transactionType,
          attachments: attachments,
          description: desc,
        };
        updateATransaction(route.params.transaction.id, updated, original);
      } else {
        addNewTransaction({
          walletId: selectedWalletId,
          amount: result.amount,
          categoryIds: [selectedCategoryId],
          createdAt: new Date().toISOString(),
          transactionDate: dateToAdd.toISOString(),
          id,
          type: transactionType,
          attachments: attachments,
          description: desc,
        });
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainBottomTabs' }],
      });
    } catch (e: any) {
      console.log(
        'Error while saving a transaction: ',
        e?.message ?? String(e),
      );
    }
  };

  const {
    btmShtRef: bottomSheetModalRef,
    handlePresent: handlePresentModalPress,
    handleSheetChange: handleSheetChanges,
  } = useBottomSheetModal();

  const {
    btmShtRef: categoryBtmSheet,
    handlePresent: handlePresentCategories,
    handleSheetChange: handleCategorySheetChanges,
  } = useBottomSheetModal();

  const {
    btmShtRef: amountInputSheetRef,
    handlePresent: handleAmountInputPresent,
    handleSheetChange: handleAmountSheetChange,
  } = useBottomSheetModal();

  const categoryContainerStyle = useMemo(() => {
    const hasError = errorFields?.includes('category');

    return {
      marginTop: spacing.md,
      backgroundColor: colors.surfaceContainer,
      borderColor: hasError ? colors.error : 'transparent',
      borderWidth: hasError ? 1 : 0,
    };
  }, [colors, errorFields]);

  useEffect(() => {
    progress.value = withTiming(transactionType === 'expense' ? 0 : 1, {
      duration: 250,
    });
  }, [transactionType, progress]);

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
        keyboardShouldPersistTaps
        contentContainerStyle={style.scrollViewContent}
      >
        {/* Header */}
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
            type={transactionType}
            onChange={setTransactionType}
          />
        </View>

        {/* Amount Input */}
        <PressableWithFeedback
          onPress={() => handleAmountInputPresent()}
          style={[
            style.amountInputContainer,
            {
              borderColor: errorFields?.some(f => f === 'amount')
                ? colors.error
                : colors.outline,
            },
          ]}
        >
          <View style={[gs.flexRow]}>
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
          </View>
          <AppText.SemiBold
            style={[
              style.textInput,
              {
                color: colors.onBackground,
              },
            ]}
          >
            {getFormattedAmount(
              amountInput.length > 0 ? parseFloat(amountInput) : 0,
            )}
          </AppText.SemiBold>
        </PressableWithFeedback>

        {/* Category Selection */}
        <PressableWithFeedback onPress={() => handlePresentCategories()}>
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
                {categories.filter(c => c.id === selectedCategoryId)[0]?.name ??
                  t('add.selectCategory')}
              </AppText.Regular>
              <Icon
                color={colors.onSurface}
                source="chevron-right"
                size={textSize.lg}
              />
            </View>
          </View>
        </PressableWithFeedback>
        {/* Wallet section */}
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

        {/* Date and time selection */}
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
              {format(dateToRender ?? new Date(), DATE_FORMAT).toUpperCase()}
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
              {format(dateToRender ?? new Date(), 'hh:mm aa').toUpperCase()}
            </AppText.Regular>
          </PressableWithFeedback>
        </View>

        {/* Date and Attachment Selection */}
        {/* <View style={[gs.flexRow, style.dateAttachmentContainer]}>
              <Tooltip title="Add Bill/invoice etc">
                <PressableWithFeedback
                  onPress={pickFiles}
                  style={[
                    gs.flexRow,
                    gs.centerItems,
                    style.attachmentButton,
                    gs.fullFlex,
                    { backgroundColor: colors.inversePrimary },
                  ]}
                >
                  <Icon
                    source="paperclip"
                    size={ICON_SIZE}
                    color={colors.onPrimaryContainer}
                  />
                </PressableWithFeedback>
              </Tooltip>
              <Tooltip title="Add Bill/invoice etc">
                <PressableWithFeedback
                  onPress={onCameraPress}
                  style={[
                    gs.flexRow,
                    gs.centerItems,
                    style.attachmentButton,
                    gs.fullFlex,
                    { backgroundColor: colors.inversePrimary },
                  ]}
                >
                  <Icon
                    source="camera"
                    size={ICON_SIZE}
                    color={colors.onPrimaryContainer}
                  />
                </PressableWithFeedback>
              </Tooltip>
            </View> */}

        {/* Description section */}
        <TextInput
          style={[style.descBox]}
          placeholder={t('add.additional')}
          multiline
          maxLength={MAX_DESCRIPTION_LIMIT}
          onChangeText={setDesc}
          value={desc}
          placeholderTextColor={colors.onSurfaceDisabled}
        />

        {/* Date Picker Modal */}
        <DatePickerModal
          label="Select transaction date"
          animationType="fade"
          presentationStyle="pageSheet"
          locale="en"
          mode="single"
          visible={openDatePicker}
          onDismiss={onDismissSingle}
          date={date}
          onConfirm={onConfirmSingle}
          saveLabel="Save"
        />

        {/* Time Picker Modal */}
        <TimePickerModal
          visible={openTimePicker}
          onDismiss={() => setOpenTimePicker(false)}
          onConfirm={value => {
            setTime(value);
            setOpenTimePicker(false);
          }}
          hours={time.hours}
          minutes={time.minutes}
        />
      </ScrollView>

      <FAB
        icon="check"
        color={colors.onPrimary}
        style={[
          style.fab,
          {
            bottom: kbHeight + 20,
            backgroundColor: colors.primary,
          },
        ]}
        onPress={saveTransaction}
      />

      <AmountInputBoard
        amountInput={amountInput}
        setAmountInput={text => {
          setErrorFields(p => (p ? p?.filter(f => f !== 'amount') : null));
          setAmountInput(text);
        }}
        handleSheetChanges={handleAmountSheetChange}
        ref={amountInputSheetRef}
      />

      <CategorySelectionModal
        handleSheetChanges={handleCategorySheetChanges}
        ref={categoryBtmSheet}
        selectCategory={id => {
          setSelectedCategoryId(id);
          setErrorFields(p => (!p ? p : p.filter(f => f !== 'category')));
        }}
        selectedCategory={selectedCategoryId}
      />
      <WalletSelectionModal
        onWalletChange={id => {
          setWalletId(id);
          setErrorFields(p => (!p ? p : p.filter(f => f !== 'wallet')));
        }}
        handleSheetChanges={handleSheetChanges}
        ref={bottomSheetModalRef}
        selectedWalletId={walletId}
      />
    </KeyboardAvoidingView>
  );
};

export default AddTransaction;

const createStyles = (colors: AppTheme['colors'], insets: EdgeInsets) =>
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
      fontFamily: 'PoppinsRegular',
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
