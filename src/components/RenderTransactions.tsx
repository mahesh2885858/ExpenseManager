import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { spacing, textSize, useAppTheme } from '../../theme';
import { gs } from '../common';
import { TBottomTabParamList, TTransaction } from '../types';
import RenderTransaction from './RenderTransaction';
import useBottomSheetModal from '../hooks/useBottomSheetModal';
import { useBottomSheetModal as useBottomSheetR } from '@gorhom/bottom-sheet';
import TransactionDetailsSheet from '../screens/TransactionDetails/TransactionDetailsSheet';
import { Snackbar } from 'react-native-paper';
import useTransactionsStore from '../stores/transactionsStore';

const RenderTransactions = ({
  transactions,
  renderSeeAll = false,
}: {
  transactions: TTransaction[];
  renderSeeAll?: boolean;
}) => {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<TBottomTabParamList>>();
  const [selectedTransaction, setSelectedTransaction] =
    useState<null | TTransaction>(null);
  const { dismissAll } = useBottomSheetR();
  const requestDelete = useTransactionsStore(state => state.requestDelete);
  const pendingDelete = useTransactionsStore(state => state.pendingDelete);
  const undoDelete = useTransactionsStore(state => state.undoDelete);
  const confirmDelete = useTransactionsStore(state => state.confirmDelete);
  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal(
    () => {
      setSelectedTransaction(null);
    },
  );

  const onItemPress = useCallback((t: TTransaction) => {
    setSelectedTransaction(t);
  }, []);

  const onDeletePress = useCallback(
    (t: TTransaction) => {
      setSelectedTransaction(null);
      requestDelete(t);
      dismissAll();
    },
    [dismissAll, requestDelete],
  );

  useEffect(() => {
    if (selectedTransaction) {
      handlePresent();
    }
  }, [selectedTransaction, handlePresent]);
  return (
    <>
      <FlashList
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Text
            style={[
              gs.fontBold,
              gs.centerText,
              {
                color: theme.colors.onSurfaceDisabled,
                fontSize: textSize.lg,
                marginTop: spacing.lg,
              },
            ]}
          >
            No transactions!!
          </Text>
        }
        data={transactions}
        showsVerticalScrollIndicator={false}
        renderItem={props => (
          <RenderTransaction onItemPress={onItemPress} item={props.item} />
        )}
        keyExtractor={item => item.id}
        ListFooterComponent={
          renderSeeAll && transactions.length === 10 ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Transactions');
              }}
            >
              <Text
                style={[
                  gs.fontBold,
                  gs.centerText,
                  {
                    fontSize: textSize.lg,
                    color: theme.colors.primary,
                  },
                ]}
              >
                See all
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
      <TransactionDetailsSheet
        handleSheetChanges={handleSheetChange}
        ref={btmShtRef}
        selectedTransaction={selectedTransaction}
        onDeletePress={onDeletePress}
      />
      <Snackbar
        action={{
          label: 'undo',
          onPress: () => {
            console.log('cancelling dleete');
            undoDelete();
          },
        }}
        style={styles.snackBar}
        onDismiss={() => {
          console.log('deleting hte trnx');
          confirmDelete();
        }}
        visible={!!pendingDelete}
      >
        <Text>Transaction deleted</Text>
      </Snackbar>
    </>
  );
};

export default RenderTransactions;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    paddingTop: spacing.md,
  },
  snackBar: {
    bottom: 60,
    zIndex: 1000,
  },
});
