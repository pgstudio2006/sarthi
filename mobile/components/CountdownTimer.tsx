import React, { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

const FIGMA_WIDTH = 390;
const DEFAULT_SECONDS = 28;

export default function CountdownTimer({
  onResend,
}: {
  onResend?: () => void;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active || seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active, seconds]);

  const handleResend = () => {
    setSeconds(DEFAULT_SECONDS);
    setActive(true);
    onResend?.();
  };

  if (!active) {
    return (
      <Pressable onPress={handleResend}>
        <Text style={[styles.text, { fontSize: 12 * scale, color: colors.primaryBlue }]}>Resend Code</Text>
      </Pressable>
    );
  }

  const formatted = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <Text style={[styles.text, { fontSize: 12 * scale }]}>
      Resend in {formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter_700Bold',
    color: '#18182D',
  },
});
