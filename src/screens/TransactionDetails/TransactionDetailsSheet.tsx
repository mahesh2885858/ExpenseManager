import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import useAccounts from '../../hooks/useAccounts';
import useCategories from '../../hooks/useCategories';
import { TTransaction } from '../../types';
import { formatAmount } from '../../utils';
import { useNavigation } from '@react-navigation/native';

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
  const { categories } = useCategories();
  const { accounts } = useAccounts();
  const navigation = useNavigation();
  const { dismissAll } = useBottomSheetModal();

  const categoryName =
    categories.find(c => c.id === props.selectedTransaction?.categoryIds[0])
      ?.name ?? 'Unknown';

  const accName =
    accounts.find(acc => acc.id === props.selectedTransaction?.accountId)
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
          <Text
            style={[
              gs.fullFlex,
              { fontSize: textSize.lg, color: colors.onBackground },
            ]}
          >
            Amount
          </Text>
          <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.lg }]}>
            <PressableWithFeedback
              onPress={() =>
                props.selectedTransaction &&
                props.onDeletePress(props.selectedTransaction)
              }
            >
              <Icon source={'delete'} size={textSize.xl} />
            </PressableWithFeedback>
            <PressableWithFeedback onPress={navigateToEdit}>
              <Icon source={'pencil'} size={textSize.xl} />
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
          <Text
            style={[
              gs.fullFlex,
              gs.fontBold,
              {
                fontSize: textSize.xxxl,
                color:
                  props.selectedTransaction?.type === 'expense'
                    ? colors.error
                    : colors.success,
              },
            ]}
          >
            {formatAmount(props.selectedTransaction?.amount ?? 0)}
          </Text>
        </View>
        <View style={[{ paddingHorizontal: spacing.md }]}>
          <Text
            style={[
              {
                fontSize: textSize.md,
                color: colors.onBackground,
              },
            ]}
          >
            {format(
              props.selectedTransaction?.transactionDate ?? new Date(),
              'MMM dd, yyyy - hh:mm a',
            )}
          </Text>
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
              <Text
                style={[
                  styles.dimText,
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              >
                Category
              </Text>
            </View>
            <Text
              style={[
                {
                  color: colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              {categoryName}
            </Text>
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
              <Text
                style={[
                  styles.dimText,
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              >
                Account
              </Text>
            </View>
            <Text
              style={[
                {
                  color: colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              {accName}
            </Text>
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
              <Text
                style={[
                  styles.dimText,
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              >
                Description
              </Text>
              <Text
                style={[
                  {
                    color: colors.onBackground,
                    fontSize: textSize.md,
                  },
                ]}
              >
                {props.selectedTransaction?.description ?? ''}
              </Text>
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
