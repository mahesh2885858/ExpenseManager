import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import useCategories from '../../hooks/useCategories';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { TCategory } from '../../types';

type TProps = {
  ref: any;
  handleSheetChanges: BottomSheetProps['onChange'];
  selectCategory: (id: string) => void;
  selectedCategory?: string | null;
  forFilter?: boolean;
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const CategorySelectionModal = (props: TProps) => {
  const { categories } = useCategories();
  const { colors } = useAppTheme();

  const coloredText = {
    color: colors.onSurfaceVariant,
  };

  const sortedCategories = useMemo(() => {
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);
  return (
    <BottomSheetModal
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
            <Text style={[styles.headerText, coloredText]}>
              Select a category
            </Text>
            <BottomSheetFlatList
              keyExtractor={(item: TCategory) => item.id}
              showsVerticalScrollIndicator={false}
              data={sortedCategories}
              contentContainerStyle={[styles.listContainer]}
              renderItem={({ item }: { item: TCategory }) => {
                const isSelected = props.selectedCategory === item.id;

                return (
                  <PressableWithFeedback
                    onPress={() => {
                      props.selectCategory(item.id);
                    }}
                    style={[
                      gs.flexRow,
                      gs.itemsCenter,
                      styles.item,
                      {
                        borderColor: isSelected
                          ? colors.inversePrimary
                          : colors.onSurfaceDisabled,
                      },
                    ]}
                    key={item.id}
                  >
                    <RadioButton.Android
                      status={isSelected ? 'checked' : 'unchecked'}
                      color={colors.inversePrimary}
                      value={item.name}
                    />
                    <Text
                      style={[
                        {
                          color: colors.onSurface,
                          fontSize: textSize.md,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
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

export default CategorySelectionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },

  headerText: {
    fontSize: textSize.lg,
  },

  categoryText: {
    fontSize: textSize.lg,
  },
  listContainer: {
    marginTop: spacing.sm,
    paddingBottom: 100,
  },
  item: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
});
