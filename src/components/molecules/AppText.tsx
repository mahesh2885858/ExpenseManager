import { JSX } from 'react';
import { Text, TextProps } from 'react-native';

export const fontsMap = {
  Thin: '100',
  ExtraLight: '200',
  Light: '300',
  Regular: '400',
  Medium: '500',
  SemiBold: '600',
  Bold: '700',
} as const;

const AppTextBase = (weight: keyof typeof fontsMap) => {
  return ({ children, style, ...rest }: TextProps) => {
    return (
      <Text
        style={[
          {
            fontFamily: 'Inter',
            fontWeight: fontsMap[weight],
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </Text>
    );
  };
};
const AppText: Record<
  keyof typeof fontsMap,
  ({ children, ...rest }: TextProps) => JSX.Element
> = {};

(Object.keys(fontsMap) as Array<keyof typeof fontsMap>).forEach(
  (key: keyof typeof fontsMap) => {
    AppText[`${key}`] = AppTextBase(key);
  },
);

export default AppText;
