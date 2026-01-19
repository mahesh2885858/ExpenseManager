import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  createAnimatedComponent,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from './PressableWithFeedback';

const SWITCH_WIDTH = 50;
const SWITCH_HEIGHT = 25 + 5;
const THUMB_WIDTH = 25;
const THUMB_HEIGHT = 25;

type TProps = {
  isOn: boolean;
  onStateChange: (state: boolean) => void;
};

const AnimatedPressable = createAnimatedComponent(PressableWithFeedback);

const Switch = (props: TProps) => {
  const { colors } = useAppTheme();
  const x = useSharedValue(0);
  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        x.value,
        [0, 1],
        ['transparent', colors.success],
      ),
    };
  });
  const animatedThumbBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        x.value,
        [0, 1],
        ['white', colors.onSuccess],
      ),
    };
  });

  const onChange = () => {
    props.onStateChange(!props.isOn);
  };

  useEffect(() => {
    if (props.isOn) {
      const d = SWITCH_WIDTH - THUMB_WIDTH - 3;
      x.value = withTiming(d, {
        duration: 500,
      });
    } else {
      x.value = withTiming(0, {
        duration: 500,
      });
    }
  }, [props, x]);

  return (
    <AnimatedPressable
      onPress={() => {
        onChange();
      }}
      style={[
        styles.box,
        gs.justifyCenter,
        animatedBgStyle,
        {
          width: SWITCH_WIDTH,
          height: SWITCH_HEIGHT,
          borderRadius: borderRadius.xl,
          borderColor: colors.onSurfaceDisabled,
        },
      ]}
    >
      <Animated.View
        style={[
          animatedThumbBgStyle,
          {
            width: THUMB_WIDTH,
            height: THUMB_HEIGHT,
            borderRadius: borderRadius.round,
            transform: [{ translateX: x }],
          },
        ]}
      />
    </AnimatedPressable>
  );
};

export default Switch;

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    paddingHorizontal: 1,
  },
});
