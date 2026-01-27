import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../atoms/PressableWithFeedback';

const CommonHeader = () => {
  const navigation = useNavigation();

  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
        <View style={[gs.flexRow, gs.itemsCenter, { gap: spacing.sm }]}>
          <Text
            style={[
              gs.fontBold,
              {
                color: colors.onBackground,
                fontSize: textSize.lg,
              },
            ]}
          >
            Transactions
          </Text>
        </View>

        <View style={styles.headerRight}>
          <PressableWithFeedback
            onPress={() => {
              navigation.navigate('Settings');
            }}
          >
            <Icon source={'cog'} size={spacing.xl} />
          </PressableWithFeedback>
        </View>
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },

  headerLeft: {
    backgroundColor: 'blue',
    borderRadius: borderRadius.round,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: textSize.lg,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    paddingRight: spacing.sm,
  },
  input: {
    fontSize: textSize.md,
    paddingHorizontal: spacing.md,
    flex: 1,
  },
});
