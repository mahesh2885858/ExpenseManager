import { JSX } from 'react';
import { Text, TextProps } from 'react-native';

const fontsMap = {
  SemiBold: 'PoppinsSemiBold',
  Bold: 'PoppinsBold',
  Light: 'PoppinsLight',
  Regular: 'PoppinsRegular',
  BoldItalic: 'PoppinsBoldItalic',
  SemiBoldItalic: 'PoppinsSemiBoldItalic',
  LightItalic: 'PoppinsLightItalic',
  ExtraLight: 'PoppinsExtraLight',
  ExtraLightItalic: 'PoppinsExtraLightItalic',
  Thin: 'PoppinsThin',
  ThinItalic: 'PoppinsThinItalic',
} as const;

const AppTextBase = (weight: keyof typeof fontsMap) => {
  return ({ children, style, ...rest }: TextProps) => {
    return (
      <Text style={[{ fontFamily: fontsMap[weight] }, style]} {...rest}>
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
