import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import RenderTransactions from '../../components/RenderTransactions';
import useGetTransactions from '../../hooks/useGetTransactions';
import { TBottomTabParamList } from '../../types';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';

const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<TBottomTabParamList>>();
  const transactions = useGetTransactions();
  const filters = ['Today', 'This week', 'This month', 'This year', 'All'];
  const [selectedFilter, setSelectedFilter] = useState('All');

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
      {/* filters section */}
      <View style={[styles.filterBox, gs.flexRow]}>
        {filters.map(item => {
          const isSelected = selectedFilter === item;
          return (
            <PressableWithFeedback
              onPress={() => setSelectedFilter(item)}
              style={[
                styles.filterItem,
                {
                  borderColor: isSelected
                    ? undefined
                    : theme.colors.onSecondaryContainer,
                  backgroundColor: isSelected
                    ? theme.colors.secondaryContainer
                    : undefined,
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
      </View>
      {/* recent transactions section */}
      <View
        style={[
          {
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <View style={[gs.fullFlex]}>
          {transactions.length === 0 ? (
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
            <RenderTransactions transactions={transactions} />
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
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  filterItem: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
});
