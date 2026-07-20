import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';
import { colors } from '../theme/colors';

const FIGMA_WIDTH = 390;

interface OutlinedInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
  error?: string;
  rightIcon?: React.ReactNode;
  editable?: boolean;
  onPress?: () => void;
}

const OutlinedInput = React.forwardRef<TextInput, OutlinedInputProps>(function OutlinedInput(
  {
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'none',
    returnKeyType,
    onSubmitEditing,
    blurOnSubmit,
    error,
    rightIcon,
    editable = true,
  },
  ref
) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { fontSize: 12 * scale }]}>{label}</Text>
      <View
        style={[
          styles.container,
          {
            borderRadius: 16 * scale,
            borderWidth: 2 * scale,
            borderColor: error ? '#FF4D4D' : focused ? '#5963E1' : '#5963E1',
            paddingHorizontal: 16 * scale,
            paddingVertical: 12 * scale,
          },
        ]}
      >
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A6A6B8"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, { fontSize: 16 * scale }]}
        />
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
      {error ? <Text style={[styles.error, { fontSize: 11 * scale }]}>{error}</Text> : null}
    </View>
  );
});

export default OutlinedInput;

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
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    color: '#18182D',
    padding: 0,
  },
  icon: {
    marginLeft: 8,
  },
  error: {
    fontFamily: 'Inter_400Regular',
    color: '#FF4D4D',
  },
});
