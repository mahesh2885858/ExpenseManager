import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { CURRENCY_SYMBOL } from '../../common';

type TProps = {
  ref: React.RefObject<BottomSheetModal | null>;
  handleSheetChanges: BottomSheetProps['onChange'];
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const CreateNewAccount = (props: TProps) => {
  const { colors } = useAppTheme();
  return (
    <BottomSheetModal
      backdropComponent={pr => BottomCBackdrop(pr)}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: colors.inverseOnSurface,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={500}
    >
      <BottomSheetView
        style={{
          paddingBottom: 100,
        }}
      >
        <View>
          <Text
            style={[
              styles.headerText,
              {
                color: colors.onBackground,
              },
            ]}
          >
            Add new account
          </Text>
          <View
            style={[
              styles.accNameBox,
              {
                borderColor: colors.onSurfaceDisabled,
              },
            ]}
          >
            <Text
              style={[
                {
                  color: colors.onSurfaceDisabled,
                  fontSize: textSize.md,
                },
              ]}
            >
              Account name
            </Text>
            <BottomSheetTextInput
              // value={catName}
              // onChangeText={setCatName}
              placeholder="My Account"
              placeholderTextColor={colors.onSurfaceDisabled}
              style={[
                {
                  color: colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            />
          </View>
          <View
            style={[
              styles.accNameBox,
              {
                borderColor: colors.onSurfaceDisabled,
              },
            ]}
          >
            <Text
              style={[
                {
                  color: colors.onSurfaceDisabled,
                  fontSize: textSize.md,
                },
              ]}
            >
              Balance
            </Text>
            <BottomSheetTextInput
              keyboardType="numeric"
              // value={catName}
              // onChangeText={setCatName}
              placeholder={CURRENCY_SYMBOL + '0.00'}
              placeholderTextColor={colors.onSurfaceDisabled}
              style={[
                {
                  color: colors.onBackground,
                  fontSize: textSize.lg,
                },
              ]}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CreateNewAccount;

const styles = StyleSheet.create({
  headerText: {
    fontSize: textSize.lg,
    fontWeight: 'bold',
    paddingHorizontal: spacing.md,
  },
  accNameBox: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    paddingLeft: spacing.sm,
  },
});
