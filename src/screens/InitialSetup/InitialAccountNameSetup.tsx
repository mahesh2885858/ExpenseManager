import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../../theme';
import { TRootStackParamList } from '../../types';

const InitialAccountNameSetup = () => {
  const { bottom, top } = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigation<NavigationProp<TRootStackParamList>>();
  const [name, setName] = useState('');

  const navigateToAmountSetup = useCallback(() => {
    navigate.navigate('AmountInput', { name });
  }, [name, navigate]);

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
      <View style={styles.headingContainer}>
        <Text
          style={[
            theme.fonts.displaySmall,
            {
              color: theme.colors.onBackground,
              fontWeight: 'bold',
            },
          ]}
        >
          Please enter an account Name
        </Text>
      </View>
      <TextInput
        error={name.trim() === ''}
        mode="outlined"
        style={[styles.texInput, { ...theme.fonts.bodyLarge }]}
        placeholder={t('common.namePlaceholder')}
        value={name}
        onChangeText={setName}
      />
      <Button
        onPress={navigateToAmountSetup}
        disabled={!name.trim()}
        labelStyle={styles.nextButtonLabel}
        style={styles.nextButton}
        mode="contained"
        icon={'arrow-right-circle-outline'}
      >
        {t('common.next')}
      </Button>
    </View>
  );
};

export default InitialAccountNameSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xxl,
  },
  headingContainer: {
    width: '80%',
  },
  texInput: {
    borderRadius: 10,
    width: '80%',
    fontSize: 20,
  },
  nextButton: { width: '40%', marginTop: 20 },
  nextButtonLabel: { fontSize: 18 },
});
