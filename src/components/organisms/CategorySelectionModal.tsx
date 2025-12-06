import {
  Text,
  Modal,
  View,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, { useRef, useState } from 'react';
import useCategories from '../../hooks/useCategories';
import PressableWithFeedback from '../atoms/PressableWithFeedback';
import { Icon } from 'react-native-paper';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import { DEFAULT_CATEGORY_ID, gs } from '../../common';
type TProps = {
  visible: boolean;
  onClose: () => void;
  selectCategory: (id: string) => void;
  selectedCategory?: string;
};
const CategorySelectionModal = (props: TProps) => {
  const { categories, selectCategory, addCategory } = useCategories();
  const [renderInputForNew, setRenderInputForNew] = useState(false);
  const { selectedCategory = DEFAULT_CATEGORY_ID } = props;
  const { colors } = useAppTheme();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const coloredText = {
    color: colors.onSurfaceVariant,
  };

  const onCategoryPress = (id: string) => {
    props.selectCategory(id);
    selectCategory(id);
    props.onClose();
  };

  const onNewPress = () => {
    setRenderInputForNew(true);
  };

  const onSave = () => {
    if (input.trim().length === 0) return;
    addCategory(input);
    setInput('');
    setRenderInputForNew(false);
  };

  const onInputClose = () => {
    setRenderInputForNew(false);
    setInput('');
  };
  return (
    <Modal
      animationType="fade"
      visible={props.visible}
      transparent
      onRequestClose={props.onClose}
    >
      <View style={[styles.container]}>
        <View
          style={[styles.content, { backgroundColor: colors.surfaceVariant }]}
        >
          <View style={[styles.contentBox]}>
            <Text style={[styles.headerText, coloredText]}>
              Select a category
            </Text>
            <FlatList
              ref={listRef}
              ListFooterComponent={
                renderInputForNew ? (
                  <View
                    onLayout={() => {
                      listRef.current?.scrollToEnd({
                        animated: true,
                      });
                    }}
                    style={[styles.inputBox]}
                  >
                    <TextInput
                      autoFocus
                      ref={inputRef}
                      style={[
                        styles.input,
                        {
                          color: colors.onSecondaryContainer,

                          backgroundColor: colors.backdrop,
                        },
                      ]}
                      value={input}
                      onChangeText={setInput}
                      placeholder="Category name"
                    />
                    <PressableWithFeedback onPress={onInputClose}>
                      <Icon
                        size={textSize.lg}
                        color={colors.onSecondaryContainer}
                        source={'close'}
                      />
                    </PressableWithFeedback>
                  </View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
              data={categories}
              contentContainerStyle={[styles.listContainer]}
              renderItem={info => {
                return (
                  <PressableWithFeedback
                    feedbackColor={colors.backdrop}
                    style={[
                      {
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.sm,
                        paddingHorizontal: spacing.sm,
                      },
                      gs.flexRow,
                      gs.justifyBetween,
                      gs.itemsCenter,
                    ]}
                    onPress={() => onCategoryPress(info.item.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: colors.onSecondaryContainer },
                      ]}
                    >
                      {info.item.name}
                    </Text>
                    {selectedCategory === info.item.id && (
                      <Icon
                        source={'check'}
                        color={colors.onSecondaryContainer}
                        size={textSize.lg}
                      />
                    )}
                  </PressableWithFeedback>
                );
              }}
            />
            <View style={[styles.buttons]}>
              <PressableWithFeedback
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.onBackground,
                    paddingHorizontal: spacing.md,
                  },
                ]}
                onPress={props.onClose}
              >
                <Text>Close</Text>
              </PressableWithFeedback>
              <PressableWithFeedback
                hidden={renderInputForNew}
                disabled={renderInputForNew}
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.onBackground,
                  },
                ]}
                onPress={() => onNewPress()}
              >
                <Text>Add new</Text>
              </PressableWithFeedback>
              <PressableWithFeedback
                hidden={!renderInputForNew}
                disabled={!renderInputForNew || input.trim().length === 0}
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.onBackground,
                    paddingHorizontal: spacing.md,
                  },
                ]}
                onPress={() => onSave()}
              >
                <Text>Save</Text>
              </PressableWithFeedback>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategorySelectionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000010',
  },
  content: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    maxHeight: 500,
    flexDirection: 'row',
  },
  contentBox: {
    width: '80%',
  },
  headerText: {
    fontSize: textSize.lg,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.lg,
  },
  input: {
    fontSize: textSize.md,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    flex: 1,
  },
  categoryText: {
    fontSize: textSize.lg,
  },
  listContainer: {
    marginTop: spacing.sm,
    paddingBottom: 50,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  button: {
    padding: spacing.sm,
    backgroundColor: 'red',
    borderRadius: borderRadius.md,
  },
});
