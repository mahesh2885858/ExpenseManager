import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Icon } from 'react-native-paper';
import { spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import ScreenWithoutHeader from '../../components/molecules/ScreenWithoutHeader';
import { TRootStackParamList } from '../../types';
const ICON_SIZE = 30;
const AVATAR_SIZE = 40;

const TransactionDetails = () => {
  const route =
    useRoute<RouteProp<TRootStackParamList, 'TransactionDetails'>>();
  const transaction = route.params.transaction;
  const navigation = useNavigation();
  const { colors } = useAppTheme();

  return (
    <ScreenWithoutHeader>
      {/* Header */}
      <View style={[gs.flexRow, gs.itemsCenter, styles.header]}>
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
            {transaction.type === 'expense' ? 'Expense' : 'Income'}
          </Text>
        </View>
        <Avatar.Icon
          icon={'pencil'}
          size={AVATAR_SIZE}
          style={{ backgroundColor: colors.primaryContainer }}
        />
      </View>
    </ScreenWithoutHeader>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  headerLeft: {
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: textSize.lg,
  },
});
