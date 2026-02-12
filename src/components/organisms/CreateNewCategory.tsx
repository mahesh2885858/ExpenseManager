import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import useCategories from '../../hooks/useCategories';
import { TCategorySummary } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';

type TProps = {
  ref: React.RefObject<BottomSheetModal | null>;
  handleSheetChanges: BottomSheetProps['onChange'];
  catToEdit?: TCategorySummary;
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const CreateNewCategory = (props: TProps) => {
  console.log({ props });
  const { colors } = useAppTheme();

  const [catName, setCatName] = useState(
    props.catToEdit ? props.catToEdit.name : '',
  );
  const { addCategory, categories, updateCategory } = useCategories();

  const renderSaveButton = useMemo(() => {
    return catName.trim().length > 0;
  }, [catName]);

  const addNew = useCallback(() => {
    Keyboard.dismiss();
    const isExist = categories.some(
      cat => cat.name.trim().toLowerCase() === catName.trim().toLowerCase(),
    );
    if (isExist) {
      ToastAndroid.show(
        'Category exist. choose different name!!',
        ToastAndroid.SHORT,
      );
      return;
    } else {
      addCategory(catName, false);
      setCatName('');
      props.ref.current?.dismiss();
    }
  }, [catName, addCategory, props, categories]);

  const editCategory = useCallback(() => {
    if (!props.catToEdit) return;
    updateCategory({
      ...props.catToEdit,
      name: catName,
    });
    props.ref.current?.dismiss();
  }, [props, catName, updateCategory]);

  const isEditModeOn = useMemo(() => {
    return !!props.catToEdit;
  }, [props]);

  return (
    <BottomSheetModal
      backdropComponent={pr => BottomCBackdrop(pr)}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: colors.inverseOnSurface,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={500}
    >
      <BottomSheetView style={[styles.container]}>
        <View>
          <Text
            style={[
              styles.headerText,
              {
                color: colors.onBackground,
              },
            ]}
          >
            {isEditModeOn ? 'Edit Category' : 'Add New Category'}
          </Text>
          <View
            style={[
              gs.flexRow,
              gs.itemsCenter,
              {
                marginHorizontal: spacing.md,
                marginTop: spacing.md,
                gap: spacing.md,
              },
            ]}
          >
            <View
              style={[
                styles.catNameBox,
                gs.fullFlex,
                {
                  borderColor: colors.onSurfaceDisabled,
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: colors.onSurfaceDisabled,
                    fontSize: textSize.md,
                  },
                ]}
              >
                Category name
              </Text>
              <BottomSheetTextInput
                value={catName}
                onChangeText={setCatName}
                placeholder="Choose your category name"
                placeholderTextColor={colors.onSurfaceDisabled}
                style={[
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              />
            </View>
          </View>

          {renderSaveButton && (
            <PressableWithFeedback
              onPress={() => {
                if (isEditModeOn) {
                  editCategory();
                } else {
                  addNew();
                }
              }}
              style={[
                styles.button,
                {
                  backgroundColor: colors.secondaryContainer,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: colors.onSecondaryContainer,
                  },
                ]}
              >
                {isEditModeOn ? 'Save' : 'Add'}
              </Text>
            </PressableWithFeedback>
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CreateNewCategory;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  headerText: {
    fontSize: textSize.lg,
    fontWeight: 'bold',
    paddingHorizontal: spacing.md,
  },
  accNameBox: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    paddingLeft: spacing.sm,
  },
  button: {
    marginHorizontal: 'auto',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  buttonText: {
    fontSize: textSize.md,
    fontWeight: '600',
  },
  catNameBox: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingTop: spacing.xs,
    paddingLeft: spacing.sm,
  },
  switchBox: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  switchText: {
    fontSize: textSize.md,
  },
});
