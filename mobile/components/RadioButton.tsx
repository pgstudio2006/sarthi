import React from 'react';
import RadioSelectedSvg from '../assets/screen2/radio-selected.svg';
import RadioUnselectedSvg from '../assets/screen2/radio-unselected.svg';

export default function RadioButton({ selected }: { selected: boolean }) {
  return selected ? (
    <RadioSelectedSvg width={24} height={24} />
  ) : (
    <RadioUnselectedSvg width={24} height={24} />
  );
}
