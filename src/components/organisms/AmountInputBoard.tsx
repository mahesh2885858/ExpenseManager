import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { RefObject, useMemo } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs, MAX_AMOUNT } from '../../common';
import useTransactions from '../../hooks/useTransactions';
import PressableWithFeedback from '../atoms/PressableWithFeedback';

type TProps = {
  ref: RefObject<BottomSheetModal | null>;
  handleSheetChanges: BottomSheetProps['onChange'];
  amountInput: string;
  setAmountInput: (input: string) => void;
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const AmountInputBoard = (props: TProps) => {
  const { colors } = useAppTheme();
  const { getFormattedAmount } = useTransactions();
  const { amountInput: input, setAmountInput: setInput } = props;
  const buttonStyles = StyleSheet.create({
    button: {
      flex: 1,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: textSize.xxl,
      fontWeight: '600',
    },
  });

  const onButtonPress = (button: string) => {
    let text = input;
    console.log({ text });

    const decimalPart = text.split('.')[1];
    if (
      button !== 'save' &&
      button !== 'back' &&
      decimalPart &&
      decimalPart.length === 2
    )
      return;
    switch (button) {
      case 'back':
        text = text.length === 0 ? text : text.slice(0, text.length - 1);
        break;
      case 'save':
        props.ref.current?.dismiss();
        break;
      default:
        text = text + button;
        if (
          parseFloat(text) >= MAX_AMOUNT &&
          button !== 'back' &&
          button !== 'save'
        ) {
          ToastAndroid.show(
            'Maximum allowed is: ' + getFormattedAmount(MAX_AMOUNT),
            2000,
          );
          return;
        }
        break;
    }
    setInput(text);
  };

  const hideDecimal = useMemo(() => {
    return input.includes('.');
  }, [input]);

  return (
    <BottomSheetModal
      stackBehavior="push"
      backdropComponent={pr => BottomCBackdrop(pr)}
      backgroundStyle={{
        backgroundColor: colors.inverseOnSurface,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={500}
    >
      <BottomSheetView style={[styles.container]}>
        <View style={[styles.content]}>
          <View>
            <View style={[gs.flexRow, gs.itemsCenter]}>
              <Text
                style={[
                  gs.fontBold,
                  gs.fullFlex,
                  {
                    fontSize: textSize.lg,
                    color: colors.onBackground,
                  },
                ]}
              >
                Enter Amount
              </Text>
            </View>
            {/*amount display start*/}
            <View
              style={[
                styles.amountDisplay,
                {
                  borderColor: colors.outline,
                },
              ]}
            >
              <Text
                style={[
                  styles.amountText,
                  {
                    color: colors.onBackground,
                  },
                ]}
              >
                {getFormattedAmount(input)}
              </Text>
            </View>
            {/*amount display end*/}
            {/*Board Starts*/}
            <View style={[styles.board]}>
              <View style={[styles.row]}>
                {[7, 8, 9].map(item => (
                  <PressableWithFeedback
                    key={item}
                    style={[buttonStyles.button]}
                    onPress={() => onButtonPress(String(item))}
                  >
                    <Text style={[buttonStyles.buttonText]}>{item}</Text>
                  </PressableWithFeedback>
                ))}
              </View>
              <View style={[styles.row]}>
                {[4, 5, 6].map(item => (
                  <PressableWithFeedback
                    key={item}
                    style={[buttonStyles.button]}
                    onPress={() => onButtonPress(String(item))}
                  >
                    <Text style={[buttonStyles.buttonText]}>{item}</Text>
                  </PressableWithFeedback>
                ))}
              </View>
              <View style={[styles.row]}>
                {[1, 2, 3].map(item => (
                  <PressableWithFeedback
                    key={item}
                    style={[buttonStyles.button]}
                    onPress={() => onButtonPress(String(item))}
                  >
                    <Text style={[buttonStyles.buttonText]}>{item}</Text>
                  </PressableWithFeedback>
                ))}
              </View>
              <View style={[styles.row]}>
                <PressableWithFeedback
                  disabled={hideDecimal}
                  onPress={() => onButtonPress('.')}
                  style={[buttonStyles.button]}
                >
                  <Text style={[buttonStyles.buttonText]}>.</Text>
                </PressableWithFeedback>
                <PressableWithFeedback
                  onPress={() => onButtonPress(String(0))}
                  style={[buttonStyles.button]}
                >
                  <Text style={[buttonStyles.buttonText]}>0</Text>
                </PressableWithFeedback>
                <PressableWithFeedback
                  onPress={() => onButtonPress('back')}
                  style={[buttonStyles.button]}
                >
                  <Icon
                    source={'backspace'}
                    size={36}
                    color={colors.onPrimary}
                  />
                </PressableWithFeedback>
                <PressableWithFeedback
                  onPress={() => onButtonPress('save')}
                  style={[buttonStyles.button]}
                >
                  <Icon source={'check'} size={36} color={colors.onPrimary} />
                </PressableWithFeedback>
              </View>
            </View>
            {/*Board ends*/}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default AmountInputBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    paddingBottom: spacing.xxxl,
  },

  headerText: {
    fontSize: textSize.lg,
  },
  amountDisplay: {
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingTop: spacing.md,
  },
  amountText: {
    fontSize: textSize.xxl,
    fontWeight: '600',
  },
  board: {
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
