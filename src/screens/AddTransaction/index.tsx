import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Dropdown } from 'react-native-element-dropdown';
import { Avatar, Icon, TextInput, Tooltip } from 'react-native-paper';
import {
  DatePickerModal,
  DatePickerModalSingleProps,
  TimePickerModal,
} from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import ScreenWithoutHeader from '../../components/molecules/ScreenWithoutHeader';
import { TTransactionType } from '../../types';

// TODO: Replace with actual category data
const TEMP_CATEGORY_DATA = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const DATE_FORMAT = 'MMM do hh:mm a';
const CURRENCY_SYMBOL = '₹';
const AVATAR_SIZE = 40;
const ICON_SIZE = 30;

const AddTransaction = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();

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

  return (
    <ScreenWithoutHeader>
      <ScrollView contentContainerStyle={style.scrollViewContent}>
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
            placeholderStyle={[
              style.dropdownText,
              { color: colors.onSurfaceDisabled },
            ]}
            selectedTextStyle={[
              style.dropdownText,
              { color: colors.onBackground },
            ]}
            itemContainerStyle={{ backgroundColor: colors.background }}
            itemTextStyle={{ color: colors.onBackground }}
            placeholder="Select a Category"
            data={TEMP_CATEGORY_DATA}
            labelField="label"
            valueField="value"
            search
            searchField="label"
            onChange={e => {
              console.log({ e });
            }}
          />
          <PressableWithFeedback
            style={[
              gs.centerItems,
              style.addCategoryButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Tooltip title="Add a new category">
              <Icon color={colors.onPrimary} source="plus" size={ICON_SIZE} />
            </Tooltip>
          </PressableWithFeedback>
        </View>

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
    </ScreenWithoutHeader>
  );
};

export default AddTransaction;

const style = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: spacing.md,
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
});
