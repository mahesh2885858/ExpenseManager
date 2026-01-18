import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FAB, Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import CreateNewCategory from '../../components/organisms/CreateNewCategory';
import RenderCategoryCard from '../../components/organisms/RenderCategoryCard';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useCategories from '../../hooks/useCategories';
import useGetKeyboardHeight from '../../hooks/useGetKeyboardHeight';

const ManageCategories = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  //   const accounts = useAccountStore(state => state.accounts);
  const { categoriesSummary: categories } = useCategories();
  const { kbHeight } = useGetKeyboardHeight();
  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();
  const [focusedId, setFocusedId] = useState('');

  const changeFocusId = useCallback((id: string) => {
    setFocusedId(id);
  }, []);

  return (
    <GestureHandlerRootView style={[gs.fullFlex]}>
      <BottomSheetModalProvider>
        <View
          style={[
            gs.fullFlex,
            {
              paddingTop: top + 5,
            },
          ]}
        >
          {/* header */}
          <View style={[gs.flexRow, gs.itemsCenter, styles.header]}>
            <PressableWithFeedback onPress={navigation.goBack}>
              <Icon source="arrow-left" size={24} />
            </PressableWithFeedback>
            <Text
              style={[
                styles.headerText,
                {
                  color: colors.onBackground,
                },
              ]}
            >
              Manage Categories
            </Text>
          </View>
          <View style={[gs.fullFlex, styles.listWrapper]}>
            <FlashList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.listBox]}
              ListEmptyComponent={
                <View style={[gs.fullFlex, gs.centerItems]}>
                  <Text
                    style={[
                      gs.fontBold,
                      gs.centerText,
                      {
                        color: colors.onSurfaceDisabled,
                        fontSize: textSize.lg,
                        marginTop: spacing.xxxl,
                      },
                    ]}
                  >
                    No Categories yet. Start by creating one.
                  </Text>
                </View>
              }
              data={categories}
              extraData={focusedId}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <RenderCategoryCard
                  isFocused={focusedId === item.id}
                  changeFocusId={changeFocusId}
                  item={item}
                />
              )}
            />
          </View>
          <FAB
            icon="plus"
            style={[
              styles.fab,
              {
                bottom: kbHeight + 20,
              },
            ]}
            onPress={() => handlePresent()}
          />
        </View>
        <CreateNewCategory
          handleSheetChanges={handleSheetChange}
          ref={btmShtRef}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ManageCategories;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  headerText: {
    fontSize: textSize.lg,
    fontWeight: 'bold',
  },
  listWrapper: {
    paddingHorizontal: spacing.md,
  },
  text: {
    fontSize: textSize.md,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 5,
    bottom: 40,
  },
  tTypeBox: {
    borderRadius: borderRadius.md,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  tType: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  amountText: {
    fontWeight: '700',
  },
  listBox: {
    paddingBottom: 100,
  },
});
