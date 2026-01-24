import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  createAnimatedComponent,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import useBackup from '../../hooks/useBackup';
const AnimatedPressable = createAnimatedComponent(PressableWithFeedback);
const heightExpanded = 200;
const heightCollapsed = 75;
const heightDoubleExpanded = 420;
type TProps = {
  scrollRef: React.RefObject<ScrollView | null>;
};
const Backup = (props: TProps) => {
  const { colors } = useAppTheme();
  const {
    exportData,
    getDataToImport,
    dataToImport,
    resetDataToImport,
    importData,
    isGettingData,
    isImporting,
  } = useBackup();

  const animHBackup = useSharedValue(heightCollapsed);
  const [expandBackup, setExpandBackup] = useState(false);

  const onBackupOptionPress = () => {
    setExpandBackup(p => !p);
  };

  const scrollToBottom = useCallback(() => {
    props.scrollRef.current?.scrollToEnd({
      animated: true,
    });
  }, [props]);

  useEffect(() => {
    if (expandBackup) {
      animHBackup.value = withTiming(heightExpanded);
    } else {
      animHBackup.value = withTiming(heightCollapsed);
      resetDataToImport();
    }
  }, [expandBackup, animHBackup, resetDataToImport]);

  useEffect(() => {
    if (!expandBackup) return;
    if (dataToImport) {
      animHBackup.value = withTiming(heightDoubleExpanded, {}, () => {
        runOnJS(scrollToBottom)();
      });
    } else if (expandBackup) {
      animHBackup.value = withTiming(heightExpanded);
    } else {
      animHBackup.value = withTiming(heightCollapsed);
    }
  }, [dataToImport, animHBackup, expandBackup, scrollToBottom]);

  return (
    <AnimatedPressable
      onPress={onBackupOptionPress}
      style={[
        styles.setting,
        {
          borderColor: colors.onSurfaceDisabled,
          height: animHBackup,
        },
      ]}
    >
      <Text
        style={[
          styles.settingTitle,
          {
            color: colors.onBackground,
          },
        ]}
      >
        Backup
      </Text>
      <Text
        style={[
          styles.settingDesc,
          {
            color: colors.onSurfaceDisabled,
          },
        ]}
      >
        {'Backup and restore your data'}
      </Text>
      <View style={[styles.themeOptContainer]}>
        <PressableWithFeedback
          onPress={exportData}
          style={[styles.themeOption]}
        >
          <Icon
            source={'file-upload-outline'}
            size={24}
            color={colors.onBackground}
          />
          <Text
            style={{
              color: colors.onBackground,
            }}
          >
            {'Export'}
          </Text>
        </PressableWithFeedback>
        <PressableWithFeedback
          onPress={getDataToImport}
          style={[styles.themeOption]}
          disabled={isGettingData}
        >
          <Icon
            source={'file-download-outline'}
            size={24}
            color={colors.onBackground}
          />
          <Text
            style={{
              color: colors.onBackground,
            }}
          >
            {'Import'}
          </Text>
        </PressableWithFeedback>
      </View>
      <View style={[{ gap: spacing.md, marginTop: spacing.lg }]}>
        <Text
          style={[
            gs.fontBold,
            { color: colors.onBackground, fontSize: textSize.md },
          ]}
        >
          Restore backup?
        </Text>
        <View>
          <Text
            style={[styles.importSummaryText, { color: colors.onBackground }]}
          >
            Transactions: {dataToImport?.transactions.length}
          </Text>
          <Text
            style={[styles.importSummaryText, { color: colors.onBackground }]}
          >
            Accounts: {dataToImport?.accounts.length}
          </Text>
          <Text
            style={[styles.importSummaryText, { color: colors.onBackground }]}
          >
            Categories: {dataToImport?.categories.length}
          </Text>
        </View>
        <Text style={[{ color: colors.onBackground }]}>
          Importing this backup will replace all existing data in the app. This
          action cannot be undone.
        </Text>
        <View style={[gs.flexRow, gs.justifyCenter, { gap: spacing.xxxl }]}>
          <PressableWithFeedback
            onPress={resetDataToImport}
            disabled={isImporting}
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
              Cancel
            </Text>
          </PressableWithFeedback>
          <PressableWithFeedback
            disabled={isImporting}
            onPress={importData}
            style={[
              {
                backgroundColor: colors.secondary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Text
              style={[
                {
                  color: colors.onSecondary,
                },
              ]}
            >
              Import
            </Text>
          </PressableWithFeedback>
        </View>
      </View>
    </AnimatedPressable>
  );
};

export default Backup;

const styles = StyleSheet.create({
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
  restoreBackupText: {},
  importSummaryText: {
    fontSize: textSize.md,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});
