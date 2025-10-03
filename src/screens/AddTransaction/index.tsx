import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Avatar, FAB, Icon, TextInput, Tooltip } from 'react-native-paper';
import {
  DatePickerModal,
  DatePickerModalSingleProps,
  TimePickerModal,
} from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

import { keepLocalCopy, pick, types } from '@react-native-documents/picker';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { DEFAULT_CATEGORY_ID, gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import { TAttachment, TTransactionType } from '../../types';
import RenderAttachment from './RenderAttachment';
import useTransactionsStore from '../../stores/transactionsStore';
import { v4 as uuid } from 'uuid';
import useAccountStore from '../../stores/accountsStore';

const DATE_FORMAT = 'MMM do hh:mm a';
const CURRENCY_SYMBOL = '₹';
const AVATAR_SIZE = 40;
const ICON_SIZE = 30;

const renderAttachment = (
  prop: TAttachment,
  removeFile: (filePath: string) => void,
) => <RenderAttachment attachment={prop} removeFile={removeFile} />;

const AddTransaction = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const addCategory = useTransactionsStore(state => state.addCategory);
  const categories = useTransactionsStore(state => state.categories);
  const addTransaction = useTransactionsStore(state => state.addTransaction);
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);

  // animatedValues
  const iconRotation = useSharedValue(0);
  const categoryInputHeight = useSharedValue(0);
  const marginTop = useSharedValue(0);

  // State
  const [transactionType, setTransactionType] =
    useState<TTransactionType>('income');
  const [amountInput, setAmountInput] = useState('');
  const [date, setDate] = useState<CalendarDate>(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [time, setTime] = useState<{ hours: number; minutes: number }>({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  });
  const [desc, setDesc] = useState('');
  const [attachments, setAttachments] = useState<TAttachment[]>([]);
  const [openCategoryInput, setOpenCategoryInput] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(DEFAULT_CATEGORY_ID);

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const addNewCategory = () => {
    const id = uuid();
    addCategory({
      id,
      name: categoryInput.trim(),
    });
    setCategoryInput('');
    setOpenCategoryInput(false);
  };

  const addNewTransaction = () => {
    try {
      const id = uuid();
      const selectedAccountId = getSelectedAccount().id;
      const amount = parseInt(amountInput);
      const dateToAdd = date ?? new Date();
      dateToAdd?.setHours(time.hours);
      dateToAdd?.setMinutes(time.minutes);
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

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainBottomTabs' }],
      });
    } catch (e: any) {
      console.log(
        'Error while creating new transaction: ',
        e?.message ?? String(e),
      );
    }
  };

  useEffect(() => {
    if (openCategoryInput) {
      iconRotation.value = withTiming(45);
      categoryInputHeight.value = withTiming(60);
      marginTop.value = withTiming(spacing.lg);
    } else {
      iconRotation.value = withTiming(0);
      categoryInputHeight.value = withTiming(0);
      marginTop.value = withTiming(0);
    }
    return () => {
      iconRotation.value = withTiming(0);
      categoryInputHeight.value = withTiming(0);
      marginTop.value = withTiming(0);
    };
  }, [openCategoryInput, iconRotation, categoryInputHeight, marginTop]);

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
            onPress={() => changeTransactionType('income')}
            style={getTransactionTypeButtonStyle('income')}
          >
            <Text style={getTransactionTypeTextStyle('income')}>Income</Text>
          </PressableWithFeedback>
          <PressableWithFeedback
            onPress={() => changeTransactionType('expense')}
            style={getTransactionTypeButtonStyle('expense')}
          >
            <Text style={getTransactionTypeTextStyle('expense')}>Expense</Text>
          </PressableWithFeedback>
        </View>

        {/* Amount Input */}
        <View style={style.amountInputContainer}>
          <TextInput
            onChangeText={setAmountInput}
            value={amountInput}
            outlineColor={colors.onSurfaceDisabled}
            mode="outlined"
            placeholder="Amount"
            keyboardType="numeric"
            left={<TextInput.Affix text={CURRENCY_SYMBOL} />}
            style={style.textInput}
            placeholderTextColor={colors.onSurfaceDisabled}
          />
        </View>

        {/* Category Selection */}
        <View style={[style.categoryContainer, gs.flexRow]}>
          <Dropdown
            style={[
              gs.fullFlex,
              style.dropdown,
              {
                backgroundColor: colors.background,
                borderColor: colors.onSurfaceDisabled,
              },
            ]}
            inputSearchStyle={{
              backgroundColor: colors.background,
              color: colors.onBackground,
            }}
            placeholderStyle={[
              style.dropdownText,
              { color: colors.onSurfaceDisabled },
            ]}
            renderInputSearch={e => (
              <TextInput
                mode="outlined"
                outlineColor="transparent"
                activeOutlineColor="transparent"
                cursorColor={colors.onBackground}
                placeholder="Search category"
                placeholderTextColor={colors.onSurfaceDisabled}
                style={{
                  backgroundColor: colors.background,
                  color: colors.onBackground,
                }}
                onChangeText={text => {
                  e(text);
                }}
              />
            )}
            selectedTextStyle={[
              style.dropdownText,
              { color: colors.onBackground },
            ]}
            itemContainerStyle={{ backgroundColor: colors.background }}
            itemTextStyle={{ color: colors.onBackground }}
            placeholder="Select a Category"
            data={categories}
            labelField="name"
            valueField="id"
            search
            searchField="name"
            onChange={e => {
              console.log({ e });
              setSelectedCategoryId(e.id);
            }}
          />
          <PressableWithFeedback
            onPress={() => setOpenCategoryInput(p => !p)}
            style={[
              gs.centerItems,
              style.addCategoryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Animated.View style={animatedStyle}>
              <Icon color={colors.onPrimary} source="plus" size={ICON_SIZE} />
            </Animated.View>
          </PressableWithFeedback>
        </View>
        {/* add category section */}
        <Animated.View
          entering={FadeIn}
          style={[
            gs.flexRow,
            style.categoryInputBox,
            {
              marginTop,
              height: categoryInputHeight,
              gap: spacing.md,
            },
          ]}
        >
          <TextInput
            onChangeText={setCategoryInput}
            value={categoryInput}
            outlineColor={colors.onSurfaceDisabled}
            mode="outlined"
            placeholder="Category name"
            style={[gs.fullFlex, style.textInput]}
            placeholderTextColor={colors.onSurfaceDisabled}
          />
          <PressableWithFeedback
            disabled={categoryInput.length === 0}
            onPress={addNewCategory}
            style={[
              gs.centerItems,
              style.addCategoryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Icon color={colors.onPrimary} source="check" size={ICON_SIZE} />
          </PressableWithFeedback>
        </Animated.View>

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
      <FAB icon="check" style={style.fab} onPress={addNewTransaction} />
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
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  dropdown: {
    padding: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: 2,
  },
  dropdownText: {
    fontSize: textSize.lg,
  },
  addCategoryButton: {
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xs,
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
  categoryInputBox: {
    overflow: 'hidden',
  },
});
