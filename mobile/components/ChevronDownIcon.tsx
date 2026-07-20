import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function ChevronDownIcon({ width = 24, height = 24, color = '#2D2A3A' }: { width?: number; height?: number; color?: string }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
