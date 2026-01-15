import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
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
            Select an account
          </Text>
          <PressableWithFeedback onPress={handlePresentNewAccBtmSheet}>
            <Text
              style={[
                styles.manageText,
                {
                  fontSize: textSize.md,

                  color: colors.onTertiaryContainer,
                },
              ]}
            >
              Add new
            </Text>
          </PressableWithFeedback>
        </View>
        <BottomSheetFlatList
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
