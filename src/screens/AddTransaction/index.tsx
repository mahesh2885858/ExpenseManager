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
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Avatar, FAB, Icon, TextInput, Tooltip } from 'react-native-paper';
import {
  DatePickerModal,
  DatePickerModalSingleProps,
  TimePickerModal,
} from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

import { keepLocalCopy, pick, types } from '@react-native-documents/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { v4 as uuid } from 'uuid';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { DEFAULT_CATEGORY_ID, gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import CategorySelectionModal from '../../components/organisms/CategorySelectionModal';
import useAccountStore from '../../stores/accountsStore';
import useTransactionsStore from '../../stores/transactionsStore';
import {
  TAttachment,
  TRootStackParamList,
  TTransactionType,
} from '../../types';
import RenderAttachment from './RenderAttachment';

const DATE_FORMAT = 'MMM do';
const CURRENCY_SYMBOL = '₹';
const AVATAR_SIZE = 40;
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
  const categories = useTransactionsStore(state => state.categories);
  const addTransaction = useTransactionsStore(state => state.addTransaction);
  const updateTransaction = useTransactionsStore(
    state => state.updateTransaction,
  );
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);

  const initData: {
    type: TTransactionType;
    amountInput: string;
    date: CalendarDate;
    desc: string;
    attachments: TAttachment[];
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
        attachments: [],
        selectedCatId: DEFAULT_CATEGORY_ID,
        time: {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
        },
      };
    }
  }, [route]);

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
  const [kbHeight, setKbHeight] = useState(0);
  const [categoryModal, setCategoryModal] = useState(false);

  // Handlers
  const changeTransactionType = (type: TTransactionType) => {
    setTransactionType(type);
  };

  const onDismissSingle = useCallback(() => {
    setOpenDatePicker(false);
  }, [setOpenDatePicker]);

  const onConfirmSingle: DatePickerModalSingleProps['onConfirm'] = useCallback(
    params => {
      setDate(params.date);
      setOpenTimePicker(true);
    },
    [setOpenTimePicker, setDate],
  );

  const dateToRender = useMemo(() => {
    date?.setHours(time.hours);
    date?.setMinutes(time.minutes);
    return date;
  }, [date, time]);

  const getTransactionTypeButtonStyle = (type: TTransactionType) => [
    gs.centerItems,
    gs.fullFlex,
    style.pill,
    {
      borderColor: colors.onBackground,
      backgroundColor:
        transactionType === type ? colors.primary : colors.background,
    },
  ];

  const getTransactionTypeTextStyle = (type: TTransactionType) => [
    gs.fontBold,
    {
      fontSize: textSize.lg,
      color: transactionType === type ? colors.onPrimary : colors.onBackground,
    },
  ];

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
      const selectedAccountId = getSelectedAccount().id;
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
        addTransaction({
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

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => {
      setKbHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKbHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

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
          <Avatar.Text
            label="M"
            size={AVATAR_SIZE}
            style={{ backgroundColor: colors.primaryContainer }}
          />
        </View>

        {/* Transaction Type */}
        <View style={style.transactionTypeContainer}>
          <PressableWithFeedback
            onPress={() => changeTransactionType('expense')}
            style={getTransactionTypeButtonStyle('expense')}
          >
            <Text style={getTransactionTypeTextStyle('expense')}>Expense</Text>
          </PressableWithFeedback>
          <PressableWithFeedback
            onPress={() => changeTransactionType('income')}
            style={getTransactionTypeButtonStyle('income')}
          >
            <Text style={getTransactionTypeTextStyle('income')}>Income</Text>
          </PressableWithFeedback>
        </View>

        {/* Amount Input */}
        <View style={style.amountInputContainer}>
          <TextInput
            autoFocus
            onChangeText={setAmountInput}
            value={amountInput}
            outlineColor={colors.onSurfaceDisabled}
            mode="outlined"
            autoFocus
            placeholder="Amount"
            keyboardType="numeric"
            left={<TextInput.Affix text={CURRENCY_SYMBOL} />}
            style={style.textInput}
            placeholderTextColor={colors.onSurfaceDisabled}
          />
        </View>

        {/* Category Selection */}
        <PressableWithFeedback
          style={[
            style.categoryContainer,
            gs.flexRow,
            gs.itemsCenter,
            gs.justifyBetween,
            {
              borderColor: colors.onSurfaceDisabled,
            },
          ]}
          onPress={() => setCategoryModal(true)}
        >
          <Text
            style={[
              style.categoryText,
              {
                color: colors.onBackground,
              },
            ]}
          >
            {categories.filter(c => c.id === selectedCategoryId)[0].name ?? ''}
          </Text>
          <Icon size={textSize.lg} source="chevron-down" />
        </PressableWithFeedback>

        {/* Date and Attachment Selection */}
        <View style={[gs.flexRow, style.dateAttachmentContainer]}>
          <PressableWithFeedback
            onPress={() => setOpenDatePicker(true)}
            style={[
              gs.flexRow,
              gs.centerItems,
              style.dateButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Icon
              source="calendar-range"
              size={ICON_SIZE}
              color={colors.onPrimary}
            />
            <View
              style={[
                gs.centerItems,
                gs.fullFlex,
                gs.flexRow,
                style.dateTextContainer,
              ]}
            >
              <Text
                style={[
                  gs.fontBold,
                  style.dateText,
                  { color: colors.onPrimary },
                ]}
              >
                {format(dateToRender ?? new Date(), DATE_FORMAT)}
              </Text>
            </View>
          </PressableWithFeedback>

          <Tooltip title="Add Bill/invoice etc">
            <PressableWithFeedback
              onPress={pickFiles}
              style={[
                gs.flexRow,
                gs.centerItems,
                style.attachmentButton,
                gs.fullFlex,
                { backgroundColor: colors.primary },
              ]}
            >
              <Icon
                source="paperclip"
                size={ICON_SIZE}
                color={colors.onPrimary}
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
                { backgroundColor: colors.primary },
              ]}
            >
              <Icon source="camera" size={ICON_SIZE} color={colors.onPrimary} />
            </PressableWithFeedback>
          </Tooltip>
        </View>
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
            <View
              style={[
                style.attachmentContainer,
                {
                  borderColor: colors.onSurfaceDisabled,
                },
              ]}
            >
              <FlatList
                contentContainerStyle={{
                  gap: spacing.lg,
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
          mode="outlined"
          outlineColor={colors.onSurfaceDisabled}
          style={[{ marginTop: spacing.lg, paddingVertical: spacing.sm }]}
          placeholder="Description"
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
          saveLabel="Next"
        />

        {/* Time Picker Modal */}
        <TimePickerModal
          visible={openTimePicker}
          onDismiss={() => setOpenTimePicker(false)}
          onConfirm={value => {
            setTime(value);
            setOpenTimePicker(false);
            setOpenDatePicker(false);
          }}
          hours={12}
          minutes={0}
        />
      </ScrollView>
      {amountInput && !isNaN(parseInt(amountInput, 10)) && (
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
      {categoryModal && (
        <CategorySelectionModal
          visible={categoryModal}
          onClose={() => setCategoryModal(false)}
          selectCategory={id => {
            setSelectedCategoryId(id);
          }}
          selectedCategory={selectedCategoryId}
        />
      )}
    </KeyboardAvoidingView>
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
    marginTop: spacing.xs,
  },
  pill: {
    borderWidth: 1,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  amountInputContainer: {
    marginTop: spacing.lg,
  },
  textInput: {
    borderRadius: borderRadius.lg,
    fontSize: textSize.lg,
  },
  categoryContainer: {
    gap: spacing.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.sm,
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
    padding: spacing.sm,
    borderWidth: 1,
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
});
