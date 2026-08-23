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

type FontWeight = keyof typeof fontsMap;

const AppTextBase = (weight: FontWeight) => {
  return ({ children, style, ...rest }: TextProps) => (
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

type AppTextComponent = ReturnType<typeof AppTextBase> & {
  [K in FontWeight]: ReturnType<typeof AppTextBase>;
};

const AppText = AppTextBase('Regular') as AppTextComponent;

(Object.keys(fontsMap) as FontWeight[]).forEach(key => {
  AppText[key] = AppTextBase(key);
});

export default AppText;
