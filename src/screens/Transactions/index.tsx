import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import RenderTransactions from '../../components/RenderTransactions';
import useTransactionsStore from '../../stores/transactionsStore';
import { TBottomTabParamList } from '../../types';

const Transactions = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp<TBottomTabParamList>>();
  const transactions = useTransactionsStore(state => state.transactions);

  return (
    <ScrollView
      nestedScrollEnabled={true}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: top + 5,
        },
      ]}
    >
      {/* header section */}
      <View
        style={[
          {
            paddingHorizontal: spacing.lg,
            gap: spacing.md,
          },
          gs.flexRow,
          gs.itemsCenter,
        ]}
      >
        <Pressable onPress={navigation.goBack}>
          <Icon size={24} source={'arrow-left'} />
        </Pressable>
        <Text
          style={[
            gs.fontBold,
            {
              fontSize: textSize.lg,
              color: theme.colors.onBackground,
            },
          ]}
        >
          Transactions
        </Text>
      </View>
      {/* recent transactions section */}
      <View
        style={[
          {
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <View style={[gs.fullFlex]}>
          {transactions.length === 0 ? (
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
              No transactions yet!!
            </Text>
          ) : (
            <RenderTransactions transactions={transactions} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Transactions;

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
