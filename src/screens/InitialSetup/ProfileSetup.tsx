import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import {
  gs,
  MAX_PROFILE_NAME_LENGTH,
  MIN_PROFILE_NAME_LENGTH,
} from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AppText, { fontsMap } from '../../components/molecules/AppText';
import { useNavigation } from '@react-navigation/native';
import useProfiles from '../../hooks/useProfiles';

const ProfileSetup = () => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const styles = createStyles(theme.colors, insets);
  const { createProfile } = useProfiles();

  const [profileName, setProfileName] = useState('');

  const navigateToWalletSetup = useCallback(() => {
    navigation.navigate('WalletSetup');
  }, [navigation]);

  const next = useCallback(async () => {
    try {
      if (profileName.trim().length < MIN_PROFILE_NAME_LENGTH) {
        throw new Error(
          t('profileSetup.minNameLengthErr', {
            minLength: MIN_PROFILE_NAME_LENGTH,
          }),
        );
      }
      if (profileName.trim().length > MAX_PROFILE_NAME_LENGTH) {
        throw new Error(
          t('profileSetup.maxNameLengthErr', {
            maxLength: MAX_PROFILE_NAME_LENGTH,
          }),
        );
      }
      await createProfile(profileName);
      navigateToWalletSetup();
    } catch (e) {
      console.log({ e });
      const message = e instanceof Error ? e.message : t('common.unknownErr');
      ToastAndroid.show(message, 2000);
    }
  }, [profileName, t, createProfile, navigateToWalletSetup]);

  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.container]}>
      <View style={styles.headingContainer}>
        <View style={[gs.flexRow, gs.centerItems]}>
          <AppText.SemiBold style={[styles.appName]}>
            {t('profileSetup.title')}
          </AppText.SemiBold>
        </View>
      </View>
      <View style={[styles.walletIconBox]}>
        <Icon source={'account-plus-outline'} size={96} />
      </View>
      <View style={[styles.details]}>
        <AppText.Bold style={[styles.welcomeText]}>
          {t('common.welcomeText')}
        </AppText.Bold>

        {/*profile name strats*/}
        <View style={[{ paddingHorizontal: spacing.md, gap: spacing.xs }]}>
          <AppText.SemiBold
            style={[
              {
                fontSize: textSize.md,
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {t('profileSetup.name')}
          </AppText.SemiBold>
          <TextInput
            autoFocus
            style={[styles.texInput]}
            placeholder={t('profileSetup.placeholder')}
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            keyboardType="default"
            value={profileName}
            onChangeText={setProfileName}
          />
        </View>
        {/*profile name ends*/}

        <PressableWithFeedback onPress={next} style={[styles.getStartedButton]}>
          <AppText.SemiBold style={[styles.getStartedText]}>
            {t('common.next')}
          </AppText.SemiBold>
        </PressableWithFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileSetup;

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
      width: '100%',
    },
    appName: {
      color: colors.onBackground,
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
    texInput: {
      borderRadius: borderRadius.sm,
      fontSize: textSize.md,
      backgroundColor: colors.surfaceContainerHigh,
      fontFamily: fontsMap.SemiBold,
      color: colors.onSurface,
      paddingLeft: spacing.sm,
      width: '80%',
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
