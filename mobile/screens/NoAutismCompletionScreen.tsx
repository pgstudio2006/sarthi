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
import { useTranslation } from '../i18n';
import { useScreening } from '../context/ScreeningContext';
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
  { key: 'Social', label: 'Social', Icon: SocialIcon, color: '#9651C8', progress: 1, ringColor: '#B87FE5' },
  { key: 'Emotion', label: 'Emotional', Icon: EmotionIcon, color: '#2BA8A6', progress: 1, ringColor: '#4ECDC4' },
  { key: 'Speech', label: 'Speech', Icon: SpeechIcon, color: '#3B8DBD', progress: 1, ringColor: '#6BADD6' },
  { key: 'Behavior', label: 'Behaviour', Icon: BehaviorIcon, color: '#D66A8E', progress: 1, ringColor: '#F28FAD' },
  { key: 'Sensory', label: 'Sensory', Icon: SensoryIcon, color: '#F4A261', progress: 1, ringColor: '#F7B37E' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#7D6CB7', progress: 1, ringColor: '#7D6CB7' },
];

export default function NoAutismCompletionScreen({ navigation, route }: any) {
  const { scaleSize, padding } = useResponsive();
  const { t } = useTranslation();
  const screening = useScreening();

  const childName = route?.params?.childName ?? t('yourChild');
  const score = route?.params?.score ?? 60;
  const total = route?.params?.total ?? 200;
  const result = route?.params?.result ?? 'No Signs of Autism';
  const date = route?.params?.date ?? '';
  const screener = route?.params?.screener ?? t('caregiver');
  const domainBreakdown = route?.params?.domainBreakdown;
  const isRepeat = route?.params?.isRepeat ?? false;
  const previousScore = route?.params?.previousScore ?? null;
  const progress = Math.min(1, Math.max(0, score / total));

  const resultLower = result.toLowerCase();
  const resultLabelKey = resultLower.includes('no sign') || resultLower === 'normal'
    ? 'resultNormal'
    : resultLower.includes('mild')
    ? 'resultMildAutism'
    : resultLower.includes('moderate')
    ? 'resultModerateAutism'
    : resultLower.includes('severe')
    ? 'resultSevereAutism'
    : 'resultNormal';
  const resultDescKey = resultLower.includes('no sign') || resultLower === 'normal'
    ? 'noSignsResultDescription'
    : resultLower.includes('mild')
    ? 'mildResultDescription'
    : resultLower.includes('moderate')
    ? 'moderateResultDescription'
    : resultLower.includes('severe')
    ? 'severeResultDescription'
    : 'mildResultDescription';

  const domainsWithProgress = DOMAINS.map((domain) => {
    const breakdown = domainBreakdown?.find((item: any) => item.key === domain.key);
    return {
      ...domain,
      progress: typeof breakdown?.progress === 'number' ? breakdown.progress : domain.progress,
      ringColor: breakdown?.statusColor ?? domain.ringColor,
    };
  });

  const handleViewReport = () => {
    navigation.navigate('NoAutismReport', {
      childName,
      score,
      total,
      result,
      date,
      screener,
      domainBreakdown,
      domainAnswers: screening?.domainAnswers,
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

        <View style={[styles.celebrationCard, { padding: scaleSize(20), borderRadius: scaleSize(24) }]}>
          <View style={[styles.confettiDot, { top: scaleSize(30), left: scaleSize(30), backgroundColor: '#FFC63E' }]} />
          <View style={[styles.confettiSquare, { top: scaleSize(20), left: scaleSize(80), backgroundColor: '#B87FE5' }]} />
          <View style={[styles.confettiDot, { top: scaleSize(40), right: scaleSize(30), backgroundColor: '#F47878' }]} />
          <View style={[styles.confettiSquare, { top: scaleSize(70), right: scaleSize(60), backgroundColor: '#5963E1' }]} />
          <View style={[styles.confettiDot, { top: scaleSize(143), left: scaleSize(50), backgroundColor: '#7DD3FC' }]} />
          <View style={[styles.confettiSquare, { top: scaleSize(143), right: scaleSize(40), backgroundColor: '#FFC63E' }]} />

          <View style={[styles.starCircle, { width: scaleSize(120), height: scaleSize(120), borderRadius: scaleSize(60) }]}>
            <FamilyStarIcon width={scaleSize(64)} height={scaleSize(64)} />
          </View>
          <Text style={[styles.youDidIt, { fontSize: scaleSize(32), marginTop: scaleSize(12) }]}>{t('youDidIt')}</Text>
          <Text style={[styles.celebrationSub, { fontSize: scaleSize(14) }]}>
            {t('screeningCompleteForName', { name: childName })}
          </Text>
        </View>

        <View style={[styles.overviewCard, { padding: scaleSize(16), borderRadius: scaleSize(24), borderWidth: 1, borderColor: 'rgba(83, 91, 216, 0.21)' }]}>
          <View style={[styles.overviewHeader, { paddingBottom: scaleSize(12) }]}>
            <Text style={[styles.overviewTitle, { fontSize: scaleSize(14) }]}>{t('screeningOverviewForName', { name: childName })}</Text>
            <View style={styles.overviewMetaRow}>
              <View style={styles.metaItem}>
                <CalendarIcon width={scaleSize(16)} height={scaleSize(16)} color="#6B7180" />
                <Text style={[styles.metaText, { fontSize: scaleSize(12) }]}>{date}</Text>
              </View>
              <View style={styles.metaItem}>
                <PersonIcon width={scaleSize(16)} height={scaleSize(16)} />
                <Text style={[styles.metaText, { fontSize: scaleSize(12) }]}>{screener}</Text>
              </View>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreLabelRow}>
              <Text style={[styles.scoreLabel, { fontSize: scaleSize(10) }]}>{t('score')} : </Text>
              <Text style={[styles.scoreValue, { fontSize: scaleSize(18) }]}>
                {score} / {total} <Text style={{ color: '#6B7180' }}>*</Text>
              </Text>
            </View>
            <View style={[styles.resultBadge, { backgroundColor: '#E8F7F0', borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6) }]}>
              <FlagIcon width={scaleSize(14)} height={scaleSize(14)} fill="#1A7340" color="#1A7340" />
              <Text style={[styles.resultBadgeText, { fontSize: scaleSize(12), color: '#1A7340' }]}>{t(resultLabelKey)}</Text>
            </View>
          </View>

          <View style={[styles.progressTrack, { height: scaleSize(8), borderRadius: scaleSize(4), marginTop: scaleSize(8) }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, height: scaleSize(8), borderRadius: scaleSize(4), backgroundColor: '#1A7340' }]} />
          </View>

          <Text style={[styles.disclaimer, { fontSize: scaleSize(12), marginTop: scaleSize(10) }]}>
            {t('scoreDisclaimer')}
          </Text>

          <View style={[styles.domainGrid, { marginTop: scaleSize(16), gap: scaleSize(16) }]}>
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <View key={rowIndex} style={[styles.domainRow, { gap: scaleSize(16) }]}>
                {domainsWithProgress.slice(rowIndex * 3, rowIndex * 3 + 3).map((domain) => {
                  const { Icon } = domain;
                  const circleSize = scaleSize(64);
                  const ringGap = scaleSize(3);
                  const ringThickness = scaleSize(4);
                  const ringSize = circleSize + ringThickness + ringGap * 2;
                  return (
                    <View key={domain.key} style={styles.domainItem}>
                      <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
                        <ProgressRing
                          size={ringSize}
                          strokeWidth={ringThickness}
                          progress={domain.progress}
                          color={domain.ringColor}
                        />
                        <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color }]}>
                          <Icon width={scaleSize(28)} height={scaleSize(28)} />
                          <View style={[styles.checkmarkWrap, { width: scaleSize(20), height: scaleSize(20), borderRadius: scaleSize(10), bottom: scaleSize(0), right: scaleSize(0) }]}>
                            <Image
                              source={CheckmarkIcon}
                              style={{ width: scaleSize(20), height: scaleSize(20) }}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      </View>
                      <Text style={[styles.domainLabel, { fontSize: scaleSize(12), marginTop: scaleSize(6) }]}>{domain.label}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.resultCard, { padding: scaleSize(16), borderRadius: scaleSize(20) }]}>
          <View style={styles.resultCardHeader}>
            <View style={[styles.resultIconBox, { width: scaleSize(56), height: scaleSize(56), borderRadius: scaleSize(14), backgroundColor: '#1A7340' }]}>
              <FlagIcon width={scaleSize(28)} height={scaleSize(28)} fill="#FFF" color="#FFF" />
            </View>
            <View style={styles.resultCardTitles}>
              <Text style={[styles.resultCardEyebrow, { fontSize: scaleSize(10) }]}>{t('screeningResult')}</Text>
              <Text style={[styles.resultCardResult, { fontSize: scaleSize(18), color: '#1A7340' }]}>{t(resultLabelKey)}</Text>
              <Text style={[styles.resultCardScore, { fontSize: scaleSize(12) }]}>{score} / {total}</Text>
            </View>
          </View>
          <View style={[styles.resultDivider, { height: scaleSize(1), marginVertical: scaleSize(12) }]} />
          <Text style={[styles.resultDescription, { fontSize: scaleSize(12) }]}>
            {t(resultDescKey, { name: childName })}
          </Text>
        </View>

        <View style={[styles.infoCard, { padding: scaleSize(14), borderRadius: scaleSize(14) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <WarningIcon width={scaleSize(24)} height={scaleSize(24)} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(13) }]}>{t('screeningNotDiagnosis')}</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>
              {t('screeningNotDiagnosisBody')}
            </Text>
          </View>
        </View>

        <View style={[styles.courageCard, { padding: scaleSize(14), borderRadius: scaleSize(14) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <CourageIcon width={scaleSize(28)} height={scaleSize(28)} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.courageTitle, { fontSize: scaleSize(14) }]}>{t('thatTookCourage')}</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>
              {t('thankYouForShowingUp', { name: childName })}
            </Text>
          </View>
        </View>

        <View style={[styles.lockCard, { padding: scaleSize(14), borderRadius: scaleSize(14) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <LockIcon width={scaleSize(28)} height={scaleSize(28)} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.courageTitle, { fontSize: scaleSize(14), color: '#535BD8' }]}>{t('responsesSavedSecurely')}</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>{t('encryptedPrivateAndYours')}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
        <Pressable
          onPress={handleViewReport}
          style={({ pressed }) => [
            styles.primaryCta,
            { height: scaleSize(54), borderRadius: scaleSize(28), opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.primaryCtaText, { fontSize: scaleSize(16) }]}>{t('viewReportForName', { name: childName })}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.maybeLater}>
          <Text style={[styles.maybeLaterText, { fontSize: scaleSize(14) }]}>{t('maybeLater')}</Text>
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
  progressFill: {},
  disclaimer: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  domainGrid: {},
  domainRow: { flexDirection: 'row', justifyContent: 'space-around' },
  domainItem: { alignItems: 'center' },
  domainCircle: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  domainLabel: { fontFamily: 'Inter_600SemiBold', color: '#3B3B3E' },
  checkmarkWrap: { position: 'absolute', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  resultCard: { backgroundColor: '#E8F7F0', gap: 0 },
  resultCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultIconBox: { justifyContent: 'center', alignItems: 'center' },
  resultCardTitles: { gap: 2, flex: 1 },
  resultCardEyebrow: { fontFamily: 'Inter_700Bold', color: '#1A7340', letterSpacing: 0.5 },
  resultCardResult: { fontFamily: 'Inter_800ExtraBold' },
  resultCardScore: { fontFamily: 'Inter_700Bold', color: '#6B7180' },
  resultDivider: { backgroundColor: 'rgba(26, 115, 64, 0.12)' },
  resultDescription: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  infoCard: { backgroundColor: 'rgba(243, 242, 255, 0.6)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIconCircle: { backgroundColor: '#E8E7FF', justifyContent: 'center', alignItems: 'center' },
  infoText: { flex: 1, gap: 2 },
  infoTitle: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  infoBody: { fontFamily: 'Inter_400Regular', color: '#6B7180', lineHeight: 18 },
  courageCard: { backgroundColor: 'rgba(243, 242, 255, 0.6)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  courageTitle: { fontFamily: 'Inter_700Bold', color: '#535BD8' },
  lockCard: { backgroundColor: 'rgba(243, 242, 255, 0.6)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  primaryCta: { backgroundColor: colors.primaryBlue, justifyContent: 'center', alignItems: 'center' },
  primaryCtaText: { fontFamily: 'Inter_700Bold', color: colors.white },
  maybeLater: { alignSelf: 'center', padding: 4 },
  maybeLaterText: { fontFamily: 'Inter_600SemiBold', color: '#6B7180' },
});
