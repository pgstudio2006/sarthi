import React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import OutlinedInput from './OutlinedInput';
import LocationIcon from '../assets/screen8/location_on.svg';

const FIGMA_WIDTH = 390;

export default function CityInput({
  label,
  value,
  onPress,
  error,
}: {
  label: string;
  value: string;
  onPress: () => void;
  error?: string;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  return (
    <Pressable onPress={onPress}>
      <OutlinedInput
        label={label}
        value={value}
        onChangeText={() => {}}
        placeholder="Select city"
        editable={false}
        rightIcon={<LocationIcon width={24 * scale} height={24 * scale} />}
        error={error}
      />
    </Pressable>
  );
}
