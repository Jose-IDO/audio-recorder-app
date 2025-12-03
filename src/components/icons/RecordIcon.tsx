import React from 'react';
import Svg, {Circle} from 'react-native-svg';

interface RecordIconProps {
  size?: number;
  color?: string;
}

const RecordIcon: React.FC<RecordIconProps> = ({size = 24, color = '#fff'}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="12" cy="12" r="8" />
    </Svg>
  );
};

export default RecordIcon;

