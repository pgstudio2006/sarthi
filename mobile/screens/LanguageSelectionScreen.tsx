import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../i18n';
import LanguageCard from '../components/LanguageCard';
import PrimaryButton from '../components/PrimaryButton';
import StarSvg from '../assets/screen2/star.svg';

const FIGMA_WIDTH = 390;

const LANGUAGES = [
  { id: 'en', native: 'English', english: 'English' },
  { id: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { id: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { id: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
];

export default function LanguageSelectionScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const { setLanguage } = useLanguage();
  const [selectedId, setSelectedId] = useState('en');

  const handleContinue = () => {
    const languageMap: Record<string, 'English' | 'Gujarati' | 'Hindi' | 'Kannada'> = {
      en: 'English',
      hi: 'Hindi',
      kn: 'Kannada',
      gu: 'Gujarati',
    };
    setLanguage(languageMap[selectedId]);
    navigation.navigate('AutismScreening');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: 24 * scale,
              paddingTop: 126 * scale,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { gap: 16 * scale }]}>
            <Text style={[styles.heading, { fontSize: 32 * scale }]}>
              {t('selectLanguage')}
            </Text>
            <Text style={[styles.subtitle, { fontSize: 14 * scale, lineHeight: 18 * scale }]}>
              {t('languageChangeNote')}
            </Text>
          </View>

          <View style={[styles.cardsContainer, { gap: 16 * scale, marginTop: 24 * scale }]}>
            {LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.id}
                language={lang.native}
                subtitle={lang.english}
                selected={selectedId === lang.id}
                onSelect={() => setSelectedId(lang.id)}
              />
            ))}
          </View>

          <View style={[styles.infoRow, { gap: 4 * scale, marginTop: 24 * scale }]}>
            <StarSvg width={16.67 * scale} height={15.85 * scale} />
            <Text style={[styles.infoText, { fontSize: 12 * scale }]}>
              {t('moreLanguagesComingSoon')}
            </Text>
          </View>
        </ScrollView>
      </View>

      <View style={[styles.buttonWrapper, { paddingHorizontal: 24 * scale, paddingBottom: 24 * scale, paddingTop: 16 * scale }]}>
        <PrimaryButton label={t('continue')} onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'flex-start',
  },
  heading: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    textAlign: 'left',
  },
  cardsContainer: {
    alignItems: 'stretch',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  infoText: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
  },
});
