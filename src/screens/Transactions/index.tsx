import { FlashList } from '@shopify/flash-list';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { AppTheme, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import { useBottomSheetModal as useBottomSheetR } from '@gorhom/bottom-sheet';

import HeaderText from '../../components/atoms/HeaderText';
import AppText from '../../components/molecules/AppText';
import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import RenderTransaction from '../../components/RenderTransaction';
import useTransactions from '../../hooks/useTransactions';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import { TTransaction } from '../../types';
import TransactionDetailsSheet from '../TransactionDetails/TransactionDetailsSheet';
import useFetchRecords from '../../hooks/useFetchRecords';

const Transactions = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const { loadInitial, transactions, loadMore, deleteTxn } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] =
    useState<null | TTransaction>(null);

  const { dismissAll } = useBottomSheetR();
  const { fetchRecents } = useFetchRecords();

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal(
    () => {
      setSelectedTransaction(null);
    },
  );

  const onItemPress = useCallback((txn: TTransaction) => {
    setSelectedTransaction(txn);
  }, []);

  const onDeletePress = useCallback(
    async (txn: TTransaction) => {
      await deleteTxn(txn.id);

      dismissAll();
      fetchRecents();
    },
    [dismissAll, deleteTxn, fetchRecents],
  );

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (selectedTransaction) {
      handlePresent();
    }
  }, [selectedTransaction, handlePresent]);

  return (
    <ScreenWrapper style={[gs.fullFlex]}>
      <View style={[styles.header]}>
        <HeaderText header={t('txns.title')} />
      </View>
      <View style={[styles.listContainer]}>
        <FlashList
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
          }}
          keyExtractor={item =>
            item.type === 'header' ? item.item.toISOString() : item.item.id
          }
          getItemType={item => {
            // To achieve better performance, specify the type based on the item
            return item.type === 'header' ? 'sectionHeader' : 'row';
          }}
          data={transactions}
          renderItem={({ item }) => {
            if (item.type === 'header')
              return (
                <AppText.Medium style={[styles.sectionHeaderText]}>
                  {format(item.item, 'MMM - do')}
                </AppText.Medium>
              );
            return (
              <RenderTransaction item={item.item} onItemPress={onItemPress} />
            );
          }}
          onEndReached={() => {
            loadMore();
          }}
          onEndReachedThreshold={0.2}
        />
      </View>
      <TransactionDetailsSheet
        handleSheetChanges={handleSheetChange}
        ref={btmShtRef}
        selectedTransaction={selectedTransaction}
        onDeletePress={onDeletePress}
      />
    </ScreenWrapper>
  );
};

export default Transactions;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    listContainer: {
      flex: 1,
      marginBottom: 100,
    },
    sectionHeaderText: {
      fontSize: textSize.md,
      color: colors.onBackground,
      opacity: 0.5,
      marginBottom: spacing.xs,
    },
  });
