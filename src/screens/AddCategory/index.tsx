import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, spacing, textSize, useAppTheme } from '../../../theme';
import Switch from '../../components/atoms/Switch';
import { gs } from '../../common';
import { FAB, Icon } from 'react-native-paper';
import useGetKeyboardHeight from '../../hooks/useGetKeyboardHeight';
import useCategories from '../../hooks/useCategories';
import { useNavigation } from '@react-navigation/native';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';

const AddCategory = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { kbHeight } = useGetKeyboardHeight();
  const [makeDefault, setMakeDefault] = useState(false);
  const [catName, setCatName] = useState('');
  const { addCategory } = useCategories();
  const navigation = useNavigation();

  const renderFab = useMemo(() => {
    return catName.trim().length > 0;
  }, [catName]);

  const saveCategory = useCallback(() => {
    addCategory(catName, makeDefault);
    navigation.goBack();
  }, [catName, makeDefault, addCategory, navigation]);

  return (
    <KeyboardAvoidingView
      style={[
        gs.fullFlex,
        {
          paddingTop: top + 10,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          gs.flexRow,
          gs.itemsCenter,
          {
            gap: spacing.md,
          },
        ]}
      >
        <PressableWithFeedback onPress={navigation.goBack}>
          <Icon source="arrow-left" size={24} />
        </PressableWithFeedback>
        <Text
          style={[
            styles.headerText,
            {
              color: colors.onBackground,
            },
          ]}
        >
          Add Category
        </Text>
      </View>
      <View
        style={[
          styles.catNameBox,
          {
            borderColor: colors.onSurfaceDisabled,
          },
        ]}
      >
        <Text
          style={[
            {
              color: colors.onSurfaceDisabled,
              fontSize: textSize.md,
            },
          ]}
        >
          Category name
        </Text>
        <TextInput
          value={catName}
          onChangeText={setCatName}
          placeholder="Choose your category name"
          placeholderTextColor={colors.onSurfaceDisabled}
          style={[
            {
              color: colors.onBackground,
              fontSize: textSize.lg,
            },
          ]}
        />
      </View>
      <View style={[gs.flexRow, gs.itemsCenter, styles.switchBox]}>
        <Text
          style={[
            gs.fullFlex,
            {
              color: colors.onBackground,
            },
          ]}
        >
          Make this as default
        </Text>
        <Switch
          isOn={makeDefault}
          onStateChange={state => setMakeDefault(state)}
        />
      </View>
      {renderFab && (
        <FAB
          icon="check"
          style={[
            styles.fab,

            {
              bottom: kbHeight + 20,
            },
          ]}
          onPress={() => {
            saveCategory();
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default AddCategory;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
  },
  headerText: {
    fontSize: textSize.lg,
    fontWeight: 'bold',
  },
  catNameBox: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    paddingLeft: spacing.sm,
  },
  switchBox: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  switchText: {
    fontSize: textSize.md,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 5,
    bottom: 40,
  },
});
