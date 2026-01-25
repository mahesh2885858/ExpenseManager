/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from '@react-navigation/native';
import { uCFirst } from 'commonutil-core';
import {
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isThisMonth,
  isThisWeek,
  isThisYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import Graph from '../../components/organisms/Graph';
import useTransactions from '../../hooks/useTransactions';
import useTransactionsStore from '../../stores/transactionsStore';
import { TGroupBy } from '../../types';
import { formatAmount } from '../../utils';

const { width } = Dimensions.get('window');
console.log({ width });

const start: Record<TGroupBy, Function> = {
  month: startOfMonth,
  week: startOfWeek,
  year: startOfYear,
};
const end: Record<TGroupBy, Function> = {
  month: endOfMonth,
  week: endOfWeek,
  year: endOfYear,
};

const add: Record<TGroupBy, Function> = {
  month: addMonths,
  week: addWeeks,
  year: addYears,
};

const sub: Record<TGroupBy, Function> = {
  month: subMonths,
  week: subWeeks,
  year: subYears,
};

const Reports = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const resetFilters = useTransactionsStore(state => state.resetFilters);
  const { filteredTransactions } = useTransactions({});
  // sort
  filteredTransactions.sort(
    (a, b) =>
      new Date(a.transactionDate).getTime() -
      new Date(b.transactionDate).getTime(),
  );

  // filter states
  const [groupBy, setGroupBy] = useState<TGroupBy>('week');

  const [currentRange, setCurrentRange] = useState<Array<Date>>([
    startOfWeek(new Date()),
    endOfWeek(new Date()),
  ]);

  const resetRange = () => {
    setCurrentRange([start[groupBy](new Date()), end[groupBy](new Date())]);
  };

  const increaseRangeByOne = () => {
    setCurrentRange(p => {
      return [add[groupBy](p[0], 1), add[groupBy](p[1], 1)];
    });
  };

  const decreaseRangeByOne = () => {
    setCurrentRange(p => {
      return [sub[groupBy](p[0], 1), sub[groupBy](p[1], 1)];
    });
  };

  const formattedText = useMemo(() => {
    let text = '';
    if (!currentRange[0] || !currentRange[1]) return text;
    switch (groupBy) {
      case 'month':
        if (isThisMonth(currentRange[0])) {
          text = 'This month';
        } else {
          text = format(currentRange[0], 'MMMM yyyy');
        }
        break;
      case 'week':
        if (isThisWeek(currentRange[0])) {
          text = 'This week';
        } else {
          text =
            format(currentRange[0], 'MMM dd') +
            ' - ' +
            format(currentRange[1], 'MMM dd');
        }
        break;
      case 'year':
        if (isThisYear(currentRange[0])) {
          text = 'This year';
        } else {
          text = format(currentRange[0], 'yyyy');
        }
        break;
      default:
        text = '';
        break;
    }
    return text;
  }, [groupBy, currentRange]);

  const handleBackPress = useCallback(
    (isEvent = false) => {
      resetFilters();
      if (isEvent) {
        return false;
      } else {
        navigation.goBack();
      }
    },
    [navigation, resetFilters],
  );

  const changeFilter = (filter: TGroupBy) => {
    const date = new Date();
    setGroupBy(filter);
    switch (filter) {
      case 'month':
        setCurrentRange([startOfMonth(date), endOfMonth(date)]);
        break;
      case 'year':
        setCurrentRange([startOfYear(date), endOfYear(date)]);
        break;
      case 'week':
      default:
        setCurrentRange([startOfWeek(date), endOfWeek(date)]);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackPress(true),
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const graphData = useMemo(() => {
    const start = currentRange[0];
    const end = currentRange[1];
    const result = filteredTransactions.filter(
      t =>
        !isBefore(t.transactionDate, start) && !isAfter(t.transactionDate, end),
    );
    const t = result.reduce(
      (prev, item) => {
        return {
          ...prev,
          expense:
            item.type === 'expense' ? prev.expense + item.amount : prev.expense,
          income:
            item.type === 'income' ? prev.income + item.amount : prev.income,
        };
      },
      {
        expense: 0,
        income: 0,
      } as Record<'income' | 'expense', number>,
    );
    return {
      result,
      summary: t,
    };
  }, [currentRange, filteredTransactions]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: top + 5,
        },
      ]}
    >
      {/* header section */}
      <View
        style={[
          gs.flexRow,
          gs.itemsCenter,
          gs.justifyBetween,

          {
            paddingHorizontal: spacing.md,
            marginTop: spacing.sm,
          },
        ]}
      >
        <Text
          style={[
            gs.fontBold,
            {
              fontSize: textSize.lg,

              color: colors.onBackground,
            },
          ]}
        >
          Reports
        </Text>
        <PressableWithFeedback
          hidden
          style={[
            {
              paddingHorizontal: spacing.md,
              borderRadius: borderRadius.pill,
              backgroundColor: colors.inversePrimary,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <Text
            style={[
              gs.centerText,
              {
                color: colors.onPrimaryContainer,
                fontSize: textSize.md,
              },
            ]}
          >
            {uCFirst(groupBy)}
          </Text>
        </PressableWithFeedback>
      </View>
      {/* select group by filter */}
      <Animated.View
        style={[gs.flexRow, gs.itemsCenter, styles.groupByContainer]}
      >
        <PressableWithFeedback
          onPress={() => {
            changeFilter('week');
          }}
          style={[
            gs.fullFlex,
            styles.groupByBtn,

            {
              borderColor:
                groupBy === 'week' ? 'transparent' : colors.surfaceDisabled,
              backgroundColor:
                groupBy === 'week' ? colors.inversePrimary : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.groupByText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            Week
          </Text>
        </PressableWithFeedback>
        <PressableWithFeedback
          onPress={() => {
            changeFilter('month');
          }}
          style={[
            gs.fullFlex,
            styles.groupByBtn,

            {
              borderColor:
                groupBy === 'month' ? 'transparent' : colors.surfaceDisabled,
              backgroundColor:
                groupBy === 'month' ? colors.inversePrimary : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.groupByText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            Month
          </Text>
        </PressableWithFeedback>
        <PressableWithFeedback
          onPress={() => {
            changeFilter('year');
          }}
          style={[
            gs.fullFlex,
            styles.groupByBtn,

            {
              borderColor:
                groupBy === 'year' ? 'transparent' : colors.surfaceDisabled,
              backgroundColor:
                groupBy === 'year' ? colors.inversePrimary : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.groupByText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            Year
          </Text>
        </PressableWithFeedback>
      </Animated.View>

      <View style={[gs.fullFlex]}>
        {/* navigate dates */}
        <View style={[gs.flexRow, gs.itemsCenter, styles.navigateDateBox]}>
          <View
            style={[styles.rangeBox, gs.flexRow, gs.itemsCenter, gs.fullFlex]}
          >
            <Text
              style={[
                styles.rangeText,
                {
                  color: colors.onPrimaryContainer,
                },
              ]}
            >
              {formattedText}
            </Text>
            <PressableWithFeedback
              style={[gs.centerItems]}
              onPress={resetRange}
            >
              <Icon size={textSize.md} source={'reload'} />
            </PressableWithFeedback>
          </View>
          <View style={[styles.navBtnBox, gs.flexRow, gs.itemsCenter]}>
            <PressableWithFeedback
              onPress={decreaseRangeByOne}
              style={[
                styles.navBtn,
                {
                  backgroundColor: colors.surfaceVariant,
                },
              ]}
            >
              <Icon source={'chevron-left'} size={textSize.xl} />
            </PressableWithFeedback>
            <PressableWithFeedback
              onPress={increaseRangeByOne}
              style={[
                styles.navBtn,
                {
                  backgroundColor: colors.surfaceVariant,
                },
              ]}
            >
              <Icon source={'chevron-right'} size={textSize.xl} />
            </PressableWithFeedback>
          </View>
        </View>
        {/* summary */}
        <View
          style={[
            styles.summary,
            {
              backgroundColor: colors.inverseOnSurface,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            Summary
          </Text>
          <View style={[styles.tTypeBox, gs.flexRow, gs.itemsCenter]}>
            <View
              style={[
                gs.fullFlex,
                styles.tType,
                {
                  backgroundColor: colors.surfaceVariant,
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: colors.onSurfaceVariant,
                  },
                ]}
              >
                Income
              </Text>
              <Text
                style={[
                  {
                    color: colors.onPrimaryContainer,
                    fontSize: textSize.md,
                    fontWeight: '700',
                  },
                ]}
              >
                {formatAmount(graphData.summary.income)}
              </Text>
            </View>
            <View
              style={[
                gs.fullFlex,
                styles.tType,
                {
                  backgroundColor: colors.surfaceVariant,
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: colors.onSurfaceVariant,
                  },
                ]}
              >
                Expense
              </Text>
              <Text
                style={[
                  {
                    color: colors.onPrimaryContainer,
                    fontSize: textSize.md,
                    fontWeight: '700',
                  },
                ]}
              >
                {formatAmount(graphData.summary.expense)}
              </Text>
            </View>
          </View>
        </View>
        {/* Graph container */}
        <View
          style={[
            styles.summary,
            {
              backgroundColor: colors.inverseOnSurface,
            },
          ]}
        >
          <Graph
            data={graphData.result}
            selectedRange={currentRange}
            filter={groupBy}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 200,
  },
  typeButton: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  groupByBtn: {
    borderRadius: borderRadius.pill,
    borderWidth: 0.5,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  groupByContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  groupByText: {
    fontSize: textSize.sm,
  },
  navigateDateBox: {
    paddingHorizontal: spacing.md,
  },
  rangeBox: {
    gap: spacing.sm,
  },
  rangeText: {
    fontSize: textSize.lg,
  },
  navBtnBox: {
    gap: spacing.md,
  },
  navBtn: {
    borderRadius: borderRadius.round,
    padding: spacing.sm,
  },
  summary: {
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  summaryText: {
    fontSize: textSize.lg,
  },
  tTypeBox: {
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  tType: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
});
