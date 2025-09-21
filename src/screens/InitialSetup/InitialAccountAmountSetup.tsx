import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TRootStackParamList } from '../../types';
import useAccountStore from '../../stores/accountsStore';

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
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <TextInput
        mode="outlined"
        style={[styles.texInput]}
        placeholder={
          t('common.amountPlaceholder') + ' (' + t('common.optional') + ')'
        }
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
        {t('common.save')}
      </Button>
    </View>
  );
};

export default InitialAccountAmountSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texInput: {
    borderRadius: 10,
    width: '80%',
    fontSize: 20,
  },
  nextButton: { width: '40%', marginTop: 20 },
  nextButtonLabel: { fontSize: 18 },
});
