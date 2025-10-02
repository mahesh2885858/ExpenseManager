import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { FAB, Icon } from 'react-native-paper';

import { borderRadius, textSize, useAppTheme } from '../../../theme';
import { gs } from '../../common';
import PressableWithFeedback from '../../components/atoms/PressableWithFeedback';
import { TAttachment } from '../../types';

type TProps = {
  attachment: TAttachment;
  removeFile: (filePath: string) => void;
};

const ATTACHMENT_SIZE = 150;
const PDF_ICON_SIZE = 100;
const FAB_POSITION = 5;

const RenderAttachment = ({ attachment, removeFile }: TProps) => {
  const { colors } = useAppTheme();

  const openFile = async () => {
    try {
      await FileViewer.open(attachment.path);
    } catch (error) {
      console.log('Error while opening file:', error);
    }
  };

  const deleteFile = async () => {
    try {
      await RNFS.unlink(attachment.path);
      removeFile(attachment.path);
    } catch (error) {
      console.log('Error while deleting local file:', error);
    }
  };

  const renderImage = () => {
    return (
      <PressableWithFeedback onPress={openFile}>
        <Image
          source={{ uri: attachment.path }}
          width={ATTACHMENT_SIZE}
          height={ATTACHMENT_SIZE}
        />
      </PressableWithFeedback>
    );
  };

  const renderPdf = () => {
    return (
      <PressableWithFeedback
        onPress={openFile}
        style={[
          gs.centerItems,
          styles.pdfContainer,
          {
            borderColor: colors.onSurfaceDisabled,
          },
        ]}
      >
        <Icon source="file-pdf-box" size={PDF_ICON_SIZE} />
        <Text style={[styles.pdfText, { color: colors.onBackground }]}>
          {attachment.name}
        </Text>
      </PressableWithFeedback>
    );
  };

  return (
    <View>
      <FAB icon="delete" size="small" style={styles.fab} onPress={deleteFile} />
      {attachment.extension.includes('image') ? renderImage() : renderPdf()}
    </View>
  );
};

export default RenderAttachment;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: FAB_POSITION,
    bottom: FAB_POSITION,
    zIndex: 1000,
  },
  pdfContainer: {
    width: ATTACHMENT_SIZE,
    height: ATTACHMENT_SIZE,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
  },
  pdfText: {
    fontSize: textSize.sm,
    paddingHorizontal: 10,
  },
});
