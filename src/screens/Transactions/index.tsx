import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import RenderTransactions from '../../components/RenderTransactions';
import useGetTransactions from '../../hooks/useGetTransactions';
import { TBottomTabParamList, TTransaction } from '../../types';
import { isThisMonth, isThisWeek, isThisYear, isToday } from 'date-fns';

const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<TBottomTabParamList>>();
  const transactions = useGetTransactions();
  const filters = ['Today', 'This week', 'This month', 'This year', 'All'];
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [renderFilters, setRenderFilters] = useState(false);
  const heightValue = useSharedValue(0);
  const marginTop = useSharedValue(0);

  const transactionsToRender = useMemo(() => {
    let filtered: TTransaction[] = [];
    switch (selectedFilter) {
      case 'All':
        filtered = transactions;
        break;
      case 'Today':
        filtered = transactions.filter(t => isToday(t.transactionDate));

        break;

      case 'This week':
        filtered = transactions.filter(t => {
          return isThisWeek(t.transactionDate);
        });
        break;

      case 'This month':
        filtered = transactions.filter(t => isThisMonth(t.transactionDate));
        break;

      case 'This year':
        filtered = transactions.filter(t => isThisYear(t.transactionDate));
        break;
      default:
        filtered = transactions;
        break;
    }
    return filtered;
  }, [selectedFilter, transactions]);

  useEffect(() => {
    if (renderFilters) {
      heightValue.value = withTiming(70);
      marginTop.value = withTiming(spacing.md);
    } else {
      heightValue.value = withTiming(0);
      marginTop.value = withTiming(0);
    }
  }, [renderFilters, heightValue, marginTop]);

  return (
    <ScrollView
      nestedScrollEnabled={true}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: top + 5,
        },
      ]}
    >
      {/* header section */}
      {
        <View
          style={[
            {
              paddingHorizontal: spacing.lg,
              gap: spacing.md,
            },
            gs.flexRow,
            gs.itemsCenter,
            gs.justifyBetween,
          ]}
        >
          <View
            style={[
              gs.flexRow,
              gs.centerItems,
              {
                gap: spacing.md,
              },
            ]}
          >
            <Pressable onPress={navigation.goBack}>
              <Icon size={24} source={'arrow-left'} />
            </Pressable>
            <Text
              style={[
                gs.fontBold,
                {
                  fontSize: textSize.lg,
                  color: theme.colors.onBackground,
                },
              ]}
            >
              Transactions
            </Text>
          </View>
          <PressableWithFeedback
            onPress={() => setRenderFilters(p => !p)}
            style={[
              {
                backgroundColor: theme.colors.surfaceVariant,
                padding: spacing.xs,
                paddingHorizontal: spacing.md,
                borderRadius: borderRadius.pill,
              },
            ]}
          >
            <Text
              style={[
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.md,
                },
              ]}
            >
              Filters
            </Text>
          </PressableWithFeedback>
        </View>
      }
      {/* filters section */}

      <Animated.View
        style={[
          styles.filterBox,
          gs.flexRow,
          {
            height: heightValue,
            marginTop,
          },
        ]}
      >
        {filters.map(item => {
          const isSelected = selectedFilter === item;
          return (
            <PressableWithFeedback
              onPress={() => setSelectedFilter(item)}
              style={[
                styles.filterItem,
                {
                  borderColor: isSelected
                    ? theme.colors.secondaryContainer
                    : theme.colors.onSecondaryContainer,
                  backgroundColor: isSelected
                    ? theme.colors.secondaryContainer
                    : theme.colors.surface,
                },
              ]}
              key={item}
            >
              <Text
                style={{
                  color: theme.colors.onPrimaryContainer,
                  fontSize: textSize.sm,
                }}
              >
                {item}
              </Text>
            </PressableWithFeedback>
          );
        })}
      </Animated.View>

      {/* recent transactions section */}
      <View
        style={[
          {
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <View style={[gs.fullFlex]}>
          {transactionsToRender.length === 0 ? (
            <Text
              style={[
                gs.fontBold,
                gs.centerText,
                {
                  color: theme.colors.onSurfaceDisabled,
                  fontSize: textSize.lg,
                  marginTop: spacing.lg,
                },
              ]}
            >
              No transactions yet!!
            </Text>
          ) : (
            <RenderTransactions transactions={transactionsToRender} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 200,
  },
  avatar: {
    height: 45,
    width: 45,
  },
  totalBalance: {
    width: '100%',
  },
  amountText: {
    fontWeight: '500',
  },
  ieBox: {
    flex: 1,
    paddingLeft: spacing.lg,
    gap: spacing.xs,
  },
  ieBanner: {
    fontWeight: 'semibold',
  },
  filterBox: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  filterItem: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
});
