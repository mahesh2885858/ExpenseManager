import { getDigits } from 'commonutil-core';
import { useMemo, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import useTransactions from './useTransactions';
const useAmountInput = () => {
  const [input, setInput] = useState('');
  const { getFormattedAmount } = useTransactions();

  const amount = useMemo(() => {
    return parseInt(getDigits(input), 10);
  }, [input]);

  const onInputChange = (text: string) => {
    const cleanDigits = getDigits(text);
    const formatted = getFormattedAmount(parseInt(cleanDigits, 10));
    setInput(formatted);
  };

  const AmountInput = (props: TextInputProps) => (
    <TextInput
      {...props}
      value={input}
      onChangeText={text => {
        onInputChange(text);
        props.onChangeText && props.onChangeText(text);
      }}
    />
  );

  return {
    input,
    AmountInput,
    amount,
  };
};
export default useAmountInput;
