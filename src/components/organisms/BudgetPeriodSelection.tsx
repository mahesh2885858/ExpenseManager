import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  useBottomSheetScrollableCreator,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, RadioButton } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { uCFirst } from 'commonutil-core';

type TProps = {
  ref: any;
  handleSheetChanges: BottomSheetProps['onChange'];
  selectBudgetPeriod: (
    id: 'weekly' | 'monthly' | 'yearly' | 'one time',
  ) => void;
  selectedPeriod?: 'weekly' | 'monthly' | 'yearly' | 'one time';
  forFilter?: boolean;
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const BudgetPeriodSelectionModal = (props: TProps) => {
  const { colors } = useAppTheme();

  const BottomSheetScrollable = useBottomSheetScrollableCreator();

  const budgetPeriods = ['weekly', 'monthly', 'yearly', 'one time'] as const;

  return (
    <BottomSheetModal
      stackBehavior="push"
      backdropComponent={pr => BottomCBackdrop(pr)}
      backgroundStyle={{
        backgroundColor: colors.inverseOnSurface,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={500}
    >
      <View style={[styles.container]}>
        <View style={[styles.content]}>
          <View>
            <View style={[gs.flexRow, gs.itemsCenter]}>
              <Text
                style={[
                  gs.fontBold,
                  gs.fullFlex,
                  {
                    fontSize: textSize.lg,
                    color: colors.onBackground,
                  },
                ]}
              >
                Select Period
              </Text>
            </View>

            <FlashList
              style={{
                maxHeight: 500,
              }}
              data={budgetPeriods}
              renderScrollComponent={BottomSheetScrollable}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              masonry
              contentContainerStyle={[styles.listContainer]}
              renderItem={({ item }) => {
                const isSelected = props.selectedPeriod === item;
                return (
                  <PressableWithFeedback
                    onPress={() => {
                      props.selectBudgetPeriod(item);
                      props.ref.current?.dismiss();
                    }}
                    style={[
                      gs.flexRow,
                      gs.itemsCenter,
                      styles.item,
                      {
                        borderColor: isSelected
                          ? colors.onPrimaryContainer
                          : colors.onSurfaceDisabled,
                      },
                    ]}
                    key={item}
                  >
                    <RadioButton.Android
                      status={isSelected ? 'checked' : 'unchecked'}
                      color={colors.inversePrimary}
                      value={item}
                    />
                    <Text
                      style={[
                        gs.fullFlex,
                        {
                          color: colors.onSurface,
                          fontSize: textSize.md,
                        },
                      ]}
                    >
                      {uCFirst(item)}
                    </Text>
                    {isSelected && (
                      <Icon
                        source={'check'}
                        size={textSize.md}
                        color={colors.onPrimaryContainer}
                      />
                    )}
                  </PressableWithFeedback>
                );
              }}
            />
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};

export default BudgetPeriodSelectionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },

  headerText: {
    fontSize: textSize.lg,
  },

  categoryText: {
    fontSize: textSize.lg,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
  },
  listContainer: {
    marginTop: spacing.md,
    paddingBottom: 100,
  },
  item: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginRight: 10,
  },
  manageText: {
    fontWeight: '600',
  },
});
