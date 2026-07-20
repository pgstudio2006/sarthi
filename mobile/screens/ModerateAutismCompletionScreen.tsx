import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import ProgressRing from '../components/ProgressRing';
import LogoIcon from '../assets/logo.svg';
import CloseIcon from '../assets/figma/screen27/Frame-11.svg';
import FamilyStarIcon from '../assets/figma/screen27/family_star.svg';
import CalendarIcon from '../assets/figma/screen27/calendar_month.svg';
import PersonIcon from '../assets/figma/screen27/Frame-7.svg';
import FlagIcon from '../assets/figma/screen27/Frame-6.svg';
import WarningIcon from '../assets/figma/screen27/Frame-8.svg';
import CourageIcon from '../assets/figma/screen27/Frame-4.svg';
import LockIcon from '../assets/figma/screen27/lock_person.svg';
import SocialIcon from '../assets/figma/screen18/Frame-2.svg';
import EmotionIcon from '../assets/figma/screen18/Frame-5.svg';
import SpeechIcon from '../assets/figma/screen18/Frame-3.svg';
import BehaviorIcon from '../assets/figma/screen18/Frame.svg';
import SensoryIcon from '../assets/figma/screen18/Frame-4.svg';
import CognitiveIcon from '../assets/figma/screen18/Frame-1.svg';
import CheckmarkIcon from '../assets/figma/screen27/Checkmark.png';

