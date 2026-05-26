import { JSX } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

export const fontsMap = {
  Thin: 'Inter-Thin',
  ExtraLight: 'Inter-ExtraLight',
  Light: 'Inter-Light',
  Regular: 'Inter-Regular',
  Medium: 'Inter-Medium',
  SemiBold: 'Inter-SemiBold',
  Bold: 'Inter-Bold',
} as const;

const AppTextBase = (weight: keyof typeof fontsMap) => {
  return ({ children, style, ...rest }: TextProps) => {
    return (
      <Text
        style={[
          {
            fontFamily: fontsMap[weight],
          } as TextStyle,
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
> = {} as any;

(Object.keys(fontsMap) as Array<keyof typeof fontsMap>).forEach(key => {
  AppText[key] = AppTextBase(key);
});

export default AppText;
