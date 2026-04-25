import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, ToastAndroid, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { CATEGORY_ICON_MAP, CATEGORY_ICONS, gs } from '../../common';
import HeaderWithBackButton from '../../components/atoms/HeaderWithBackButton';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AppText from '../../components/molecules/AppText';
import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import CategoryIconSelector from '../../components/organisms/CategoryIconSelector';
import useCategories from '../../hooks/useCategories';
import { TCategoryType, TRootStackParamList } from '../../types';

const AddCategory = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<TRootStackParamList, 'AddCategory'>>();

  const { addCategory, updateCategory } = useCategories();
  const [catName, setCatName] = useState(
    route.params?.category ? route.params.category.name : '',
  );
  const [selectedIconId, setSelectedIconId] = useState<string>(
    route.params?.category ? route.params.category.icon.id : 'general',
  );
  const [catType, setCatType] = useState<TCategoryType>(
    route.params?.category ? route.params.category.type : 'expense',
  );
  const selectedCategory = useMemo(() => {
    return CATEGORY_ICONS.find(c => c.id === selectedIconId);
  }, [selectedIconId]);

  const createNew = useCallback(() => {
    try {
      if (selectedIconId) {
        addCategory(catName, CATEGORY_ICON_MAP[selectedIconId], catType);
        navigation.goBack();
      }
    } catch (e) {
      ToastAndroid.show(
        e instanceof Error ? e.message : 'Error while creating category',
        2000,
      );
    }
  }, [addCategory, catName, selectedIconId, catType, navigation]);

  const editCat = useCallback(() => {
    if (!route.params?.category) return;
    updateCategory({
      icon: CATEGORY_ICON_MAP[selectedIconId],
      id: route.params?.category.id,
      name: catName,
      type: catType,
    });
    navigation.goBack();
  }, [
    route.params,
    navigation,
    selectedIconId,
    updateCategory,
    catName,
    catType,
  ]);
  return (
    <ScreenWrapper>
      {/*Header starts*/}
      <View style={[styles.header]}>
        <View style={[gs.fullFlex]}>
          <HeaderWithBackButton headerText={t('newCat.newCat')} />
        </View>
        <PressableWithFeedback
          onPress={() => {
            if (route.params?.category) {
              editCat();
            } else {
              createNew();
            }
          }}
          style={[styles.saveBtn]}
        >
          <AppText.Bold style={[styles.saveBtnText]}>
            {t('common.save')}
          </AppText.Bold>
        </PressableWithFeedback>
      </View>
      {/*Header ends*/}
      <View style={[gs.justifyCenter, gs.itemsCenter]}>
        <Icon
          source={selectedCategory?.icon ?? 'shape-outline'}
          color={selectedCategory?.color ?? 'black'}
          size={150}
        />
      </View>
      {/*Category Name starts*/}
      <View style={[styles.catNameSection]}>
        <AppText.Regular style={[styles.catNameTitle]}>
          {t('newCat.name')}
        </AppText.Regular>
        <TextInput
          value={catName}
          onChangeText={setCatName}
          style={[styles.catNameInput]}
          placeholder={t('newCat.namePlaceholder')}
          placeholderTextColor={colors.onSurfaceDisabled}
        />
      </View>
      {/*Category Name ends*/}
      {/*category type starts*/}
      <View style={[styles.catTypeSection]}>
        <AppText.Regular style={[styles.catNameTitle]}>
          {t('newCat.type')}
        </AppText.Regular>
        <View style={[styles.catTypeBtnBox]}>
          <PressableWithFeedback
            onPress={() => setCatType('expense')}
            style={[
              styles.catTypeBtn,
              {
                backgroundColor:
                  catType === 'expense'
                    ? colors.error
                    : colors.surfaceContainer,
              },
            ]}
          >
            <AppText.Regular
              style={[
                {
                  color:
                    catType === 'expense' ? colors.onError : colors.onSurface,
                },
              ]}
            >
              {t('common.expense')}
            </AppText.Regular>
          </PressableWithFeedback>
          <PressableWithFeedback
            onPress={() => setCatType('income')}
            style={[
              styles.catTypeBtn,
              {
                backgroundColor:
                  catType === 'income'
                    ? colors.primary
                    : colors.surfaceContainer,
              },
            ]}
          >
            <AppText.Regular
              style={[
                {
                  color:
                    catType === 'income' ? colors.onPrimary : colors.onSurface,
                },
              ]}
            >
              {t('common.income')}
            </AppText.Regular>
          </PressableWithFeedback>
        </View>
      </View>
      {/*category type ends*/}
      {/*Icon selection starts*/}
      <View style={[styles.catIconSection]}>
        <AppText.Regular style={[styles.catIconTitle]}>
          {t('newCat.selectIcon')}
        </AppText.Regular>
        <CategoryIconSelector
          selectedId={selectedIconId}
          setSelectedId={setSelectedIconId}
        />
      </View>
      {/*Icon selection ends*/}
    </ScreenWrapper>
  );
};

export default AddCategory;
const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xxl,
    },
    saveBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.primary,
      marginRight: spacing.md,
      borderRadius: borderRadius.sm,
    },
    saveBtnText: {
      color: colors.onPrimary,
      fontSize: textSize.sm,
    },
    catNameSection: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.xxl,
      gap: spacing.sm,
    },
    catNameTitle: {
      color: colors.onSurface,
      fontSize: textSize.md,
      flex: 1,
    },
    catNameInput: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      color: colors.onSurface,
      fontSize: textSize.sm,
      borderColor: colors.outline,
      borderWidth: 1,
      borderRadius: borderRadius.sm,
    },
    catTypeSection: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.md,
      gap: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    catTypeBtnBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    catTypeBtn: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.surfaceContainer,
    },
    catIconSection: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.md,
      gap: spacing.sm,
      minHeight: 140,
    },
    catIconTitle: {
      color: colors.onSurface,
      fontSize: textSize.md,
    },
  });
