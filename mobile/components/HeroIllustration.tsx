import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, useWindowDimensions } from 'react-native';

const FIGMA_WIDTH = 390;
const ILLUSTRATION_HEIGHT = 340;

export default function HeroIllustration({ source }: { source: ImageSourcePropType }) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  return (
    <Image
      source={source}
      style={[styles.image, { width: '100%', height: ILLUSTRATION_HEIGHT * scale }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
