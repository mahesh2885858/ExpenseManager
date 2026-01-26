import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { v4 } from 'uuid';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { CURRENCY_SYMBOL } from '../../common';
import useAccountStore from '../../stores/accountsStore';
import { TAccount } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';

type TProps = {
  ref: React.RefObject<BottomSheetModal | null>;
  handleSheetChanges: BottomSheetProps['onChange'];
  accToEdit?: TAccount;
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const CreateNewAccount = (props: TProps) => {
  const { colors } = useAppTheme();
  const [accName, setAccName] = useState(
    props.accToEdit ? props.accToEdit.name : '',
  );
  const [balance, setBalance] = useState('');
  const accounts = useAccountStore(state => state.accounts);
  const addAccount = useAccountStore(state => state.addAccount);
  const updateAccount = useAccountStore(state => state.updateAccount);

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
        'Account exist. choose different name!!',
        ToastAndroid.SHORT,
      );
      return;
    } else {
      const id = v4();
      addAccount({
        initBalance: parseFloat(balance.trim().length > 0 ? balance : '0'),
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
      maxDynamicContentSize={500}
    >
      <BottomSheetView style={[styles.container]}>
        <View>
          <Text
            style={[
              styles.headerText,
              {
                color: colors.onBackground,
              },
            ]}
          >
            {isEditModeOn ? 'Edit Account' : 'Add New Account'}
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
              Account name
            </Text>
            <BottomSheetTextInput
              value={accName}
              onChangeText={setAccName}
              placeholder="My Account"
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
                Balance
              </Text>

              <BottomSheetTextInput
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
                placeholder={CURRENCY_SYMBOL + '0.00'}
                placeholderTextColor={colors.onSurfaceDisabled}
                style={[
                  {
                    color: colors.onBackground,
                    fontSize: textSize.lg,
                  },
                ]}
              />
            </View>
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
