import { Canvas } from '@shopify/react-native-skia';
import { max, scaleLinear } from 'd3';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { v4 as uuid } from 'uuid';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import { TGroupBy, TTransaction } from '../../types';
import {
  formatAmount,
  getDatesOfWeek,
  getMonthRangesOfYear,
  getNetForGivenTransactions,
  getWeekRangesOfMonth,
} from '../../utils';
import Bar from './Bar';
const { width } = Dimensions.get('screen');
const CHART_HEIGHT = 270;
const X_AXIS_ITEM_HEIGHT = 5;
const CHART_WIDTH = width - spacing.md * 4;
const spacingBetweenBarAndIndicator = 20;

type TProps = {
  data: TTransaction[];
  filter: TGroupBy;
  selectedRange: Array<Date>;
};

const Graph = (props: TProps) => {
  const { colors } = useAppTheme();
  const [focusedItem, setFocusedItem] = useState<Record<string, any> | null>(
    null,
  );

  const graphData = useMemo(() => {
    switch (props.filter) {
      case 'week': {
        const dates = getDatesOfWeek(props.selectedRange[0]);
        const data = dates.map(date => {
          const dataForThisDay = props.data.filter(d =>
            isSameDay(d.transactionDate, date),
          );
          const expense = getNetForGivenTransactions(
            dataForThisDay.filter(d => d.type === 'expense'),
          );
          const income = getNetForGivenTransactions(
            dataForThisDay.filter(d => d.type === 'income'),
          );
          return {
            total: getNetForGivenTransactions(dataForThisDay),
            expense,
            income,
            date,
          };
        });

        const maxValue = max(data.map(d => d.total));
        const hScale = scaleLinear(
          [0, maxValue ?? 0],
          [0, CHART_HEIGHT - spacingBetweenBarAndIndicator - 10],
        );

        const barWidth = (CHART_WIDTH - (data.length - 1) * 5) / data.length;
        const spacingBetweenBars = 5; // Need to be changed based on provided data
        const dataByDays = data.map((d, i) => {
          const x = i === 0 ? i : i * barWidth + i * spacingBetweenBars;
          const barHeight = hScale(d.total);
          let ratio = 0;
          if (d.total > 0) {
            ratio = d.expense / (d.income + d.expense);
          }

          return {
            id: uuid(),
            focusTex: format(d.date, 'MMMM dd'),
            bar: {
              height: d.total > 0 ? barHeight : 0,
              width: barWidth,
              x,
              y: CHART_HEIGHT - barHeight - spacingBetweenBarAndIndicator - 10,
              ratio,
              income: d.income,
              expense: d.expense,
            },
            info: {
              height: X_AXIS_ITEM_HEIGHT,
              width: barWidth,
              x,
              y: CHART_HEIGHT - X_AXIS_ITEM_HEIGHT - 20,
            },
            xAxisLabel: {
              text: format(d.date, 'EEE'),
              height: 10,
              width: barWidth,
              x,
              y: CHART_HEIGHT,
            },
          };
        });
        return dataByDays;
      }
      case 'month': {
        const weeks = getWeekRangesOfMonth(props.selectedRange[0]);
        const dataByWeeks = weeks.map(week => {
          const start = week[0];
          const end = week[1];
          const trnsForWeek = props.data.filter(tr => {
            return (
              !isBefore(tr.transactionDate, start) &&
              !isAfter(tr.transactionDate, end)
            );
          });
          const expense = trnsForWeek.filter(d => d.type === 'expense');
          const income = trnsForWeek.filter(d => d.type === 'income');

          return {
            total: getNetForGivenTransactions(trnsForWeek),
            expense: getNetForGivenTransactions(expense),
            income: getNetForGivenTransactions(income),
            week,
          };
        });

        const maxValue = max(dataByWeeks.map(d => d.total));
        const hScale = scaleLinear(
          [0, maxValue ?? 0],
          [0, CHART_HEIGHT - spacingBetweenBarAndIndicator - 10],
        );

        const barWidth =
          (CHART_WIDTH - (dataByWeeks.length - 1) * 5) / dataByWeeks.length;
        const spacingBetweenBars = 5;

        const data = dataByWeeks.map((d, i) => {
          const x = i === 0 ? i : i * barWidth + i * spacingBetweenBars;
          const barHeight = hScale(d.total);
          let ratio = 0;
          if (d.total > 0) {
            ratio = d.expense / (d.income + d.expense);
          }

          return {
            id: uuid(),
            focusTex:
              format(d.week[0], 'MMMM dd') + '-' + format(d.week[1], 'MMMM dd'),
            bar: {
              height: d.total > 0 ? barHeight : 0,
              width: barWidth,
              x,
              y: CHART_HEIGHT - barHeight - spacingBetweenBarAndIndicator - 10,
              ratio,
              income: d.income,
              expense: d.expense,
            },
            info: {
              height: X_AXIS_ITEM_HEIGHT,
              width: barWidth,
              x,
              y: CHART_HEIGHT - X_AXIS_ITEM_HEIGHT - 20,
            },
            xAxisLabel: {
              text: 'week' + (i + 1),
              height: 10,
              width: barWidth,
              x,
              y: CHART_HEIGHT,
            },
          };
        });

        return data;
      }
      case 'year': {
        const months = getMonthRangesOfYear(props.selectedRange[0]);
        const dataByMonths = months.map(month => {
          const start = month[0];
          const end = month[1];
          const trnsForMonth = props.data.filter(tr => {
            return (
              !isBefore(tr.transactionDate, start) &&
              !isAfter(tr.transactionDate, end)
            );
          });
          const expense = trnsForMonth.filter(d => d.type === 'expense');
          const income = trnsForMonth.filter(d => d.type === 'income');

          return {
            total: getNetForGivenTransactions(trnsForMonth),
            expense: getNetForGivenTransactions(expense),
            income: getNetForGivenTransactions(income),
            month: month,
          };
        });

        const maxValue = max(dataByMonths.map(d => d.total));

        const hScale = scaleLinear(
          [0, maxValue ?? 0],
          [0, CHART_HEIGHT - spacingBetweenBarAndIndicator - 10],
        );

        const barWidth =
          (CHART_WIDTH - (dataByMonths.length - 1) * 5) / dataByMonths.length;
        const spacingBetweenBars = 5;

        const data = dataByMonths.map((d, i) => {
          const x = i === 0 ? i : i * barWidth + i * spacingBetweenBars;
          const barHeight = hScale(d.total);
          let ratio = 0;
          if (d.total > 0) {
            ratio = d.expense / (d.income + d.expense);
          }

          return {
            id: uuid(),
            focusTex: format(d.month[0], 'MMM yyyy'),
            bar: {
              height: d.total > 0 ? barHeight : 0,
              width: barWidth,
              x,
              y: CHART_HEIGHT - barHeight - spacingBetweenBarAndIndicator - 10,
              ratio,
              income: d.income,
              expense: d.expense,
            },
            info: {
              height: X_AXIS_ITEM_HEIGHT,
              width: barWidth,
              x,
              y: CHART_HEIGHT - X_AXIS_ITEM_HEIGHT - 20,
            },
            xAxisLabel: {
              text: (i + 1).toString(),
              height: 10,
              width: barWidth,
              x,
              y: CHART_HEIGHT,
            },
          };
        });
        return data;
      }
      default:
        return [];
    }
  }, [props]);

  console.log({ graphData });

  const onGraphTouch = (e: GestureResponderEvent) => {
    e.persist();
    const touchX = e.nativeEvent.locationX;
    const itemsInTheRange = graphData.filter(item => {
      if (item.bar.x < touchX) return true;
      return false;
    });
    const intendedItem = itemsInTheRange[itemsInTheRange.length - 1];
    setFocusedItem(intendedItem);
  };

  useEffect(() => {
    setFocusedItem(null);
  }, [props.filter, props.selectedRange]);

  return (
    <>
      <Text
        style={[
          {
            color: colors.onPrimaryContainer,
            fontSize: textSize.lg,
          },
        ]}
      >
        {focusedItem?.focusTex}
      </Text>
      <Canvas
        onTouchEnd={onGraphTouch}
        style={{
          height: CHART_HEIGHT,
        }}
      >
        {graphData.map(({ id, bar, info, xAxisLabel }) => {
          return (
            <Fragment key={id}>
              <Bar
                colors={colors}
                isFocused={focusedItem?.id === id}
                item={{ bar, info, xAxisLabel }}
              />
            </Fragment>
          );
        })}
      </Canvas>
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
              styles.tTypeText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            {formatAmount(focusedItem?.bar?.income ?? 0)}
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
              styles.tTypeText,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            {formatAmount(focusedItem?.bar?.expense ?? 0)}
          </Text>
        </View>
      </View>
    </>
  );
};

export default Graph;

const styles = StyleSheet.create({
  tTypeBox: {
    borderRadius: borderRadius.md,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  tType: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  tTypeText: {
    fontSize: textSize.md,
    fontWeight: '700',
  },
});
