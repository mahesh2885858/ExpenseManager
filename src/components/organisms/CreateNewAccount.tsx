import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { CURRENCY_SYMBOL } from '../../common';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import useAccountStore from '../../stores/accountsStore';
import { Toast } from 'toastify-react-native';
import { v4 } from 'uuid';

type TProps = {
  ref: React.RefObject<BottomSheetModal | null>;
  handleSheetChanges: BottomSheetProps['onChange'];
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const CreateNewAccount = (props: TProps) => {
  const { colors } = useAppTheme();
  const [accName, setAccName] = useState('');
  const [balance, setBalance] = useState('');
  const accounts = useAccountStore(state => state.accounts);
  const addAccount = useAccountStore(state => state.addAccount);

  const renderSaveButton = useMemo(() => {
    return accName.trim().length > 0;
  }, [accName]);

  const addNewAcc = useCallback(() => {
    // check for existing acc name
    const isExist = accounts.some(
      item => item.name.toLowerCase().trim() === accName.trim().toLowerCase(),
    );
    if (isExist) {
      Toast.info('Account exist. choose different name!!', 'top');
    } else {
      const id = v4();
      addAccount({
        balance: parseFloat(balance),
        id,
        name: accName,
      });
      setAccName('');
      setBalance('');
      props.ref.current?.dismiss();
    }
  }, [accName, accounts, addAccount, balance, props]);

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
            Add new account
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
          {renderSaveButton && (
            <PressableWithFeedback
              onPress={addNewAcc}
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
                Add
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
