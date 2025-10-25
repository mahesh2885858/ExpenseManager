import { RouteProp, useRoute } from '@react-navigation/native';
import { formatDigits } from 'commonutil-core';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import ScreenWithoutHeader from '../../components/molecules/ScreenWithoutHeader';
import useTransactionsStore from '../../stores/transactionsStore';
import { TRootStackParamList } from '../../types';
import useAccountStore from '../../stores/accountsStore';
import { Card } from 'react-native-paper';
import RenderAttachment from '../AddTransaction/RenderAttachment';

const TransactionDetails = () => {
  const route =
    useRoute<RouteProp<TRootStackParamList, 'TransactionDetails'>>();
  const transaction = route.params.transaction;
  const theme = useAppTheme();
  const categories = useTransactionsStore(state => state.categories);
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);

  const selectedAccount = useMemo(() => {
    return getSelectedAccount();
  }, [getSelectedAccount]);

  const categoryName = useMemo(() => {
    const category = categories.find(c => c.id === transaction.categoryIds[0]);
    return category?.name ?? 'General';
  }, [categories, transaction]);

  return (
    <ScreenWithoutHeader>
      <View
        style={[
          {
            gap: spacing.lg,
          },
        ]}
      >
        {/* header section */}
        <View style={[{ paddingHorizontal: spacing.lg }, gs.flexRow]}>
          <Pressable
            style={[
              {
                backgroundColor: theme.colors.primaryContainer,
                borderRadius: borderRadius.round,
              },
              styles.avatar,
              gs.centerItems,
            ]}
          >
            <Text
              style={{
                color: theme.colors.onPrimaryContainer,
                fontSize: textSize.lg,
              }}
            >
              {selectedAccount.name.charAt(0).toUpperCase()}
            </Text>
          </Pressable>
        </View>
        {/* amount section */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Card mode="contained">
            <Card.Content
              style={[
                styles.totalBalance,
                {
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md,
                  gap: spacing.xs,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.colors.onPrimaryContainer,
                  fontSize: textSize.md,
                }}
              >
                Amount
              </Text>
              <Text
                style={[
                  styles.amountText,
                  {
                    color: theme.colors.onPrimaryContainer,
                    fontSize: textSize.xxxl,
                  },
                ]}
              >
                ₹{formatDigits(transaction.amount.toString())}
              </Text>
            </Card.Content>
          </Card>
        </View>
        {/* Category and date section */}
        <View style={[gs.flexRow, { paddingHorizontal: spacing.lg }]}>
          <View style={[styles.ieBox]}>
            <Text
              style={[
                styles.ieBanner,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.md,
                },
              ]}
            >
              Category
            </Text>
            <Text
              style={[
                gs.fontBold,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.xl,
                },
              ]}
            >
              {categoryName}
            </Text>
          </View>
          <View style={[styles.ieBox]}>
            <Text
              style={[
                styles.ieBanner,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.md,
                },
              ]}
            >
              Date
            </Text>
            <Text
              style={[
                gs.fontBold,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.xl,
                },
              ]}
            >
              {format(transaction.transactionDate, 'MMM dd yyyy')}
            </Text>
          </View>
        </View>
        {/* Attachment section*/}
        {transaction.attachments && transaction.attachments.length > 0 && (
          <View
            style={{
              paddingHorizontal: spacing.lg,
            }}
          >
            <Text
              style={[
                gs.fontBold,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              Attachments
            </Text>
            <FlatList
              horizontal
              contentContainerStyle={{
                padding: spacing.sm,
              }}
              showsHorizontalScrollIndicator={false}
              data={transaction.attachments}
              keyExtractor={(item, i) => item.path + item + i}
              renderItem={({ item }) => {
                return (
                  <RenderAttachment
                    allowDeletion={false}
                    attachment={item}
                    removeFile={() => {}}
                  />
                );
              }}
            />
          </View>
        )}
      </View>
    </ScreenWithoutHeader>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 200,
  },
  avatar: {
    height: 45,
    width: 45,
  },
  totalBalance: {
    width: '100%',
  },
  amountText: {
    fontWeight: '500',
  },
  ieBox: {
    flex: 1,
    paddingLeft: spacing.lg,
    gap: spacing.xs,
  },
  ieBanner: {
    fontWeight: 'semibold',
  },
});
