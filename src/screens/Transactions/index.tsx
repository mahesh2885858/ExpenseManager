/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CurveType,
  LineChart,
  lineDataItem,
  Pointer,
} from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import CommonHeader from '../../components/organisms/CommonHeader';
import useGetTransactions from '../../hooks/useGetTransactions';
import useTransactionsStore from '../../stores/transactionsStore';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import { TTransactionType } from '../../types';
import { VictoryChart, VictoryArea } from 'victory-native';
const { width } = Dimensions.get('window');
console.log({ width });
const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const resetFilters = useTransactionsStore(state => state.resetFilters);
  const { filteredTransactions } = useGetTransactions();
  const [type, setType] = useState<TTransactionType>('income');

  // sort
  filteredTransactions.sort(
    (a, b) =>
      new Date(a.transactionDate).getTime() -
      new Date(b.transactionDate).getTime(),
  );

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

  const expenseGraphData: Array<lineDataItem> = useMemo(() => {
    const expenseData = filteredTransactions.filter(t => t.type === 'expense');

    return expenseData.map(e => {
      return {
        value: e.amount,
        transactionDate: e.transactionDate,
        type: e.type,
      } as lineDataItem;
    });
  }, [filteredTransactions]);

  const incomeGraphData: Array<lineDataItem> = useMemo(() => {
    const incomeData = filteredTransactions.filter(t => t.type === 'income');

    return incomeData.map(e => {
      return {
        value: e.amount,
        transactionDate: e.transactionDate,
        type: e.type,
      } as lineDataItem;
    });
  }, [filteredTransactions]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackPress(true),
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const pointer: Pointer = {
    pointerLabelComponent: (items: Array<any>) => {
      return (
        <View
          style={{
            height: 120,
            width: 100,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 4,
          }}
        >
          <Text>{items[0].type}</Text>
          <Text>{'Amount: ' + (items[0].value ?? '')}</Text>
          <Text>
            {'Date: ' + format(new Date(items[0].transactionDate), 'MMM dd')}
          </Text>
        </View>
      );
    },
  };

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

      <CommonHeader />

      {/* recent transactions section */}
      <View style={[gs.fullFlex]}>
        {filteredTransactions.length < 2 ? (
          <View style={[gs.fullFlex, gs.centerItems]}>
            <Text
              style={[
                gs.fontBold,
                {
                  color: colors.onSurfaceVariant,
                  fontSize: textSize.lg,
                },
              ]}
            >
              Not enough transactions!!
            </Text>
          </View>
        ) : (
          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <View
              style={[
                {
                  paddingHorizontal: spacing.md,
                  marginBottom: spacing.md,
                  gap: spacing.lg,
                },
                gs.flexRow,
                gs.itemsCenter,
              ]}
            >
              <PressableWithFeedback
                style={[
                  gs.fullFlex,
                  styles.typeButton,
                  {
                    backgroundColor:
                      type === 'income' ? colors.inversePrimary : 'transparent',
                    borderWidth: 0.5,
                    borderColor:
                      type === 'income'
                        ? 'transparent'
                        : colors.onSurfaceDisabled,
                  },
                ]}
                onPress={() => setType('income')}
              >
                <Text
                  style={[
                    gs.centerText,
                    {
                      color: colors.onPrimaryContainer,
                    },
                  ]}
                >
                  Income
                </Text>
              </PressableWithFeedback>
              <PressableWithFeedback
                style={[
                  gs.fullFlex,
                  styles.typeButton,
                  {
                    backgroundColor:
                      type === 'expense'
                        ? colors.inversePrimary
                        : 'transparent',
                    borderWidth: 0.5,
                    borderColor:
                      type === 'expense'
                        ? 'transparent'
                        : colors.onSurfaceDisabled,
                  },
                ]}
                onPress={() => setType('expense')}
              >
                <Text
                  style={[
                    gs.centerText,
                    {
                      color: colors.onPrimaryContainer,
                    },
                  ]}
                >
                  Expense
                </Text>
              </PressableWithFeedback>
            </View>
            <View
              style={{
                paddingLeft: spacing.sm,
              }}
            >
              <LineChart
                renderDataPointsAfterAnimationEnds
                curved
                areaChart
                dataPointsColor={
                  type === 'income' ? colors.success : colors.error
                }
                isAnimated
                animateOnDataChange
                animationDuration={1000}
                curveType={CurveType.QUADRATIC}
                hideRules
                data={type === 'expense' ? expenseGraphData : incomeGraphData}
                pointerConfig={pointer}
                adjustToWidth
                noOfSections={4}
                yAxisColor={colors.onSurfaceDisabled}
                yAxisThickness={1}
                yAxisTextStyle={{
                  fontSize: textSize.xs,
                  color: colors.onSurfaceDisabled,
                }}
                width={330}
                xAxisColor={colors.onSurfaceDisabled}
                startFillColor={
                  type === 'expense' ? colors.error : colors.success
                }
                endFillColor={
                  type === 'expense' ? colors.error : colors.success
                }
                startOpacity={0.5}
                endOpacity={0.2}
                color="transparent"
                initialSpacing={0}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 200,
  },
  typeButton: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
});
