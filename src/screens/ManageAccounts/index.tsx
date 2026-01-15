import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FAB, Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, textSize, useAppTheme } from '../../../theme';
import { CURRENCY_SYMBOL, gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import CreateNewAccount from '../../components/organisms/CreateNewAccount';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useGetKeyboardHeight from '../../hooks/useGetKeyboardHeight';
import useAccountStore from '../../stores/accountsStore';
import { formatDigits } from 'commonutil-core';

const ManageAccounts = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  const accounts = useAccountStore(state => state.accounts);
  const { kbHeight } = useGetKeyboardHeight();

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();

  return (
    <GestureHandlerRootView style={[gs.fullFlex]}>
      <BottomSheetModalProvider>
        <View
          style={[
            gs.fullFlex,
            {
              paddingTop: top + 5,
            },
          ]}
        >
          {/* header */}
          <View style={[gs.flexRow, gs.itemsCenter, styles.header]}>
            <PressableWithFeedback onPress={navigation.goBack}>
              <Icon source="arrow-left" size={24} />
            </PressableWithFeedback>
            <Text
              style={[
                styles.headerText,
                {
                  color: colors.onBackground,
                },
              ]}
            >
              Manage Accounts
            </Text>
          </View>
          <View style={[gs.fullFlex, styles.listWrapper]}>
            <FlashList
              ListEmptyComponent={
                <View>
                  <Text
                    style={[
                      gs.fontBold,
                      {
                        color: colors.onBackground,
                        fontSize: textSize.lg,
                      },
                    ]}
                  >
                    No accounts yet. Start by creating one.
                  </Text>
                </View>
              }
              data={accounts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                console.log({ item });
                return (
                  <View
                    style={[
                      {
                        backgroundColor: colors.surfaceDisabled,
                        marginTop: spacing.md,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: spacing.sm,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: colors.onBackground,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <View>
                      <Text
                        style={[
                          styles.text,
                          {
                            color: colors.onBackground,
                          },
                        ]}
                      >
                        Balance:{CURRENCY_SYMBOL}
                        {formatDigits(String(item.balance ?? 0) ?? 0)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <FAB
            icon="plus"
            style={[
              styles.fab,
              {
                bottom: kbHeight + 20,
              },
            ]}
            onPress={() => handlePresent()}
          />
        </View>
        <CreateNewAccount
          handleSheetChanges={handleSheetChange}
          ref={btmShtRef}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ManageAccounts;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  headerText: {
    fontSize: textSize.lg,
    fontWeight: 'bold',
  },
  listWrapper: {
    paddingHorizontal: spacing.md,
  },
  text: {
    fontSize: textSize.md,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 5,
    bottom: 40,
  },
});
