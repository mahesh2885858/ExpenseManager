import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Icon, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuid } from 'uuid';
import { borderRadius, spacing, textSize } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AmountInputBoard from '../../components/organisms/AmountInputBoard';
import CurrencySelectionModal from '../../components/organisms/CurrencySelectionModal';
import useWallets from '../../hooks/useAccounts';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useTransactions from '../../hooks/useTransactions';
import useWalletStore from '../../stores/walletsStore';
import { TRootStackParamList } from '../../types';

const WalletSetup = () => {
  const { bottom, top } = useSafeAreaInsets();
  const route = useRoute<RouteProp<TRootStackParamList, 'AmountInput'>>();
  const theme = useTheme();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [accName, setAccName] = useState('');
  const addAccount = useWalletStore(state => state.addWallet);
  const setUsername = useWalletStore(state => state.setUsername);
  const currency = useWalletStore(state => state.currency);
  const setIsInitialSetupDone = useWalletStore(
    state => state.setIsInitialSetupDone,
  );
  const setDefaultAcc = useWalletStore(state => state.setDefaultWalletId);
  const { setSelectedWalletId: setSelectedAccountId } = useWallets();

  const { getFormattedAmount } = useTransactions();

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();
  const {
    btmShtRef: amountBtmShtRef,
    handlePresent: amountBoardPresent,
    handleSheetChange: amountBoardSheetChange,
  } = useBottomSheetModal();

  const saveAccount = useCallback(() => {
    const id = uuid();
    if (route.params?.userName) {
      setUsername(route.params.userName);
      const amt = parseFloat(amount) || 0;
      addAccount({
        name: accName,
        initBalance: amt,
        id,
      });
      setDefaultAcc(id);
      setSelectedAccountId(id);
      Keyboard.dismiss();
      setIsInitialSetupDone(true);
    }
  }, [
    addAccount,
    setUsername,
    accName,
    setDefaultAcc,
    setSelectedAccountId,
    amount,
    route.params?.userName,
    setIsInitialSetupDone,
  ]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View style={styles.headingContainer}>
        <View style={[gs.flexRow, gs.itemsCenter]}>
          <Text
            style={[
              gs.fontBold,
              {
                color: theme.colors.onBackground,
                fontSize: textSize.xl,
              },
            ]}
          >
            {t('common.setupAccount')}
          </Text>
          <Icon
            source={'wallet-bifold'}
            size={40}
            color={theme.colors.tertiary}
          />
        </View>

        <Text
          style={[
            {
              color: theme.colors.onSurfaceDisabled,
              fontSize: textSize.sm,
            },
          ]}
        >
          {t('common.setupAccDesc')}
        </Text>
      </View>

      <View style={[{ gap: spacing.md }]}>
        <View style={[{ gap: spacing.sm }]}>
          <Text
            style={[
              gs.fontBold,
              {
                fontSize: textSize.lg,
                color: theme.colors.onBackground,
              },
            ]}
          >
            {t('common.accName')}
          </Text>
          <TextInput
            autoFocus
            mode="outlined"
            style={[styles.texInput]}
            placeholder={t('common.accName')}
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            keyboardType="default"
            value={accName}
            onChangeText={setAccName}
            activeOutlineColor={theme.colors.inverseSurface}
          />
        </View>
        <View style={[{ gap: spacing.sm }]}>
          <Text
            style={[
              gs.fontBold,
              {
                fontSize: textSize.lg,
                color: theme.colors.onBackground,
              },
            ]}
          >
            {t('common.amountPlaceholder')}
          </Text>
          <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
            <PressableWithFeedback
              onPress={handlePresent}
              style={[
                gs.centerItems,
                {
                  paddingHorizontal: spacing.md,
                  backgroundColor: theme.colors.surfaceVariant,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.sm,
                },
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: textSize.md,
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {currency.code}
              </Text>
              <Text
                style={[
                  {
                    fontSize: textSize.md,
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {currency.symbol}
              </Text>
            </PressableWithFeedback>
            <PressableWithFeedback
              onPress={amountBoardPresent}
              style={[gs.fullFlex, styles.texInput]}
            >
              <Text
                style={[
                  styles.amountBox,
                  {
                    borderColor: theme.colors.inverseSurface,
                    color:
                      amount.length === 0
                        ? theme.colors.onSurfaceDisabled
                        : theme.colors.onBackground,
                  },
                ]}
              >
                {amount.length === 0
                  ? t('common.amount') + ' (' + t('common.optional') + ')'
                  : getFormattedAmount(amount, false)}
              </Text>
            </PressableWithFeedback>
          </View>
        </View>
      </View>

      <Button
        onPress={saveAccount}
        labelStyle={styles.nextButtonLabel}
        style={styles.nextButton}
        mode="contained"
        disabled={accName.trim().length <= 0}
        buttonColor={theme.colors.inversePrimary}
        textColor={theme.colors.onPrimaryContainer}
      >
        {t('common.next')}
      </Button>
      <CurrencySelectionModal
        handleSheetChanges={handleSheetChange}
        ref={btmShtRef}
      />
      <AmountInputBoard
        ref={amountBtmShtRef}
        handleSheetChanges={amountBoardSheetChange}
        amountInput={amount}
        setAmountInput={setAmount}
      />
    </KeyboardAvoidingView>
  );
};

export default WalletSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  headingContainer: {
    marginTop: spacing.md,
  },
  texInput: {
    borderRadius: borderRadius.lg,
    fontSize: textSize.lg,
  },
  nextButton: { width: '40%' },
  nextButtonLabel: { fontSize: textSize.md },
  amountBox: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    fontSize: textSize.lg - 2,
    paddingVertical: spacing.sm + 5,
    paddingLeft: spacing.xs,
  },
});
