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
            {
              marginBottom: spacing.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text
            style={[
              gs.fontBold,
              {
                fontSize: textSize.lg,
                color: colors.onBackground,
              },
            ]}
          >
            Select an account
          </Text>
        </View>
        <BottomSheetFlatList
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          data={accounts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const isSelected = props.selectedAccountId === item.id;
            return (
              <PressableWithFeedback
                onPress={() => {
                  props.onAccountChange(item.id);
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
});
