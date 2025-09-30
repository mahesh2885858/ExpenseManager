import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, Icon } from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../theme';

function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useAppTheme();
  const { buildHref } = useLinkBuilder();
  const { bottom } = useSafeAreaInsets();

  // Filter out 'CustomButton' routes to get actual tabs
  const filteredRoutes = state.routes.filter(
    route => route.name !== 'CustomButton',
  );
  const focusedIndex = filteredRoutes.findIndex(route => {
    const originalIndex = state.routes.findIndex(r => r.key === route.key);
    return state.index === originalIndex;
  });

  // Animated value for slider position
  const sliderPosition = useSharedValue(0);

  // Update slider position when focused tab changes
  useEffect(() => {
    sliderPosition.value = withTiming(focusedIndex, {
      duration: 100,
    });
  }, [focusedIndex, sliderPosition]);

  // Animated style for the slider background
  const sliderStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      sliderPosition.value,
      [0, filteredRoutes.length - 1],
      [0, (filteredRoutes.length - 1) * (200 / filteredRoutes.length)],
    );

    return {
      transform: [{ translateX: `${translateX}%` }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          bottom: bottom,
        },
      ]}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: colors.surfaceVariant,
          },
        ]}
      >
        {/* Animated slider background */}
        <Animated.View
          style={[
            styles.slider,
            {
              backgroundColor: colors.onSurfaceVariant,
              width: `${100 / filteredRoutes.length}%`,
            },
            sliderStyle,
          ]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          //   const label =
          //     options.tabBarLabel !== undefined
          //       ? options.tabBarLabel
          //       : options.title !== undefined
          //       ? options.title
          //       : route.name;

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
            return null;
          }

          return (
            <PlatformPressable
              key={route.key}
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.navigationItem}
            >
              <Icon
                source={route.name === 'Home' ? 'home' : 'history'}
                size={30}
                color={
                  isFocused ? colors.primaryContainer : colors.onSurfaceVariant
                }
              />
            </PlatformPressable>
          );
        })}
      </View>
      <View>
        <FAB
          icon={'plus'}
          mode="elevated"
          color={colors.onSurfaceVariant}
          size="large"
          style={[
            styles.fab,
            {
              backgroundColor: colors.surfaceVariant,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default MyTabBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  box: {
    flexDirection: 'row',
    borderRadius: 25,
    width: '50%',
    gap: 10,
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    height: 50,
    borderRadius: 100,
  },
  navigationItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    height: 50,
    width: 50,
    zIndex: 1,
  },
  fab: {
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
