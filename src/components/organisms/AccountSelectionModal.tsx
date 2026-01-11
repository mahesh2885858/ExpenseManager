import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import useAccountStore from '../../stores/accountsStore';
import PressableWithFeedback from '../atoms/PressableWithFeedback';

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
  return (
    <BottomSheetModal
      enableDismissOnClose
      backdropComponent={pr => BottomCBackdrop(pr)}
      backgroundStyle={{
        backgroundColor: colors.inverseOnSurface,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
    >
      <BottomSheetView
        style={[
          gs.fullFlex,
          {
            paddingBottom: spacing.lg,
          },
        ]}
      >
        <View
          style={[
            styles.bottomSheet,
            gs.fullFlex,
            {
              backgroundColor: colors.inverseOnSurface,
            },
          ]}
        >
          <Text
            style={[
              gs.fontBold,
              {
                color: colors.onBackground,
                fontSize: textSize.lg,
              },
            ]}
          >
            Select an account
          </Text>
          <View
            style={[
              {
                marginTop: spacing.md,
              },
            ]}
          >
            {[...accounts].map(acc => {
              const isSelected = props.selectedAccountId === acc.id;
              return (
                <PressableWithFeedback
                  onPress={() => {
                    props.onAccountChange(acc.id);
                  }}
                  style={[
                    gs.flexRow,
                    gs.itemsCenter,
                    {
                      borderColor: isSelected
                        ? colors.inversePrimary
                        : colors.onSurfaceDisabled,
                      borderWidth: 1,
                      borderRadius: borderRadius.lg,
                      marginBottom: spacing.md,
                      paddingVertical: spacing.md,
                    },
                  ]}
                  key={acc.id}
                >
                  <RadioButton.Android
                    status={isSelected ? 'checked' : 'unchecked'}
                    color={colors.inversePrimary}
                    value={acc.name}
                  />
                  <Text
                    style={[
                      {
                        color: colors.onSurface,
                        fontSize: textSize.md,
                      },
                    ]}
                  >
                    {acc.name}
                  </Text>
                </PressableWithFeedback>
              );
            })}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default AccountSelectionModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000010',
  },
  bottomSheet: {
    paddingHorizontal: spacing.md,
  },
});
