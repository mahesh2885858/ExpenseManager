import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getMaxText } from 'commonutil-core';
import { format, getDate } from 'date-fns';
import React from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
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
            <FlatList
              scrollEnabled={false}
              data={transactions}
              renderItem={props => (
                <View
                  style={[
                    gs.flexRow,
                    { gap: spacing.md, marginTop: spacing.lg },
                  ]}
                >
                  <View
                    style={[
                      {
                        padding: spacing.sm,
                        paddingHorizontal: spacing.md,
                        borderRadius: borderRadius.lg,
                        backgroundColor: theme.colors.secondaryContainer,
                      },
                      gs.centerItems,
                    ]}
                  >
                    <Text
                      style={[
                        {
                          color: theme.colors.onSecondaryContainer,
                          fontSize: textSize.md,
                        },
                        gs.fontBold,
                      ]}
                    >
                      {format(props.item.createdAt, 'MMM')}
                    </Text>
                    <Text
                      style={[
                        {
                          color: theme.colors.onSecondaryContainer,
                          fontSize: textSize.md,
                        },
                        gs.fontBold,
                      ]}
                    >
                      {getDate(props.item.createdAt)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text
                      style={[
                        {
                          fontSize: textSize.lg,
                          color: theme.colors.onBackground,
                        },
                      ]}
                    >
                      Food
                    </Text>
                    {props.item.description && (
                      <Text
                        style={[
                          {
                            fontSize: textSize.md,
                            color: theme.colors.onSurfaceDisabled,
                          },
                        ]}
                      >
                        {getMaxText(props.item.description ?? '', 35)}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={[
                        gs.fontBold,
                        {
                          fontSize: textSize.lg,
                          color:
                            props.item.type === 'expense'
                              ? theme.colors.error
                              : theme.colors.success,
                        },
                      ]}
                    >
                      {props.item.type === 'expense'
                        ? `-₹${props.item.amount}`
                        : `₹${props.item.amount}`}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
            />
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
