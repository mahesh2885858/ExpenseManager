import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, useAppTheme } from '../../../theme';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { TTransactionType } from '../../types';
const sectionHeight = 50;

type TProps = {
  type: TTransactionType;
  onChange: (type: TTransactionType) => void;
};

const TransactionTypeSwitch = (props: TProps) => {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);
  const highlightX = useSharedValue(2);

  const highlightAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: highlightX.value }],
    };
  });

  useEffect(() => {
    if (props.type === 'expense') {
      highlightX.value = withTiming(width > 0 ? width / 2 - 4 : width);
    } else {
      highlightX.value = withTiming(2);
    }
  }, [props.type, highlightX, width]);

  return (
    <View
      onLayout={e => {
        console.log({ e: e.nativeEvent.layout });
        setWidth(e.nativeEvent.layout.width);
      }}
      style={[
        styles.container,
        {
          borderColor: colors.onSurfaceDisabled,
        },
      ]}
    >
      <Animated.View
        style={[
          highlightAnimStyle,
          styles.highlighter,
          {
            backgroundColor: colors.primary,
            height: sectionHeight - 5,
            borderRadius: borderRadius.md,
          },
        ]}
      />
      <PressableWithFeedback
        onPress={e => {
          e.persist();
          props.onChange('income');
        }}
        style={[styles.button]}
      >
        <Text
          style={[
            {
              color:
                props.type === 'income'
                  ? colors.onPrimary
                  : colors.onSurfaceDisabled,
            },
          ]}
        >
          Income
        </Text>
      </PressableWithFeedback>
      <PressableWithFeedback
        onPress={() => props.onChange('expense')}
        style={[styles.button]}
      >
        <Text
          style={[
            {
              color:
                props.type === 'expense'
                  ? colors.onPrimary
                  : colors.onSurfaceDisabled,
            },
          ]}
        >
          Expense
        </Text>
      </PressableWithFeedback>
    </View>
  );
};

export default TransactionTypeSwitch;

const styles = StyleSheet.create({
  container: {
    height: sectionHeight,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlighter: {
    width: '50%',
    position: 'absolute',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
  },
});
