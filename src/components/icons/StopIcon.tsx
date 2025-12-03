import React from 'react';
import Svg, {Rect} from 'react-native-svg';

interface StopIconProps {
  size?: number;
  color?: string;
}

const StopIcon: React.FC<StopIconProps> = ({size = 24, color = '#fff'}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Rect x="6" y="6" width="12" height="12" rx="1" />
    </Svg>
  );
};

export default StopIcon;

