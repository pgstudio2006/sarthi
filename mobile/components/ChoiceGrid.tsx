import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import SelectionChip from './SelectionChip';

const FIGMA_WIDTH = 390;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function ChoiceGrid({
  options,
  selected,
  onSelect,
  columns = 2,
}: {
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  columns?: number;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  const rows = chunk(options, columns);

  return (
    <View style={[styles.container, { gap: 12 * scale }]}>
      {rows.map((row, rowIndex) => (
        <View key={`${rowIndex}-${row.join('-')}`} style={[styles.row, { gap: 12 * scale }]}>
          {row.map((option) => (
            <SelectionChip
              key={option}
              label={option}
              selected={selected === option}
              onPress={() => onSelect(option)}
            />
          ))}
          {row.length < columns
            ? Array.from({ length: columns - row.length }).map((_, index) => (
                <View key={`spacer-${rowIndex}-${index}`} style={styles.spacer} />
              ))
            : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  spacer: {
    flex: 1,
  },
});
