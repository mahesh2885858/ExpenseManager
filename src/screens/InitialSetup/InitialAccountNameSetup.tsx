import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize } from '../../../theme';
import { TRootStackParamList } from '../../types';
import { gs } from '../../common/';

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
          {t('common.pickName')}
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
    </KeyboardAvoidingView>
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
    borderRadius: borderRadius.lg,
    width: '80%',
    fontSize: textSize.lg,
  },
  nextButton: { width: '40%' },
  nextButtonLabel: { fontSize: textSize.md },
});
