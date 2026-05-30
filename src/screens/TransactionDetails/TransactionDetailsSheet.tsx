import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import AppText from '../../components/molecules/AppText';
import useHelpers from '../../hooks/useHelpers';
import useWallets from '../../hooks/useWallets';
import { TTransaction } from '../../types';

type TProps = {
  ref: React.RefObject<BottomSheetModal | null>;
  handleSheetChanges: BottomSheetProps['onChange'];
  selectedTransaction: TTransaction | null;
  onDeletePress: (t: TTransaction) => void;
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const TransactionDetailsSheet = (props: TProps) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { wallets } = useWallets();
  const navigation = useNavigation();
  const { dismissAll } = useBottomSheetModal();
  const { getFormattedAmount } = useHelpers();
  const categoryName = props.selectedTransaction
    ? props.selectedTransaction.category?.name ?? t('common.unknownCat')
    : t('common.unknownCat');

  const walletName =
    wallets.find(acc => acc.id === props.selectedTransaction?.wallet_id)
      ?.name ?? '';

  const navigateToEdit = useCallback(() => {
    if (props.selectedTransaction) {
      dismissAll();
      navigation.navigate('AddTransaction', {
        mode: 'edit',
        transaction: props.selectedTransaction,
      });
    }
  }, [props, navigation, dismissAll]);

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
        {/* header */}
        <View
          style={[
            { paddingHorizontal: spacing.md },
            gs.flexRow,
            gs.itemsCenter,
          ]}
        >
          <AppText.Medium
            style={[
              gs.fullFlex,
              { fontSize: textSize.lg, color: colors.onBackground },
            ]}
          >
            {t('txnDetails.amount')}
          </AppText.Medium>
          <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.lg }]}>
            <PressableWithFeedback
              onPress={() =>
                props.selectedTransaction &&
                props.onDeletePress(props.selectedTransaction)
              }
            >
              <Icon source={'delete'} size={textSize.xl} color={colors.error} />
            </PressableWithFeedback>
            <PressableWithFeedback onPress={navigateToEdit}>
              <Icon
                source={'pencil'}
                size={textSize.xl}
                color={colors.onSurfaceVariant}
              />
            </PressableWithFeedback>
          </View>
        </View>
        <View
          style={[
            { paddingHorizontal: spacing.md, marginTop: spacing.sm },
            gs.flexRow,
            gs.itemsCenter,
          ]}
        >
          <AppText.Bold
            style={[
              gs.fullFlex,
              {
                fontSize: textSize.xxxl,
                color:
                  props.selectedTransaction?.type === 'expense'
                    ? colors.error
                    : colors.primary,
              },
            ]}
          >
            {getFormattedAmount(props.selectedTransaction?.amount ?? 0)}
          </AppText.Bold>
        </View>
        <View style={[{ paddingHorizontal: spacing.md }]}>
          <AppText.Regular
            style={[
              {
                fontSize: textSize.md,
                color: colors.onBackground,
              },
            ]}
          >
            {format(
              props.selectedTransaction?.transaction_date ?? new Date(),
              'MMM dd, yyyy - hh:mm a',
            )}
          </AppText.Regular>
        </View>
        <View
          style={[
            gs.flexRow,
            gs.itemsCenter,
            {
              paddingHorizontal: spacing.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <View style={[gs.fullFlex]}>
            <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
              <View style={[styles.dimText]}>
                <Icon
                  source={'shape'}
                  size={textSize.lg}
                  color={colors.onBackground}
                />
              </View>
              <AppText.Regular
                style={[
                  styles.dimText,
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              >
                {t('common.category')}
              </AppText.Regular>
            </View>
            <AppText.Regular
              style={[
                {
                  color: colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              {categoryName}
            </AppText.Regular>
          </View>
          <View style={[gs.fullFlex]}>
            <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
              <View style={[styles.dimText]}>
                <Icon
                  source={'wallet'}
                  size={textSize.lg}
                  color={colors.onBackground}
                />
              </View>
              <AppText.Regular
                style={[
                  styles.dimText,
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              >
                {t('common.wallet')}
              </AppText.Regular>
            </View>
            <AppText.Regular
              style={[
                {
                  color: colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              {walletName}
            </AppText.Regular>
          </View>
        </View>
        {props.selectedTransaction &&
          (props.selectedTransaction.description ?? '').trim().length > 0 && (
            <View
              style={[
                {
                  paddingHorizontal: spacing.md,
                  marginTop: spacing.md,
                },
              ]}
            >
              <AppText.Regular
                style={[
                  styles.dimText,
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              >
                {t('txnDetails.desc')}
              </AppText.Regular>
              <AppText.Regular
                style={[
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              >
                {props.selectedTransaction?.description ?? ''}
              </AppText.Regular>
            </View>
          )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default TransactionDetailsSheet;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  dimText: {
    opacity: 0.7,
  },
});
