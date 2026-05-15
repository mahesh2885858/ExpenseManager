import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import useTransactions from '../../hooks/useTransactions';
import { FlashList } from '@shopify/flash-list';
import AppText from '../../components/molecules/AppText';
import RenderTransaction from '../../components/RenderTransaction';
import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import { gs } from '../../common';
import { AppTheme, spacing, textSize, useAppTheme } from '../../../theme';
import HeaderText from '../../components/atoms/HeaderText';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const Transactions = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const { loadInitial, transactions, loadMore, hasMore } = useTransactions();

  useEffect(() => {
    console.log('w');
    loadInitial();
  }, [loadInitial]);

  return (
    <ScreenWrapper style={[gs.fullFlex]}>
      <View style={[styles.header]}>
        <HeaderText header={t('txns.title')} />
      </View>
      <View
        style={[
          {
            flex: 1,
            // backgroundColor: 'red',
            marginBottom: 100,
          },
        ]}
      >
        <FlashList
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
          }}
          keyExtractor={item =>
            item.type === 'header' ? item.item.toISOString() : item.item.id
          }
          // stickyHeaderIndices={transactions
          //   .map((item, index) => (item.type === 'header' ? index : null))
          //   .filter(i => i !== null)}
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
              <RenderTransaction
                item={item.item}
                onItemPress={t => {
                  console.log(t);
                }}
              />
            );
          }}
          onEndReached={() => {
            console.log('end reached');
            console.log({ hasMore });
            loadMore();
          }}
          onEndReachedThreshold={0.2}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Transactions;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.md,
    },
    sectionHeaderText: {
      fontSize: textSize.md,
      color: colors.onBackground,
      opacity: 0.5,
      marginBottom: spacing.xs,
      // paddingHorizontal: spacing.md,
    },
  });
