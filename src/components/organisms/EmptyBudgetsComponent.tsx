import { StyleSheet, View } from 'react-native';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { Icon } from 'react-native-paper';
import AppText from '../molecules/AppText';
import { useTranslation } from 'react-i18next';
import PressableWithFeedback from '../atoms/PressableWithFeedback';

const EmptyBudgetComponent = () => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  return (
    <View style={[styles.container]}>
      <Icon source={'hand-coin-outline'} size={35} color={colors.primary} />
      <AppText.SemiBold style={[styles.noBudgetText]}>
        {t('home.noBudgets')}
      </AppText.SemiBold>
      <AppText.Regular style={[styles.noBudgetSub]}>
        {t('home.noBudgetHelp')}
      </AppText.Regular>
      <PressableWithFeedback style={[styles.button]}>
        <AppText.SemiBold style={[styles.buttonText]}>
          {t('home.createFirstBudget')}
        </AppText.SemiBold>
      </PressableWithFeedback>
    </View>
  );
};
export default EmptyBudgetComponent;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    noBudgetText: {
      fontSize: textSize.sm,
      color: colors.onSurface,
      lineHeight: 12,
      marginTop: spacing.sm,
    },
    noBudgetSub: {
      fontSize: textSize.xs,
      color: colors.onSurfaceVariant,
      marginBottom: spacing.sm,
    },
    button: {
      backgroundColor: colors.primaryContainer,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
    },
    buttonText: {
      fontSize: textSize.xs,
      color: colors.onPrimaryContainer,
    },
  });
