import { ColorValue } from 'react-native';
import Svg, { Circle, Text } from 'react-native-svg';
import { useAppTheme } from '../../../theme';
type TProps = {
  progress: number;
  strokeWidth: number;
  size: number;
  background?: ColorValue;
  completedColor?: ColorValue;
  remainingColor?: ColorValue;
};
const CircularProgressBar = ({
  progress,
  strokeWidth,
  size,
  background,
  completedColor,
  remainingColor,
}: TProps) => {
  const { colors } = useAppTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressLength = (circumference * progress) / 100;
  return (
    <Svg height={size} width={size}>
      {/* Background */}
      <Circle
        stroke={remainingColor ? remainingColor : colors.onSurfaceVariant}
        fill={background ? background : 'none'}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />

      {/* Progress (hard stop) */}
      <Circle
        stroke={completedColor ?? colors.surfaceContainerLow}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={`${progressLength}, ${circumference}`}
        strokeLinecap="butt"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
      />
      <Text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        dx="-0.2em"
        fontSize="11"
        fill={colors.onSurface}
      >
        {progress}%
      </Text>
    </Svg>
  );
};

export default CircularProgressBar;
