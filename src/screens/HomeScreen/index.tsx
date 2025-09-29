import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Icon, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize } from '../../../theme';
import { gs } from '../../common';
import useAccountStore from '../../stores/accountsStore';
import { formatDigits } from 'commonutil-core';

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const getSelectedAccount = useAccountStore(state => state.getSelectedAccount);

  const selectedAccount = useMemo(() => {
    return getSelectedAccount();
  }, [getSelectedAccount]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top + 5, gap: spacing.lg }}
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
      {/* Total balance section */}
      <View style={{ paddingHorizontal: spacing.lg }}>
        <Card mode="elevated" elevation={5}>
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
              Total Balance
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
              ₹{formatDigits(selectedAccount.balance.toString())}
            </Text>
          </Card.Content>
        </Card>
      </View>
      {/* income and expense section */}
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
            Income
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
            ₹{formatDigits('3000')}
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
            Expense
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
            -₹{formatDigits('200')}
          </Text>
        </View>
      </View>
      {/* recent transactions section */}
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
          Recent transactions
        </Text>
        <View style={[gs.flexRow, { gap: spacing.md, marginTop: spacing.lg }]}>
          <View
            style={[
              {
                padding: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: borderRadius.lg,
                backgroundColor: theme.colors.backdrop,
              },
              gs.centerItems,
            ]}
          >
            <Text
              style={[
                { color: theme.colors.onBackground, fontSize: textSize.md },
                gs.fontBold,
              ]}
            >
              Feb
            </Text>
            <Text
              style={[
                { color: theme.colors.onBackground, fontSize: textSize.md },
                gs.fontBold,
              ]}
            >
              25
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
            <Text
              style={[
                {
                  fontSize: textSize.md,
                  color: theme.colors.onSurfaceDisabled,
                },
              ]}
            >
              some description
            </Text>
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
                  color: theme.colors.onErrorContainer,
                },
              ]}
            >
              -₹120
            </Text>
          </View>
        </View>
        <View style={[gs.flexRow, { gap: spacing.md, marginTop: spacing.lg }]}>
          <View
            style={[
              {
                padding: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: borderRadius.lg,
                backgroundColor: theme.colors.backdrop,
              },
              gs.centerItems,
            ]}
          >
            <Text
              style={[
                { color: theme.colors.onBackground, fontSize: textSize.md },
                gs.fontBold,
              ]}
            >
              Feb
            </Text>
            <Text
              style={[
                { color: theme.colors.onBackground, fontSize: textSize.md },
                gs.fontBold,
              ]}
            >
              25
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
                  color: theme.colors.onTertiaryContainer,
                },
              ]}
            >
              ₹120
            </Text>
          </View>
        </View>
      </View>
      {/* <Button
        onPress={() => {
          setIsInitialSetupDone(false);
          deleteAllAccounts();
        }}
      >
        Reset stack
      </Button> */}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
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
