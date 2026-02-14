import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  useBottomSheetScrollableCreator,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, RadioButton } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useAccountStore from '../../stores/accountsStore';
import { TAccount } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import CreateNewAccount from './CreateNewAccount';

type TProps = {
  ref: any;
  handleSheetChanges: BottomSheetProps['onChange'];
  selectedAccountId: string;
  onAccountChange: (id: string) => void;
};
const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};
const AccountSelectionModal = (props: TProps) => {
  const { colors } = useAppTheme();
  const accounts = useAccountStore(state => state.accounts);
  const BottomSheetScrollable = useBottomSheetScrollableCreator();

  const {
    btmShtRef: newAccBtmSheet,
    handlePresent: handlePresentNewAccBtmSheet,
    handleSheetChange: handleNewAccSheetChanges,
  } = useBottomSheetModal();

  return (
    <BottomSheetModal
      backdropComponent={pr => BottomCBackdrop(pr)}
      backgroundStyle={{
        backgroundColor: colors.inverseOnSurface,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={500}
    >
      <View
        style={[
          {
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <View
          style={[
            gs.flexRow,
            gs.itemsCenter,
            {
              marginBottom: spacing.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text
            style={[
              gs.fontBold,
              gs.fullFlex,
              {
                fontSize: textSize.lg,
                color: colors.onBackground,
              },
            ]}
          >
            Select Account
          </Text>
          <PressableWithFeedback
            style={[
              {
                paddingLeft: spacing.md,
              },
            ]}
            onPress={handlePresentNewAccBtmSheet}
          >
            <Icon
              source={'plus'}
              size={textSize.xxxl}
              color={colors.onTertiaryContainer}
            />
          </PressableWithFeedback>
        </View>
        <FlashList
          ListEmptyComponent={
            <View style={[gs.fullFlex, gs.centerItems]}>
              <Text
                style={[
                  gs.fontBold,
                  gs.centerText,
                  {
                    color: colors.onSurfaceDisabled,
                    fontSize: textSize.lg,
                    marginTop: spacing.lg,
                    paddingBottom: spacing.lg,
                  },
                ]}
              >
                No accounts yet. Start by creating one.
              </Text>
            </View>
          }
          style={{
            maxHeight: 500,
          }}
          renderScrollComponent={BottomSheetScrollable}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          data={accounts}
          keyExtractor={(item: TAccount) => item.id}
          renderItem={({ item }: { item: TAccount }) => {
            const isSelected = props.selectedAccountId === item.id;
            return (
              <PressableWithFeedback
                onPress={() => {
                  props.onAccountChange(item.id);
                  props.ref.current?.dismiss();
                }}
                style={[
                  gs.flexRow,
                  gs.itemsCenter,
                  styles.item,
                  {
                    borderColor: isSelected
                      ? colors.inversePrimary
                      : colors.onSurfaceDisabled,
                  },
                ]}
                key={item.id}
              >
                <RadioButton.Android
                  status={isSelected ? 'checked' : 'unchecked'}
                  color={colors.inversePrimary}
                  value={item.name}
                />
                <Text
                  style={[
                    {
                      color: colors.onSurface,
                      fontSize: textSize.md,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </PressableWithFeedback>
            );
          }}
        />
      </View>
      <CreateNewAccount
        handleSheetChanges={handleNewAccSheetChanges}
        ref={newAccBtmSheet}
      />
    </BottomSheetModal>
  );
};

export default AccountSelectionModal;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  bottomSheet: {
    paddingHorizontal: spacing.md,
  },
  item: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
  manageText: {
    fontWeight: '600',
  },
});
