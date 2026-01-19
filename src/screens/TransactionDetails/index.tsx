import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { formatDigits } from 'commonutil-core';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import ScreenWithoutHeader from '../../components/molecules/ScreenWithoutHeader';
import useAccountStore from '../../stores/accountsStore';
import useTransactionsStore from '../../stores/transactionsStore';
import { TRootStackParamList } from '../../types';

const TransactionDetails = () => {
  const route =
    useRoute<RouteProp<TRootStackParamList, 'TransactionDetails'>>();
  const transaction = route.params.transaction;
  const theme = useAppTheme();
  const navigation = useNavigation();
  const categories = useTransactionsStore(state => state.categories);
  const accounts = useAccountStore(state => state.accounts);

  const categoryName = useMemo(() => {
    const category = categories.find(c => c.id === transaction.categoryIds[0]);
    return category?.name ?? 'General';
  }, [categories, transaction]);

  const accountName = useMemo(() => {
    return accounts.find(acc => acc.id === transaction.accountId)?.name ?? '';
  }, [transaction, accounts]);

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
        <View
          style={[
            { paddingHorizontal: spacing.lg },
            gs.flexRow,
            gs.justifyBetween,
          ]}
        >
          <Pressable
            onPress={navigation.goBack}
            style={[
              {
                borderRadius: borderRadius.round,
              },
              styles.avatar,
              gs.centerItems,
            ]}
          >
            <Icon size={24} source={'arrow-left'} />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('AddTransaction', {
                mode: 'edit',
                transaction: transaction,
              });
            }}
            style={[
              {
                borderRadius: borderRadius.round,
              },
              styles.avatar,
              gs.centerItems,
            ]}
          >
            <Icon size={24} source={'pencil'} />
          </Pressable>
        </View>
        {/* amount section */}
        <View style={{ paddingHorizontal: spacing.md }}>
          <Card mode="contained">
            <Card.Content
              style={[
                styles.totalBalance,
                {
                  backgroundColor: theme.colors.surfaceVariant,
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
                    color:
                      transaction.type === 'expense'
                        ? theme.colors.error
                        : theme.colors.success,
                    fontSize: textSize.xxxl,
                  },
                ]}
              >
                ₹ {formatDigits(transaction.amount.toString())}
              </Text>
            </Card.Content>
          </Card>
        </View>
        {/* Category and account section */}
        <View
          style={[
            gs.flexRow,
            { paddingHorizontal: spacing.md, gap: spacing.md },
          ]}
        >
          <View
            style={[
              styles.ieBox,
              {
                backgroundColor: theme.colors.backdrop,
              },
            ]}
          >
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
                styles.fontSemi,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              {categoryName}
            </Text>
          </View>
          <View
            style={[
              styles.ieBox,
              {
                backgroundColor: theme.colors.backdrop,
              },
            ]}
          >
            <Text
              style={[
                styles.ieBanner,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.md,
                },
              ]}
            >
              Account
            </Text>
            <Text
              style={[
                styles.fontSemi,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              {accountName}
            </Text>
          </View>
        </View>
        {/* date and time section */}
        <View
          style={[
            gs.flexRow,
            { paddingHorizontal: spacing.md, gap: spacing.md },
          ]}
        >
          <View
            style={[
              styles.ieBox,
              {
                backgroundColor: theme.colors.backdrop,
              },
            ]}
          >
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
                styles.fontSemi,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              {format(transaction.transactionDate, 'MMM dd yyyy')}
            </Text>
          </View>
          <View
            style={[
              styles.ieBox,
              {
                backgroundColor: theme.colors.backdrop,
              },
            ]}
          >
            <Text
              style={[
                styles.ieBanner,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.md,
                },
              ]}
            >
              Time
            </Text>
            <Text
              style={[
                styles.fontSemi,
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            >
              {format(transaction.transactionDate, 'HH:mm a')}
            </Text>
          </View>
        </View>
        {/* description section */}
        {(transaction.description ?? '').trim().length > 0 && (
          <View style={[gs.flexRow, { paddingHorizontal: spacing.lg }]}>
            <Text
              style={[
                {
                  color: theme.colors.onBackground,
                  fontSize: textSize.md,
                  padding: spacing.xs,
                },
              ]}
            >
              {transaction.description}
            </Text>
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
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  ieBanner: {
    fontWeight: 'semibold',
  },
  attachmentContainer: {
    marginTop: spacing.xs,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  fontSemi: {
    fontWeight: 'semibold',
  },
});
