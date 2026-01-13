import {
  LinearGradient,
  RoundedRect,
  Text,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import React, { Fragment, useEffect } from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AppTheme } from '../../../theme';
type TBarProps = {
  item: any;
  isFocused: boolean;
  colors: AppTheme['colors'];
};
const Bar = (props: TBarProps) => {
  const { info, bar, xAxisLabel } = props.item;
  const isFocused = props.isFocused;
  const { colors } = props;
  const font1 = useFont(require('../../../assets/fonts/Inter-Medium.ttf'));

  const textWidth = font1?.measureText(String(props.item.xAxisLabel.text));
  const centeredX = info.x + info.width / 2 - (textWidth?.width ?? 0) / 2;

  const animatedHeight = useSharedValue(0);
  const animatedWidth = useSharedValue(0);

  const animatedY = useDerivedValue(() => {
    return bar.y + bar.height - animatedHeight.value;
  });

  useEffect(() => {
    animatedHeight.value = withTiming(bar.height, {
      duration: 500,
      easing: Easing.cubic,
    });
  }, [bar, animatedHeight]);

  useEffect(() => {
    if (isFocused) {
      animatedWidth.value = withTiming(info.width, {
        duration: 200,
        easing: Easing.ease,
      });
    } else {
      animatedWidth.value = 0;
    }
  }, [isFocused, animatedWidth, info]);

  return (
    <Fragment>
      <RoundedRect
        x={info.x}
        y={info.y}
        height={info.height}
        r={8}
        width={info.width}
        color={colors.onSurfaceDisabled}
      />
      {/* to animate the highlighting of info bar */}
      <RoundedRect
        x={info.x}
        y={info.y}
        height={info.height}
        r={8}
        width={animatedWidth}
        color={colors.onSurfaceVariant}
      />

      <RoundedRect
        x={bar.x}
        y={animatedY}
        height={animatedHeight}
        r={8}
        width={bar.width}
        color={colors.onSurfaceVariant}
      >
        <LinearGradient
          colors={[
            colors.error,
            colors.error,
            colors.tertiary,
            colors.tertiary,
          ]}
          end={vec(bar.x, bar.y + bar.height)}
          start={vec(bar.x, bar.y)}
          positions={[0, bar.ratio, bar.ratio, 1]}
        />
      </RoundedRect>
      <Text
        text={xAxisLabel.text}
        x={centeredX}
        y={xAxisLabel.y}
        font={font1}
        color={isFocused ? colors.onSurfaceVariant : colors.onSurfaceDisabled}
      />
    </Fragment>
  );
};

export default Bar;
