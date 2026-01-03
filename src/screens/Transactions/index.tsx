import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import CommonHeader from '../../components/organisms/CommonHeader';
import useTransactionsStore from '../../stores/transactionsStore';
import useGetTransactions from '../../hooks/useGetTransactions';
import { gs } from '../../common';
import { LineChart } from 'react-native-gifted-charts';

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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackPress(true),
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

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
          <View>
            <LineChart
              data={filteredTransactions
                .filter(d => d.type === 'expense')
                .map(t => ({ value: t.amount }))}
              data2={filteredTransactions
                .filter(d => d.type === 'income')
                .map(t => ({ value: t.amount }))}
              areaChart
              color="skyblue"
              color2="orange"
              startFillColor="skyblue"
              startFillColor2="orange"
              curved
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
