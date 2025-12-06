import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  add,
  isAfter,
  isBefore,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  sub,
} from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import RenderTransactions from '../../components/RenderTransactions';
import useGetTransactions from '../../hooks/useGetTransactions';
import useTransactionsStore from '../../stores/transactionsStore';
import { TBottomTabParamList, TTransaction } from '../../types';

const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<TBottomTabParamList>>();
  const { transactions } = useGetTransactions();
  const filters = useTransactionsStore(state => state.filters);
  const resetFilters = useTransactionsStore(state => state.resetFilters);
  const [renderSearch, setRenderSearch] = useState(false);

  const isFiltersActive = useMemo(() => {
    return !!filters.date || !!filters.type;
  }, [filters]);

  const transactionsToRender = useMemo(() => {
    let filtered: TTransaction[] = [];
    // apply date filter
    if (filters.date) {
      if (filters.date.isToday) {
        filtered = transactions.filter(t => isToday(t.transactionDate));
      } else if (filters.date.isThisWeek) {
        filtered = transactions.filter(t => isThisWeek(t.transactionDate));
      } else if (filters.date.isThisMonth) {
        filtered = transactions.filter(t => isThisMonth(t.transactionDate));
      } else if (filters.date.isThisYear) {
        filtered = transactions.filter(t => isThisYear(t.transactionDate));
      } else if (filters.date.range) {
        filtered = filters.date.range
          ? transactions.filter(t => {
              // because date-fn excludes the given dates, only gives results from before and after. So, we are offsetting by adding and subtracting one day
              const startDate = sub(filters.date.range[0], { days: 1 });
              const endDate = add(filters.date?.range[1], { days: 1 });
              return (
                isBefore(startDate, t.transactionDate) &&
                isAfter(endDate, t.transactionDate)
              );
            })
          : transactions;
      } else {
        filtered = transactions;
      }
    } else {
      filtered = transactions;
    }

    // apply type filter
    if (filters.type) {
      filtered = filtered.filter(
        t => t.type === (filters.type === 'income' ? 'income' : 'expense'),
      );
    }

    return filtered;
  }, [filters, transactions]);

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
          <>
            {renderSearch ? (
              <View
                style={[
                  gs.flexRow,
                  gs.fullFlex,
                  gs.itemsCenter,
                  gs.justifyBetween,

                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderRadius: borderRadius.pill,
                  },
                ]}
              >
                <TextInput
                  autoFocus
                  placeholder="Search.."
                  style={[
                    gs.fullFlex,
                    {
                      paddingHorizontal: spacing.md,
                    },
                  ]}
                />
                <PressableWithFeedback
                  hidden={isFiltersActive}
                  onPress={() => {
                    setRenderSearch(false);
                  }}
                  style={[
                    {
                      padding: spacing.xs,
                      paddingRight: spacing.md,
                    },
                  ]}
                >
                  <Icon source={'close'} size={textSize.md} />
                </PressableWithFeedback>
              </View>
            ) : (
              <>
                <View
                  style={[
                    gs.flexRow,
                    gs.centerItems,
                    {
                      gap: spacing.md,
                    },
                  ]}
                >
                  <Pressable onPress={() => handleBackPress()}>
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
                <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
                  <PressableWithFeedback
                    onPress={() => {
                      setRenderSearch(true);
                    }}
                    style={[
                      {
                        backgroundColor: theme.colors.surfaceVariant,
                        padding: spacing.xs,
                        paddingHorizontal: spacing.md,
                        borderRadius: borderRadius.xxl,
                      },
                    ]}
                  >
                    <Icon source={'magnify'} size={textSize.md} />
                  </PressableWithFeedback>
                  <PressableWithFeedback
                    onPress={() => {
                      navigation.navigate('TransactionFilters');
                    }}
                    style={[
                      {
                        backgroundColor: theme.colors.surfaceVariant,
                        padding: spacing.xs,
                        paddingHorizontal: spacing.md,
                        borderRadius: borderRadius.xxl,
                      },
                    ]}
                  >
                    <Icon
                      source={isFiltersActive ? 'filter-off' : 'filter'}
                      size={textSize.md}
                    />
                  </PressableWithFeedback>
                </View>
              </>
            )}
          </>
        </View>
      }

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
