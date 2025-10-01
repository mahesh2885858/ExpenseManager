import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWithoutHeader = (props: ViewProps) => {
  const { top } = useSafeAreaInsets();
  return (
    <View {...props} style={[props.style, { paddingTop: top }]}>
      {props.children}
    </View>
  );
};

export default ScreenWithoutHeader;
