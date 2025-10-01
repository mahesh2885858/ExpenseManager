import React from 'react';
import { Pressable, PressableProps } from 'react-native';

const PressableWithFeedback = (props: PressableProps) => {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.6 : 1,
        },
        props.style as any,
      ]}
    >
      {props.children}
    </Pressable>
  );
};

export default PressableWithFeedback;
