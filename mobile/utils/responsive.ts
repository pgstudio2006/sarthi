import { useWindowDimensions } from 'react-native';

export const FIGMA_WIDTH = 390;
export const FIGMA_HEIGHT = 844;
export const FIGMA_PADDING = 24;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const heightScale = height / FIGMA_HEIGHT;
  const padding = FIGMA_PADDING * scale;

  const scaleSize = (size: number) => size * scale;
  const scaleFont = (size: number) => size * scale;
  const scaleH = (size: number) => size * heightScale;

  return {
    width,
    height,
    scale,
    heightScale,
    padding,
    scaleSize,
    scaleFont,
    scaleH,
    FIGMA_WIDTH,
    FIGMA_HEIGHT,
    FIGMA_PADDING,
  };
}
