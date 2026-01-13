import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import useCategories from '../../hooks/useCategories';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { TCategory } from '../../types';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  const coloredText = {
    color: colors.onSurfaceVariant,
  };

  const sortedCategories = useMemo(() => {
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const navigateToAddCategoryScreen = useCallback(() => {
    navigation.navigate('AddCategory');
  }, [navigation]);

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
            <View style={[gs.flexRow, gs.itemsCenter]}>
              <Text style={[styles.headerText, coloredText, gs.fullFlex]}>
                Select a category
              </Text>
              <PressableWithFeedback onPress={navigateToAddCategoryScreen}>
                <Text
                  style={[
                    styles.manageText,
                    {
                      fontSize: textSize.md,

                      color: colors.onTertiaryContainer,
                    },
                  ]}
                >
                  Add new
                </Text>
              </PressableWithFeedback>
            </View>
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
    marginTop: spacing.md,
    paddingBottom: 100,
  },
  item: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
  manageText: {
    fontWeight: '600',
  },
});
