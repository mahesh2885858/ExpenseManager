import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useGetKeyboardHeight = () => {
  const [kbHeight, setKbHeight] = useState(0);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => {
      setKbHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKbHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return {
    kbHeight,
  };
};

export default useGetKeyboardHeight;
