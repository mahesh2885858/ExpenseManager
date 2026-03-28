import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TextInputBase,
  View,
} from 'react-native';
import { Button, Icon, useTheme } from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuid } from 'uuid';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AmountInputBoard from '../../components/organisms/AmountInputBoard';
import CurrencySelectionModal from '../../components/organisms/CurrencySelectionModal';
import useWallets from '../../hooks/useAccounts';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useTransactions from '../../hooks/useTransactions';
import useWalletStore from '../../stores/walletsStore';
import AppText from '../../components/molecules/AppText';

const WalletSetup = () => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const styles = createStyles(theme.colors, insets);
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [accName, setAccName] = useState('');
  const addAccount = useWalletStore(state => state.addWallet);
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
  }, [
    addAccount,
    accName,
    setDefaultAcc,
    setSelectedAccountId,
    amount,
    setIsInitialSetupDone,
  ]);

  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.container, {}]}>
      <View>
        <AppText.SemiBold style={[styles.getStarted]}>
          {t('walletSetup.getYouStarted')}
        </AppText.SemiBold>
      </View>

      <View style={[styles.walletIconBox]}>
        <Icon source={'wallet'} size={96} />
      </View>

      <AppText.SemiBold style={[styles.createFirstText]}>
        {t('walletSetup.createFirst')}
      </AppText.SemiBold>

      <View style={[{ gap: spacing.md }]}>
        {/*wallet name starts*/}
        <View style={[{ paddingHorizontal: spacing.md, gap: spacing.xs }]}>
          <AppText.SemiBold
            style={[
              {
                fontSize: textSize.md,
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {t('walletSetup.name')}
          </AppText.SemiBold>
          <TextInput
            autoFocus
            style={[styles.texInput]}
            placeholder={t('walletSetup.name')}
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            keyboardType="default"
            value={accName}
            onChangeText={setAccName}
          />
        </View>
        {/*wallet name ends*/}

        {/*Currency starts*/}
        <View style={[{ paddingHorizontal: spacing.md, gap: spacing.xs }]}>
          <AppText.SemiBold
            style={[
              {
                fontSize: textSize.md,
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {t('walletSetup.currency')}
          </AppText.SemiBold>
          <PressableWithFeedback
            onPress={handlePresent}
            style={[styles.currencyBox]}
          >
            <AppText.SemiBold style={[styles.currencyText]}>
              {currency.code + ' (' + currency.symbol + ')'}
            </AppText.SemiBold>
            <Icon
              source={'chevron-right'}
              size={textSize.xl}
              color={theme.colors.onSurface}
            />
          </PressableWithFeedback>
        </View>
        {/*Currency ends*/}

        {/*Initial balance starts*/}
        <View style={[{ paddingHorizontal: spacing.md, gap: spacing.xs }]}>
          <AppText.SemiBold
            style={[
              {
                fontSize: textSize.md,
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {t('walletSetup.initBalance')}
          </AppText.SemiBold>
          <PressableWithFeedback
            onPress={amountBoardPresent}
            style={[styles.currencyBox]}
          >
            <AppText.SemiBold
              style={[
                styles.currencyText,
                {
                  color:
                    amount.length === 0
                      ? theme.colors.onSurfaceDisabled
                      : theme.colors.onSurface,
                },
              ]}
            >
              {amount.length === 0
                ? t('common.amount') + ' (' + t('common.optional') + ')'
                : getFormattedAmount(amount, false)}
            </AppText.SemiBold>
            <Icon
              source={'chevron-right'}
              size={textSize.xl}
              color={theme.colors.onSurface}
            />
          </PressableWithFeedback>
        </View>
        {/*Initial balance ends*/}
        <PressableWithFeedback style={[styles.continueButton]}>
          <AppText.SemiBold style={[styles.continueText]}>
            {t('common.continue')}
          </AppText.SemiBold>
        </PressableWithFeedback>
      </View>

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

const createStyles = (colors: AppTheme['colors'], insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      backgroundColor: colors.background,
    },

    getStarted: {
      color: colors.onBackground,
      fontSize: textSize.xxxl,
      textAlign: 'center',
    },
    walletIconBox: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
      marginBottom: 50,
    },
    createFirstText: {
      color: colors.onSurface,
      fontSize: textSize.xxl,
      textAlign: 'center',
      marginBottom: spacing.xxl,
    },

    texInput: {
      borderRadius: borderRadius.sm,
      fontSize: textSize.md,
      backgroundColor: colors.surfaceContainerHigh,
      fontFamily: 'PoppinsSemiBold',
      color: colors.onSurface,
      paddingLeft: spacing.sm,
    },
    currencyBox: {
      borderRadius: borderRadius.sm,
      backgroundColor: colors.surfaceContainerHigh,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    currencyText: {
      fontSize: textSize.md,
      fontFamily: 'PoppinsSemiBold',
      color: colors.onSurface,
      flex: 1,
    },

    continueButton: {
      backgroundColor: colors.primary,
      height: 60,
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.sm,
      marginTop: spacing.xl,
      alignSelf: 'center',
    },
    continueText: {
      fontSize: textSize.lg,
      color: colors.onPrimary,
    },
  });
