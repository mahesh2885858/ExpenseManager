import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import useTransactionsStore from '../../stores/transactionsStore';
import PressableWithFeedback from '../atoms/PressableWithFeedback';

type TProps = {
  search?: string;
  setSearch?: (text: string) => void;
};

const CommonHeader = (props: TProps) => {
  const [renderSearch, setRenderSearch] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  const { colors } = useAppTheme();
  const filters = useTransactionsStore(state => state.filters);

  const isFiltersActive = useMemo(() => {
    return !!filters.date || !!filters.type || !!filters.categoryId;
  }, [filters]);

  const onSearchClose = () => {
    props.setSearch && props.setSearch('');
    setRenderSearch(false);
  };

  return (
    <View style={styles.container}>
      {renderSearch ? (
        <View
          style={[
            styles.search,
            {
              backgroundColor: colors.surfaceVariant,
            },
          ]}
        >
          <TextInput
            value={props.search ?? ''}
            onChangeText={props.setSearch}
            autoFocus
            placeholder="Search here..."
            placeholderTextColor={colors.onSurfaceDisabled}
            style={[
              styles.input,
              {
                color: colors.onSurfaceVariant,
              },
            ]}
          />
          <PressableWithFeedback onPress={onSearchClose}>
            <Icon source={'close'} size={spacing.lg} />
          </PressableWithFeedback>
        </View>
      ) : (
        <View style={[styles.header]}>
          <View
            style={[
              styles.headerLeft,
              {
                backgroundColor: colors.primaryContainer,
              },
            ]}
          >
            <PressableWithFeedback>
              <Text
                style={[
                  styles.avatarText,
                  {
                    color: colors.onPrimaryContainer,
                  },
                ]}
              >
                M
              </Text>
            </PressableWithFeedback>
          </View>
          <View style={styles.headerRight}>
            <PressableWithFeedback
              hidden={route.name === 'Transactions'}
              onPress={() => setRenderSearch(true)}
            >
              <Icon source={'magnify'} size={spacing.xl} />
            </PressableWithFeedback>
            <PressableWithFeedback
              onPress={() => {
                navigation.navigate('TransactionFilters');
              }}
            >
              <Icon
                source={isFiltersActive ? 'filter-off' : 'filter-outline'}
                size={spacing.xl}
              />
            </PressableWithFeedback>
          </View>
        </View>
      )}
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
