import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
import OTPDigitBox from './OTPDigitBox';

const FIGMA_WIDTH = 390;
const OTP_LENGTH = 6;
const BOX_GAP = 8;

export default function OTPInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const inputRef = useRef<TextInput>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const digits = value.split('').slice(0, OTP_LENGTH);

  useEffect(() => {
    // Ensure focus is at the next empty slot when value changes from outside
    const nextIndex = Math.min(value.length, OTP_LENGTH - 1);
    setFocusedIndex(nextIndex);
  }, [value]);

  const handleChange = (text: string) => {
    const numeric = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(numeric);
    setFocusedIndex(Math.min(numeric.length, OTP_LENGTH - 1));
  };

  const handleKeyPress = (event: { nativeEvent: { key: string } }) => {
    if (event.nativeEvent.key === 'Backspace' && value.length > 0) {
      onChange(value.slice(0, -1));
      setFocusedIndex(Math.max(value.length - 2, 0));
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable onPress={focusInput} style={[styles.container, { gap: BOX_GAP * scale }]}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <OTPDigitBox
          key={index}
          value={digits[index] ?? ''}
          isFocused={index === focusedIndex && value.length === index}
        />
      ))}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onKeyPress={handleKeyPress}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        autoFocus
        style={styles.hiddenInput}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        returnKeyType="done"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
