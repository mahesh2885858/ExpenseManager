import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing } from '../../../theme';
import { CATEGORY_ICONS } from '../../common';
import { TCategory, TCategoryIcon } from '../../types';
import withOpacity from '../../utils/withOpacity';
import PressableWithFeedback from '../atoms/PressableWithFeedback';

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
  const styles = createStyles();

  const columnData = useMemo(() => chunkIntoColumns(CATEGORY_ICONS, 2), []);
  const iconBgStyles = (icon: TCategory['icon'], isSelected = false) => ({
    backgroundColor: withOpacity(icon.color, 0.15),
    borderColor: isSelected ? icon.color : 'transparent',
  });
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
                style={[styles.item, iconBgStyles(cat, isSelected)]}
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
const createStyles = () =>
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
