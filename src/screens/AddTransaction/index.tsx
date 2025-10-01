import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Icon, TextInput } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import ScreenWithoutHeader from '../../components/molecules/ScreenWithoutHeader';
import { TTransactionType } from '../../types';

const AddTransaction = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const [transactionType, setTransactionType] =
    useState<TTransactionType>('income');

  const [amountInput, setAmountInput] = useState('');

  const changeTransactionType = (type: TTransactionType) => {
    setTransactionType(type);
  };
  return (
    <ScreenWithoutHeader>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
        }}
      >
        {/* header section */}
        <View
          style={[
            gs.flexRow,
            gs.itemsCenter,
            {
              paddingVertical: spacing.sm,
            },
          ]}
        >
          <View
            style={[gs.flexRow, gs.itemsCenter, gs.fullFlex, style.headerBox]}
          >
            <PressableWithFeedback onPress={navigation.goBack}>
              <Icon source="arrow-left" size={30} />
            </PressableWithFeedback>
            <Text
              style={[
                gs.fontBold,
                {
                  color: colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              Add Transaction
            </Text>
          </View>
          <Avatar.Text
            label="M"
            size={40}
            style={{
              backgroundColor: colors.primaryContainer,
            }}
          />
        </View>
        {/* transaction type*/}
        <View style={[gs.flexRow, { gap: spacing.lg, marginTop: spacing.xs }]}>
          <PressableWithFeedback
            onPress={() => changeTransactionType('income')}
            style={[
              gs.centerItems,
              gs.fullFlex,
              style.pill,
              {
                borderColor: colors.onBackground,
                backgroundColor:
                  transactionType === 'income'
                    ? colors.primaryContainer
                    : colors.background,
              },
            ]}
          >
            <Text
              style={[
                gs.fontBold,
                {
                  fontSize: textSize.lg,
                  color:
                    transactionType === 'income'
                      ? colors.onPrimaryContainer
                      : colors.onBackground,
                },
              ]}
            >
              Income
            </Text>
          </PressableWithFeedback>
          <PressableWithFeedback
            onPress={() => changeTransactionType('expense')}
            style={[
              gs.centerItems,
              gs.fullFlex,
              style.pill,
              {
                borderColor: colors.onBackground,
                backgroundColor:
                  transactionType === 'expense'
                    ? colors.primaryContainer
                    : colors.background,
              },
            ]}
          >
            <Text
              style={[
                gs.fontBold,
                {
                  fontSize: textSize.lg,
                  color:
                    transactionType === 'expense'
                      ? colors.onPrimaryContainer
                      : colors.onBackground,
                },
              ]}
            >
              Expense
            </Text>
          </PressableWithFeedback>
        </View>
        {/* amount input*/}
        <View
          style={[
            {
              marginTop: spacing.lg,
            },
          ]}
        >
          <TextInput
            onChangeText={setAmountInput}
            value={amountInput}
            mode="outlined"
            placeholder="Amount"
            keyboardType="numeric"
            left={<TextInput.Affix text="₹" />}
            style={style.texInput}
          />
        </View>
      </ScrollView>
    </ScreenWithoutHeader>
  );
};

export default AddTransaction;

const style = StyleSheet.create({
  headerBox: {
    gap: spacing.sm,
  },
  pill: {
    borderWidth: 1,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  texInput: {
    borderRadius: borderRadius.lg,
    fontSize: textSize.lg,
  },
});
