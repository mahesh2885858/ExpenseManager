import { LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';
import React, { Fragment, useEffect } from 'react';
import { AppTheme } from '../../../theme';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
type TBarProps = {
  item: any;
  isFocused: boolean;
  colors: AppTheme['colors'];
};
const Bar = (props: TBarProps) => {
  const { info, bar } = props.item;
  const isFocused = props.isFocused;
  const { colors } = props;

  const barHeight = useSharedValue(0);

  useEffect(() => {
    barHeight.value = withTiming(bar.height, {
      duration: 500,
      easing: Easing.cubic,
    });
  }, [bar, barHeight]);

  return (
    <Fragment>
      <RoundedRect
        x={info.x}
        y={info.y}
        height={info.height}
        r={8}
        width={info.width}
        color={isFocused ? colors.onSurfaceVariant : colors.onSurfaceDisabled}
      />

      <RoundedRect
        x={bar.x}
        y={bar.y}
        height={barHeight}
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
    </Fragment>
  );
};

export default Bar;
