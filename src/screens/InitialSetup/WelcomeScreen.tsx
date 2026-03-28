import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AppText from '../../components/molecules/AppText';

const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme.colors, insets);

  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.container]}>
      <View style={styles.headingContainer}>
        <View style={[gs.flexRow, gs.itemsCenter]}>
          <AppText.SemiBold style={[styles.appName]}>
            {t('common.appName')}
          </AppText.SemiBold>
        </View>
      </View>
      <View style={[styles.walletIconBox]}>
        <Icon source={'wallet'} size={96} />
      </View>
      <View style={[styles.details]}>
        <AppText.Bold style={[styles.welcomeText]}>
          {t('common.welcomeText')}
        </AppText.Bold>
        <AppText.Regular style={[styles.welcomSubText]}>
          {t('common.welcomeSubText')}
        </AppText.Regular>
        <PressableWithFeedback style={[styles.getStartedButton]}>
          <AppText.SemiBold style={[styles.getStartedText]}>
            {t('common.getStarted')}
          </AppText.SemiBold>
        </PressableWithFeedback>
        <PressableWithFeedback>
          <AppText.Regular style={[styles.alreadyHaveDataText]}>
            {t('common.alreadyHaveData')}
          </AppText.Regular>
        </PressableWithFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

export default WelcomeScreen;

const createStyles = (colors: AppTheme['colors'], insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      backgroundColor: colors.surface,
    },
    headingContainer: {
      width: '80%',
    },
    appName: {
      color: colors.onBackground,
      marginRight: spacing.md,
      fontSize: textSize.xxxl,
    },
    walletIconBox: { flex: 2, alignItems: 'center', justifyContent: 'center' },
    details: {
      flex: 3,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    welcomeText: {
      fontSize: textSize.xxxl,
      color: colors.onSurface,
      textAlign: 'center',
      paddingHorizontal: spacing.xxl,
    },
    welcomSubText: {
      fontSize: textSize.lg,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      paddingHorizontal: spacing.xxl,
    },
    getStartedButton: {
      backgroundColor: colors.primary,
      height: 60,
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.sm,
      marginTop: spacing.xl,
    },
    getStartedText: {
      fontSize: textSize.lg,
      color: colors.onPrimary,
    },
    alreadyHaveDataText: {
      color: colors.onSurface,
      fontSize: textSize.md,
      marginTop: spacing.md,
    },
  });
