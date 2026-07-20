import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface GradientBorderCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  open?: boolean;
  borderRadius?: number;
  borderWidth?: number;
  padding?: number;
}

export default function GradientBorderCard({
  children,
  onPress,
  open = false,
  borderRadius = 18,
  borderWidth = 1,
  padding = 14,
}: GradientBorderCardProps) {
  return (
    <LinearGradient
      colors={['#3054A9', '#4BB65D', '#C63A82', '#8741C4']}
      locations={[0, 0.5, 0.75, 1]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        styles.gradient,
        {
          borderRadius,
          padding: borderWidth,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.inner,
          {
            borderRadius: Math.max(0, borderRadius - borderWidth),
            backgroundColor: open ? '#FAFAFF' : colors.white,
            padding,
          },
        ]}
      >
        {children}
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
  },
  inner: {
    width: '100%',
  },
});
