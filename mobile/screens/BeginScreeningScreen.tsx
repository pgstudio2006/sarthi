import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';
import PrivacyInfoCard from '../components/PrivacyInfoCard';
import { useAuth } from '../context/AuthContext';
import { useScreening } from '../context/ScreeningContext';
import ChildIcon from '../assets/figma/screen17/Frame-18.svg';
import LockIcon from '../assets/figma/screen17/Frame.svg';
import PauseIcon from '../assets/figma/screen17/Frame-9.svg';
import WarningIcon from '../assets/figma/screen17/Frame-7.svg';
import CloseIcon from '../assets/figma/screen17/Frame-40.svg';

const FIGMA_WIDTH = 390;

const EXPECTATIONS = [
  {
    title: "About Nitya's day to day life",
    subtitle: 'What you already observe',
    Icon: ChildIcon,
  },
  {
    title: 'Private & secure',
    subtitle: "Your responses are encrypted and protected in line with India's DPDPA.",
    Icon: LockIcon,
  },
  {
    title: 'Pause anytime',
    subtitle: 'Come back whenever you want',
    Icon: PauseIcon,
  },
];

export default function BeginScreeningScreen({ navigation }: { navigation: any }) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const { user, activeChild } = useAuth();
  const screening = useScreening();

  const childId = activeChild?.id || user?.children?.[0]?.id;

  const handleStart = async () => {
    if (!childId) {
      Alert.alert('No child profile', 'Please create a child profile before starting screening.');
      return;
    }
    const sessionId = await screening.start(childId);
    if (sessionId) {
      navigation.navigate('SocialScreening');
    } else {
      Alert.alert('Could not start screening', screening.error || 'Please check your connection and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={() => navigation.goBack()} />
        <View style={[styles.sheet, { borderTopLeftRadius: 28 * scale, borderTopRightRadius: 28 * scale }]}>
          <View style={styles.handle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.kicker, { fontSize: 13 * scale }]}>Before you start screening</Text>
              <Text style={[styles.title, { fontSize: 30 * scale, lineHeight: 35 * scale }]}>Here's what to expect</Text>
            </View>
            <Pressable onPress={() => navigation.goBack()} style={[styles.closeButton, { width: 32 * scale, height: 32 * scale, borderRadius: 16 * scale }]} hitSlop={10}>
              <CloseIcon width={16 * scale} height={16 * scale} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 10 * scale }} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 12 * scale, marginTop: 22 * scale }}>
              {EXPECTATIONS.map((item) => {
                const Icon = item.Icon;
                return (
                  <View key={item.title} style={styles.expectationCard}>
                    <Icon width={48 * scale} height={48 * scale} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.expectationTitle}>{item.title}</Text>
                      <Text style={styles.expectationSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={{ marginTop: 24 * scale }}>
              <PrivacyInfoCard
                icon={<WarningIcon width={28 * scale} height={28 * scale} />}
                backgroundColor="rgba(243, 242, 255, 0.6)"
                title="A screening is not a diagnosis."
                subtitle="Screening results are not a diagnosis. They help identify developmental signals and guide your next steps."
                titleColor="#535BD8"
              />
            </View>

            <View style={{ marginTop: 24 * scale }}>
              {screening.error ? (
                <Text style={[styles.errorText, { fontSize: 12 * scale, marginBottom: 12 * scale }]}>{screening.error}</Text>
              ) : null}
              <PrimaryButton label="Start Screening" onPress={handleStart} disabled={screening.loading || !childId} />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 24, 0.53)',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    maxHeight: '88%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E2E4E8',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  kicker: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expectationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E4E8',
    backgroundColor: colors.white,
  },
  expectationTitle: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
    fontSize: 14,
    lineHeight: 18,
  },
  expectationSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#D12B2B',
    textAlign: 'center',
  },
});
