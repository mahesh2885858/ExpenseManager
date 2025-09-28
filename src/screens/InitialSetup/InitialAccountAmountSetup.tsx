import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize } from '../../../theme';
import { gs, MAX_INITIAL_AMOUNT } from '../../common';
import useAccountStore from '../../stores/accountsStore';
import { TRootStackParamList } from '../../types';

const InitialAccountAmountSetup = () => {
  const { bottom, top } = useSafeAreaInsets();
  const route = useRoute<RouteProp<TRootStackParamList, 'AmountInput'>>();
  const theme = useTheme();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const addAccount = useAccountStore(state => state.addAccount);
  const setIsInitialSetupDone = useAccountStore(
    state => state.setIsInitialSetupDone,
  );

  const onAmountChange = useCallback((value: string) => {
    // don't allow floats and etc symbols
    if (value.includes('.') || value.includes(',') || value.includes('-'))
      return;
    const digits = parseInt(value, 10);
    if (digits > MAX_INITIAL_AMOUNT) return;
    setAmount(value);
  }, []);

  const saveAccount = useCallback(() => {
    if (route.params?.name) {
      addAccount({
        name: route.params.name,
        balance: parseInt(amount, 10) || 0,
        id: Date.now().toString(),
        isSelected: true,
      });
      setIsInitialSetupDone(true);
    }
  }, [addAccount, amount, route.params?.name, setIsInitialSetupDone]);
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
        <Text
          style={[
            theme.fonts.displaySmall,
            gs.fontBold,
            {
              color: theme.colors.onBackground,
            },
          ]}
        >
          {t('common.amountPlaceholder')}
        </Text>
      </View>
      <TextInput
        mode="outlined"
        style={[styles.texInput]}
        placeholder={t('common.amount') + ' (' + t('common.optional') + ')'}
        keyboardType="numeric"
        value={amount}
        onChangeText={onAmountChange}
        left={<TextInput.Affix text="₹" />}
      />
      <Button
        onPress={saveAccount}
        labelStyle={styles.nextButtonLabel}
        style={styles.nextButton}
        mode="contained"
      >
        {t('common.next')}
      </Button>
    </KeyboardAvoidingView>
  );
};

export default InitialAccountAmountSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  headingContainer: {
    width: '80%',
  },
  texInput: {
    borderRadius: borderRadius.lg,
    width: '80%',
    fontSize: textSize.lg,
  },
  nextButton: { width: '40%' },
  nextButtonLabel: { fontSize: textSize.md },
});
