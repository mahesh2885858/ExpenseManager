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
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { currencies, gs } from '../../common';
import { TCurrency } from '../../types';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import useAccountStore from '../../stores/accountsStore';

type TProps = {
  ref: any;
  handleSheetChanges: BottomSheetProps['onChange'];
};

const BottomCBackdrop = (props: BottomSheetBackdropProps) => {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
};

const CurrencySelectionModal = (props: TProps) => {
  const { colors } = useAppTheme();

  const BottomSheetScrollable = useBottomSheetScrollableCreator();
  const { dismissAll } = useBottomSheetModal();

  const [search, setSearch] = useState('');
  const setCurrency = useAccountStore(state => state.setCurrency);
  const currency = useAccountStore(state => state.currency);

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
        backgroundColor: colors.inverseOnSurface,
      }}
      ref={props.ref}
      onChange={props.handleSheetChanges}
      maxDynamicContentSize={500}
    >
      <View style={[styles.container]}>
        <View style={[styles.content]}>
          <View>
            <View style={[gs.flexRow, gs.itemsCenter]}>
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
                Select Currency
              </Text>
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
                      color: colors.onBackground,
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
                        borderColor: isSelected
                          ? colors.onPrimaryContainer
                          : colors.onSurfaceDisabled,
                      },
                    ]}
                    key={item.code}
                  >
                    <Text
                      style={[
                        gs.fullFlex,
                        {
                          color: colors.onSurface,
                          fontSize: textSize.md,
                        },
                      ]}
                    >
                      {item.name} ({item.symbol})
                    </Text>
                    {isSelected && (
                      <Icon
                        source={'check'}
                        size={textSize.md}
                        color={colors.onPrimaryContainer}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },

  headerText: {
    fontSize: textSize.lg,
  },

  categoryText: {
    fontSize: textSize.lg,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
  },
  listContainer: {
    marginTop: spacing.md,
    paddingBottom: 100,
  },
  item: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  manageText: {
    fontWeight: '600',
  },
  list: {
    maxHeight: 500,
    paddingBottom: 30,
  },
});
