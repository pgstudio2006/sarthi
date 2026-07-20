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
import TopHeader from '../components/TopHeader';
import HeroIllustration from '../components/HeroIllustration';
import PaginationIndicator from '../components/PaginationIndicator';
import PrimaryButton from '../components/PrimaryButton';
import PrivacyInfoCard from '../components/PrivacyInfoCard';
import LockIcon from '../assets/screen5/lock.svg';

const FIGMA_WIDTH = 390;

export default function NextStepsScreen({ navigation }: { navigation: any }) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
    } catch (e) {}
    navigation.navigate('PhoneAuth');
  };

  const handleBegin = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
    } catch (e) {
      // Ignore storage errors and still navigate
    }
    navigation.navigate('PhoneAuth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader onSkip={handleSkip} showSkip={false} />
      <HeroIllustration source={require('../assets/screen5/hero.png')} />

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
          Know the Next Steps
        </Text>

        <Text style={[styles.body, { fontSize: 14 * scale, lineHeight: 20 * scale, marginTop: 12 * scale }]}>
          If the screening identifies signs that need further attention, Saarathi guides you on what to do next and helps you prepare before consulting a qualified specialist.
        </Text>

        <View style={[styles.privacyWrapper, { marginTop: 12 * scale }]}>
          <PrivacyInfoCard
            icon={<LockIcon width={16 * scale} height={16 * scale} />}
            message="We never share your child's information without your permission."
            backgroundColor={colors.privacyGreenLight}
          />
        </View>

        <View style={[styles.paginationWrapper, { marginTop: 24 * scale }]}>
          <PaginationIndicator total={3} active={2} />
        </View>
      </ScrollView>

      <View style={[styles.buttonWrapper, { paddingHorizontal: 20 * scale, paddingBottom: 24 * scale }]}>
        <PrimaryButton label="Let's Begin" onPress={handleBegin} />
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
  privacyWrapper: {
    width: '100%',
  },
  paginationWrapper: {
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
  },
});
