import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';

interface ProgressRingProps {
  size: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  color: string;
}

export default function ProgressRing({ size, strokeWidth = 4, progress, color }: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  if (clamped <= 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const center = size / 2;

  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }} pointerEvents="none">
      <G transform={`rotate(-90, ${center}, ${center})`}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </G>
    </Svg>
  );
}
