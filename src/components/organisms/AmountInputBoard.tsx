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
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs, MAX_AMOUNT } from '../../common';
import useTransactions from '../../hooks/useTransactions';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import AppText from '../molecules/AppText';

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
  const styles = createStyles(colors);
  const { getFormattedAmount } = useTransactions();
  const { amountInput: input, setAmountInput: setInput } = props;
  const buttonStyles = StyleSheet.create({
    button: {
      flex: 1,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      borderWidth: 1,
      borderColor: colors.onSurface,
    },
    buttonText: {
      color: colors.onSurface,
      fontSize: textSize.xl,
    },
  });

  const onButtonPress = (button: string) => {
    let text = input;

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
        backgroundColor: colors.surfaceContainer,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={520}
    >
      <BottomSheetView style={[styles.container]}>
        <View style={[styles.content]}>
          <View>
            <View style={[gs.flexRow, gs.itemsCenter]}>
              <AppText.SemiBold
                style={[
                  gs.fullFlex,
                  {
                    fontSize: textSize.lg,
                    color: colors.onSurface,
                  },
                ]}
              >
                Enter Amount
              </AppText.SemiBold>
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
              <AppText.Bold
                style={[
                  styles.amountText,
                  {
                    color: colors.onBackground,
                  },
                ]}
              >
                {getFormattedAmount(input, false)}
              </AppText.Bold>
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
                    <AppText.SemiBold style={[buttonStyles.buttonText]}>
                      {item}
                    </AppText.SemiBold>
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
                    <AppText.SemiBold style={[buttonStyles.buttonText]}>
                      {item}
                    </AppText.SemiBold>
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
                    <AppText.SemiBold style={[buttonStyles.buttonText]}>
                      {item}
                    </AppText.SemiBold>
                  </PressableWithFeedback>
                ))}
              </View>
              <View style={[styles.row]}>
                <PressableWithFeedback
                  disabled={hideDecimal}
                  onPress={() => onButtonPress('.')}
                  style={[buttonStyles.button]}
                >
                  <AppText.SemiBold style={[buttonStyles.buttonText]}>
                    .
                  </AppText.SemiBold>
                </PressableWithFeedback>
                <PressableWithFeedback
                  onPress={() => onButtonPress(String(0))}
                  style={[buttonStyles.button]}
                >
                  <AppText.SemiBold style={[buttonStyles.buttonText]}>
                    0
                  </AppText.SemiBold>
                </PressableWithFeedback>
                <PressableWithFeedback
                  onPress={() => onButtonPress('back')}
                  style={[buttonStyles.button, { height: 59 }]}
                >
                  <Icon
                    source={'backspace'}
                    size={28}
                    color={colors.onSurface}
                  />
                </PressableWithFeedback>
              </View>
              <PressableWithFeedback
                onPress={() => onButtonPress('save')}
                style={[styles.saveButton]}
              >
                <AppText.Bold style={[styles.okText]}>OK</AppText.Bold>
              </PressableWithFeedback>
            </View>
            {/*Board ends*/}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default AmountInputBoard;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
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
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    amountText: {
      fontSize: textSize.xxxl,
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
    saveButton: {
      backgroundColor: colors.primary,
      flex: 1,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
    },
    okText: {
      color: colors.onPrimary,
      fontSize: textSize.lg,
    },
  });
