import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScreening } from '../context/ScreeningContext';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useTranslation } from '../i18n';
import { generateScreeningReportPDF, getResultColors, buildDomainTopInsights } from '../utils/reportPdf';
import ProgressRing from '../components/ProgressRing';
import BackArrow from '../assets/figma/screen18/Vector.svg';
import CalendarIcon from '../assets/figma/screen28/calendar_month.svg';
import WarningIcon from '../assets/figma/screen28/Frame-1.svg';
import ShareIcon from '../assets/figma/screen28/Frame-8.svg';
import StarIcon from '../assets/figma/screen28/kid_star.svg';
import DownloadIcon from '../assets/figma/screen28/Frame-3.svg';
import ChevronDown from '../assets/figma/screen28/Frame-4.svg';
import ChevronUp from '../assets/figma/screen28/Frame-6.svg';
import CheckmarkIcon from '../assets/figma/screen28/Checkmark1.png';
import ResultFlagIcon from '../assets/figma/screen28/Frame-10.svg';
import PersonIcon from '../assets/figma/screen27/Frame-7.svg';
import { getDynamicFAQs } from '../utils/qaLogic';
import { getAiFaqs, AiFaq } from '../api/client';

import SocialIcon from '../assets/figma/screen28/Frame-7.svg';
import EmotionIcon from '../assets/figma/screen28/Frame-5.svg';
import SpeechIcon from '../assets/figma/screen28/Frame-15.svg';
import BehaviorIcon from '../assets/figma/screen28/Frame-14.svg';
import SensoryIcon from '../assets/figma/screen28/Frame-13.svg';
import CognitiveIcon from '../assets/figma/screen28/Frame-11.svg';

