import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';

const TransactionFilters = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const filters = ['Today', 'This week', 'This month', 'This year', 'All'];
  const [selectedFilter, setSelectedFilter] = useState('All');
  const transactionType = ['Income', 'Expense', 'All'];
  const [selectedType, setSelectedType] = useState('All');

  return (
    <KeyboardAvoidingView
      style={[
        gs.centerItems,
        gs.fullFlex,
        {
          backgroundColor: colors.backdrop,
        },
      ]}
    >
      <View
        style={[
          styles.filterBox,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            gs.flexRow,
            gs.itemsCenter,
            gs.justifyBetween,

            {
              paddingHorizontal: spacing.sm,
              paddingTop: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              {
                color: colors.onBackground,
                fontSize: textSize.lg,
              },
            ]}
          >
            Filters
          </Text>
          <PressableWithFeedback
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon source={'close'} size={textSize.lg} />
          </PressableWithFeedback>
        </View>
        {/* date filters */}
        <View
          style={[
            styles.dateFilter,
            gs.flexRow,
            {
              borderColor: colors.onSurfaceDisabled,
            },
          ]}
        >
          {filters.map(item => {
            const isSelected = selectedFilter === item;
            return (
              <PressableWithFeedback
                onPress={() => {
                  setSelectedFilter(item);
                }}
                style={[
                  styles.filterItem,
                  {
                    borderColor: isSelected
                      ? colors.secondaryContainer
                      : colors.onSecondaryContainer,
                    backgroundColor: isSelected
                      ? colors.secondaryContainer
                      : colors.surface,
                  },
                ]}
                key={item}
              >
                <Text
                  style={{
                    color: colors.onPrimaryContainer,
                    fontSize: textSize.sm,
                  }}
                >
                  {item}
                </Text>
              </PressableWithFeedback>
            );
          })}
        </View>
        {/* transaction type filters */}
        <View
          style={[
            styles.dateFilter,
            gs.flexRow,
            {
              borderColor: colors.onSurfaceDisabled,
            },
          ]}
        >
          {transactionType.map(item => {
            const isSelected = selectedType === item;
            return (
              <PressableWithFeedback
                onPress={() => setSelectedType(item)}
                style={[
                  styles.filterItem,
                  {
                    borderColor: isSelected
                      ? colors.secondaryContainer
                      : colors.onSecondaryContainer,
                    backgroundColor: isSelected
                      ? colors.secondaryContainer
                      : colors.surface,
                  },
                ]}
                key={item}
              >
                <Text
                  style={{
                    color: colors.onPrimaryContainer,
                    fontSize: textSize.sm,
                  }}
                >
                  {item}
                </Text>
              </PressableWithFeedback>
            );
          })}
        </View>
        <View style={[gs.flexRow, gs.centerItems]}>
          <PressableWithFeedback
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.secondaryContainer,
              },
            ]}
          >
            <Text
              style={{
                fontSize: textSize.md,
                color: colors.onSecondaryContainer,
              }}
            >
              Filter
            </Text>
          </PressableWithFeedback>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TransactionFilters;

const styles = StyleSheet.create({
  filterBox: {
    position: 'absolute',
    bottom: 0,
    height: 360,
    width: '96%',
    borderTopEndRadius: borderRadius.xxl,
    borderTopStartRadius: borderRadius.xxl,
    padding: spacing.md,
    gap: spacing.lg,
  },
  dateFilter: {
    gap: spacing.sm,
    flexWrap: 'wrap',
    overflow: 'hidden',
    borderWidth: 1,
    padding: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  filterItem: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  dropdown: {
    padding: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  dropdownText: {
    fontSize: textSize.sm,
  },
  filterButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.lg,
  },
});
