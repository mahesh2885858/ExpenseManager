import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import HeaderWithBackButton from '../../components/atoms/HeaderWithBackButton';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import Backup from './Backup';
import ThemeSwitch from './ThemeSwitch';

const Settings = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View
      style={[
        gs.fullFlex,
        {
          paddingTop: top + 10,
        },
      ]}
    >
      <HeaderWithBackButton headerText="Settings" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.Container}>
        <ThemeSwitch />
        <PressableWithFeedback
          onPress={() => {
            navigation.navigate('ManageAccounts');
          }}
          style={[
            styles.setting,
            {
              borderColor: colors.onSurfaceDisabled,
            },
          ]}
        >
          <Text
            style={[
              styles.settingTitle,
              {
                color: colors.onBackground,
              },
            ]}
          >
            Accounts
          </Text>
          <Text
            style={[
              styles.settingDesc,
              {
                color: colors.onSurfaceDisabled,
              },
            ]}
          >
            Manage your accounts here
          </Text>
        </PressableWithFeedback>
        <PressableWithFeedback
          onPress={() => {
            navigation.navigate('ManageCategories');
          }}
          style={[
            styles.setting,
            {
              borderColor: colors.onSurfaceDisabled,
            },
          ]}
        >
          <Text
            style={[
              styles.settingTitle,
              {
                color: colors.onBackground,
              },
            ]}
          >
            Categories
          </Text>
          <Text
            style={[
              styles.settingDesc,
              {
                color: colors.onSurfaceDisabled,
              },
            ]}
          >
            Manage your categories here
          </Text>
        </PressableWithFeedback>
        <Backup scrollRef={scrollRef} />
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  Container: {
    paddingBottom: 100,
  },
  setting: {
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
    overflow: 'hidden',
    height: 75,
  },
  settingTitle: {
    fontSize: textSize.lg,
    fontWeight: '500',
  },
  settingDesc: {
    fontSize: textSize.md,
    fontWeight: 'normal',
  },
  themeOptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    position: 'relative',
  },
  highlightBox: {
    position: 'absolute',
    width: 90,
    height: 80,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    zIndex: -1,
  },
  themeOption: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    width: 90,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    zIndex: 1, // Above highlight
  },
});
