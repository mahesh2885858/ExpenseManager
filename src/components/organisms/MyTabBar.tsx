import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { uCFirst } from 'commonutil-core';
import { useEffect, useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import AppText from '../molecules/AppText';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const GAP = 4;

function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);
  const EACH_ROUTE_WIDTH = useMemo(() => {
    return (
      (SCREEN_WIDTH - (state.routes.length + 1) * GAP) / state.routes.length
    );
  }, [state.routes]);

  const focusedIndex = state.routes.findIndex(route => {
    const originalIndex = state.routes.findIndex(r => r.key === route.key);
    return state.index === originalIndex;
  });

  // Update slider position based on focused index
  const sliderPosition = useSharedValue(0);

  useEffect(() => {
    sliderPosition.value = withTiming(
      GAP + focusedIndex * (EACH_ROUTE_WIDTH + GAP),
      {
        duration: 100,
      },
    );
  }, [focusedIndex, sliderPosition, EACH_ROUTE_WIDTH]);

  return (
    <View style={[styles.container, {}]}>
      <View style={[styles.box]}>
        {/* Animated slider background */}
        <Animated.View
          style={[
            styles.slider,
            {
              backgroundColor: colors.surfaceContainerHighest,
              width: EACH_ROUTE_WIDTH,
              transform: [
                {
                  translateX: sliderPosition,
                },
              ],
            },
          ]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if (route.name === 'CustomButton') {
            return (
              <View
                style={[
                  styles.navigationItem,
                  {
                    position: 'relative',
                  },
                ]}
              >
                <PressableWithFeedback style={[styles.addIcon]}>
                  <Icon
                    source={'plus'}
                    size={textSize.xxxl}
                    color={colors.onPrimary}
                  />
                </PressableWithFeedback>
              </View>
            );
          }

          const routeIcon =
            route.name === 'Home'
              ? 'home-outline'
              : route.name === 'Transactions'
              ? 'history'
              : route.name === 'Budgets'
              ? 'hand-coin-outline'
              : 'chart-arc';

          return (
            <Pressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.navigationItem,
                {
                  opacity: pressed ? 0.5 : 1,
                  transform: [{ scale: pressed ? 0.7 : 1 }],
                  width: EACH_ROUTE_WIDTH,
                },
              ]}
            >
              <Icon source={routeIcon} size={27} color={colors.onSurface} />
              <AppText.Regular
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[styles.routeName]}
              >
                {uCFirst(route.name)}
              </AppText.Regular>
            </Pressable>
          );
        })}
      </View>
      {/* <View> */}
      <Pressable
        onPress={() => {
          navigation.navigate('AddTransaction', {
            mode: 'new',
          });
        }}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
            transform: [
              {
                scale: pressed ? 0.95 : 1,
              },
            ],
          },
        ]}
      >
        <Icon source={'plus'} color={colors.onPrimary} size={30} />
      </Pressable>
      {/* </View> */}
    </View>
  );
}

export default MyTabBar;

const createStyles = (colors: AppTheme['colors'], insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      flexDirection: 'row',
      paddingTop: spacing.sm,
      bottom: 0,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      backgroundColor: colors.surfaceContainer,
      paddingBottom: insets.bottom + 10,
      borderRadius: spacing.sm,
    },
    box: {
      flexDirection: 'row',
      width: '100%',
      gap: GAP,
      position: 'relative',
      paddingHorizontal: spacing.xs,
    },
    slider: {
      position: 'absolute',
      height: 65,
      borderRadius: borderRadius.md,
    },
    navigationItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      zIndex: 1,
    },
    fab: {
      borderRadius: 100,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    routeName: {
      fontSize: 10,
      color: colors.onSurface,
    },
    addIcon: {
      position: 'absolute',
      width: 65,
      height: 65,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.round,
      bottom: '70%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
