/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo } from 'react';
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
import { spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import CommonHeader from '../../components/organisms/CommonHeader';
import useGetTransactions from '../../hooks/useGetTransactions';
import useTransactionsStore from '../../stores/transactionsStore';
const { width } = Dimensions.get('window');
const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const resetFilters = useTransactionsStore(state => state.resetFilters);
  const { filteredTransactions } = useGetTransactions();

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
    // autoAdjustPointerLabelPosition: true,
    pointerLabelComponent: items => {
      console.log({ items });
      return (
        <View
          style={{
            zIndex: 100,
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
      <View
        style={[
          gs.fullFlex,
          {
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
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
            <LineChart
              hideDataPoints
              curved
              curveType={CurveType.QUADRATIC}
              adjustToWidth
              hideRules
              data2={expenseGraphData}
              data={incomeGraphData}
              pointerConfig={pointer}
              noOfSections={4}
            />
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
});
