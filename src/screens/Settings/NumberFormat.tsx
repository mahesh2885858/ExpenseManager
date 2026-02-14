import { uCFirst } from 'commonutil-core';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import useUIStore from '../../stores/uiStore';
import { TNumberFormat } from '../../types';
import { formatAmount } from '../../utils';
import useAccounts from '../../hooks/useAccounts';

const AnimatedPressable = createAnimatedComponent(PressableWithFeedback);
const AnimatedView = createAnimatedComponent(View);

const formatOptionHeightExpanded = 200;
const formatOptionHeightCollapsed = 75;
const formatOptions: TNumberFormat[] = ['lakhs', 'millions'];
const { width } = Dimensions.get('screen');
const formatOptionWidth = 120;
const gap = (width - 2 * formatOptionWidth - 3 * spacing.md) / 3;
type Props = {
  onItemPress: (item: string | null) => void;
  expandedItem: string | null;
};
const NumberFormat = (props: Props) => {
  const { colors } = useAppTheme();

  const animHeight = useSharedValue(formatOptionHeightCollapsed);

  const numberFormat = useUIStore(state => state.numberFormat);
  const setNumberFormat = useUIStore(state => state.setNumberFormat);
  const highlightX = useSharedValue(
    (formatOptions.indexOf(numberFormat) + 1) * gap +
      formatOptionWidth * formatOptions.indexOf(numberFormat) +
      1,
  ); // x position of highlight

  const { currency } = useAccounts();

  const onPress = () => {
    props.onItemPress('format');
    // setExpandTheme(p => !p);
  };

  const changeTheme = (t: TNumberFormat) => {
    setNumberFormat(t);
    const index = formatOptions.indexOf(t);
    highlightX.value = withTiming(
      (index + 1) * gap + formatOptionWidth * index,
    );
  };

  // Animated style for the sliding highlight box
  const highlightAnimStyle = useAnimatedStyle(() => {
    return {
      left: highlightX.value,
    };
  });

  useEffect(() => {
    if (props.expandedItem === 'format') {
      animHeight.value = withTiming(formatOptionHeightExpanded);
    } else {
      animHeight.value = withTiming(formatOptionHeightCollapsed);
    }
  }, [props, animHeight]);

  return (
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
      <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
        <Icon
          color={colors.onBackground}
          source={'palette'}
          size={textSize.xxl}
        />
        <View
          style={[
            {
              gap: spacing.sm,
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
            Number format
          </Text>
          <Text
            style={[
              styles.settingDesc,
              {
                color: colors.onSurfaceDisabled,
              },
            ]}
          >
            {uCFirst(numberFormat)}
          </Text>
        </View>
      </View>
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
        {formatOptions.map(t => (
          <PressableWithFeedback
            key={t}
            onPress={() => changeTheme(t)}
            style={[styles.themeOption]}
          >
            <Text
              style={{
                color:
                  numberFormat === t
                    ? colors.onBackground
                    : colors.onSurfaceDisabled,
              }}
            >
              {formatAmount(
                100000,
                currency.symbol,
                t === 'lakhs' ? 'indian' : 'international',
              )}
            </Text>
            <Text
              style={{
                color:
                  numberFormat === t
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
  );
};

export default NumberFormat;

const styles = StyleSheet.create({
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
    justifyContent: 'space-evenly',
    marginTop: spacing.md,
    position: 'relative',
  },
  highlightBox: {
    position: 'absolute',
    width: 120,
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
    width: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    zIndex: 1, // Above highlight
    // backgroundColor: 'red',
  },
});
