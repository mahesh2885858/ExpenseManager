import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { getDigits } from 'commonutil-core';
import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 } from 'uuid';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import usePaddingKeyboard from '../../hooks/usePaddingKeyboard';
import useTransactions from '../../hooks/useTransactions';
import useWalletStore from '../../stores/walletsStore';
import { TWallet } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import AmountInputBoard from './AmountInputBoard';

const screenHeight = Dimensions.get('screen').height;

type TProps = {
  ref: React.RefObject<BottomSheetModal | null>;
  handleSheetChanges: BottomSheetProps['onChange'];
  accToEdit?: TWallet;
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const CreateNewAccount = (props: TProps) => {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const availableScreenHeight = screenHeight - top - bottom;
  const [accName, setAccName] = useState(
    props.accToEdit ? props.accToEdit.name : '',
  );
  const [balance, setBalance] = useState('');
  const { topPadding } = usePaddingKeyboard();
  const accounts = useWalletStore(state => state.wallets);
  const addAccount = useWalletStore(state => state.addWallet);
  const updateAccount = useWalletStore(state => state.updateWallet);
  const { getFormattedAmount } = useTransactions();

  const { btmShtRef, handlePresent, handleSheetChange, open } =
    useBottomSheetModal();

  const renderSaveButton = useMemo(() => {
    return accName.trim().length > 0;
  }, [accName]);

  const addNewAcc = useCallback(() => {
    // check for existing acc name
    const isExist = accounts.some(
      item => item.name.toLowerCase().trim() === accName.trim().toLowerCase(),
    );
    if (isExist) {
      ToastAndroid.show(
        'Wallet exist. choose different name!!',
        ToastAndroid.SHORT,
      );
      return;
    } else {
      const id = v4();
      addAccount({
        initBalance: parseFloat(
          balance.trim().length > 0 ? getDigits(balance) : '0',
        ),
        id,
        name: accName,
      });
      setAccName('');
      setBalance('');
      props.ref.current?.dismiss();
    }
  }, [accName, accounts, addAccount, balance, props]);

  const editAccount = useCallback(() => {
    if (!props.accToEdit) return;
    updateAccount({
      ...props.accToEdit,
      name: accName,
    });
    setAccName('');
    setBalance('');
    props.ref.current?.dismiss();
  }, [props, accName, updateAccount]);

  const isEditModeOn = useMemo(() => {
    return !!props.accToEdit;
  }, [props]);

  return (
    <BottomSheetModal
      backdropComponent={pr => BottomCBackdrop(pr)}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: colors.inverseOnSurface,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={open ? availableScreenHeight : 500}
    >
      <BottomSheetView
        style={[
          styles.container,
          {
            paddingTop: topPadding,
            height: open ? availableScreenHeight : 'auto',
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.headerText,
              {
                color: colors.onBackground,
              },
            ]}
          >
            {isEditModeOn ? 'Edit Wallet' : 'Add New Wallet'}
          </Text>
          <View
            style={[
              styles.accNameBox,
              {
                borderColor: colors.onSurfaceDisabled,
              },
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
              Wallet name
            </Text>
            <BottomSheetTextInput
              value={accName}
              onChangeText={setAccName}
              placeholder="My Wallet"
              placeholderTextColor={colors.onSurfaceDisabled}
              style={[
                {
                  color: colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            />
          </View>
          {!isEditModeOn && (
            <PressableWithFeedback
              onPress={handlePresent}
              style={[
                styles.accNameBox,
                {
                  borderColor: colors.onSurfaceDisabled,
                },
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
                Balance
              </Text>

              <View style={[{ paddingBottom: spacing.sm }]}>
                <Text
                  style={[
                    {
                      fontSize: textSize.xl,
                      color:
                        balance.length === 0
                          ? colors.onSurfaceDisabled
                          : colors.onBackground,
                    },
                  ]}
                >
                  {getFormattedAmount(balance)}
                </Text>
              </View>
            </PressableWithFeedback>
          )}
          {renderSaveButton && (
            <PressableWithFeedback
              onPress={() => {
                if (isEditModeOn) {
                  editAccount();
                } else {
                  addNewAcc();
                }
              }}
              style={[
                styles.button,
                {
                  backgroundColor: colors.secondaryContainer,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: colors.onSecondaryContainer,
                  },
                ]}
              >
                {isEditModeOn ? 'Save' : 'Add'}
              </Text>
            </PressableWithFeedback>
          )}
        </View>
      </BottomSheetView>
      <AmountInputBoard
        amountInput={balance}
        handleSheetChanges={handleSheetChange}
        ref={btmShtRef}
        setAmountInput={setBalance}
      />
    </BottomSheetModal>
  );
};

export default CreateNewAccount;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  headerText: {
    fontSize: textSize.lg,
    fontWeight: 'bold',
    paddingHorizontal: spacing.md,
  },
  accNameBox: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    paddingLeft: spacing.sm,
  },
  button: {
    marginHorizontal: 'auto',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  buttonText: {
    fontSize: textSize.md,
    fontWeight: '600',
  },
});
