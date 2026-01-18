import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { gs } from '../../common';
import { spacing, textSize, useAppTheme } from '../../../theme';
import { Icon } from 'react-native-paper';
import PressableWithFeedback from './PressableWithFeedback';
import { useNavigation } from '@react-navigation/native';
const ICON_SIZE = 24;

type TProps = {
  headerText: string;
};

const HeaderWithBackButton = (props: TProps) => {
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        gs.flexRow,
        gs.itemsCenter,
        {
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <View
        style={[gs.flexRow, gs.itemsCenter, gs.fullFlex, styles.headerLeft]}
      >
        <PressableWithFeedback onPress={navigation.goBack}>
          <Icon source="arrow-left" size={ICON_SIZE} />
        </PressableWithFeedback>
        <Text
          style={[
            gs.fontBold,
            styles.headerTitle,
            { color: colors.onBackground },
          ]}
        >
          {props.headerText}
        </Text>
      </View>
    </View>
  );
};

export default HeaderWithBackButton;

const styles = StyleSheet.create({
  headerLeft: {
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: textSize.lg,
  },
});
