import React from 'react';
import LogoSvg from '../assets/logo.svg';

export default function Logo({ width = 94, height = 91 }: { width?: number; height?: number }) {
  return <LogoSvg width={width} height={height} />;
}
