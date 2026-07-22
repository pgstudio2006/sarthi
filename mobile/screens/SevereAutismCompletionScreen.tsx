import React from 'react';
import {
  ScrollView,
  View,
  Text,
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
import ResultFlagIcon from '../assets/figma/screen27/Frame-10.svg';
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

const DOMAIN_META: Record<string, { Icon: any; color: string; ringColor: string; label: string; totalQuestions: number }> = {
  Social: { Icon: SocialIcon, color: '#9651C8', ringColor: '#B87FE5', label: 'Social', totalQuestions: 9 },
  Emotion: { Icon: EmotionIcon, color: '#2BA8A6', ringColor: '#4ECDC4', label: 'Emotion', totalQuestions: 5 },
  Speech: { Icon: SpeechIcon, color: '#3B8DBD', ringColor: '#6BADD6', label: 'Speech', totalQuestions: 9 },
  Behavior: { Icon: BehaviorIcon, color: '#D66A8E', ringColor: '#F28FAD', label: 'Behaviour', totalQuestions: 6 },
  Sensory: { Icon: SensoryIcon, color: '#F4A261', ringColor: '#F7B37E', label: 'Sensory', totalQuestions: 6 },
  Cognitive: { Icon: CognitiveIcon, color: '#7D6CB7', ringColor: '#7D6CB7', label: 'Cognitive', totalQuestions: 5 },
};

const DOMAIN_KEYS = ['Social', 'Emotion', 'Speech', 'Behavior', 'Sensory', 'Cognitive'];

export default function SevereAutismCompletionScreen({ navigation, route }: any) {
  const { scaleSize, padding } = useResponsive();
  const { t } = useTranslation();
  const screening = useScreening();

  const childName = route?.params?.childName ?? 'Nitya';
  const score = route?.params?.score ?? 164;
  const total = route?.params?.total ?? 200;
  const result = route?.params?.result ?? 'Severe Autism';
  const date = route?.params?.date ?? '8 June 2026';
  const screener = route?.params?.screener ?? 'Dhaval (Father)';
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

  const severityColor = '#A83B3B';
  const severityBg = '#FDF0F0';

  const isDomainOnTrack = (key: string) => {
    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === key);
      if (bd) {
        const statusLower = bd.status.toLowerCase();
        return statusLower.includes('great') || statusLower.includes('well');
      }
    }
    if (result === 'Normal' || result === 'No Signs of Autism') return true;
    return false;
  };

  const getDomainProgress = (key: string) => {
    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === key);
      if (bd) {
        return bd.progress;
      }
    }
    const fallbacks: Record<string, number> = {
      Social: 0.85,
      Emotion: 0.8,
      Speech: 0.9,
      Behavior: 0.85,
      Sensory: 0.8,
      Cognitive: 0.75,
    };
    return fallbacks[key] ?? 0.8;
  };

  const domainsWithProgress = DOMAIN_KEYS.map((key) => {
    const meta = DOMAIN_META[key];
    const breakdown = domainBreakdown?.find((item: any) => item.key === key);
    return {
      key,
      label: meta.label,
      Icon: meta.Icon,
      color: meta.color,
      ringColor: breakdown?.statusColor ?? meta.ringColor,
    };
  });

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

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: scaleSize(0), backgroundColor: '#fff', borderRadius: scaleSize(16), borderWidth: 1, borderColor: '#E2E4E8', paddingVertical: scaleSize(16) }}>
          <View style={{ alignItems: 'center', width: scaleSize(112) }}>
            <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: scaleSize(20), color: '#18182D' }}>40</Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: scaleSize(11), color: '#6B7180', marginTop: scaleSize(2) }}>{t('questionsLabel')}</Text>
          </View>
          <View style={{ width: 1, height: scaleSize(48), backgroundColor: '#E2E4E8' }} />
          <View style={{ alignItems: 'center', width: scaleSize(112) }}>
            <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: scaleSize(20), color: '#18182D' }}>38</Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: scaleSize(11), color: '#6B7180', marginTop: scaleSize(2) }}>{t('minutes')}</Text>
          </View>
          <View style={{ width: 1, height: scaleSize(48), backgroundColor: '#E2E4E8' }} />
          <View style={{ alignItems: 'center', width: scaleSize(112) }}>
            <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: scaleSize(20), color: '#18182D' }}>6</Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: scaleSize(11), color: '#6B7180', marginTop: scaleSize(2) }}>{t('domains')}</Text>
          </View>
        </View>

        <View style={[styles.overviewCard, { padding: scaleSize(16), borderRadius: scaleSize(24), borderWidth: 1, borderColor: 'rgba(83, 91, 216, 0.21)' }]}>
          <View style={[styles.overviewHeader, { paddingBottom: scaleSize(12) }]}>
            <Text style={[styles.overviewTitle, { fontSize: scaleSize(14) }]}>{t('screeningOverviewForName', { name: childName })}</Text>
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

          <View style={styles.scoreRow}>
            <View style={styles.scoreLabelRow}>
              <Text style={[styles.scoreLabel, { fontSize: scaleSize(10) }]}>{t('score')} : </Text>
              <Text style={[styles.scoreValue, { fontSize: scaleSize(18) }]}>
                {score} / {total} <Text style={{ color: '#6B7180' }}>*</Text>
              </Text>
            </View>
            <View style={[styles.resultBadge, { backgroundColor: severityColor, borderColor: severityColor, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6) }]}>
              <FlagIcon width={scaleSize(14)} height={scaleSize(14)} fill="#FFF" color="#FFF" />
              <Text style={[styles.resultBadgeText, { fontSize: scaleSize(12), color: '#FFF' }]}>{t(resultLabelKey)}</Text>
            </View>
          </View>

          <View style={[styles.progressTrack, { height: scaleSize(8), borderRadius: scaleSize(4), marginTop: scaleSize(8) }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, height: scaleSize(8), borderRadius: scaleSize(4), backgroundColor: severityColor }]} />
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
                  const onTrack = isDomainOnTrack(domain.key);
                  const progressVal = getDomainProgress(domain.key);

                  return (
                    <View key={domain.key} style={styles.domainItem}>
                      {!onTrack ? (
                        <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
                          <ProgressRing
                            size={ringSize}
                            strokeWidth={ringThickness}
                            progress={progressVal}
                            color={domain.ringColor}
                          />
                          <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color }]}>
                            <Icon width={scaleSize(28)} height={scaleSize(28)} />
                          </View>
                        </View>
                      ) : (
                        <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
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
                      )}
                      <Text style={[styles.domainLabel, { fontSize: scaleSize(12), marginTop: scaleSize(6) }]}>{domain.label}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.resultCard, { padding: scaleSize(16), borderRadius: scaleSize(20), backgroundColor: severityBg }]}>
          <View style={styles.resultCardHeader}>
            <View style={[styles.resultIconBox, { width: scaleSize(56), height: scaleSize(56), borderRadius: scaleSize(14), backgroundColor: severityColor }]}>
              <ResultFlagIcon width={scaleSize(28)} height={scaleSize(28)} fill="#FFF" color="#FFF" />
            </View>
            <View style={styles.resultCardTitles}>
              <Text style={[styles.resultCardEyebrow, { fontSize: scaleSize(10), color: severityColor }]}>{t('screeningResult')}</Text>
              <Text style={[styles.resultCardResult, { fontSize: scaleSize(18), color: severityColor }]}>{t(resultLabelKey)}</Text>
              <Text style={[styles.resultCardScore, { fontSize: scaleSize(12) }]}>{score} / {total}</Text>
            </View>
          </View>
          <View style={[styles.resultDivider, { height: scaleSize(1), marginVertical: scaleSize(12), backgroundColor: `${severityColor}20` }]} />
          <Text style={[styles.resultDescription, { fontSize: scaleSize(12) }]}>
            {t(resultDescKey, { name: childName })}
          </Text>
        </View>

        <View style={[styles.infoCard, { padding: scaleSize(12), borderRadius: scaleSize(14) }]}>
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

        <View style={[styles.encouragementCard, { padding: scaleSize(14), borderRadius: scaleSize(14) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <CourageIcon width={scaleSize(28)} height={scaleSize(28)} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(14), color: severityColor }]}>{t('thatTookCourage')}</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>
              {t('thankYouForShowingUp', { name: childName })}
            </Text>
          </View>
        </View>

        <View style={[styles.encouragementCard, { padding: scaleSize(12), borderRadius: scaleSize(12) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <LockIcon width={scaleSize(28)} height={scaleSize(28)} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(14), color: '#535BD8' }]}>{t('responsesSavedSecurely')}</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>{t('encryptedPrivateAndYours')}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
        <Pressable
          onPress={() =>
            navigation.navigate('SevereAutismReport', {
              childName,
              score,
              total,
              result,
              date,
              screener,
              domainBreakdown,
              isRepeat,
              previousScore,
            })
          }
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brand: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#373E8B',
    letterSpacing: 0.4,
  },
  closeButton: {
    backgroundColor: '#F5F6F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationCard: {
    backgroundColor: '#EDFBF8',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  confettiDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  confettiSquare: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  starCircle: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  youDidIt: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#2BA8A6',
    textAlign: 'center',
    zIndex: 1,
  },
  celebrationSub: {
    fontFamily: 'Inter_500Medium',
    color: '#454545',
    textAlign: 'center',
    zIndex: 1,
  },
  overviewCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E2E4E8',
    gap: 12,
  },
  overviewHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4E8',
    gap: 10,
  },
  overviewTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  overviewMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontFamily: 'Inter_700Bold',
    color: '#939394',
  },
  scoreValue: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#1B1B1B',
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  resultBadgeText: {
    fontFamily: 'Inter_700Bold',
  },
  progressTrack: {
    backgroundColor: '#E2E4E8',
    overflow: 'hidden',
  },
  progressFill: {},
  disclaimer: {
    fontFamily: 'Inter_400Regular',
    color: '#757575',
    lineHeight: 18,
  },
  domainGrid: {},
  domainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  domainItem: {
    flex: 1,
    alignItems: 'center',
  },
  domainCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkmarkWrap: {
    position: 'absolute',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  domainLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: '#434343',
    textAlign: 'center',
  },
  resultCard: {
    gap: 4,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultIconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCardTitles: {
    gap: 2,
  },
  resultCardEyebrow: {
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  resultCardResult: {
    fontFamily: 'Inter_800ExtraBold',
  },
  resultCardScore: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  resultDivider: {},
  resultDescription: {
    fontFamily: 'Inter_400Regular',
    color: '#2D2A3A',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  encouragementCard: {
    backgroundColor: 'rgba(243, 242, 255, 0.6)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIconCircle: {
    backgroundColor: '#F3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  infoBody: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#DFDFDF',
    paddingTop: 12,
    gap: 12,
    alignItems: 'center',
  },
  primaryCta: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  primaryCtaText: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  maybeLater: {
    alignSelf: 'center',
  },
  maybeLaterText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
  },
});
