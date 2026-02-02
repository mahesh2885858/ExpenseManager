import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { BackHandler, Keyboard } from 'react-native';

const useBottomSheetModal = (callback?: () => void) => {
  const btmShtRef = useRef<BottomSheetModal>(null);

  const [open, setOpen] = useState(false);
  const handlePresent = useCallback(() => {
    Keyboard.dismiss();
    btmShtRef.current?.present();
    setOpen(true);
  }, []);

  const handleSheetChange = useCallback(
    (index: number) => {
      setOpen(index >= 0);
      if (index < 0) {
        callback && callback();
      }
    },
    [callback],
  );

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (open) {
          btmShtRef.current?.dismiss();

          callback && callback();
          return true;
        } else {
          return false;
        }
      });
      return () => {
        sub.remove();
      };
    }, [open, callback]),
  );

  return {
    open,
    handleSheetChange,
    handlePresent,
    btmShtRef,
  };
};

export default useBottomSheetModal;
