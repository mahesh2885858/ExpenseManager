import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { CATEGORY_ICONS } from '../../common';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { TCategory, TCategoryIcon } from '../../types';
import withOpacity from '../../utils/withOpacity';
import { AppTheme, borderRadius, spacing, useAppTheme } from '../../../theme';

const chunkIntoColumns = (data: TCategoryIcon[], rows = 2) => {
  const result: TCategoryIcon[][] = [];
  for (let i = 0; i < data.length; i += rows) {
    result.push(data.slice(i, i + rows));
  }
  return result;
};

type TProps = {
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
};

const CategoryIconSelector = (props: TProps) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const columnData = useMemo(() => chunkIntoColumns(CATEGORY_ICONS, 2), []);

  return (
    <FlatList
      horizontal
      data={columnData}
      keyExtractor={item => item[0].id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.column}>
          {item.map(cat => {
            const isSelected = props.selectedId === cat.id;

            return (
              <PressableWithFeedback
                key={cat.id}
                onPress={() => props.setSelectedId(cat.id)}
                style={[
                  styles.item,
                  {
                    backgroundColor: withOpacity(cat.color, 0.15),
                    borderColor: isSelected ? cat.color : 'transparent',
                  },
                ]}
              >
                <Icon source={cat.icon} size={28} color={cat.color} />
              </PressableWithFeedback>
            );
          })}
        </View>
      )}
    />
  );
};

export default CategoryIconSelector;
const createStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    listContainer: {
      paddingRight: spacing.md,
    },
    column: {
      marginRight: spacing.md,
      gap: spacing.md,
    },
    item: {
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
  });
