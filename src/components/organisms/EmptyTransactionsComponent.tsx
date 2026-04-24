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

const EmptyTransactionsComponent = () => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  return (
    <View style={[styles.container]}>
      <Icon source={'invoice-list-outline'} size={35} color={colors.primary} />
      <AppText.SemiBold style={[styles.noTransactionsText]}>
        {t('home.noTransactions')}
      </AppText.SemiBold>
      <AppText.Regular style={[styles.noTransactionsSubText]}>
        {t('home.noTransactionsHelp')}
      </AppText.Regular>
      <PressableWithFeedback style={[styles.button]}>
        <AppText.SemiBold style={[styles.buttonText]}>
          {t('home.addFirstTransactions')}
        </AppText.SemiBold>
      </PressableWithFeedback>
    </View>
  );
};
export default EmptyTransactionsComponent;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    noTransactionsText: {
      fontSize: textSize.sm,
      color: colors.onSurface,
      marginTop: spacing.sm,
    },
    noTransactionsSubText: {
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
