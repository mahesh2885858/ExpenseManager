import React from 'react';
import { Pressable, PressableProps } from 'react-native';

const PressableWithFeedback = (
  props: PressableProps & { hidden?: boolean },
) => {
  if (props.hidden) return null;
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.6 : props.disabled ? 0.5 : 1,
          transform: [
            {
              scale: pressed ? 0.99 : 1,
            },
          ],
        },
        props.style as any,
      ]}
    >
      {props.children}
    </Pressable>
  );
};

export default PressableWithFeedback;
