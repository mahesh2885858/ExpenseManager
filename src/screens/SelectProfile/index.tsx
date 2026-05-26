import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import AppText from '../../components/molecules/AppText';
import useProfileStore from '../../stores/profileStore';
import { FlashList } from '@shopify/flash-list';
import useFetchRecords from '../../hooks/useFetchRecords';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import withOpacity from '../../utils/withOpacity';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CreateProfileModal from '../../components/organisms/CreateProfileModal';

const SelectProfile = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const { fetchProfiles } = useFetchRecords();
  const navigation = useNavigation();
  const profiles = useProfileStore(state => state.profiles);
  const setSelectedProfileId = useProfileStore(
    state => state.setSelectedProfileId,
  );
  const selectedProfileId = useProfileStore(state => state.selectedProfileId);

  const [visible, setVisible] = useState(false);

  const onProfilePress = useCallback(
    (id: string) => {
      setSelectedProfileId(id);
      navigation.goBack();
    },
    [setSelectedProfileId, navigation],
  );
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <ScreenWrapper>
      {/*header starts*/}
      <View style={[styles.header]}>
        <AppText.Bold style={[styles.headerTitle]}>
          {t('profileSetup.chooseAProfile')}
        </AppText.Bold>
        <AppText.Medium style={[styles.headerSubTitle]}>
          {t('profileSetup.chooseAProfileSub')}
        </AppText.Medium>
      </View>
      {/*header ends*/}
      {/*List starts*/}
      <View style={[styles.listContainer]}>
        <AppText.Regular style={[styles.listTitle]}>
          {t('profileSetup.yourProfiles')}
        </AppText.Regular>
        <FlashList
          data={profiles}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedProfileId;
            return (
              <PressableWithFeedback
                onPress={() => onProfilePress(item.id)}
                style={styles.profile}
              >
                {/* Icon */}
                <View style={[styles.iconBox]}>
                  <Icon source={'shape'} size={20} color={colors.onSurface} />
                </View>

                {/* Name */}
                <AppText.Regular style={styles.name}>
                  {item.name}
                </AppText.Regular>

                {/* Right side */}
                {isSelected ? (
                  <Icon source="check" size={20} color={colors.primary} />
                ) : (
                  <Icon
                    source="chevron-right"
                    size={20}
                    color={colors.onSurfaceDisabled}
                  />
                )}
              </PressableWithFeedback>
            );
          }}
          ListFooterComponent={
            <PressableWithFeedback
              onPress={() => setVisible(true)}
              style={[styles.addNewBtn]}
            >
              <AppText.Regular style={[styles.addNewText]}>
                {t('profileSetup.addNew')}
              </AppText.Regular>
            </PressableWithFeedback>
          }
        />
      </View>
      {/*List ends*/}
      <CreateProfileModal
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
      />
    </ScreenWrapper>
  );
};

export default SelectProfile;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: spacing.md,
    },
    headerTitle: {
      color: colors.onSurface,
      fontSize: textSize.lg,
    },
    headerSubTitle: {
      color: colors.onSurface,
      opacity: 0.4,
      fontSize: textSize.sm,
    },
    listContainer: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.md,
      flex: 1,
    },
    listTitle: {
      color: colors.onSurface,
      fontSize: textSize.md,
      marginBottom: spacing.sm,
    },
    profile: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surfaceContainer,
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },

    name: {
      flex: 1,
      fontSize: textSize.md,
      color: colors.onSurface,
    },
    addNewBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: withOpacity(colors.primaryContainer, 0.4),
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: borderRadius.md,
      marginTop: spacing.md,
    },
    addNewText: {
      fontSize: textSize.md,
      color: colors.onSurface,
      padding: spacing.md,
    },
  });
