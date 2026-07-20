import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import FlagIcon from '../assets/screen6/flag.svg';
import ChevronDownIcon from './ChevronDownIcon';

const FIGMA_WIDTH = 390;

export default function CountrySelector({
  countryCode = '+91',
  onPress,
}: {
  countryCode?: string;
  onPress?: () => void;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  return (
    <View
      style={[
        styles.container,
        {
          width: 110 * scale,
          height: 42 * scale,
          borderRadius: 10 * scale,
          paddingVertical: 7 * scale,
          paddingHorizontal: 10 * scale,
          gap: 7 * scale,
        },
      ]}
    >
      <FlagIcon width={30 * scale} height={20 * scale} />
      <View style={[styles.codeWrapper, { gap: 2 * scale }]}>
        <Text style={[styles.code, { fontSize: 14 * scale }]}>{countryCode}</Text>
        <ChevronDownIcon width={24 * scale} height={24 * scale} color={colors.mainBlack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F6F8',
  },
  codeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  code: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
  },
});
