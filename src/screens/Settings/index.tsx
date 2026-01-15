import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import HeaderWithBackButton from '../../components/atoms/HeaderWithBackButton';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import useUIStore from '../../stores/uiStore';
import { TTheme } from '../../types';
import { uCFirst } from 'commonutil-core';

const AnimatedPressable = createAnimatedComponent(PressableWithFeedback);
const AnimatedView = createAnimatedComponent(View);

const themeOptionHeightExpanded = 200;
const themeOptionHeightCollapsed = 75;
const themeOptions: TTheme[] = ['light', 'dark', 'system'];
const themeOptionWidth = 90;
const { width } = Dimensions.get('screen');
const themeOptionSpacing = (width - 2 * spacing.md - 3 * themeOptionWidth) / 4; // gap between options

const Settings = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const animHeight = useSharedValue(themeOptionHeightCollapsed);
  const [expandTheme, setExpandTheme] = useState(false);
  const theme = useUIStore(state => state.theme);
  const setTheme = useUIStore(state => state.setThem);
  const highlightX = useSharedValue(
    (themeOptions.indexOf(theme) - 1) * (themeOptionWidth + themeOptionSpacing),
  ); // x position of highlight

  const onPress = () => {
    setExpandTheme(p => !p);
  };

  const changeTheme = (t: TTheme) => {
    setTheme(t);
    // Calculate x position: index * (width + spacing)
    const index = themeOptions.indexOf(t);
    highlightX.value = withTiming(
      (index - 1) * (themeOptionWidth + themeOptionSpacing),
    );
  };

  // Animated style for the sliding highlight box
  const highlightAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: highlightX.value }],
    };
  });

  useEffect(() => {
    if (expandTheme) {
      animHeight.value = withTiming(themeOptionHeightExpanded);
    } else {
      animHeight.value = withTiming(themeOptionHeightCollapsed);
    }
  }, [expandTheme, animHeight]);

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
      <View>
        <AnimatedPressable
          onPress={onPress}
          style={[
            styles.setting,
            {
              borderColor: colors.onSurfaceDisabled,
              height: animHeight,
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
            Theme
          </Text>
          <Text
            style={[
              styles.settingDesc,
              {
                color: colors.onSurfaceDisabled,
              },
            ]}
          >
            {uCFirst(theme)}
          </Text>
          <View style={[styles.themeOptContainer]}>
            {/* Animated sliding highlight box */}
            <AnimatedView
              style={[
                styles.highlightBox,
                {
                  backgroundColor: colors.surfaceDisabled,
                  borderColor: colors.onSurfaceDisabled,
                },
                highlightAnimStyle,
              ]}
            />

            {/* Theme options */}
            {themeOptions.map(t => (
              <PressableWithFeedback
                key={t}
                onPress={() => changeTheme(t)}
                style={[styles.themeOption]}
              >
                <Icon
                  source={
                    t === 'light'
                      ? 'white-balance-sunny'
                      : t === 'dark'
                      ? 'weather-night'
                      : 'cellphone-cog'
                  }
                  size={24}
                  color={
                    theme === t ? colors.onBackground : colors.onSurfaceDisabled
                  }
                />
                <Text
                  style={{
                    color:
                      theme === t
                        ? colors.onBackground
                        : colors.onSurfaceDisabled,
                  }}
                >
                  {uCFirst(t)}
                </Text>
              </PressableWithFeedback>
            ))}
          </View>
        </AnimatedPressable>
        <PressableWithFeedback
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
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  Container: {},
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
