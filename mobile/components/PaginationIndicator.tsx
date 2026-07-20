import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

const FIGMA_WIDTH = 390;

export default function PaginationIndicator({ total = 3, active = 0 }: { total?: number; active?: number }) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  return (
    <View style={[styles.container, { gap: 4 * scale }]}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === active;
        return (
          <View
            key={index}
            style={[
              isActive ? styles.activeDot : styles.inactiveDot,
              {
                width: isActive ? 22 * scale : 6 * scale,
                height: isActive ? 8 * scale : 6 * scale,
                borderRadius: isActive ? 4 * scale : 3 * scale,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    backgroundColor: colors.primaryBlue,
  },
  inactiveDot: {
    backgroundColor: colors.selectedBackground,
  },
});