const DOMAINS_OVERVIEW = [
  { key: 'Social', label: 'Social', Icon: SocialIcon, color: '#9651C8', progress: 1, ringColor: '#B87FE5' },
  { key: 'Emotion', label: 'Emotion', Icon: EmotionIcon, color: '#2BA8A6', progress: 1, ringColor: '#4ECDC4' },
  { key: 'Speech', label: 'Speech', Icon: SpeechIcon, color: '#3B8DBD', progress: 1, ringColor: '#6BADD6' },
  { key: 'Behavior', label: 'Behaviour', Icon: BehaviorIcon, color: '#D66A8E', progress: 1, ringColor: '#F28FAD' },
  { key: 'Sensory', label: 'Sensory', Icon: SensoryIcon, color: '#F4A261', progress: 1, ringColor: '#F7B37E' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#7D6CB7', progress: 1, ringColor: '#7D6CB7' },
];

const INSIGHTS = [
  {
    title: 'Cognitive Patterns',
    heading: 'Attention & Focus need support',
    status: 'Needs support',
    statusColor: '#C62828',
    statusBg: '#FDE8E8',
    Icon: CognitiveIcon,
    bullets: [
      'Inconsistent focus during tasks',
      'Requires frequent prompting',
      'Difficulties with transitions',
    ],
  },
  {
    title: 'Social Interaction',
    heading: 'Social reciprocity concerns',
    status: 'Needs support',
    statusColor: '#C62828',
    statusBg: '#FDE8E8',
    Icon: SocialIcon,
    bullets: [
      'Avoids eye contact frequently',
      'Does not respond to name consistently',
      'Prefers solitary play activities',
    ],
  },
];

const DEVELOPMENT_DOMAINS = [
  {
    key: 'Social',
    label: 'Social',
    status: 'Needs extra support',
    statusColor: '#C62828',
    statusBg: '#FDE8E8',
    color: '#9651C8',
    Icon: SocialIcon,
    score: '39/45',
    strengths: [
      'Tolerates being in same room as peers',
    ],
    attention: [
      'Does not respond when name is called',
      'Avoids social engagement and sharing',
      'Difficulty understanding social boundaries',
    ],
  },
  {
    key: 'Emotion',
    label: 'Emotional',
    status: 'Needs extra support',
    statusColor: '#C62828',
    statusBg: '#FDE8E8',
    color: '#2BA8A6',
    Icon: EmotionIcon,
    score: '38/45',
    strengths: [
      'Responds well to calm parent presence',
    ],
    attention: [
      'Frequent intense meltdowns or emotional outbursts',
      'Extreme difficulty self-regulating',
      'Expression of distress in new settings',
    ],
  },
  {
    key: 'Speech',
    label: 'Speech',
    status: 'Needs support',
    statusColor: '#C62828',
    statusBg: '#FDE8E8',
    color: '#3B8DBD',
    Icon: SpeechIcon,
    score: '36/45',
    strengths: [
      'Uses basic single words occasionally',
    ],
    attention: [
      'Delayed functional speech development',
      'Echolalia (repeating words/phrases) present',
      'Difficulty expressing basic physical needs',
    ],
  },
  {
    key: 'Behavior',
    label: 'Behavioural',
    status: 'Needs support',
    statusColor: '#C62828',
    statusBg: '#FDE8E8',
    color: '#D66A8E',
    Icon: BehaviorIcon,
    score: '37/45',
    strengths: [
      'Can follow highly structured schedules',
    ],
    attention: [
      'Highly repetitive behaviors or stereotypic play',
      'Severe resistance to small routine changes',
      'Sensory-seeking behaviors like hand flapping',
    ],
  },
  {
    key: 'Sensory',
    label: 'Sensory',
    status: 'Needs extra support',
    statusColor: '#C62828',
    statusBg: '#FDE8E8',
    color: '#F4A261',
    Icon: SensoryIcon,
    score: '39/45',
    strengths: [
      'Enjoys deep pressure/weighted blankets',
    ],
    attention: [
      'Extreme distress with loud sounds or lights',
      'Avoidance of specific clothing textures or foods',
      'Sensory overload in busy environments',
    ],
  },
  {
    key: 'Cognitive',
    label: 'Cognitive',
    status: 'Needs extra support',
    statusColor: '#C62828',
    statusBg: '#FDE8E8',
    color: '#7D6CB7',
    Icon: CognitiveIcon,
    score: '35/45',
    strengths: [
      'Very strong visual recall for details',
    ],
    attention: [
      'Struggles with abstract concepts',
      'Highly selective attention limits learning',
      'Significant response delay when spoken to',
    ],
  },
];

const DOMAIN_QUESTIONS: Record<string, string[]> = {
  Social: [
    "How often does the child avoid looking at people's faces while talking or playing?",
    "How often does the child not smile back when someone smiles at them?",
    "How often does the child prefer to stay alone instead of joining family members or other children?",
    "How often does the child not seek help, comfort, or share excitement with a familiar person?",
    "How often does the child seem unaware of people around them?",
    "How often does the child not notice or join what other people are doing?",
    "How often does the child play alone in the same way again and again?",
    "How often does the child have difficulty waiting for their turn during play or conversation?",
    "How often does the child avoid playing or interacting with other children of a similar age?"
  ],
  Emotion: [
    "How often does the child react in a way that does not match the situation?",
    "How often does the child react much more strongly than the situation requires?",
    "How often does the child suddenly laugh, cry, or become excited without an obvious reason?",
    "How often does the child do dangerous things without seeming to understand the risk?",
    "How often does the child suddenly become very excited or upset without an obvious reason?"
  ],
  Speech: [
    "How often does the child stop using words or sentences they could previously say?",
    "How often does the child find it difficult to use gestures like pointing, waving, or nodding to communicate?",
    "How often does the child repeat the same words or phrases again and again?",
    "How often does the child repeat words or questions exactly as they hear them?",
    "How often does the child make unusual sounds instead of using words?",
    "How often does the child have difficulty starting or continuing a conversation?",
    "How often does the child use words that do not have a clear meaning to others?",
    "How often does the child refer to themselves using the wrong words, such as saying \"you\" instead of \"I\"?",
    "How often does the child have difficulty understanding the real meaning behind what others say."
  ],
  Behavior: [
    "How often does the child repeatedly flap their hands, rock their body, spin, or make the same movements again and again?",
    "How often does the child become unusually attached to a particular object?",
    "How often does the child seem unable to sit still or stay calm?",
    "How often does the child hit, kick, bite, push, or hurt others?",
    "How often does the child have intense tantrums that are difficult to calm?",
    "How often does the child hurt themselves on purpose?",
    "How often does the child become upset when daily routines or familiar things change?"
  ],
  Sensory: [
    "How often does the child react strongly to everyday sounds, lights, smells, touch, or certain clothes?",
    "How often does the child stare into space for a long time without responding?",
    "How often does the child have difficulty following a moving object with their eyes?",
    "How often does the child look at objects in unusual ways?",
    "How often does the child seem to feel little or no pain after getting hurt?",
    "How often does child repeatedly smell objects, put things in their mouth, or frequently touch people?"
  ],
  Cognitive: [
    "How often does the child have difficulty staying focused on an activity?",
    "How often does the child take much longer than expected to respond when spoken to?",
    "How often does the child remember unusual details much better than expected?",
    "How often does the child show an exceptional skill that is much stronger than expected for their age?"
  ]
};

export default function SevereAutismReportScreen({ navigation, route }: any) {
  const { scaleSize, padding } = useResponsive();
  const { t } = useTranslation();
  const screening = useScreening();

  const childName = route?.params?.childName ?? '';
  const score = route?.params?.score ?? 0;
  const total = route?.params?.total ?? 1;
  const result = route?.params?.result ?? '';
  const date = route?.params?.date ?? '';
  const screener = route?.params?.screener ?? '';
  const domainBreakdown = route?.params?.domainBreakdown;
  const completedCount = route?.params?.completedCount ?? (route?.params?.isRepeat ? 2 : 1);
  const childId = route?.params?.childId ?? '';
  const progress = Math.min(1, Math.max(0, Number(score || 0) / Number(total || 1)));

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

  const getStatusKey = (status: string) => {
    const lower = (status ?? '').toLowerCase();
    if (lower.includes('great')) return 'doingGreat';
    if (lower.includes('well')) return 'doingWell';
    if (lower.includes('more support')) return 'needsMoreSupport';
    if (lower.includes('extra support')) return 'needsExtraSupport';
    if (lower.includes('progress')) return 'makingProgress';
    if (lower.includes('support')) return 'needsSupport';
    return lower.replace(/\s+/g, '');
  };

  const resultColors = useMemo(() => getResultColors(result), [result]);
  const dynamicInsights = useMemo(() => buildDomainTopInsights(domainBreakdown), [domainBreakdown]);

  // Answers source: route params or context
  const contextAnswers = screening?.domainAnswers || {};
  const routeAnswers = route?.params?.domainAnswers;
  const domainAnswers = routeAnswers || contextAnswers;

  const isDomainOnTrack = (key: string) => {
    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === key);
      if (bd) {
        const statusLower = (bd.status ?? '').toLowerCase();
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

  const domainsWithProgress = DOMAINS_OVERVIEW.map((d) => {
    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === d.key);
      if (bd) {
        return { ...d, progress: bd.progress, ringColor: bd.statusColor };
      }
    }
    return d;
  });

  const domainsDetailWithScore = DEVELOPMENT_DOMAINS.map((d) => {
    let scoreStr = d.score;
    let statusStr = d.status;
    let statusColorStr = d.statusColor;
    let statusBgStr = d.statusBg;

    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === d.key);
      if (bd) {
        scoreStr = `${bd.score ?? 0}/${bd.maxScore ?? 45}`;
        statusStr = bd.status ?? d.status;
        statusColorStr = bd.statusColor ?? d.statusColor;
        statusBgStr = bd.statusBg ?? d.statusBg;
      }
    }

    // Now compute dynamic attention and strengths lists:
    const questions = DOMAIN_QUESTIONS[d.key] || [];
    const answers = domainAnswers[d.key] || [];

    const attention: string[] = [];
    const strengths: string[] = [];

    if (answers && answers.length > 0) {
      questions.forEach((qText, index) => {
        const answer = answers[index];
        if (answer !== null && answer !== undefined) {
          if (answer >= 2) {
            attention.push(qText);
          } else {
            strengths.push(qText);
          }
        }
      });
    }

    return {
      ...d,
      score: scoreStr,
      status: statusStr,
      statusColor: statusColorStr,
      statusBg: statusBgStr,
      attention: attention.length > 0 ? attention : d.attention,
      strengths: strengths.length > 0 ? strengths : d.strengths,
    };
  });

  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [domainTab, setDomainTab] = useState<Record<string, 'attention' | 'strengths'>>(() => {
    const initial: Record<string, 'attention' | 'strengths'> = {};
    domainsDetailWithScore.forEach((d) => {
      initial[d.key] = d.attention.length > 0 ? 'attention' : 'strengths';
    });
    return initial;
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleDomain = (key: string) => {
    setExpandedDomain((prev) => (prev === key ? null : key));
  };

  const handleShare = async () => {
    await generateScreeningReportPDF({ childName, score, total, result, date, screener, domainBreakdown, domainAnswers }, 'share');
  };

  const reportPriorityDomains = useMemo(
    () => domainsDetailWithScore.map(d => d.key),
    [domainsDetailWithScore]
  );
  const [reportFAQs, setReportFAQs] = useState<AiFaq[]>(() =>
    getDynamicFAQs(completedCount, false, reportPriorityDomains)
  );
  useEffect(() => {
    let mounted = true;
    if (!childId) return;
    getAiFaqs(childId).then((res) => {
      if (!mounted) return;
      if (res.success && res.data.faqs.length === 10) {
        setReportFAQs(res.data.faqs);
      }
    });
    return () => { mounted = false; };
  }, [childId, completedCount, reportPriorityDomains]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingHorizontal: padding, paddingVertical: scaleSize(12) }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={scaleSize(10)}>
          <BackArrow width={scaleSize(12)} height={scaleSize(21)} />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: scaleSize(16) }]}>{t('screeningReport')}</Text>
        <View style={{ width: scaleSize(12) }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: scaleSize(120), gap: scaleSize(16) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.overviewCard, { padding: scaleSize(16), borderRadius: scaleSize(24), borderWidth: 1, borderColor: 'rgba(83, 91, 216, 0.21)' }]}>
          <Text style={[styles.overviewTitle, { fontSize: scaleSize(16) }]}>{t('screeningOverviewForName', { name: childName })}</Text>
          <View style={styles.overviewMetaRow}>
            <CalendarIcon width={scaleSize(16)} height={scaleSize(16)} />
            <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12), marginLeft: scaleSize(6) }]}>{date}</Text>
            <View style={{ marginLeft: scaleSize(16), flexDirection: 'row', alignItems: 'center' }}>
              <PersonIcon width={scaleSize(16)} height={scaleSize(16)} fill="#6B7180" color="#6B7180" />
              <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12), marginLeft: scaleSize(6) }]}>{screener}</Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <View>
              <View style={styles.scoreLabelRow}>
                <Text style={[styles.scoreLabel, { fontSize: scaleSize(12) }]}>{t('score')} : </Text>
                <Text style={[styles.scoreValue, { fontSize: scaleSize(20) }]}>{score} / {total}</Text>
                <Text style={[styles.scoreAsterisk, { fontSize: scaleSize(14) }]}> *</Text>
              </View>
              <View style={[styles.resultBadge, { backgroundColor: resultColors.bg, borderColor: resultColors.border, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6) }]}>
                <ResultFlagIcon width={scaleSize(14)} height={scaleSize(14)} fill={resultColors.fill} color={resultColors.fill} />
                <Text style={[styles.resultBadgeText, { fontSize: scaleSize(12), color: resultColors.text, marginLeft: scaleSize(4) }]}>{t(resultLabelKey)}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.progressTrack, { height: scaleSize(8), borderRadius: scaleSize(4), marginTop: scaleSize(12) }]}>
            <View style={{ width: `${progress * 100}%`, height: scaleSize(8), borderRadius: scaleSize(4), backgroundColor: resultColors.fill }} />
          </View>

          <View style={[styles.domainGrid, { marginTop: scaleSize(16), gap: scaleSize(12) }]}>
            <View style={styles.domainRow}>
              {domainsWithProgress.slice(0, 3).map((domain) => {
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
            <View style={styles.domainRow}>
              {domainsWithProgress.slice(3, 6).map((domain) => {
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
          </View>

          <Text style={[styles.disclaimer, { fontSize: scaleSize(11), marginTop: scaleSize(12) }]}>
            {t('scoreDisclaimer')}
          </Text>
        </View>

        <View style={[styles.summaryCard, { padding: scaleSize(16), borderRadius: scaleSize(20), backgroundColor: resultColors.bg }]}>
          <View style={styles.summaryHeader}>
            <View style={[styles.summaryIconBox, { width: scaleSize(48), height: scaleSize(48), borderRadius: scaleSize(12), backgroundColor: resultColors.bg, justifyContent: 'center', alignItems: 'center' }]}>
              <ResultFlagIcon width={scaleSize(24)} height={scaleSize(24)} fill={resultColors.fill} color={resultColors.fill} />
            </View>
            <View style={{ marginLeft: scaleSize(12) }}>
              <Text style={[styles.summaryEyebrow, { fontSize: scaleSize(10), color: resultColors.text }]}>{t('screeningResult')}</Text>
              <Text style={[styles.summaryTitle, { fontSize: scaleSize(18), color: resultColors.text }]}>{t(resultLabelKey)}</Text>
              <Text style={[styles.summaryScore, { fontSize: scaleSize(12), marginTop: scaleSize(2) }]}>{score} / {total}</Text>
            </View>
          </View>
          <View style={[styles.summaryDivider, { marginVertical: scaleSize(12), backgroundColor: resultColors.border }]} />
          <Text style={[styles.summaryBody, { fontSize: scaleSize(12) }]}>
            {t(resultDescKey, { name: childName })}
          </Text>
        </View>

        <View style={[styles.infoCard, { padding: scaleSize(14), borderRadius: scaleSize(14), borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }]}>
          <WarningIcon width={scaleSize(24)} height={scaleSize(24)} />
          <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(13) }]}>{t('screeningNotDiagnosis')}</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>
              {t('screeningNotDiagnosisBody')}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: scaleSize(16) }]}>{t('topInsights')}</Text>
        {dynamicInsights.map((insight) => {
          const { Icon } = insight;
          return (
            <View key={insight.title} style={[styles.insightCard, { padding: scaleSize(14), borderRadius: scaleSize(16) }]}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIconBox, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22), backgroundColor: insight.statusBg }]}>
                  <Icon width={scaleSize(24)} height={scaleSize(24)} />
                </View>
                <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
                  <Text style={[styles.insightTitle, { fontSize: scaleSize(13), color: '#6B7180' }]}>{insight.title}</Text>
                  <Text style={[styles.insightHeading, { fontSize: scaleSize(16), color: '#18182D', marginTop: scaleSize(2) }]}>{insight.heading}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: insight.statusBg, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6) }]}>
                  <Text style={[styles.statusBadgeText, { fontSize: scaleSize(11), color: insight.statusColor }]}>{t(getStatusKey(insight.status))}</Text>
                </View>
              </View>
              <View style={{ marginTop: scaleSize(12), gap: scaleSize(8) }}>
                {insight.bullets.map((b, i) => (
                  <Text key={i} style={[styles.bullet, { fontSize: scaleSize(12) }]}>• {b}</Text>
                ))}
              </View>
            </View>
          );
        })}

        <Text style={[styles.sectionTitle, { fontSize: scaleSize(16), marginTop: scaleSize(8) }]}>{t('developmentByDomain')}</Text>
        <Text style={[styles.sectionSubtitle, { fontSize: scaleSize(12) }]}>{t('tapAnyDomain')}</Text>
        {domainsDetailWithScore.map((domain) => {
          const { Icon } = domain;
          const expanded = expandedDomain === domain.key;
          const tab = domainTab[domain.key];
          const items = tab === 'attention' ? domain.attention : domain.strengths;
          return (
            <View key={domain.key} style={[styles.domainCard, { padding: scaleSize(14), borderRadius: scaleSize(16), borderColor: expanded ? domain.color : '#E2E4E8' }]}>
              <Pressable onPress={() => toggleDomain(domain.key)} style={styles.domainCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={[styles.domainCardIconBox, { width: scaleSize(40), height: scaleSize(40), borderRadius: scaleSize(12), backgroundColor: domain.color }]}>
                    <Icon width={scaleSize(20)} height={scaleSize(20)} />
                  </View>
                  <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
                    <Text style={[styles.domainCardLabel, { fontSize: scaleSize(14) }]}>{domain.label}</Text>
                    <Text style={[styles.domainCardScore, { fontSize: scaleSize(12) }]}>{t('score')} · {domain.score}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(8) }}>
                  <View style={[styles.statusBadge, { backgroundColor: domain.statusBg, borderRadius: scaleSize(10), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3) }]}>
                    <Text style={[styles.statusBadgeText, { fontSize: scaleSize(10), color: domain.statusColor }]}>{t(getStatusKey(domain.status))}</Text>
                  </View>
                  {expanded ? <ChevronUp width={scaleSize(18)} height={scaleSize(18)} /> : <ChevronDown width={scaleSize(18)} height={scaleSize(18)} />}
                </View>
              </Pressable>
              {expanded && (
                <View style={{ marginTop: scaleSize(12), paddingTop: scaleSize(12), borderTopWidth: 1, borderTopColor: '#E2E4E8', gap: scaleSize(10) }}>
                  <View style={styles.domainTabs}>
                    <Pressable
                      onPress={() => setDomainTab((prev) => ({ ...prev, [domain.key]: 'attention' }))}
                      style={[styles.domainTab, tab === 'attention' && styles.domainTabActive]}
                    >
                      <WarningIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={styles.domainTabText}>{t('attentionAreas')} ({domain.attention.length})</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setDomainTab((prev) => ({ ...prev, [domain.key]: 'strengths' }))}
                      style={[styles.domainTab, tab === 'strengths' && styles.domainTabActive]}
                    >
                      <StarIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={styles.domainTabText}>{t('areasWorkingWell')} ({domain.strengths.length})</Text>
                    </Pressable>
                  </View>
                  {tab === 'strengths' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(6) }}>
                      <StarIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={[styles.strengthHeaderText, { fontSize: scaleSize(12) }]}>{t('heresWhatWorkingWell')}</Text>
                    </View>
                  )}
                  <View style={{ gap: scaleSize(10) }}>
                    {items.map((item: string, idx: number) => (
                      <View
                        key={idx}
                        style={[
                          styles.bulletCard,
                          { backgroundColor: tab === 'attention' ? '#F6F6F8' : '#E8F7F0' },
                        ]}
                      >
                        <View
                          style={[
                            styles.numberCircle,
                            tab === 'attention'
                              ? { backgroundColor: domain.statusBg }
                              : { backgroundColor: '#FFFFFF' },
                          ]}
                        >
                          <Text style={[styles.numberCircleText, { color: tab === 'attention' ? domain.statusColor : '#1A7340' }]}>{idx + 1}</Text>
                        </View>
                        <Text style={[styles.bulletText, { fontSize: scaleSize(12), lineHeight: scaleSize(18) }]}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <Text style={[styles.sectionTitle, { fontSize: scaleSize(16), marginTop: scaleSize(8) }]}>{t('learnMoreAboutChild')}</Text>
        <View style={{ gap: scaleSize(12) }}>
          {reportFAQs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <Pressable
                key={faq.title}
                onPress={() => setOpenFaq(isOpen ? null : index)}
                style={({ pressed }) => [
                  styles.faqCard,
                  { padding: scaleSize(14), borderRadius: scaleSize(14), opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <View style={styles.faqHeader}>
                  <View style={styles.faqNumberCircle}>
                    <Text style={styles.faqNumber}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.faqTitle, { fontSize: scaleSize(13) }]}>{faq.title}</Text>
                  <View style={[styles.faqToggle, { backgroundColor: isOpen ? '#535BD8' : '#F3F2FF' }]}>
                    <Text style={[styles.faqToggleText, { color: isOpen ? '#FFFFFF' : '#535BD8' }]}>
                      {isOpen ? '−' : '+'}
                    </Text>
                  </View>
                </View>
                {isOpen && (
                  <View style={{ paddingTop: scaleSize(12), borderTopWidth: 1, borderTopColor: '#E4E7FB', marginTop: scaleSize(10), gap: scaleSize(8) }}>
                    <Text style={[styles.faqBody, { fontSize: scaleSize(12), lineHeight: scaleSize(18) }]}>
                      {faq.body}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
        <Pressable
          onPress={() => generateScreeningReportPDF({ childName, score, total, result, date, screener, domainBreakdown, domainAnswers }, 'download')}
          style={({ pressed }) => [styles.primaryButton, { height: scaleSize(54), borderRadius: scaleSize(26), opacity: pressed ? 0.9 : 1 }]}
        >
          <DownloadIcon width={scaleSize(20)} height={scaleSize(20)} />
          <Text style={[styles.primaryButtonText, { fontSize: scaleSize(15) }]}>{t('downloadReport')}</Text>
        </Pressable>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [styles.secondaryButton, { height: scaleSize(54), borderRadius: scaleSize(26), opacity: pressed ? 0.9 : 1 }]}
        >
          <ShareIcon width={scaleSize(20)} height={scaleSize(20)} />
          <Text style={[styles.secondaryButtonText, { fontSize: scaleSize(15) }]}>{t('share')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  datePill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F2FF' },
  dateText: { fontFamily: 'Inter_600SemiBold', color: '#535BD8' },
  overviewCard: { backgroundColor: '#F3F2FF', gap: 8 },
  overviewTitle: { fontFamily: 'Inter_700Bold', color: '#2D2A3A' },
  overviewMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  overviewMetaText: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  scoreLabelRow: { flexDirection: 'row', alignItems: 'baseline' },
  scoreLabel: { fontFamily: 'Inter_700Bold', color: '#6B7180' },
  scoreValue: { fontFamily: 'Inter_800ExtraBold', color: '#18182D' },
  scoreAsterisk: { fontFamily: 'Inter_800ExtraBold', color: '#6B7180' },
  resultBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 6 },
  resultBadgeText: { fontFamily: 'Inter_700Bold' },
  progressTrack: { backgroundColor: '#E2E4E8' },
  domainGrid: {},
  domainRow: { flexDirection: 'row', justifyContent: 'space-around' },
  domainItem: { alignItems: 'center' },
  domainCircle: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  checkmarkWrap: {
    position: 'absolute',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  domainLabel: { fontFamily: 'Inter_600SemiBold', color: '#3B3B3E' },
  disclaimer: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  summaryCard: { gap: 0 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center' },
  summaryIconBox: { justifyContent: 'center', alignItems: 'center' },
  summaryEyebrow: { fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  summaryTitle: { fontFamily: 'Inter_800ExtraBold' },
  summaryScore: { fontFamily: 'Inter_700Bold', color: '#6B7180' },
  summaryDivider: { height: 1 },
  summaryBody: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  infoCard: { backgroundColor: '#F3F2FF', flexDirection: 'row', alignItems: 'center' },
  infoTitle: { fontFamily: 'Inter_700Bold', color: '#535BD8' },
  infoBody: { fontFamily: 'Inter_400Regular', color: '#6B7180', lineHeight: 18 },
  sectionTitle: { fontFamily: 'Inter_800ExtraBold', color: '#18182D' },
  sectionSubtitle: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  insightCard: { backgroundColor: '#F8F8FF', borderWidth: 1, borderColor: '#E2E4E8' },
  insightHeader: { flexDirection: 'row', alignItems: 'center' },
  insightIconBox: { justifyContent: 'center', alignItems: 'center' },
  insightTitle: { fontFamily: 'Inter_600SemiBold' },
  insightHeading: { fontFamily: 'Inter_700Bold' },
  statusBadge: { justifyContent: 'center', alignItems: 'center' },
  statusBadgeText: { fontFamily: 'Inter_700Bold' },
  bullet: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  domainCard: { backgroundColor: '#F8F8FF', borderWidth: 1, borderColor: '#E2E4E8' },
  domainCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  domainCardIconBox: { justifyContent: 'center', alignItems: 'center' },
  domainCardLabel: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  domainCardScore: { fontFamily: 'Inter_400Regular', color: '#6B7180', marginTop: 2 },
  domainTabs: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#F3F3F6',
    padding: 4,
    borderRadius: 30,
  },
  domainTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    borderRadius: 23,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  domainTabActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  domainTabText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#2D2A3A',
  },
  strengthHeaderText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#1A7340',
  },
  bulletCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    padding: 12,
  },
  numberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberCircleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    color: '#2D2A3A',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E4E7FB',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faqNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#535BD8',
  },
  faqTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  faqToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqToggleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 20,
  },
  faqBody: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  faqCta: {
    fontFamily: 'Inter_600SemiBold',
    color: '#535BD8',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F2FF',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 19,
    gap: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#E4E7FB',
  },
  secondaryButtonText: {
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  primaryButton: {
    flex: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#535BD8',
  },
  primaryButtonText: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
});
