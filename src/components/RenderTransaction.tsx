import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../theme';
import { gs } from '../common';
import useHelpers from '../hooks/useHelpers';
import { TTransaction } from '../types';
import withOpacity from '../utils/withOpacity';
import Card from './atoms/Card';
import PressableWithFeedback from './atoms/PressableWithFeedback';
import AppText from './molecules/AppText';

const RenderTransaction = (props: {
  item: TTransaction;
  onItemPress: (t: TTransaction) => void;
}) => {
  const theme = useAppTheme();
  const { getFormattedAmount } = useHelpers();

  return (
    <PressableWithFeedback
      onPress={() => {
        props.onItemPress(props.item);
      }}
      style={[{ marginBottom: spacing.sm }]}
    >
      <Card>
        <View style={[gs.flexRow]}>
          <View
            style={[
              {
                backgroundColor: withOpacity(
                  props.item.category?.icon.color ?? theme.colors.primary,
                  0.15,
                ),
                borderRadius: borderRadius.round,
                padding: spacing.sm,
              },
            ]}
          >
            <Icon
              source={props.item.category?.icon.icon ?? 'shape-outline'}
              size={28}
              color={props.item.category?.icon.color ?? theme.colors.primary}
            />
          </View>
          <View
            style={[
              gs.fullFlex,
              {
                marginLeft: spacing.sm,
                justifyContent: 'center',
              },
            ]}
          >
            <AppText.Regular
              style={[
                {
                  color: theme.colors.onSurface,
                  fontSize: textSize.sm,
                },
              ]}
            >
              {props.item.category?.name ?? ''}
            </AppText.Regular>
            <AppText.Regular
              style={[
                {
                  color: theme.colors.onSurfaceVariant,
                  fontSize: textSize.xs,
                },
              ]}
            >
              {props.item.category?.name ?? ''}
            </AppText.Regular>
          </View>
          <AppText.Medium
            style={[
              {
                fontSize: textSize.sm,
                color: theme.colors.onSurface,
                textAlignVertical: 'center',
              },
            ]}
          >
            {getFormattedAmount(props.item.amount)}
          </AppText.Medium>
        </View>
      </Card>
    </PressableWithFeedback>
  );
};

export default RenderTransaction;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 3,
    left: 3,
  },
  actionsBox: {
    gap: spacing.xs,
  },
  action: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
});
