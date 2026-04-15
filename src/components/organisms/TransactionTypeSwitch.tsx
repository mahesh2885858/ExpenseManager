import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AppTheme, borderRadius, useAppTheme } from '../../../theme';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { TTransactionType } from '../../types';
import AppText from '../molecules/AppText';
import { useTranslation } from 'react-i18next';
const sectionHeight = 50;

type TProps = {
  type: TTransactionType;
  onChange: (type: TTransactionType) => void;
};

const TransactionTypeSwitch = (props: TProps) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
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
        setWidth(e.nativeEvent.layout.width);
      }}
      style={[styles.container]}
    >
      <Animated.View
        style={[
          highlightAnimStyle,
          styles.highlighter,
          {
            height: sectionHeight - 5,
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
        <AppText.Medium
          style={[
            {
              color:
                props.type === 'income'
                  ? colors.onPrimaryContainer
                  : colors.onSurface,
            },
          ]}
        >
          {t('common.income')}
        </AppText.Medium>
      </PressableWithFeedback>
      <PressableWithFeedback
        onPress={() => props.onChange('expense')}
        style={[styles.button]}
      >
        <AppText.Medium
          style={[
            {
              color:
                props.type === 'expense'
                  ? colors.onPrimaryContainer
                  : colors.onSurface,
            },
          ]}
        >
          {t('common.expense')}
        </AppText.Medium>
      </PressableWithFeedback>
    </View>
  );
};

export default TransactionTypeSwitch;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      height: sectionHeight,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: colors.outline,
    },
    highlighter: {
      width: '50%',
      position: 'absolute',
      backgroundColor: colors.primaryContainer,
      borderRadius: borderRadius.md,
    },
    button: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
    },
  });
