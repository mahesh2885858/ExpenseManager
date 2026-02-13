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
import { gs, MAX_AMOUNT } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import CurrencySelectionModal from '../../components/organisms/CurrencySelectionModal';
import useAccounts from '../../hooks/useAccounts';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useAccountStore from '../../stores/accountsStore';
import { TRootStackParamList } from '../../types';

const InitialAccountAmountSetup = () => {
  const { bottom, top } = useSafeAreaInsets();
  const route = useRoute<RouteProp<TRootStackParamList, 'AmountInput'>>();
  const theme = useTheme();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [accName, setAccName] = useState('');
  const addAccount = useAccountStore(state => state.addAccount);
  const setUsername = useAccountStore(state => state.setUsername);
  const currency = useAccountStore(state => state.currency);
  const setIsInitialSetupDone = useAccountStore(
    state => state.setIsInitialSetupDone,
  );
  const setDefaultAcc = useAccountStore(state => state.setDefaultAccountId);
  const { setSelectedAccountId } = useAccounts();

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();

  const onAmountChange = useCallback((value: string) => {
    // don't allow floats and etc symbols
    if (value.includes('.') || value.includes(',') || value.includes('-'))
      return;
    const digits = parseInt(value, 10);
    if (digits > MAX_AMOUNT) return;
    setAmount(value);
  }, []);

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
            <TextInput
              mode="outlined"
              style={[gs.fullFlex, styles.texInput]}
              placeholder={
                t('common.amount') + ' (' + t('common.optional') + ')'
              }
              keyboardType="numeric"
              value={amount}
              onChangeText={onAmountChange}
              activeOutlineColor={theme.colors.inverseSurface}
              placeholderTextColor={theme.colors.onSurfaceDisabled}
            />
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
    </KeyboardAvoidingView>
  );
};

export default InitialAccountAmountSetup;

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
});
