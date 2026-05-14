import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  useBottomSheetScrollableCreator,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, RadioButton } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import useWalletStore from '../../stores/walletsStore';
import { TWallet } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import AppText from '../molecules/AppText';
import CreateNewWallet from './CreateNewWallet';
import { useTranslation } from 'react-i18next';

type TProps = {
  ref: any;
  handleSheetChanges: BottomSheetProps['onChange'];
  selectedWalletId: string;
  onWalletChange: (id: string) => void;
};
const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};
const WalletSelectionModal = (props: TProps) => {
  const { colors } = useAppTheme();
  const wallets = useWalletStore(state => state.wallets);
  const BottomSheetScrollable = useBottomSheetScrollableCreator();
  const setDefaultWalletId = useWalletStore(state => state.setDefaultWalletId);
  const defaultWalletId = useWalletStore(state => state.defaultWalletId);
  const { t } = useTranslation();
  const {
    btmShtRef: newWalletBtmSheet,
    handlePresent: handlePresentNewWalletBtmSheet,
    handleSheetChange: handleNewWalletSheetChanges,
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
          <AppText.Bold
            style={[
              gs.fullFlex,
              {
                fontSize: textSize.lg,
                color: colors.onBackground,
              },
            ]}
          >
            {t('wallets.select')}
          </AppText.Bold>
          <PressableWithFeedback
            style={[
              {
                paddingLeft: spacing.md,
              },
            ]}
            onPress={handlePresentNewWalletBtmSheet}
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
              <AppText.Bold
                style={[
                  gs.centerText,
                  {
                    color: colors.onSurfaceDisabled,
                    fontSize: textSize.lg,
                    marginTop: spacing.lg,
                    paddingBottom: spacing.lg,
                  },
                ]}
              >
                {t('wallets.emptyList')}
              </AppText.Bold>
            </View>
          }
          style={[styles.listStyle]}
          renderScrollComponent={BottomSheetScrollable}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          data={wallets}
          keyExtractor={(item: TWallet) => item.id}
          renderItem={({ item }: { item: TWallet }) => {
            const isSelected = props.selectedWalletId === item.id;
            const isDefault = defaultWalletId === item.id;
            return (
              <PressableWithFeedback
                onPress={() => {
                  props.onWalletChange(item.id);
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
                <AppText.Regular
                  style={[
                    gs.fullFlex,
                    {
                      color: colors.onSurface,
                      fontSize: textSize.md,
                    },
                  ]}
                >
                  {item.name}
                </AppText.Regular>
                <PressableWithFeedback
                  onPress={() => setDefaultWalletId(item.id)}
                  style={[
                    gs.centerItems,
                    { marginRight: isDefault ? spacing.md : spacing.lg },
                  ]}
                >
                  <Icon
                    source={isDefault ? 'star' : 'star-outline'}
                    size={textSize.lg}
                    color={colors.primary}
                  />
                  {isDefault && (
                    <AppText.Regular
                      style={[
                        { fontSize: textSize.xs, color: colors.onBackground },
                      ]}
                    >
                      Default
                    </AppText.Regular>
                  )}
                </PressableWithFeedback>
              </PressableWithFeedback>
            );
          }}
        />
      </View>
      <CreateNewWallet
        handleSheetChanges={handleNewWalletSheetChanges}
        ref={newWalletBtmSheet}
      />
    </BottomSheetModal>
  );
};

export default WalletSelectionModal;

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
  listStyle: {
    maxHeight: 500,
  },
});
