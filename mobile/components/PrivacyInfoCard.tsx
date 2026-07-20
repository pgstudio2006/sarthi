import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

const FIGMA_WIDTH = 390;

export default function PrivacyInfoCard({
  icon,
  message,
  backgroundColor,
  title,
  subtitle,
  textAlign = 'left',
  borderRadius,
  paddingHorizontal,
  paddingVertical,
  messageWeight = 'semiBold',
  titleColor,
}: {
  icon?: React.ReactNode;
  message?: string;
  backgroundColor: string;
  title?: string;
  subtitle?: string;
  textAlign?: 'left' | 'center';
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  messageWeight?: 'regular' | 'semiBold';
  titleColor?: string;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  const resolvedBorderRadius = borderRadius !== undefined ? borderRadius : (title ? 14 : 40);
  const resolvedPaddingHorizontal = paddingHorizontal !== undefined ? paddingHorizontal : (title ? 14 : 16);
  const resolvedPaddingVertical = paddingVertical !== undefined ? paddingVertical : (title ? 12 : 10);
  const iconSize = title ? 32 : 16;

  return (
    <View style={[styles.card, {
      backgroundColor,
      borderRadius: resolvedBorderRadius * scale,
      paddingHorizontal: resolvedPaddingHorizontal * scale,
      paddingVertical: resolvedPaddingVertical * scale,
      gap: icon ? 4 * scale : 0,
      justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
    }]}>
      {icon && (
        <View style={[styles.icon, { width: iconSize * scale, height: iconSize * scale }]}>{icon}</View>
      )}
      <View style={[styles.textColumn, { gap: (title && subtitle) ? 4 : 0 }]}>
        {title && (
          <Text style={[styles.title, { fontSize: 13 * scale, lineHeight: 18 * scale, textAlign, color: titleColor ?? colors.privacyGreen }]}>{title}</Text>
        )}
        {message ? (
          <Text style={[styles.message, { fontSize: 12 * scale, lineHeight: 16 * scale, textAlign, fontFamily: messageWeight === 'regular' ? 'Inter_400Regular' : 'Inter_600SemiBold' }]}>{message}</Text>
        ) : subtitle ? (
          <Text style={[styles.subtitle, { fontSize: 11 * scale, lineHeight: 15 * scale, textAlign }]}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    color: colors.privacyGreen,
  },
  message: {
    fontFamily: 'Inter_400Regular',
    color: colors.privacyGreen,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
});