const DOMAINS = [
  { key: 'Social',    label: 'Social',    Icon: SocialIcon,    color: '#9651C8', ringColor: '#B87FE5' },
  { key: 'Emotion',   label: 'Emotion',   Icon: EmotionIcon,   color: '#2BA8A6', ringColor: '#4ECDC4' },
  { key: 'Speech',    label: 'Speech',    Icon: SpeechIcon,    color: '#3B8DBD', ringColor: '#6BADD6' },
  { key: 'Behavior',  label: 'Behaviour', Icon: BehaviorIcon,  color: '#D66A8E', ringColor: '#F28FAD' },
  { key: 'Sensory',   label: 'Sensory',   Icon: SensoryIcon,   color: '#F4A261', ringColor: '#F7B37E' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#7D6CB7', ringColor: '#7D6CB7' },
];

export default function ModerateAutismCompletionScreen({ navigation, route }: any) {
  const { scaleSize, padding } = useResponsive();

  const childName      = route?.params?.childName     ?? 'Nitya';
  const score          = route?.params?.score         ?? 141;
  const total          = route?.params?.total         ?? 200;
  const result         = route?.params?.result        ?? 'Moderate Autism';
  const date           = route?.params?.date          ?? '8 June 2026';
  const screener       = route?.params?.screener      ?? 'Dhaval (Father)';
  const domainBreakdown = route?.params?.domainBreakdown;
  const domainAnswers  = route?.params?.domainAnswers ?? {};
  const isRepeat       = route?.params?.isRepeat      ?? false;
  const previousScore  = route?.params?.previousScore ?? null;
  const progressFill   = Math.min(1, Math.max(0, score / total));

  // Moderate Autism colours — orange palette
  const severityColor = '#EA580C';
  const severityBg    = '#FFEDD5';

  const isDomainOnTrack = (key: string) => {
    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === key);
      if (bd) {
        const sl = bd.status.toLowerCase();
        return sl.includes('great') || sl.includes('well');
      }
    }
    // Moderate: typically no domain is fully on-track unless explicitly noted
    return false;
  };

  const getDomainProgress = (key: string) => {
    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === key);
      if (bd) return bd.progress;
    }
    const fallbacks: Record<string, number> = {
      Social: 0.65, Emotion: 0.85, Speech: 0.65,
      Behavior: 0.55, Sensory: 0.7, Cognitive: 0.75,
    };
    return fallbacks[key] ?? 0.7;
  };

  const handleViewReport = () => {
    navigation.navigate('ModerateAutismReport', {
      childName,
      score,
      total,
      result,
      date,
      screener,
      domainBreakdown,
      domainAnswers,
      isRepeat,
      previousScore,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: padding,
          paddingTop: scaleSize(16),
          paddingBottom: scaleSize(140),
          gap: scaleSize(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <LogoIcon width={scaleSize(36)} height={scaleSize(36)} />
            <Text style={[styles.brand, { fontSize: scaleSize(20) }]}>SAARATHI</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Home')}
            style={[styles.closeButton, { width: scaleSize(32), height: scaleSize(32), borderRadius: scaleSize(16) }]}
          >
            <CloseIcon width={scaleSize(16)} height={scaleSize(16)} />
          </Pressable>
        </View>

        {/* Celebration card */}
        <View style={[styles.celebrationCard, { padding: scaleSize(20), borderRadius: scaleSize(24) }]}>
          <View style={[styles.confettiDot,   { top: scaleSize(30),  left:  scaleSize(30),  backgroundColor: '#FFC63E' }]} />
          <View style={[styles.confettiSquare, { top: scaleSize(20),  left:  scaleSize(80),  backgroundColor: '#B87FE5' }]} />
          <View style={[styles.confettiDot,   { top: scaleSize(40),  right: scaleSize(30),  backgroundColor: '#F47878' }]} />
          <View style={[styles.confettiSquare, { top: scaleSize(70),  right: scaleSize(60),  backgroundColor: '#5963E1' }]} />
          <View style={[styles.confettiDot,   { top: scaleSize(143), left:  scaleSize(50),  backgroundColor: '#7DD3FC' }]} />
          <View style={[styles.confettiSquare, { top: scaleSize(143), right: scaleSize(40),  backgroundColor: '#FFC63E' }]} />
          <View style={[styles.starCircle, { width: scaleSize(120), height: scaleSize(120), borderRadius: scaleSize(60) }]}>
            <FamilyStarIcon width={scaleSize(64)} height={scaleSize(64)} />
          </View>
          <Text style={[styles.youDidIt, { fontSize: scaleSize(32), marginTop: scaleSize(12) }]}>You did it!</Text>
          <Text style={[styles.celebrationSub, { fontSize: scaleSize(14) }]}>
            {childName}'s screening is complete.
          </Text>
        </View>

        {/* Overview card */}
        <View style={[styles.overviewCard, { padding: scaleSize(16), borderRadius: scaleSize(24), borderWidth: 1, borderColor: 'rgba(83, 91, 216, 0.21)' }]}>
          <View style={[styles.overviewHeader, { paddingBottom: scaleSize(12) }]}>
            <Text style={[styles.overviewTitle, { fontSize: scaleSize(14) }]}>{childName}'s Screening Overview</Text>
            <View style={styles.overviewMetaRow}>
              <View style={styles.metaItem}>
                <CalendarIcon width={scaleSize(16)} height={scaleSize(16)} />
                <Text style={[styles.metaText, { fontSize: scaleSize(12) }]}>{date}</Text>
              </View>
              <View style={styles.metaItem}>
                <PersonIcon width={scaleSize(16)} height={scaleSize(16)} />
                <Text style={[styles.metaText, { fontSize: scaleSize(12) }]}>{screener}</Text>
              </View>
            </View>
          </View>

          {/* Score row */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreLabelRow}>
              <Text style={[styles.scoreLabel, { fontSize: scaleSize(10) }]}>Score : </Text>
              <Text style={[styles.scoreValue, { fontSize: scaleSize(18) }]}>
                {score} / {total} <Text style={{ color: '#6B7180' }}>*</Text>
              </Text>
            </View>
            <View style={[styles.resultBadge, { backgroundColor: severityBg, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6) }]}>
              <FlagIcon width={scaleSize(14)} height={scaleSize(14)} />
              <Text style={[styles.resultBadgeText, { fontSize: scaleSize(12), color: severityColor }]}>{result}</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={[styles.progressTrack, { height: scaleSize(8), borderRadius: scaleSize(4), marginTop: scaleSize(8) }]}>
            <View style={{ width: `${progressFill * 100}%`, height: scaleSize(8), borderRadius: scaleSize(4), backgroundColor: severityColor }} />
          </View>

          <Text style={[styles.disclaimer, { fontSize: scaleSize(12), marginTop: scaleSize(10) }]}>
            * The score is indicative, not diagnostic. Consult a specialist for confirmation.
          </Text>

          {/* Domain grid */}
          <View style={[styles.domainGrid, { marginTop: scaleSize(16), gap: scaleSize(16) }]}>
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <View key={rowIndex} style={[styles.domainRow, { gap: scaleSize(16) }]}>
                {DOMAINS.slice(rowIndex * 3, rowIndex * 3 + 3).map((domain) => {
                  const { Icon } = domain;
                  const circleSize    = scaleSize(64);
                  const ringGap       = scaleSize(3);
                  const ringThickness = scaleSize(4);
                  const ringSize      = circleSize + ringThickness + ringGap * 2;
                  const onTrack       = isDomainOnTrack(domain.key);
                  const progressVal   = getDomainProgress(domain.key);

                  return (
                    <View key={domain.key} style={styles.domainItem}>
                      <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
                        {onTrack ? (
                          <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color }]}>
                            <Icon width={scaleSize(28)} height={scaleSize(28)} />
                            <View style={[styles.checkmarkWrap, { width: scaleSize(20), height: scaleSize(20), borderRadius: scaleSize(10), bottom: scaleSize(0), right: scaleSize(0) }]}>
                              <Image source={CheckmarkIcon} style={{ width: scaleSize(20), height: scaleSize(20) }} resizeMode="contain" />
                            </View>
                          </View>
                        ) : (
                          <>
                            <ProgressRing
                              size={ringSize}
                              strokeWidth={ringThickness}
                              progress={progressVal}
                              color={domain.ringColor}
                            />
                            <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color, position: 'absolute' }]}>
                              <Icon width={scaleSize(28)} height={scaleSize(28)} />
                            </View>
                          </>
                        )}
                      </View>
                      <Text style={[styles.domainLabel, { fontSize: scaleSize(12), marginTop: scaleSize(6) }]}>{domain.label}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Result card */}
        <View style={[styles.resultCard, { padding: scaleSize(16), borderRadius: scaleSize(20), backgroundColor: severityBg }]}>
          <View style={styles.resultCardHeader}>
            <View style={[styles.resultIconBox, { width: scaleSize(56), height: scaleSize(56), borderRadius: scaleSize(14), backgroundColor: severityColor }]}>
              <FlagIcon width={scaleSize(28)} height={scaleSize(28)} />
            </View>
            <View style={styles.resultCardTitles}>
              <Text style={[styles.resultCardEyebrow, { fontSize: scaleSize(10), color: severityColor }]}>SCREENING RESULT</Text>
              <Text style={[styles.resultCardResult, { fontSize: scaleSize(18), color: severityColor }]}>{result}</Text>
              <Text style={[styles.resultCardScore, { fontSize: scaleSize(12) }]}>{score} / {total}</Text>
            </View>
          </View>
          <View style={[styles.resultDivider, { height: scaleSize(1), marginVertical: scaleSize(12), backgroundColor: `${severityColor}40` }]} />
          <Text style={[styles.resultDescription, { fontSize: scaleSize(12) }]}>
            {childName} shows heavy signs across emotional and sensory domains. Visiting a doctor and therapist as soon as possible is the most recommended.
          </Text>
        </View>

        {/* Not-a-diagnosis info card */}
        <View style={[styles.infoCard, { padding: scaleSize(12), borderRadius: scaleSize(14) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <WarningIcon width={scaleSize(24)} height={scaleSize(24)} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(13) }]}>A screening is not a diagnosis</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>
              Screening results are not a diagnosis. They help identify developmental signals and guide your next steps.
            </Text>
          </View>
        </View>

        {/* Courage card */}
        <View style={[styles.encouragementCard, { padding: scaleSize(14), borderRadius: scaleSize(14) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <CourageIcon width={scaleSize(28)} height={scaleSize(28)} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(14), color: '#535BD8' }]}>That took courage.</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>
              Thank you for showing up for {childName} in this powerful way.
            </Text>
          </View>
        </View>

        {/* Privacy card */}
        <View style={[styles.encouragementCard, { padding: scaleSize(12), borderRadius: scaleSize(12) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <LockIcon width={scaleSize(28)} height={scaleSize(28)} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(14), color: '#535BD8' }]}>Your responses are saved securely</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>Encrypted, private, and yours alone.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
        <Pressable
          onPress={handleViewReport}
          style={({ pressed }) => [
            styles.primaryCta,
            { height: scaleSize(54), borderRadius: scaleSize(28), opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.primaryCtaText, { fontSize: scaleSize(16) }]}>View {childName}'s Report</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.maybeLater}>
          <Text style={[styles.maybeLaterText, { fontSize: scaleSize(14) }]}>Maybe later</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brand: { fontFamily: 'Inter_800ExtraBold', color: '#373E8B', letterSpacing: 0.4 },
  closeButton: { backgroundColor: '#F5F6F8', justifyContent: 'center', alignItems: 'center' },
  celebrationCard: { backgroundColor: '#EDFBF8', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  confettiDot: { position: 'absolute', width: 14, height: 14, borderRadius: 7 },
  confettiSquare: { position: 'absolute', width: 14, height: 14, borderRadius: 4 },
  starCircle: { backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  youDidIt: { fontFamily: 'Inter_800ExtraBold', color: '#2BA8A6', textAlign: 'center', zIndex: 1 },
  celebrationSub: { fontFamily: 'Inter_500Medium', color: '#454545', textAlign: 'center', zIndex: 1 },
  overviewCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: '#E2E4E8', gap: 12 },
  overviewHeader: { borderBottomWidth: 1, borderBottomColor: '#E2E4E8', gap: 10 },
  overviewTitle: { fontFamily: 'Inter_700Bold', color: '#2D2A3A' },
  overviewMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreLabelRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  scoreLabel: { fontFamily: 'Inter_700Bold', color: '#6B7180' },
  scoreValue: { fontFamily: 'Inter_800ExtraBold', color: '#18182D' },
  resultBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultBadgeText: { fontFamily: 'Inter_700Bold' },
  progressTrack: { backgroundColor: '#E2E4E8' },
  disclaimer: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  domainGrid: {},
  domainRow: { flexDirection: 'row', justifyContent: 'space-around' },
  domainItem: { alignItems: 'center' },
  domainCircle: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  domainLabel: { fontFamily: 'Inter_600SemiBold', color: '#3B3B3E' },
  checkmarkWrap: { position: 'absolute', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  resultCard: { gap: 0 },
  resultCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultIconBox: { justifyContent: 'center', alignItems: 'center' },
  resultCardTitles: { gap: 2, flex: 1 },
  resultCardEyebrow: { fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  resultCardResult: { fontFamily: 'Inter_800ExtraBold' },
  resultCardScore: { fontFamily: 'Inter_700Bold', color: '#6B7180' },
  resultDivider: {},
  resultDescription: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  infoCard: { backgroundColor: '#F3F2FF', flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIconCircle: { backgroundColor: '#E8E7FF', justifyContent: 'center', alignItems: 'center' },
  infoText: { flex: 1, gap: 2 },
  infoTitle: { fontFamily: 'Inter_700Bold', color: '#535BD8' },
  infoBody: { fontFamily: 'Inter_400Regular', color: '#6B7180', lineHeight: 18 },
  encouragementCard: { backgroundColor: '#F3F2FF', flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white,
    gap: 16, paddingTop: 13, paddingBottom: 15, paddingHorizontal: 22,
    borderTopWidth: 2, borderTopColor: '#DFDFDF', alignItems: 'center',
  },
  primaryCta: { backgroundColor: colors.primaryBlue, justifyContent: 'center', alignItems: 'center', width: '100%' },
  primaryCtaText: { fontFamily: 'Inter_700Bold', color: colors.white },
  maybeLater: { alignSelf: 'center', padding: 4 },
  maybeLaterText: { fontFamily: 'Inter_600SemiBold', color: '#6B7180' },
});
