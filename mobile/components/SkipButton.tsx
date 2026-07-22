import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useTranslation } from '../i18n';

export default function SkipButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{t('skip')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: colors.skipBackground,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.grey,
    textAlign: 'center',
  },
});
