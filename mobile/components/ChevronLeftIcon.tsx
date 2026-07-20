import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function ChevronLeftIcon({
  width = 16,
  height = 16,
  color = '#6B7180',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
