import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import SelectionChip from './SelectionChip';

const FIGMA_WIDTH = 390;

const OPTIONS = ['Mother', 'Father', 'Therapist', 'Teacher', 'Doctor', 'Others'];

export default function RelationshipGrid({
  selected,
  onSelect,
  label,
  error,
}: {
  selected: string | null;
  onSelect: (value: string) => void;
  label: string;
  error?: string;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { fontSize: 12 * scale }]}>{label}</Text>
      <View style={[styles.row, { gap: 12 * scale }]}>
        <SelectionChip
          label={OPTIONS[0]}
          selected={selected === OPTIONS[0]}
          onPress={() => onSelect(OPTIONS[0])}
        />
        <SelectionChip
          label={OPTIONS[1]}
          selected={selected === OPTIONS[1]}
          onPress={() => onSelect(OPTIONS[1])}
        />
      </View>
      <View style={[styles.row, { gap: 12 * scale }]}>
        <SelectionChip
          label={OPTIONS[2]}
          selected={selected === OPTIONS[2]}
          onPress={() => onSelect(OPTIONS[2])}
        />
        <SelectionChip
          label={OPTIONS[3]}
          selected={selected === OPTIONS[3]}
          onPress={() => onSelect(OPTIONS[3])}
        />
      </View>
      <View style={[styles.row, { gap: 12 * scale }]}>
        <SelectionChip
          label={OPTIONS[4]}
          selected={selected === OPTIONS[4]}
          onPress={() => onSelect(OPTIONS[4])}
        />
        <SelectionChip
          label={OPTIONS[5]}
          selected={selected === OPTIONS[5]}
          onPress={() => onSelect(OPTIONS[5])}
        />
      </View>
      {error ? <Text style={[styles.error, { fontSize: 11 * scale }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 12,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    color: colors.grey,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  error: {
    fontFamily: 'Inter_400Regular',
    color: '#FF4D4D',
  },
});
