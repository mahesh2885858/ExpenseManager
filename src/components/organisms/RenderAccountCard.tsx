import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  createAnimatedComponent,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import { TAccount } from '../../types';
import { formatAmount } from '../../utils';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import CreateNewAccount from './CreateNewAccount';
import useAccounts from '../../hooks/useAccounts';
import { useNavigation } from '@react-navigation/native';

type TProps = {
  item: TAccount;
  isFocused?: boolean;
  changeFocusId: (id: string) => void;
};

const AnimatedPressable = createAnimatedComponent(PressableWithFeedback);
const cardHeightCollapsed = 130;
const cardHeightExpanded = 200;
const cardHeightDeleteExpanded = 330;

const RenderAccountCard = (props: TProps) => {
  const { item } = props;
  const { colors } = useAppTheme();
  const animH = useSharedValue(cardHeightCollapsed);
  const [openDelDesc, setOpenDelDesc] = useState(false);
  const navigation = useNavigation();
  const { deleteAcc } = useAccounts();
  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();

  useEffect(() => {
    if (props.isFocused) {
      animH.value = withTiming(cardHeightExpanded);
    } else {
      animH.value = withTiming(cardHeightCollapsed);
      setOpenDelDesc(false);
    }
  }, [props, animH]);

  useEffect(() => {
    if (!props.isFocused) return;
    if (openDelDesc) {
      animH.value = withTiming(cardHeightDeleteExpanded);
    } else if (props.isFocused) {
      animH.value = withTiming(cardHeightExpanded);
    } else {
      animH.value = withTiming(cardHeightCollapsed);
    }
  }, [openDelDesc, animH, props]);

  return (
    <AnimatedPressable
      onPress={() => props.changeFocusId(props.isFocused ? '' : item.id)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceDisabled,
          height: animH,
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
          Balance: {formatAmount(item.balance)}
        </Text>
      </View>
      <View style={[styles.tTypeBox, gs.flexRow, gs.itemsCenter]}>
        <View
          style={[
            gs.fullFlex,
            styles.tType,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text
            style={[
              {
                color: colors.onSurfaceVariant,
              },
            ]}
          >
            Income
          </Text>
          <Text
            style={[
              styles.amountText,
              {
                color: colors.onPrimaryContainer,
                fontSize: textSize.md,
              },
            ]}
          >
            {formatAmount(item.income ?? 0)}
          </Text>
        </View>
        <View
          style={[
            gs.fullFlex,
            styles.tType,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text
            style={[
              {
                color: colors.onSurfaceVariant,
              },
            ]}
          >
            Expense
          </Text>
          <Text
            style={[
              styles.amountText,
              {
                color: colors.onPrimaryContainer,
                fontSize: textSize.md,
              },
            ]}
          >
            {formatAmount(item.expense ?? 0)}
          </Text>
        </View>
      </View>
      <View style={[styles.actionBox]}>
        <PressableWithFeedback
          onPress={() => setOpenDelDesc(true)}
          feedbackColor={colors.background}
          style={[styles.action]}
        >
          <Icon source={'delete'} size={textSize.xl} />
        </PressableWithFeedback>
        <PressableWithFeedback
          feedbackColor={colors.background}
          style={[styles.action]}
          onPress={handlePresent}
        >
          <Icon source={'pencil'} size={textSize.xl} />
        </PressableWithFeedback>
        <PressableWithFeedback
          feedbackColor={colors.background}
          style={[styles.action]}
          onPress={() => {
            navigation.navigate('FilteredTransactions', {
              id: props.item.id,
              type: 'account',
            });
          }}
        >
          <Icon source={'eye'} size={textSize.xl} />
        </PressableWithFeedback>
      </View>
      <View
        style={{
          marginTop: spacing.md,
        }}
      >
        <Text
          style={[
            gs.centerText,
            {
              color: colors.onBackground,
            },
          ]}
        >
          Deleting this account will also delete all transactions associated
          with this account. Are you sure you want to continue?
        </Text>
        <View style={[gs.flexRow, styles.btnContainer]}>
          <PressableWithFeedback
            onPress={() => deleteAcc(props.item.id)}
            style={[
              {
                backgroundColor: colors.errorContainer,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Text
              style={[
                {
                  color: colors.onErrorContainer,
                },
              ]}
            >
              Delete
            </Text>
          </PressableWithFeedback>
          <PressableWithFeedback
            style={[
              {
                backgroundColor: colors.secondary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.sm,
              },
            ]}
            onPress={() => {
              setOpenDelDesc(false);
            }}
          >
            <Text
              style={[
                {
                  color: colors.onSecondary,
                },
              ]}
            >
              Cancel
            </Text>
          </PressableWithFeedback>
        </View>
      </View>
      <CreateNewAccount
        accToEdit={props.item}
        handleSheetChanges={handleSheetChange}
        ref={btmShtRef}
      />
    </AnimatedPressable>
  );
};

export default RenderAccountCard;

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    // height: cardHeightCollapsed,
    overflow: 'hidden',
  },
  text: {
    fontSize: textSize.md,
    fontWeight: '600',
  },

  tTypeBox: {
    borderRadius: borderRadius.md,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  tType: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  amountText: {
    fontWeight: '700',
  },
  listBox: {
    paddingBottom: 100,
  },
  actionBox: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  action: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  btnContainer: {
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
});
