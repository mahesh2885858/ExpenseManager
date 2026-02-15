import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import HeaderWithBackButton from '../../components/atoms/HeaderWithBackButton';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import Backup from './Backup';
import ThemeSwitch from './ThemeSwitch';
import { Icon } from 'react-native-paper';
import useAccounts from '../../hooks/useAccounts';
import useBottomSheetModal from '../../hooks/useBottomSheetModal';
import CurrencySelectionModal from '../../components/organisms/CurrencySelectionModal';
import NumberFormat from './NumberFormat';

const Settings = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { currency } = useAccounts();

  const { btmShtRef, handlePresent, handleSheetChange } = useBottomSheetModal();

  const scrollRef = useRef<ScrollView>(null);

  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const onItemPress = (item: string | null) => {
    setExpandedItem(p => (p === item ? null : item));
  };

  return (
    <View
      style={[
        gs.fullFlex,
        {
          paddingTop: top + 10,
        },
      ]}
    >
      <HeaderWithBackButton headerText="Settings" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.Container}>
        <ThemeSwitch expandedItem={expandedItem} onItemPress={onItemPress} />
        <PressableWithFeedback
          onPress={() => {
            navigation.navigate('ManageAccounts');
          }}
          style={[
            styles.setting,
            gs.flexRow,
            gs.itemsCenter,
            {
              borderColor: colors.onSurfaceDisabled,
              gap: spacing.sm,
            },
          ]}
        >
          <Icon
            source={'wallet'}
            size={textSize.xxl}
            color={colors.onBackground}
          />
          <View style={[{ gap: spacing.sm }]}>
            <Text
              style={[
                styles.settingTitle,
                {
                  color: colors.onBackground,
                },
              ]}
            >
              Accounts
            </Text>
            <Text
              style={[
                styles.settingDesc,
                {
                  color: colors.onSurfaceDisabled,
                },
              ]}
            >
              Manage your accounts here
            </Text>
          </View>
        </PressableWithFeedback>
        <PressableWithFeedback
          onPress={() => {
            navigation.navigate('ManageCategories');
          }}
          style={[
            styles.setting,
            gs.flexRow,
            gs.itemsCenter,
            {
              borderColor: colors.onSurfaceDisabled,
              gap: spacing.sm,
            },
          ]}
        >
          <Icon
            source={'shape'}
            size={textSize.xxl}
            color={colors.onBackground}
          />
          <View style={[{ gap: spacing.sm }]}>
            <Text
              style={[
                styles.settingTitle,
                {
                  color: colors.onBackground,
                },
              ]}
            >
              Categories
            </Text>
            <Text
              style={[
                styles.settingDesc,
                {
                  color: colors.onSurfaceDisabled,
                },
              ]}
            >
              Manage your categories here
            </Text>
          </View>
        </PressableWithFeedback>
        <PressableWithFeedback
          onPress={() => {
            handlePresent();
          }}
          style={[
            styles.setting,
            gs.flexRow,
            gs.itemsCenter,
            {
              borderColor: colors.onSurfaceDisabled,
              gap: spacing.sm,
            },
          ]}
        >
          <Icon
            source={'currency-usd'}
            size={textSize.xxl}
            color={colors.onBackground}
          />
          <View style={[{ gap: spacing.sm }]}>
            <Text
              style={[
                styles.settingTitle,
                {
                  color: colors.onBackground,
                },
              ]}
            >
              Currency
            </Text>
            <Text
              style={[
                styles.settingDesc,
                {
                  color: colors.onSurfaceDisabled,
                },
              ]}
            >
              {currency.name} ({currency.symbol})
            </Text>
          </View>
        </PressableWithFeedback>
        <NumberFormat expandedItem={expandedItem} onItemPress={onItemPress} />
        <Backup
          scrollRef={scrollRef}
          expandedItem={expandedItem}
          onItemPress={onItemPress}
        />
        <CurrencySelectionModal
          handleSheetChanges={handleSheetChange}
          ref={btmShtRef}
        />
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  Container: {
    paddingBottom: 100,
  },
  setting: {
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
    overflow: 'hidden',
    height: 75,
  },
  settingTitle: {
    fontSize: textSize.lg,
    fontWeight: '500',
  },
  settingDesc: {
    fontSize: textSize.md,
    fontWeight: 'normal',
  },
  themeOptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    position: 'relative',
  },
  highlightBox: {
    position: 'absolute',
    width: 90,
    height: 80,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    zIndex: -1,
  },
  themeOption: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    width: 90,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    zIndex: 1, // Above highlight
  },
});
