import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import RadioButton from './RadioButton';

export default function LanguageCard({
  language,
  subtitle,
  selected,
  onSelect,
}: {
  language: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      style={[styles.card, selected ? styles.selectedCard : styles.unselectedCard]}
      onPress={onSelect}
    >
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <Text style={[styles.language, selected ? styles.selectedLanguage : styles.unselectedLanguage]}>
            {language}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <RadioButton selected={selected} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderRadius: 18,
    alignSelf: 'stretch',
  },
  selectedCard: {
    backgroundColor: colors.selectedBackground,
    borderColor: colors.primaryBlue,
  },
  unselectedCard: {
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textColumn: {
    gap: 4,
    alignItems: 'flex-start',
  },
  language: {
    fontSize: 22,
    textAlign: 'left',
  },
  selectedLanguage: {
    color: colors.primaryBlue,
    fontFamily: 'Inter_800ExtraBold',
  },
  unselectedLanguage: {
    color: colors.secondaryBlack,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 12,
    color: colors.secondaryBlack,
    fontFamily: 'Inter_400Regular',
    textAlign: 'left',
  },
});
