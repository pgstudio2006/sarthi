import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  KeyboardTypeOptions,
} from 'react-native';
import { colors } from '../theme/colors';
import CountrySelector from './CountrySelector';

const FIGMA_WIDTH = 390;

export default function PhoneNumberInput({
  value,
  onChangeText,
  placeholder = '9XXXX XXXXX',
  maxLength = 10,
  keyboardType = 'phone-pad',
  editable = true,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    onChangeText(digits.slice(0, maxLength));
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: 16 * scale,
          borderWidth: 2 * scale,
          paddingVertical: 6 * scale,
          paddingHorizontal: 10 * scale,
          gap: 10 * scale,
        },
      ]}
    >
      <CountrySelector />
      <View style={[styles.divider, { height: 40 * scale, width: 1 * scale }]} />
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#A6A6B8"
        style={[styles.input, { fontSize: 16 * scale }]}        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={editable}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#5963E1',
    backgroundColor: colors.white,
  },
  divider: {
    backgroundColor: 'rgba(226, 228, 232, 0.6)',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    color: colors.mainBlack,
    padding: 0,
  },
});
