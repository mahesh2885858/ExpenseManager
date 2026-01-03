import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, useAppTheme } from '../../../theme';
import CommonHeader from '../../components/organisms/CommonHeader';
import useTransactionsStore from '../../stores/transactionsStore';

const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const navigation = useNavigation();
  const resetFilters = useTransactionsStore(state => state.resetFilters);

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
          {
            paddingHorizontal: spacing.lg,
          },
        ]}
      ></View>
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
