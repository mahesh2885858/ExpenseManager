import { FlashList } from '@shopify/flash-list';
import { format, isThisYear } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import EmptyTransactionsComponent from '../../components/organisms/EmptyTransactionsComponent';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import { Icon } from 'react-native-paper';
import TransactionFilters from '../TransactionFilters';
import useTransactionsStore from '../../stores/transactionsStore';

const Transactions = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const { loadInitial, transactions, loadMore, deleteTxn } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] =
    useState<null | TTransaction>(null);
  const [renderFilters, setRenderFilters] = useState(false);
  const { dismissAll } = useBottomSheetR();
  const { fetchRecents } = useFetchRecords();
const filters = useTransactionsStore(state=>state.filters)
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

  const isAnyFilterApplied = useMemo(() => {
    return (
      (!!filters.date && !filters.date.isThisMonth) || !!filters.type
    );
  }, [filters]);

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
        <PressableWithFeedback
          onPress={() => {
            setRenderFilters(true);
          }}
        >
          {isAnyFilterApplied&&<View
            style={styles.activeFilterDot}
          />}
          <Icon
            source={'filter'}
            size={textSize.xxl}
            color={colors.onSurface}
          />
        </PressableWithFeedback>
      </View>
      <View style={[styles.listContainer]}>
        <FlashList
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
          }}
          ListEmptyComponent={EmptyTransactionsComponent}
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
                  {isThisYear(item.item)? format(item.item, 'MMM - do'):format(item.item, 'yyyy - MMM - do')}
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
      <TransactionFilters
        visible={renderFilters}
        onClose={() => setRenderFilters(false)}
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    listContainer: {
      flex: 1,
      marginBottom: 100,
    },
    activeFilterDot: {
      height: 10,
      width: 10,
      borderRadius: 100,
      backgroundColor:colors.primary,
      position: "absolute",
      zIndex: 100,
      right:0
    },
    sectionHeaderText: {
      fontSize: textSize.md,
      color: colors.onBackground,
      opacity: 0.5,
      marginBottom: spacing.xs,
    },
  });
