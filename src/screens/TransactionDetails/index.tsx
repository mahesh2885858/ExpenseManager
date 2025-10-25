import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { formatDigits } from 'commonutil-core';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import ScreenWithoutHeader from '../../components/molecules/ScreenWithoutHeader';
import useTransactionsStore from '../../stores/transactionsStore';
import { TRootStackParamList } from '../../types';
import RenderAttachment from '../AddTransaction/RenderAttachment';

const TransactionDetails = () => {
  const route =
    useRoute<RouteProp<TRootStackParamList, 'TransactionDetails'>>();
  const transaction = route.params.transaction;
  const theme = useAppTheme();
  const navigation = useNavigation();
  const categories = useTransactionsStore(state => state.categories);

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
                backgroundColor: theme.colors.primaryContainer,
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
                backgroundColor: theme.colors.primaryContainer,
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
              gap: spacing.sm,
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
              contentContainerStyle={[styles.attachmentContainer]}
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
  attachmentContainer: {
    marginTop: spacing.xs,
    padding: spacing.sm,
    gap: spacing.sm,
  },
});
