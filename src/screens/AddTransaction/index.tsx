import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Linking,
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

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { keepLocalCopy, pick, types } from '@react-native-documents/picker';
import { uCFirst } from 'commonutil-core';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  SlideInDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { v4 as uuid } from 'uuid';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AccountSelectionModal from '../../components/organisms/AccountSelectionModal';
import CategorySelectionModal from '../../components/organisms/CategorySelectionModal';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import useGetKeyboardHeight from '../../hooks/useGetKeyboardHeight';
import useAccountStore from '../../stores/accountsStore';
import useTransactionsStore from '../../stores/transactionsStore';
import {
  TAttachment,
  TRootStackParamList,
  TTransactionType,
} from '../../types';
import RenderAttachment from './RenderAttachment';
import useTransactions from '../../hooks/useTransactions';
const DATE_FORMAT = 'dd MMM yyyy';
const CURRENCY_SYMBOL = '₹';
const ICON_SIZE = 24;

const renderAttachment = (
  prop: TAttachment,
  removeFile: (filePath: string) => void,
) => <RenderAttachment attachment={prop} removeFile={removeFile} />;

const AddTransaction = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [renderCamera, setRenderCamera] = useState(false);
  const route = useRoute<RouteProp<TRootStackParamList, 'AddTransaction'>>();
  const { categories, defaultCategoryId } = useCategories();
  const { addNewTransaction } = useTransactions({});
  const updateTransaction = useTransactionsStore(
    state => state.updateTransaction,
  );
  const accounts = useAccountStore(state => state.accounts);

  const initData: {
    type: TTransactionType;
    amountInput: string;
    date: CalendarDate;
    desc: string;
    attachments: TAttachment[];
    accountId: string;
    selectedCatId: string;
    time: {
      hours: number;
      minutes: number;
    };
  } = useMemo(() => {
    if (route.params.mode === 'edit') {
      const tr = route.params.transaction;
      return {
        type: tr.type,
        amountInput: String(tr.amount),
        date: new Date(tr.transactionDate),
        desc: tr.description ?? '',
        attachments: tr.attachments ?? [],
        selectedCatId: tr.categoryIds[0],
        accountId: tr.accountId,
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
        accountId: '',

        attachments: [],
        selectedCatId: defaultCategoryId,
        time: {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
        },
      };
    }
  }, [route, defaultCategoryId]);

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
  const [attachments, setAttachments] = useState<TAttachment[]>(
    initData.attachments,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initData.selectedCatId,
  );
  const { kbHeight } = useGetKeyboardHeight();
  const [accountId, setAccountId] = useState(initData.accountId);
  const progress = useSharedValue(0);
  // Handlers
  const changeTransactionType = (type: TTransactionType) => {
    setTransactionType(type);
  };

  const selectedAcc = useMemo(() => {
    if (accountId.trim().length <= 0) {
      return null;
    } else {
      const selectedAccount = accounts.filter(acc => acc.id === accountId);
      return selectedAccount[0] ?? null;
    }
  }, [accountId, accounts]);

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

  const pickFiles = async () => {
    try {
      const filesWithLocalUri: TAttachment[] = [];
      const PickedFiles = await pick({
        allowMultiSelection: true,
        type: [types.images, types.pdf],
      });
      console.log({ selectedFiles: PickedFiles });
      const validFiles = PickedFiles.filter(f => !!f.uri);
      const copied = await keepLocalCopy({
        destination: 'documentDirectory',
        // @ts-expect-error: i don't know why it is throwing error
        files: validFiles.map(f => ({
          fileName: f.name ?? 'file',
          uri: f.uri,
        })),
      });
      copied.forEach((file, i) => {
        if (file.status === 'error') {
          console.log('error while copying: ', file.copyError);
        } else {
          filesWithLocalUri.push({
            extension: validFiles[i].nativeType ?? '',
            name: validFiles[i].name ?? '',
            path: file.localUri,
            size: validFiles[i].size ?? 0,
          });
        }
      });
      console.log({ filesWithLocalUri });
      setAttachments(filesWithLocalUri);
    } catch (error) {
      console.log({ errorWhilePickingFiles: error });
    }
  };

  const removeFile = (filePath: string) => {
    const files = attachments.filter(f => f.path !== filePath);
    setAttachments(files);
  };

  const onCameraPress = async () => {
    if (hasPermission) {
      if (!device) {
        console.log('No device found');
      }
      setRenderCamera(true);
    } else {
      const result = await requestPermission();
      if (result) {
        if (!device) {
          console.log('No device found');
        }
        setRenderCamera(true);
      } else {
        console.log('Camera permission denied');
        Linking.openSettings();
      }
    }
  };

  const saveTransaction = () => {
    try {
      const id =
        route.params.mode === 'edit' ? route.params.transaction.id : uuid();
      if (!selectedAcc) {
        console.log('No account selected');
        return;
      }
      const selectedAccountId = selectedAcc.id;
      const amount = parseFloat(amountInput);
      const dateToAdd = date ?? new Date();
      dateToAdd?.setHours(time.hours);
      dateToAdd?.setMinutes(time.minutes);
      if (route.params.mode === 'edit') {
        updateTransaction(route.params.transaction.id, {
          ...route.params.transaction,
          amount,
          categoryIds: [selectedCategoryId],
          transactionDate: dateToAdd.toISOString(),
          type: transactionType,
          attachments: attachments,
          description: desc,
        });
      } else {
        addNewTransaction({
          accountId: selectedAccountId,
          amount,
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

  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.error, colors.success],
      ),
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        [colors.onError, colors.onSuccess],
      ),
    };
  });

  useEffect(() => {
    progress.value = withTiming(transactionType === 'expense' ? 0 : 1, {
      duration: 250,
    });
  }, [transactionType, progress]);

  return (
    <GestureHandlerRootView style={[gs.fullFlex]}>
      <BottomSheetModalProvider>
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
                style={[
                  gs.flexRow,
                  gs.itemsCenter,
                  gs.fullFlex,
                  style.headerLeft,
                ]}
              >
                <PressableWithFeedback onPress={navigation.goBack}>
                  <Icon source="arrow-left" size={ICON_SIZE} />
                </PressableWithFeedback>
                <Text
                  style={[
                    gs.fontBold,
                    style.headerTitle,
                    { color: colors.onBackground },
                  ]}
                >
                  Add Transaction
                </Text>
              </View>
              <Animated.View
                style={[style.tractionTypeButton, animatedBgStyle]}
              >
                <PressableWithFeedback
                  onPress={() =>
                    changeTransactionType(
                      transactionType === 'expense' ? 'income' : 'expense',
                    )
                  }
                  style={[gs.overflowHide]}
                >
                  <Animated.Text
                    key={transactionType}
                    entering={SlideInDown.duration(300)}
                    exiting={SlideOutUp.duration(1000)}
                    style={[
                      {
                        fontSize: textSize.md,
                      },
                      gs.centerText,
                      animatedTextStyle,
                    ]}
                  >
                    {uCFirst(transactionType)}
                  </Animated.Text>
                </PressableWithFeedback>
              </Animated.View>
            </View>

            {/* Amount Input */}
            <View
              style={[
                style.amountInputContainer,
                {
                  borderColor: colors.onSurfaceDisabled,
                },
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: textSize.md,
                    color: colors.onSurfaceDisabled,
                  },
                ]}
              >
                Amount
              </Text>
              <TextInput
                onChangeText={setAmountInput}
                value={amountInput}
                autoFocus
                placeholder={CURRENCY_SYMBOL + '0.00'}
                keyboardType="numeric"
                style={[
                  style.textInput,
                  {
                    color: colors.onBackground,
                  },
                ]}
                placeholderTextColor={colors.onSurfaceDisabled}
              />
            </View>

            {/* Category Selection */}
            <PressableWithFeedback onPress={() => handlePresentCategories()}>
              <View
                style={[
                  {
                    marginTop: spacing.md,

                    borderColor: colors.onSurfaceDisabled,
                  },
                  style.categoryContainer,
                ]}
              >
                <Text
                  style={[
                    {
                      fontSize: textSize.md,
                      color: colors.onSurfaceDisabled,
                    },
                  ]}
                >
                  Category
                </Text>
                <Text
                  style={[
                    style.categoryText,
                    {
                      color: colors.onBackground,
                    },
                  ]}
                >
                  {categories.filter(c => c.id === selectedCategoryId)[0]
                    ?.name ?? ''}
                </Text>
              </View>
            </PressableWithFeedback>
            {/* Account section */}
            <PressableWithFeedback onPress={() => handlePresentModalPress()}>
              <View
                style={[
                  {
                    marginTop: spacing.md,

                    borderColor: colors.onSurfaceDisabled,
                  },
                  style.categoryContainer,
                ]}
              >
                <Text
                  style={[
                    {
                      fontSize: textSize.md,
                      color: colors.onSurfaceDisabled,
                    },
                  ]}
                >
                  Account
                </Text>
                <Text
                  style={[
                    style.categoryText,
                    {
                      color: colors.onBackground,
                    },
                  ]}
                >
                  {selectedAcc?.name ?? 'Select an account'}
                </Text>
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
                    borderColor: colors.onSurfaceDisabled,
                  },
                  style.categoryContainer,
                ]}
              >
                <Text
                  style={[
                    {
                      color: colors.onSurfaceDisabled,
                      fontSize: textSize.md,
                    },
                  ]}
                >
                  Date
                </Text>
                <Text
                  style={[
                    {
                      color: colors.onBackground,
                      fontSize: textSize.md,
                    },
                  ]}
                >
                  {format(
                    dateToRender ?? new Date(),
                    DATE_FORMAT,
                  ).toUpperCase()}
                </Text>
              </PressableWithFeedback>
              <PressableWithFeedback
                onPress={() => setOpenTimePicker(true)}
                style={[
                  gs.fullFlex,
                  {
                    borderColor: colors.onSurfaceDisabled,
                  },
                  style.categoryContainer,
                ]}
              >
                <Text
                  style={[
                    {
                      color: colors.onSurfaceDisabled,
                      fontSize: textSize.md,
                    },
                  ]}
                >
                  Time
                </Text>
                <Text
                  style={[
                    {
                      color: colors.onBackground,
                      fontSize: textSize.md,
                    },
                  ]}
                >
                  {format(dateToRender ?? new Date(), 'hh:mm aa').toUpperCase()}
                </Text>
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

            {/* Todo: Attachments list section */}
            {attachments.length > 0 && (
              <View
                style={[
                  {
                    marginTop: spacing.lg,
                  },
                ]}
              >
                <Text
                  style={[
                    gs.fontBold,
                    {
                      fontSize: textSize.md,
                      color: colors.onBackground,
                    },
                  ]}
                >
                  Attachments
                </Text>
                <View style={[style.attachmentContainer]}>
                  <FlatList
                    contentContainerStyle={{
                      gap: spacing.md,
                    }}
                    horizontal
                    data={attachments}
                    renderItem={item => renderAttachment(item.item, removeFile)}
                    keyExtractor={item => item.path}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            )}

            {/* Description section */}
            <TextInput
              style={[
                style.descBox,
                {
                  borderColor: colors.onSurfaceDisabled,
                  color: colors.onBackground,
                },
              ]}
              placeholder="Additional details"
              multiline
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
              hours={12}
              minutes={0}
            />
          </ScrollView>
          {amountInput &&
            !isNaN(parseInt(amountInput, 10)) &&
            !!selectedAcc && (
              <FAB
                icon="check"
                style={[
                  style.fab,
                  {
                    bottom: kbHeight + 20,
                  },
                ]}
                onPress={saveTransaction}
              />
            )}
          {renderCamera && device && (
            <View style={[StyleSheet.absoluteFill]}>
              <Camera
                style={StyleSheet.absoluteFill}
                ref={camera}
                photo
                device={device}
                isActive={renderCamera}
              />
              <View style={style.cameraToolbar}>
                <PressableWithFeedback
                  onPress={async () => {
                    const file = await camera.current?.takePhoto({});
                    const result = await fetch(`file://${file.path}`);
                    const photo = await result.blob();
                    console.log({ photo, file, result });
                    const copied = await keepLocalCopy({
                      destination: 'documentDirectory',
                      files: [
                        {
                          fileName: 'file.jpeg',
                          uri: result.url,
                        },
                      ],
                    });
                    copied.forEach(file => {
                      if (file.status === 'error') {
                        console.log('error while copying: ', file.copyError);
                      } else {
                        console.log({ file });
                        setAttachments([
                          {
                            extension: 'image/jpeg',
                            name: 'file.jpeg',
                            path: file.localUri,
                            size: 100,
                          },
                        ]);
                      }
                    });

                    setRenderCamera(false);
                  }}
                >
                  <Icon source={'radiobox-marked'} size={70} />
                </PressableWithFeedback>
              </View>
            </View>
          )}
          <CategorySelectionModal
            handleSheetChanges={handleCategorySheetChanges}
            ref={categoryBtmSheet}
            selectCategory={id => {
              setSelectedCategoryId(id);
            }}
            selectedCategory={selectedCategoryId}
          />
          <AccountSelectionModal
            onAccountChange={id => {
              setAccountId(id);
            }}
            handleSheetChanges={handleSheetChanges}
            ref={bottomSheetModalRef}
            selectedAccountId={accountId}
          />
        </KeyboardAvoidingView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default AddTransaction;

const style = StyleSheet.create({
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
    marginTop: spacing.lg,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingLeft: spacing.sm,
    paddingTop: spacing.sm,
  },
  textInput: {
    fontSize: textSize.lg,
  },
  categoryContainer: {
    gap: spacing.sm,
    borderWidth: 1,
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
