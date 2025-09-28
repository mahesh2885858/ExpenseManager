import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize } from '../../../theme';
import { gs } from '../../common';
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
        onChangeText={setAmount}
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
