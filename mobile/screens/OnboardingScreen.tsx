import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { useTranslation } from '../i18n';
import TopHeader from '../components/TopHeader';
import HeroIllustration from '../components/HeroIllustration';
import PaginationIndicator from '../components/PaginationIndicator';
import PrimaryButton from '../components/PrimaryButton';
import PrivacyInfoCard from '../components/PrivacyInfoCard';
import LockIcon from '../assets/screen5/lock.svg';

const FIGMA_WIDTH = 390;

type Page = {
  hero: any;
  titleKey: string;
  bodyKey: string;
  showPrivacy: boolean;
};

const PAGES: Page[] = [
  {
    hero: require('../assets/screen3/hero.png'),
    titleKey: 'freeAutismScreening',
    bodyKey: 'freeAutismScreeningBody',
    showPrivacy: false,
  },
  {
    hero: require('../assets/screen4/hero.png'),
    titleKey: 'simpleResults',
    bodyKey: 'simpleResultsBody',
    showPrivacy: false,
  },
  {
    hero: require('../assets/screen5/hero.png'),
    titleKey: 'knowNextSteps',
    bodyKey: 'knowNextStepsBody',
    showPrivacy: true,
  },
];

export default function OnboardingScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Page>>(null);

  const finishOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
    } catch (e) {}
    navigation.replace('PhoneAuth');
  }, [navigation]);

  const handleNext = useCallback(() => {
    if (activeIndex < PAGES.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      finishOnboarding();
    }
  }, [activeIndex, finishOnboarding]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      const clamped = Math.min(Math.max(index, 0), PAGES.length - 1);
      setActiveIndex(clamped);
    },
    [width]
  );

  const renderItem = ({ item }: { item: Page }) => (
    <ScrollView
      style={{ width }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24 * scale,
        paddingTop: 24 * scale,
        paddingBottom: 16 * scale,
      }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <HeroIllustration source={item.hero} />

      <Text style={[styles.heading, { fontSize: 26 * scale, lineHeight: 34 * scale }]}>
        {t(item.titleKey)}
      </Text>

      <Text style={[styles.body, { fontSize: 14 * scale, lineHeight: 20 * scale, marginTop: 12 * scale }]}>
        {t(item.bodyKey)}
      </Text>

      {item.showPrivacy && (
        <View style={[styles.privacyWrapper, { marginTop: 12 * scale }]}>
          <PrivacyInfoCard
            icon={<LockIcon width={16 * scale} height={16 * scale} />}
            message={t('neverShareInfo')}
            backgroundColor={colors.privacyGreenLight}
          />
        </View>
      )}

      <View style={[styles.paginationWrapper, { marginTop: 24 * scale }]}>
        <PaginationIndicator total={PAGES.length} active={activeIndex} />
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader onSkip={finishOnboarding} showSkip={activeIndex < PAGES.length - 1} />

      <FlatList
        ref={flatListRef}
        data={PAGES}
        keyExtractor={(_, index) => String(index)}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        scrollEnabled
        style={{ flex: 1 }}
      />

      <View style={[styles.buttonWrapper, { paddingHorizontal: 20 * scale, paddingBottom: 24 * scale }]}>
        <PrimaryButton
          label={activeIndex === PAGES.length - 1 ? t('letsBegin') : t('next')}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
  },
});
