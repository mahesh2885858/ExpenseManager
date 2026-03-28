import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetTextInput,
  useBottomSheetModal,
  useBottomSheetScrollableCreator,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  AppTheme,
  borderRadius,
  spacing,
  textSize,
  useAppTheme,
} from '../../../theme';
import { currencies, gs } from '../../common';
import { TCurrency } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import useWalletStore from '../../stores/walletsStore';
import AppText from '../molecules/AppText';
import { useTranslation } from 'react-i18next';

type TProps = {
  ref: any;
  handleSheetChanges: BottomSheetProps['onChange'];
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const CurrencySelectionModal = (props: TProps) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const BottomSheetScrollable = useBottomSheetScrollableCreator();
  const { dismissAll } = useBottomSheetModal();

  const [search, setSearch] = useState('');
  const setCurrency = useWalletStore(state => state.setCurrency);
  const currency = useWalletStore(state => state.currency);

  const currenciesToRender = useMemo(() => {
    return search.trim().length === 0
      ? currencies
      : currencies.filter(cur =>
          cur.name.toLowerCase().includes(search.trim().toLowerCase()),
        );
  }, [search]);

  const sortedCurrencies = useMemo(() => {
    return currenciesToRender.sort((a, b) => a.name.localeCompare(b.name));
  }, [currenciesToRender]);

  return (
    <BottomSheetModal
      stackBehavior="push"
      backdropComponent={pr => BottomCBackdrop(pr)}
      backgroundStyle={{
        backgroundColor: colors.surfaceContainerLow,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={500}
    >
      <View style={[styles.container]}>
        <View style={[styles.content]}>
          <View>
            <View style={[gs.flexRow, gs.itemsCenter]}>
              <AppText.Bold style={[styles.headerText]}>
                {t('currencyList.select')}
              </AppText.Bold>
            </View>
            {currencies.length > 5 && (
              <View style={[{ marginTop: spacing.sm }]}>
                <BottomSheetTextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor={colors.onSurfaceDisabled}
                  placeholder="Search currencies"
                  style={[
                    styles.searchInput,
                    {
                      color: colors.onSurfaceVariant,
                      borderColor: colors.outlineVariant,
                    },
                  ]}
                />
              </View>
            )}
            <FlashList
              style={styles.list}
              renderScrollComponent={BottomSheetScrollable}
              keyExtractor={(item: TCurrency) => item.code}
              showsVerticalScrollIndicator={false}
              data={sortedCurrencies}
              contentContainerStyle={[styles.listContainer]}
              renderItem={({ item }: { item: TCurrency }) => {
                const isSelected = item.code === currency.code;
                return (
                  <PressableWithFeedback
                    onPress={() => {
                      setCurrency(item);
                      dismissAll();
                    }}
                    style={[
                      gs.flexRow,
                      gs.itemsCenter,
                      styles.item,
                      {
                        borderBottomColor: isSelected
                          ? 'transparent'
                          : colors.onSurfaceDisabled,
                        backgroundColor: isSelected
                          ? colors.primary
                          : 'transparent',
                      },
                    ]}
                    key={item.code}
                  >
                    <AppText.Regular
                      style={[
                        gs.fullFlex,
                        {
                          color: isSelected
                            ? colors.onPrimary
                            : colors.onSurface,
                          fontSize: textSize.md,
                        },
                      ]}
                    >
                      {item.name} ({item.symbol})
                    </AppText.Regular>
                    {isSelected && (
                      <Icon
                        source={'check'}
                        size={textSize.md}
                        color={colors.onPrimary}
                      />
                    )}
                  </PressableWithFeedback>
                );
              }}
            />
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};

export default CurrencySelectionModal;

const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
    },

    headerText: {
      fontSize: textSize.lg,
      color: colors.onSurface,
      flex: 1,
    },

    categoryText: {
      fontSize: textSize.lg,
    },
    searchInput: {
      borderWidth: 1,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surfaceContainerHighest,
    },
    listContainer: {
      marginTop: spacing.md,
      paddingBottom: 100,
    },
    item: {
      borderBottomWidth: 1,
      marginBottom: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderBottomColor: colors.onSurfaceDisabled,
      borderRadius: borderRadius.sm,
    },
    manageText: {
      fontWeight: '600',
    },
    list: {
      maxHeight: 500,
      paddingBottom: 30,
    },
  });
