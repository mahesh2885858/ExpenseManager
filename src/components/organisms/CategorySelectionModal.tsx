import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetTextInput,
  useBottomSheetScrollableCreator,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import { TCategory } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import CreateNewCategory from './CreateNewCategory';

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
  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();

  const BottomSheetScrollable = useBottomSheetScrollableCreator();

  const [search, setSearch] = useState('');

  const categoriesToRender = useMemo(() => {
    return search.trim().length === 0
      ? categories
      : categories.filter(cat =>
          cat.name.toLowerCase().includes(search.trim().toLowerCase()),
        );
  }, [categories, search]);

  const sortedCategories = useMemo(() => {
    return categoriesToRender.sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesToRender]);

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
                Select Category
              </Text>
              <PressableWithFeedback
                hidden={props.forFilter}
                onPress={handlePresent}
                style={[
                  {
                    paddingLeft: spacing.md,
                  },
                ]}
              >
                <Icon
                  source={'plus'}
                  size={textSize.xxxl}
                  color={colors.onTertiaryContainer}
                />
              </PressableWithFeedback>
            </View>
            {categories.length > 5 && (
              <View style={[{ marginTop: spacing.sm }]}>
                <BottomSheetTextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor={colors.onSurfaceDisabled}
                  placeholder="Search categories"
                  style={[
                    styles.searchInput,
                    {
                      color: colors.onBackground,
                      borderColor: colors.outlineVariant,
                    },
                  ]}
                />
              </View>
            )}
            <FlashList
              style={{
                maxHeight: 500,
              }}
              numColumns={2}
              renderScrollComponent={BottomSheetScrollable}
              keyExtractor={(item: TCategory) => item.id}
              showsVerticalScrollIndicator={false}
              data={sortedCategories}
              masonry
              contentContainerStyle={[styles.listContainer]}
              renderItem={({ item }: { item: TCategory }) => {
                const isSelected = props.selectedCategory === item.id;

                return (
                  <PressableWithFeedback
                    onPress={() => {
                      props.selectCategory(item.id);
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
                    key={item.id}
                  >
                    {/* <RadioButton.Android
                      status={isSelected ? 'checked' : 'unchecked'}
                      color={colors.inversePrimary}
                      value={item.name}
                    /> */}
                    <Text
                      style={[
                        gs.fullFlex,
                        {
                          color: colors.onSurface,
                          fontSize: textSize.md,
                        },
                      ]}
                    >
                      {item.name}
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
      <CreateNewCategory
        handleSheetChanges={handleSheetChange}
        ref={btmShtRef}
      />
    </BottomSheetModal>
  );
};

export default CategorySelectionModal;

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
