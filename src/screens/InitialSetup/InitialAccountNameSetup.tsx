import { NavigationProp, useNavigation } from '@react-navigation/native';
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
import { borderRadius, spacing, textSize } from '../../../theme';
import { TRootStackParamList } from '../../types';
import { gs } from '../../common/';

const InitialAccountNameSetup = () => {
  const { bottom, top } = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigation<NavigationProp<TRootStackParamList>>();
  const [name, setName] = useState('user');

  const navigateToAmountSetup = useCallback(() => {
    Keyboard.dismiss();
    navigate.navigate('AmountInput', { userName: name });
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
        <View style={[gs.flexRow, gs.itemsCenter]}>
          <Text
            style={[
              theme.fonts.displaySmall,
              gs.fontBold,
              {
                color: theme.colors.onBackground,
                marginRight: spacing.md,
              },
            ]}
          >
            {'Hi there'}
          </Text>
          <Icon source={'hand-wave'} size={60} color={theme.colors.tertiary} />
          <Text
            style={[
              theme.fonts.displaySmall,
              gs.fontBold,
              {
                color: theme.colors.onBackground,
              },
            ]}
          >
            {','}
          </Text>
        </View>

        <Text
          style={[
            theme.fonts.headlineSmall,

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
        style={[styles.texInput]}
        placeholder={t('common.namePlaceholder')}
        value={name}
        onChangeText={setName}
        autoFocus
        activeOutlineColor={theme.colors.inverseSurface}
        placeholderTextColor={theme.colors.onSurfaceDisabled}
      />
      <Button
        onPress={navigateToAmountSetup}
        disabled={!name.trim()}
        labelStyle={styles.nextButtonLabel}
        style={styles.nextButton}
        mode="contained"
        icon={'arrow-right-circle-outline'}
        buttonColor={theme.colors.inversePrimary}
        textColor={theme.colors.onPrimaryContainer}
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
