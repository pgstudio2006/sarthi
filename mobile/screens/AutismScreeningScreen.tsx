import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { useTranslation } from '../i18n';
import TopHeader from '../components/TopHeader';
import HeroIllustration from '../components/HeroIllustration';
import PaginationIndicator from '../components/PaginationIndicator';
import PrimaryButton from '../components/PrimaryButton';

const FIGMA_WIDTH = 390;

export default function AutismScreeningScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
    } catch (e) {}
    navigation.navigate('PhoneAuth');
  };

  const handleNext = () => {
    navigation.navigate('SimpleResults');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader onSkip={handleSkip} />
      <HeroIllustration source={require('../assets/screen3/hero.png')} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: 24 * scale,
            paddingTop: 24 * scale,
            paddingBottom: 16 * scale,
          },
        ]}
      >
        <Text style={[styles.heading, { fontSize: 26 * scale, lineHeight: 34 * scale }]}>
          {t('freeAutismScreening')}
        </Text>

        <Text style={[styles.body, { fontSize: 14 * scale, lineHeight: 20 * scale, marginTop: 12 * scale }]}>
          {t('freeAutismScreeningBody')}
        </Text>

        <View style={[styles.paginationWrapper, { marginTop: 24 * scale }]}>
          <PaginationIndicator total={3} active={0} />
        </View>
      </ScrollView>

      <View style={[styles.buttonWrapper, { paddingHorizontal: 20 * scale, paddingBottom: 24 * scale }]}>
        <PrimaryButton label={t('next')} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  heading: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    textAlign: 'left',
  },
  body: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    textAlign: 'left',
  },
  paginationWrapper: {
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
  },
});
