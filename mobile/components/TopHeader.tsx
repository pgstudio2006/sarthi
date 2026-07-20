import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import HeaderSvg from '../assets/screen3/header.svg';
import SkipButton from './SkipButton';

const FIGMA_WIDTH = 390;

export default function TopHeader({ onSkip, showSkip = true }: { onSkip: () => void; showSkip?: boolean }) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  return (
    <View style={[styles.container, { height: 56 * scale, paddingHorizontal: 20 * scale }]}>
      <HeaderSvg width={width} height={56 * scale} />
      {showSkip && (
        <View style={[styles.skipOverlay, { right: 20 * scale }]}>
          <SkipButton onPress={onSkip} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.white,
    position: 'relative',
  },
  skipOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
