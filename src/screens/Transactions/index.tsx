import { useNavigation } from '@react-navigation/native';
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

const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const navigation = useNavigation();
  const { search, setSearch, filteredTransactions } = useGetTransactions();
  const filters = useTransactionsStore(state => state.filters);
  const resetFilters = useTransactionsStore(state => state.resetFilters);
  const [renderSearch, setRenderSearch] = useState(false);

  const isFiltersActive = useMemo(() => {
    return !!filters.date || !!filters.type || !!filters.categoryId;
  }, [filters]);

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

  const onSearchClose = () => {
    setSearch('');
    setRenderSearch(false);
  };

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
                  value={search}
                  onChangeText={setSearch}
                  autoFocus
                  placeholder="Search here.."
                  style={[
                    gs.fullFlex,
                    {
                      paddingHorizontal: spacing.md,
                      color: theme.colors.onBackground,
                    },
                  ]}
                />
                <PressableWithFeedback
                  onPress={() => {
                    onSearchClose();
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
          {filteredTransactions.length === 0 ? (
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
            <RenderTransactions
              transactions={filteredTransactions.sort(
                (a, b) =>
                  new Date(b.transactionDate).getTime() -
                  new Date(a.transactionDate).getTime(),
              )}
            />
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
