import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';

export default function SuccessIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="23.5" fill="#009951" stroke="#02542D" />
      <G transform="translate(8, 8) scale(1.5)">
        <Path
          d="M12.7333 24.0001L5.1333 16.4001L7.0333 14.5001L12.7333 20.2001L24.9666 7.9668L26.8666 9.8668L12.7333 24.0001Z"
          fill="white"
        />
      </G>
    </Svg>
  );
}
