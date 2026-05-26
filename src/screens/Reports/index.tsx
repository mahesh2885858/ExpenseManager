import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import AppText from '../../components/molecules/AppText';

const Reports = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top + 5,
        },
      ]}
    >
      {/* header section */}
      <View
        style={[
          gs.flexRow,
          gs.itemsCenter,
          gs.justifyBetween,

          {
            paddingHorizontal: spacing.md,
            marginTop: spacing.sm,
          },
        ]}
      >
        <AppText.Bold
          style={[
            gs.fontBold,
            {
              fontSize: textSize.lg,

              color: colors.onBackground,
            },
          ]}
        >
          Reports
        </AppText.Bold>
      </View>
      <View style={[gs.fullFlex, gs.centerItems]}>
        <AppText.SemiBold style={[{ color: colors.onBackground }]}>
          Coming soon!!!!
        </AppText.SemiBold>
      </View>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 200,
    flex: 1,
  },
  typeButton: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  groupByBtn: {
    borderRadius: borderRadius.pill,
    borderWidth: 0.5,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  groupByContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  groupByText: {
    fontSize: textSize.sm,
  },
  navigateDateBox: {
    paddingHorizontal: spacing.md,
  },
  rangeBox: {
    gap: spacing.sm,
  },
  rangeText: {
    fontSize: textSize.lg,
  },
  navBtnBox: {
    gap: spacing.md,
  },
  navBtn: {
    borderRadius: borderRadius.round,
    padding: spacing.sm,
  },
  summary: {
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  summaryText: {
    fontSize: textSize.lg,
  },
  tTypeBox: {
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  tType: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
});
