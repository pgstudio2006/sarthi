import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

const FIGMA_WIDTH = 390;
const BOX_WIDTH = 44;
const BOX_HEIGHT = 52;
const BOX_BORDER_RADIUS = 12;
const ACTIVE_BORDER_COLOR = '#5963E1';
const EMPTY_BORDER_COLOR = '#E2E4E8';

export default function OTPDigitBox({
  value,
  isFocused,
}: {
  value: string;
  isFocused: boolean;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const isEmpty = value.length === 0;

  return (
    <View
      style={[
        styles.container,
        {
          width: BOX_WIDTH * scale,
          height: BOX_HEIGHT * scale,
          borderRadius: BOX_BORDER_RADIUS * scale,
          borderWidth: 2 * scale,
          borderColor: isEmpty ? EMPTY_BORDER_COLOR : ACTIVE_BORDER_COLOR,
        },
      ]}
    >
      {isEmpty && isFocused ? (
        <View style={[styles.cursor, { width: 2 * scale, height: 32 * scale, borderRadius: 2 * scale }]} />
      ) : (
        <Text style={[styles.text, { fontSize: 22 * scale }]}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  text: {
    fontFamily: 'Inter_700Bold',
    color: '#18182D',
    textAlign: 'center',
  },
  cursor: {
    backgroundColor: '#5963E1',
  },
});
