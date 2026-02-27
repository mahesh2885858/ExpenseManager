import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const usePaddingKeyboard = () => {
  const [topPadding, setTopPadding] = useState(0);
  useEffect(() => {
    const t = Keyboard.addListener('keyboardDidShow', () => {
      setTopPadding(15);
    });
    const v = Keyboard.addListener('keyboardDidHide', () => {
      setTopPadding(0);
    });
    return () => {
      t.remove();
      v.remove();
    };
  }, []);
  return { topPadding };
};

export default usePaddingKeyboard;
