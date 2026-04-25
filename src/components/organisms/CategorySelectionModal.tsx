import React, { useMemo, useState, useCallback } from 'react';
import { Modal, View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';

import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import HeaderWithBackButton from '../../components/atoms/HeaderWithBackButton';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AppText from '../../components/molecules/AppText';

import useCategories from '../../hooks/useCategories';
import { gs } from '../../common';
import { TCategory } from '../../types';
import { useTranslation } from 'react-i18next';

type Props = {
  visible: boolean;
  onClose: () => void;
  selectCategory: (id: string) => void;
} & (
  | {
      allowMultiple: false;
      selectedCategory?: string | null;
    }
  | {
      allowMultiple: true;
      selectedCategories?: string[] | [];
    }
);

const CategorySelectionModal = (props: Props) => {
  const { onClose, selectCategory, visible } = props;
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const navigation = useNavigation();
  const { categories } = useCategories();

  const [search, setSearch] = useState('');

  // 🔍 Filter + sort (same logic, cleaner)
  const filteredCategories = useMemo(() => {
    const list =
      search.trim().length === 0
        ? categories
        : categories.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()),
          );

    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, search]);

  const goToAddCategory = useCallback(() => {
    onClose();
    navigation.navigate('AddCategory');
  }, [navigation, onClose]);

  return (
    <Modal
      onRequestClose={onClose}
      statusBarTranslucent
      visible={visible}
      animationType="slide"
    >
      <ScreenWrapper>
        {/* Header */}
        <View style={styles.header}>
          <View style={gs.fullFlex}>
            <HeaderWithBackButton headerText="Select Category" />
          </View>
          <View style={[styles.btnContainer]}>
            <PressableWithFeedback onPress={goToAddCategory}>
              <View style={styles.addBtn}>
                <Icon source="plus" size={20} color={colors.onPrimary} />
                <AppText.Regular style={styles.addText}>
                  {t('common.new')}
                </AppText.Regular>
              </View>
            </PressableWithFeedback>
            <PressableWithFeedback
              hidden={!props.allowMultiple}
              onPress={onClose}
            >
              <View style={styles.addBtn}>
                <AppText.Regular style={styles.addText}>
                  {t('common.done')}
                </AppText.Regular>
              </View>
            </PressableWithFeedback>
          </View>
        </View>

        {/*Search */}
        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search categories"
            placeholderTextColor={colors.onSurfaceDisabled}
            style={styles.searchInput}
          />
        </View>

        {/*List */}
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredCategories.map((item: TCategory) => {
            const isSelected = props.allowMultiple
              ? !!props.selectedCategories?.find(cat => cat === item.id)
              : props.selectedCategory === item.id;

            return (
              <PressableWithFeedback
                key={item.id}
                onPress={() => {
                  selectCategory(item.id);
                  if (!props.allowMultiple) {
                    onClose();
                  }
                }}
                style={styles.item}
              >
                {/* Icon */}
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: item.icon.color + '22' },
                  ]}
                >
                  <Icon
                    source={item.icon.icon}
                    size={20}
                    color={item.icon.color}
                  />
                </View>

                {/* Name */}
                <AppText.Regular style={styles.name}>
                  {item.name}
                </AppText.Regular>

                {/* Right side */}
                {isSelected ? (
                  <Icon source="check" size={20} color={colors.primary} />
                ) : (
                  <Icon
                    source="chevron-right"
                    size={20}
                    color={colors.onSurfaceDisabled}
                  />
                )}
              </PressableWithFeedback>
            );
          })}
        </ScrollView>
      </ScreenWrapper>
    </Modal>
  );
};

export default CategorySelectionModal;

const createStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingRight: spacing.md,
    },

    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
    },

    addText: {
      color: colors.onPrimary,
      fontSize: textSize.sm,
    },

    searchContainer: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },

    searchInput: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      color: colors.onSurface,
      fontSize: textSize.sm,
    },

    listContainer: {
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
      paddingBottom: 150,
    },

    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surfaceContainer,
      gap: spacing.md,
      // marginBottom: spacing.sm,
    },

    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },

    name: {
      flex: 1,
      fontSize: textSize.md,
      color: colors.onSurface,
    },
    btnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
  });
