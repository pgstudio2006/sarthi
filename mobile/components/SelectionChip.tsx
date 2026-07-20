import React from 'react';
import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

const FIGMA_WIDTH = 390;

export default function SelectionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          borderRadius: 16 * scale,
          borderWidth: 2 * scale,
          backgroundColor: selected ? '#EEEfff' : colors.white,
          borderColor: selected ? colors.primaryBlue : '#E2E4E8',
          height: 56 * scale,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            fontSize: 14 * scale,
            color: selected ? colors.primaryBlue : '#18182D',
            fontFamily: selected ? 'Inter_700Bold' : 'Inter_600SemiBold',
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
