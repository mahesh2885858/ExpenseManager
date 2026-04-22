import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { gs } from '../../common';
import HeaderWithBackButton from '../../components/atoms/HeaderWithBackButton';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AppText from '../../components/molecules/AppText';
import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import CategoryIconSelector from '../../components/organisms/CategoryIconSelector';

const AddCategory = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  return (
    <ScreenWrapper>
      {/*Header starts*/}
      <View style={[styles.header]}>
        <View style={[gs.fullFlex]}>
          <HeaderWithBackButton headerText={t('newCat.newCat')} />
        </View>
        <PressableWithFeedback style={[styles.saveBtn]}>
          <AppText.Bold style={[styles.saveBtnText]}>
            {t('common.save')}
          </AppText.Bold>
        </PressableWithFeedback>
      </View>
      {/*Header ends*/}
      <View style={[gs.justifyCenter, gs.itemsCenter]}>
        <Icon source={'train-car'} size={150} />
      </View>
      {/*Category Name starts*/}
      <View style={[styles.catNameSection]}>
        <AppText.Regular style={[styles.catNameTitle]}>
          {t('newCat.name')}
        </AppText.Regular>
        <TextInput
          style={[styles.catNameInput]}
          placeholder={t('newCat.namePlaceholder')}
          placeholderTextColor={colors.onSurfaceDisabled}
        />
      </View>
      {/*Category Name ends*/}
      {/*Icon selection starts*/}
      <View style={[styles.catIconSection]}>
        <AppText.Regular style={[styles.catIconTitle]}>
          {t('newCat.selectIcon')}
        </AppText.Regular>
        <CategoryIconSelector />
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
