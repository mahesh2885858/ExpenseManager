import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon, RadioButton } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import useTransactionsStore from '../../stores/transactionsStore';

const TransactionSort = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();

  const selectedSort = useTransactionsStore(state => state.sort);
  const onSortChange = useTransactionsStore(state => state.setSort);

  const [renderSnack, setRenderSnack] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let t: number;
      if (renderSnack) {
        t = setTimeout(() => {
          setRenderSnack(false);
          clearTimeout(t);
        }, 1000);
      }
      return () => {
        clearTimeout(t);
      };
    }, [renderSnack]),
  );

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <KeyboardAvoidingView
          style={[
            gs.centerItems,
            gs.fullFlex,
            {
              backgroundColor: colors.backdrop,
            },
          ]}
        >
          <View
            style={[
              styles.filterBox,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <View
              style={[
                gs.flexRow,
                gs.itemsCenter,
                gs.justifyBetween,

                {
                  paddingHorizontal: spacing.sm,
                  paddingTop: spacing.sm,
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: colors.onBackground,
                    fontSize: textSize.lg,
                  },
                ]}
              >
                Sort by
              </Text>
              <PressableWithFeedback
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  paddingVertical: spacing.sm,
                }}
              >
                <Icon source={'close'} size={textSize.lg} />
              </PressableWithFeedback>
            </View>
            {/* Sort options */}
            <View
              style={[
                styles.dateFilter,
                {
                  borderColor: colors.onSurfaceDisabled,
                },
              ]}
            >
              {/* date sort */}
              <View
                style={[
                  {
                    borderBottomWidth: 0.5,

                    borderBottomColor: colors.surfaceDisabled,
                    paddingBottom: spacing.md,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: colors.onSurfaceDisabled,
                      fontSize: textSize.md,
                      marginBottom: spacing.sm,
                    },
                  ]}
                >
                  {'Date'}
                </Text>

                <PressableWithFeedback
                  onPress={() => onSortChange('dateNewFirst')}
                  style={[gs.flexRow, gs.itemsCenter]}
                >
                  <RadioButton.Android
                    color={colors.onSecondaryContainer}
                    value="dateNewFirst"
                    onPress={() => onSortChange('dateNewFirst')}
                    status={
                      selectedSort === 'dateNewFirst' ? 'checked' : 'unchecked'
                    }
                  />
                  <Text
                    style={[
                      {
                        color: colors.onBackground,
                        fontSize: textSize.md,
                      },
                    ]}
                  >
                    Newest first
                  </Text>
                </PressableWithFeedback>
                <PressableWithFeedback
                  onPress={() => onSortChange('dateOldFirst')}
                  style={[gs.flexRow, gs.itemsCenter]}
                >
                  <RadioButton.Android
                    color={colors.onSecondaryContainer}
                    value="dateOldFirst"
                    onPress={() => onSortChange('dateOldFirst')}
                    status={
                      selectedSort === 'dateOldFirst' ? 'checked' : 'unchecked'
                    }
                  />
                  <Text
                    style={[
                      {
                        color: colors.onBackground,
                        fontSize: textSize.md,
                      },
                    ]}
                  >
                    Oldest first
                  </Text>
                </PressableWithFeedback>
              </View>
              {/* amount sort */}
              <View>
                <Text
                  style={[
                    {
                      color: colors.onSurfaceDisabled,
                      fontSize: textSize.md,
                      marginBottom: spacing.sm,
                    },
                  ]}
                >
                  {'Amount'}
                </Text>

                <PressableWithFeedback
                  onPress={() => onSortChange('amountHighFirst')}
                  style={[gs.flexRow, gs.itemsCenter]}
                >
                  <RadioButton.Android
                    color={colors.onSecondaryContainer}
                    value="amountHighFirst"
                    onPress={() => onSortChange('amountHighFirst')}
                    status={
                      selectedSort === 'amountHighFirst'
                        ? 'checked'
                        : 'unchecked'
                    }
                  />
                  <Text
                    style={[
                      {
                        color: colors.onBackground,
                        fontSize: textSize.md,
                      },
                    ]}
                  >
                    Highest first
                  </Text>
                </PressableWithFeedback>
                <PressableWithFeedback
                  onPress={() => onSortChange('amountLowFirst')}
                  style={[gs.flexRow, gs.itemsCenter]}
                >
                  <RadioButton.Android
                    color={colors.onSecondaryContainer}
                    value="amountLowFirst"
                    onPress={() => onSortChange('amountLowFirst')}
                    status={
                      selectedSort === 'amountLowFirst'
                        ? 'checked'
                        : 'unchecked'
                    }
                  />
                  <Text
                    style={[
                      {
                        color: colors.onBackground,
                        fontSize: textSize.md,
                      },
                    ]}
                  >
                    Lowest first
                  </Text>
                </PressableWithFeedback>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default TransactionSort;

const styles = StyleSheet.create({
  filterBox: {
    position: 'absolute',
    bottom: 0,
    height: 400,
    width: '96%',
    borderTopEndRadius: borderRadius.xxl,
    borderTopStartRadius: borderRadius.xxl,
    padding: spacing.md,
  },
  dateFilter: {
    gap: spacing.sm,
    // flexWrap: 'wrap',
    overflow: 'hidden',
    borderBottomWidth: 0,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  filterItem: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  dropdown: {
    padding: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  dropdownText: {
    fontSize: textSize.sm,
  },
  categoryBox: {
    marginVertical: spacing.sm,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  filterButtonBox: {
    gap: spacing.md,
  },
  filterButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.lg,
  },
});
