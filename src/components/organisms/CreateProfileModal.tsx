import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AppText, { fontsMap } from '../molecules/AppText';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { useTranslation } from 'react-i18next';
import useProfiles from '../../hooks/useProfiles';
import useFetchRecords from '../../hooks/useFetchRecords';
import useHelpers from '../../hooks/useHelpers';
type TProps = {
  visible: boolean;
  onClose: () => void;
};
const CreateProfileModal = (props: TProps) => {
  const { onClose, visible } = props;
  const { colors } = useAppTheme();
  const { showErrorToast } = useHelpers();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const { createProfile } = useProfiles();
  const { fetchProfiles } = useFetchRecords();
  const [profileName, setProfileName] = useState('');

  const disableCreateBtn = useMemo(
    () => profileName.trim().length < 2,
    [profileName],
  );

  const onCreate = useCallback(async () => {
    try {
      await createProfile(profileName);
      await fetchProfiles();
      setProfileName('');
      onClose();
    } catch (e) {
      console.log('Error while creating profile: ', e);
      showErrorToast(e);
    }
  }, [createProfile, fetchProfiles, showErrorToast, profileName, onClose]);

  return (
    <Modal onRequestClose={onClose} visible={visible} transparent>
      <KeyboardAvoidingView
        onTouchStart={e => {
          e.stopPropagation();
          onClose();
        }}
        style={[styles.container]}
      >
        <View
          onTouchStart={e => {
            e.stopPropagation();
          }}
          style={[styles.content]}
        >
          {/*header start*/}
          <View style={[styles.header]}>
            <AppText.SemiBold style={[styles.headerText]}>
              {t('profileSetup.addNew')}
            </AppText.SemiBold>
            <PressableWithFeedback
              onPress={onClose}
              style={[styles.headerButton]}
            >
              <AppText.Regular style={[styles.headerBtnText]}>
                {t('common.cancel')}
              </AppText.Regular>
            </PressableWithFeedback>
          </View>
          {/*header ends*/}
          <View>
            <TextInput
              autoFocus
              style={[styles.texInput]}
              placeholder={t('profileSetup.placeholder')}
              placeholderTextColor={colors.onSurfaceDisabled}
              keyboardType="default"
              value={profileName}
              onChangeText={setProfileName}
            />
            <PressableWithFeedback
              disabled={disableCreateBtn}
              style={[styles.createBtn]}
              onPress={onCreate}
            >
              <AppText.Medium style={[styles.createBtnText]}>
                {t('profileSetup.create')}
              </AppText.Medium>
            </PressableWithFeedback>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateProfileModal;
const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
    },
    content: {
      backgroundColor: colors.surfaceContainerHighest,
      alignSelf: 'flex-end',
      flex: 1,
      paddingHorizontal: spacing.md,
      borderTopLeftRadius: borderRadius.md,
      borderTopRightRadius: borderRadius.md,
      padding: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    headerText: {
      fontSize: textSize.md,
      color: colors.onSurface,
    },
    headerButton: {
      backgroundColor: colors.surfaceContainerHigh,
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    headerBtnText: {
      color: colors.onSurface,
    },
    nameBox: {
      gap: spacing.sm,
    },

    texInput: {
      borderRadius: borderRadius.sm,
      fontSize: textSize.md,
      backgroundColor: colors.surfaceContainerHigh,
      fontFamily: fontsMap.SemiBold,
      color: colors.onSurface,
      paddingLeft: spacing.sm,
    },
    createBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginTop: spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    createBtnText: {
      color: colors.onPrimary,
    },
  });
