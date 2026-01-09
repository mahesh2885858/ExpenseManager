import { Canvas } from '@shopify/react-native-skia';
import { max, scaleLinear } from 'd3';
import { isSameDay } from 'date-fns';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
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
import { getDatesOfWeek, getNetForGivenTransactions } from '../../utils';
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
  console.log({
    ...props,
    date: props.selectedRange.map(t => t.toString()),
  });
  const { colors } = useAppTheme();
  const [focusedItem, setFocusedItem] = useState<Record<string, any> | null>(
    null,
  );

  const yAxisData = useMemo(
    () => [
      { income: 1200, expense: 3400 },
      { income: 1800, expense: 2200 },
      { income: 2500, expense: 1900 },
      { income: 900, expense: 1500 },
      { income: 3200, expense: 2800 },
      { income: 4100, expense: 3600 },
      { income: 1500, expense: 1700 },
      { income: 2700, expense: 2300 },
      { income: 3600, expense: 4200 },
      { income: 5000, expense: 3100 },
      { income: 2200, expense: 2600 },
      { income: 3900, expense: 3400 },
    ],
    [],
  );

  const realData = useMemo(() => {
    switch (props.filter) {
      case 'week':
        const dates = getDatesOfWeek(props.selectedRange[0]);
        const trns = [];
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
          };
        });

        const maxValue = max(data.map(d => d.total));
        const hScale = scaleLinear(
          [0, maxValue ?? 0],
          [0, CHART_HEIGHT - spacingBetweenBarAndIndicator],
        );

        const barWidth = (CHART_WIDTH - (data.length - 1) * 5) / data.length;
        const spacingBetweenBars = 5; // Need to be changed based on provided data

        const d = data.map((d, i) => {
          const x = i === 0 ? i : i * barWidth + i * spacingBetweenBars;
          const barHeight = hScale(d.total);
          let ratio = 0;
          if (d.total > 0) {
            ratio = d.expense / (d.income + d.expense);
          }

          return {
            id: uuid(),
            bar: {
              height: barHeight,
              width: barWidth,
              x,
              y: CHART_HEIGHT - barHeight - spacingBetweenBarAndIndicator,
              ratio,
              income: d.income,
              expense: d.expense,
            },
            info: {
              height: X_AXIS_ITEM_HEIGHT,
              width: barWidth,
              x,
              y: CHART_HEIGHT - X_AXIS_ITEM_HEIGHT,
            },
          };
        });

        return d;
      default:
        return [];
    }
  }, [props]);

  console.log({ realData });

  const xAxisData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const barWidth =
    (CHART_WIDTH - (xAxisData.length - 1) * 5) / xAxisData.length;

  const maxValue = yAxisData.reduce((max, item) => {
    return Math.max(max, item.income + item.expense);
  }, 0);

  const renderHeightForBar = useCallback(
    (value: number) => {
      return Math.round((value * (CHART_HEIGHT - 20)) / maxValue);
    },
    [maxValue],
  );

  const data = useMemo(() => {
    const spacingBetweenBars = 5; // Need to be changed based on provided data

    return yAxisData.map((t, i) => {
      const x = i === 0 ? i : i * barWidth + i * spacingBetweenBars;
      const barHeight = renderHeightForBar(t.expense + t.income);
      return {
        id: uuid(), //internal id for various operations
        bar: {
          x,
          y: CHART_HEIGHT - barHeight - spacingBetweenBarAndIndicator,
          width: barWidth,
          height: barHeight,
          ratio: t.expense / (t.income + t.expense),
          income: t.income,
          expense: t.expense,
        },
        info: {
          x,
          y: CHART_HEIGHT - X_AXIS_ITEM_HEIGHT,
          width: barWidth,
          height: X_AXIS_ITEM_HEIGHT,
        },
      };
    });
  }, [barWidth, renderHeightForBar, yAxisData]);

  const onGraphTouch = (e: GestureResponderEvent) => {
    e.persist();
    console.log({ e: e.nativeEvent, data });
    const touchX = e.nativeEvent.locationX;
    const itemsInTheRange = realData.filter(item => {
      if (item.bar.x < touchX) return true;
      return false;
    });
    const intendedItem = itemsInTheRange[itemsInTheRange.length - 1];
    setFocusedItem(intendedItem);
  };

  return (
    <>
      <Canvas
        onTouchEnd={onGraphTouch}
        style={{
          height: CHART_HEIGHT,
        }}
      >
        {realData.map(({ id, bar, info }) => {
          return (
            <Fragment key={id}>
              <Bar
                colors={colors}
                isFocused={focusedItem?.id === id}
                item={{ bar, info }}
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
            {focusedItem?.bar?.income ?? 0}
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
            {focusedItem?.bar?.expense ?? 0}
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
