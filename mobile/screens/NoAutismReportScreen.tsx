import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Share,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScreening } from '../context/ScreeningContext';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useTranslation } from '../i18n';
import { generateScreeningReportPDF, getResultColors, buildDomainTopInsights } from '../utils/reportPdf';
import Svg, { Line, Circle, Path, Rect, Text as SvgText, G } from 'react-native-svg';
import BackArrow from '../assets/figma/screen18/Vector.svg';
import CalendarIcon from '../assets/figma/screen28/calendar_month.svg';
import FlagIcon from '../assets/figma/screen28/Frame-10.svg';
import WarningIcon from '../assets/figma/screen28/Frame-1.svg';
import ShareIcon from '../assets/figma/screen28/Frame-8.svg';
import StarIcon from '../assets/figma/screen28/kid_star.svg';
import ChevronDown from '../assets/figma/screen28/Frame-4.svg';
import ChevronUp from '../assets/figma/screen28/Frame-6.svg';
import CheckmarkIcon from '../assets/figma/screen28/Checkmark1.png';
import PersonIcon from '../assets/figma/screen27/Frame-7.svg';
import ResultFlagIcon from '../assets/figma/screen28/Frame-10.svg';

import SocialIcon from '../assets/figma/screen28/Frame-7.svg';
import EmotionIcon from '../assets/figma/screen28/Frame-5.svg';
import SpeechIcon from '../assets/figma/screen28/Frame-15.svg';
import BehaviorIcon from '../assets/figma/screen28/Frame-14.svg';
import SensoryIcon from '../assets/figma/screen28/Frame-13.svg';
import CognitiveIcon from '../assets/figma/screen28/Frame-11.svg';

const DOMAINS_OVERVIEW = [
  { key: 'Social', label: 'Social', Icon: SocialIcon, color: '#9651C8', progress: 1, ringColor: '#B87FE5' },
  { key: 'Emotion', label: 'Emotional', Icon: EmotionIcon, color: '#2BA8A6', progress: 1, ringColor: '#4ECDC4' },
  { key: 'Speech', label: 'Speech', Icon: SpeechIcon, color: '#3B8DBD', progress: 1, ringColor: '#6BADD6' },
  { key: 'Behavior', label: 'Behaviour', Icon: BehaviorIcon, color: '#D66A8E', progress: 1, ringColor: '#F28FAD' },
  { key: 'Sensory', label: 'Sensory', Icon: SensoryIcon, color: '#F4A261', progress: 1, ringColor: '#F7B37E' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#7D6CB7', progress: 1, ringColor: '#7D6CB7' },
];

const INSIGHTS = [
  {
    title: 'Behavioural Patterns',
    heading: 'Repetitive behaviours are in control',
    status: 'Doing well',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#D66A8E',
    Icon: BehaviorIcon,
    bullets: [
      'Flexible with daily routines',
      'No repetitive behaviour concerns',
      'Transitions are manageable',
    ],
  },
  {
    title: 'Speech & Language',
    heading: 'Speech is improving',
    status: 'Doing great',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#3B8DBD',
    Icon: SpeechIcon,
    bullets: [
      'Clear communication for age',
      'Good back-and-forth conversation',
      'Vocabulary is on track',
    ],
  },
  {
    title: 'Social Connection',
    heading: 'Social skills are on track',
    status: 'Doing great',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#9651C8',
    Icon: SocialIcon,
    bullets: [
      'Enjoys playing with others',
      'Shares interests and toys',
      'Good eye contact and response',
    ],
  },
];

const DEVELOPMENT_DOMAINS = [
  {
    key: 'Social',
    label: 'Social',
    status: 'Doing well',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#9651C8',
    Icon: SocialIcon,
    strengths: [
      'Makes eye contact when spoken to or during play',
      'Shows interest in peers during group play',
    ],
    attention: [],
  },
  {
    key: 'Emotion',
    label: 'Emotional',
    status: 'Doing well',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#2BA8A6',
    Icon: EmotionIcon,
    strengths: [
      'Shows affection to caregivers',
      'Can express basic feelings',
    ],
    attention: [],
  },
  {
    key: 'Speech',
    label: 'Speech',
    status: 'Doing great',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#3B8DBD',
    Icon: SpeechIcon,
    strengths: [
      'Responds when spoken to and follows simple conversations',
      'Uses gestures to communicate needs',
    ],
    attention: [],
  },
  {
    key: 'Behavior',
    label: 'Behavioural',
    status: 'Doing great',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#D66A8E',
    Icon: BehaviorIcon,
    strengths: [
      'Follows simple instructions',
      'Engages in preferred activities',
    ],
    attention: [],
  },
  {
    key: 'Sensory',
    label: 'Sensory',
    status: 'Doing well',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#F4A261',
    Icon: SensoryIcon,
    strengths: [
      'Tolerates everyday sounds and textures',
      'Explores new environments with confidence',
    ],
    attention: [],
  },
  {
    key: 'Cognitive',
    label: 'Cognitive',
    status: 'Doing great',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#7D6CB7',
    Icon: CognitiveIcon,
    strengths: [
      'Good problem solving for familiar tasks',
      'Notices small changes',
    ],
    attention: [],
  },
];

const LEARN_MORE = [
  {
    title: 'Suggested strategies to improve sensory issues',
    expanded: true,
    body: 'Autism is a neurodevelopmental difference that affects how a person communicates, interacts with others, and experiences the world. It is present from early childhood, though signs may become noticeable at different ages. Every autistic person is unique, with their own strengths, challenges, and support needs.',
  },
  { title: 'What are the suggested next steps?', expanded: false },
  { title: 'What type of doctors should I visit?', expanded: false },
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

export default function NoAutismReportScreen({ navigation, route }: any) {
  const { scaleSize, padding } = useResponsive();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const screening = useScreening();

  const childName = route?.params?.childName ?? '';
  const score = route?.params?.score ?? 0;
  const total = route?.params?.total ?? 1;
  const result = route?.params?.result ?? '';
  const date = route?.params?.date ?? '';
  const screener = route?.params?.screener ?? '';
  const domainBreakdown = route?.params?.domainBreakdown;
  const isRepeat = route?.params?.isRepeat ?? false;
  const previousScore = route?.params?.previousScore ?? null;
  const progress = Math.min(1, Math.max(0, Number(score || 0) / Number(total || 1)));

  const prevScoreVal = previousScore?.totalScore != null ? Number(previousScore.totalScore) : undefined;
  const currentScoreVal = Number(score);
  const hasHistory = isRepeat && prevScoreVal !== undefined;

  let trendStatus = 'No Change';
  let trendStatusColor = '#6B7180';
  let trendStatusBg = '#F4F5F5';
  let isImproved = false;
  let percentChange = 0;

  if (hasHistory) {
    const diff = currentScoreVal - prevScoreVal;
    percentChange = Math.round((Math.abs(diff) / prevScoreVal) * 100);
    if (diff < 0) {
      trendStatus = 'Improved';
      trendStatusColor = '#1A7340';
      trendStatusBg = '#E8F7F0';
      isImproved = true;
    } else if (diff > 0) {
      trendStatus = 'Needs Attention';
      trendStatusColor = '#E25648';
      trendStatusBg = '#FDF0EB';
      isImproved = false;
    }
  }

  const prevDateStr = previousScore?.date ?? '';

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

  const resultColors = useMemo(() => getResultColors(result), [result]);
  const dynamicInsights = useMemo(() => {
    const built = buildDomainTopInsights(domainBreakdown, previousScore);
    return built.length ? built : INSIGHTS;
  }, [domainBreakdown, previousScore]);

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
      Social: 0.2,
      Emotion: 0.15,
      Speech: 0.25,
      Behavior: 0.2,
      Sensory: 0.15,
      Cognitive: 0.2,
    };
    return fallbacks[key] ?? 0.2;
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
    let scoreStr = '0/45';
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
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [expandedLearnMore, setExpandedLearnMore] = useState<number | null>(0);

  const handleShare = async () => {
    await generateScreeningReportPDF({ childName, score, total, result, date, screener, domainBreakdown, domainAnswers }, 'share');
  };

  const [domainTab, setDomainTab] = useState<Record<string, 'attention' | 'strengths'>>(() => {
    const initial: Record<string, 'attention' | 'strengths'> = {};
    domainsDetailWithScore.forEach((d) => {
      initial[d.key] = d.attention.length > 0 ? 'attention' : 'strengths';
    });
    return initial;
  });

  const toggleDomain = (key: string) => {
    setExpandedDomain((prev) => (prev === key ? null : key));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingHorizontal: padding, paddingVertical: scaleSize(10) }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={scaleSize(10)}>
          <BackArrow width={scaleSize(12)} height={scaleSize(21)} />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: scaleSize(16) }]}>{t('screeningReport')}</Text>
        <View style={{ width: scaleSize(12) }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: padding, paddingTop: scaleSize(4), paddingBottom: scaleSize(120), gap: scaleSize(16) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.overviewCard, { padding: scaleSize(12), borderRadius: scaleSize(24) }]}>
          <Text style={[styles.overviewTitle, { fontSize: scaleSize(16) }]}>{t('screeningOverviewForName', { name: childName })}</Text>
          <View style={styles.overviewMetaRow}>
            <View style={styles.metaItem}>
              <CalendarIcon width={scaleSize(16)} height={scaleSize(16)} />
              <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12) }]}>{date}</Text>
            </View>
            <View style={styles.metaItem}>
              <PersonIcon width={scaleSize(16)} height={scaleSize(16)} />
              <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12) }]}>{screener}</Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <View>
              <View style={styles.scoreLabelRow}>
                <Text style={[styles.scoreLabel, { fontSize: scaleSize(12) }]}>{t('score')} : </Text>
                <Text style={[styles.scoreValue, { fontSize: scaleSize(20) }]}>{score} / {total}</Text>
                <Text style={[styles.scoreAsterisk, { fontSize: scaleSize(14) }]}> *</Text>
              </View>
              <View style={[styles.resultBadge, { backgroundColor: resultColors.bg, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6), marginTop: scaleSize(6), borderWidth: 1, borderColor: resultColors.border }]}>
                <ResultFlagIcon width={scaleSize(14)} height={scaleSize(14)} fill={resultColors.fill} color={resultColors.fill} />
                <Text style={[styles.resultBadgeText, { fontSize: scaleSize(12), color: resultColors.text, marginLeft: scaleSize(4) }]}>{t(resultLabelKey)}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.progressTrack, { height: scaleSize(6), borderRadius: scaleSize(3), marginTop: scaleSize(10) }]}>
            <View style={{ width: `${progress * 100}%`, height: scaleSize(6), borderRadius: scaleSize(3), backgroundColor: '#1A7340' }} />
          </View>

          <View style={[styles.domainGrid, { marginTop: scaleSize(16), gap: scaleSize(12) }]}>
            <View style={styles.domainRow}>
              {domainsWithProgress.slice(0, 3).map((domain) => {
                const { Icon } = domain;
                const circleSize = scaleSize(70);
                const ringGap = scaleSize(3);
                const ringThickness = scaleSize(3);
                const ringSize = circleSize + ringThickness + ringGap * 2;
                return (
                  <View key={domain.key} style={styles.domainItem}>
                    <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color }]}>
                        <Icon width={scaleSize(30)} height={scaleSize(30)} />
                        <View style={[styles.checkmarkWrap, { width: scaleSize(20), height: scaleSize(20), borderRadius: scaleSize(10), bottom: scaleSize(0), right: scaleSize(0) }]}>
                          <Image source={CheckmarkIcon} style={{ width: scaleSize(20), height: scaleSize(20) }} resizeMode="contain" />
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.domainLabel, { fontSize: scaleSize(12), marginTop: scaleSize(6) }]}>{domain.label}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.domainRow}>
              {domainsWithProgress.slice(3, 6).map((domain) => {
                const { Icon } = domain;
                const circleSize = scaleSize(70);
                const ringGap = scaleSize(3);
                const ringThickness = scaleSize(3);
                const ringSize = circleSize + ringThickness + ringGap * 2;
                return (
                  <View key={domain.key} style={styles.domainItem}>
                    <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color }]}>
                        <Icon width={scaleSize(30)} height={scaleSize(30)} />
                        <View style={[styles.checkmarkWrap, { width: scaleSize(20), height: scaleSize(20), borderRadius: scaleSize(10), bottom: scaleSize(0), right: scaleSize(0) }]}>
                          <Image source={CheckmarkIcon} style={{ width: scaleSize(20), height: scaleSize(20) }} resizeMode="contain" />
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.domainLabel, { fontSize: scaleSize(12), marginTop: scaleSize(6) }]}>{domain.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={[styles.disclaimer, { fontSize: scaleSize(11), marginTop: scaleSize(10) }]}>
            {t('scoreDisclaimer')}
          </Text>
        </View>

        <View style={[styles.summaryCard, { paddingVertical: scaleSize(18), paddingHorizontal: scaleSize(16), borderRadius: scaleSize(20) }]}>
          <View style={styles.summaryHeader}>
            <View style={[styles.summaryIconBox, { width: scaleSize(56), height: scaleSize(56), borderRadius: scaleSize(14), backgroundColor: resultColors.bg }]}>
              <ResultFlagIcon width={scaleSize(28)} height={scaleSize(28)} fill={resultColors.fill} color={resultColors.fill} />
            </View>
            <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
              <Text style={[styles.summaryEyebrow, { fontSize: scaleSize(10), color: resultColors.text }]}>{t('screeningResult')}</Text>
              <Text style={[styles.summaryTitle, { fontSize: scaleSize(18), color: resultColors.text }]}>{t(resultLabelKey)}</Text>
              <Text style={[styles.summaryScore, { fontSize: scaleSize(12), marginTop: scaleSize(2) }]}>{score} / {total}</Text>
            </View>
          </View>
          <View style={[styles.summaryDivider, { marginVertical: scaleSize(10) }]} />
          <Text style={[styles.summaryBody, { fontSize: scaleSize(12) }]}>
            {t(resultDescKey, { name: childName })}
          </Text>
        </View>

        {hasHistory && (
          <View style={{ padding: scaleSize(16), borderRadius: scaleSize(16), backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E4E8' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scaleSize(16) }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: scaleSize(14), color: '#2D2A3A' }}>{t('scoreTrend')}</Text>
              <View style={{ backgroundColor: trendStatusBg, borderRadius: scaleSize(10), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3) }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: scaleSize(10), color: trendStatusColor }}>
                  {isImproved ? '↓ ' + t('improved') : '↑ ' + t('needsAttention')}
                </Text>
              </View>
            </View>

            <Svg width={width - scaleSize(64)} height={scaleSize(160)}>
              {(() => {
                const chartW = width - scaleSize(64);
                const x0 = scaleSize(40);
                const x1 = chartW - scaleSize(40);
                const minScore = Math.max(0, Math.min(prevScoreVal ?? 0, currentScoreVal) - 20);
                const maxScore = Math.max(prevScoreVal ?? currentScoreVal, currentScoreVal) + 20;
                const yFor = (val: number) => scaleSize(120) - ((val - minScore) / (maxScore - minScore)) * scaleSize(90);
                const y0 = yFor(prevScoreVal ?? 0);
                const y1 = yFor(currentScoreVal);
                return (
                  <G>
                    {[0.25, 0.5, 0.75].map((ratio) => (
                      <Line
                        key={ratio}
                        x1={scaleSize(35)}
                        y1={scaleSize(30) + ratio * scaleSize(90)}
                        x2={chartW - scaleSize(35)}
                        y2={scaleSize(30) + ratio * scaleSize(90)}
                        stroke="#E2E4E8"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                    ))}
                    <Line x1={x0} y1={y0} x2={x1} y2={y1} stroke={isImproved ? '#1A7340' : '#E25648'} strokeWidth={3} />
                    <Circle cx={x0} cy={y0} r={4} fill="#535BD8" />
                    <Circle cx={x1} cy={y1} r={4} fill={isImproved ? '#1A7340' : '#E25648'} />
                    <SvgText x={x0} y={scaleSize(140)} fill="#9E9EA0" fontSize={scaleSize(10)} textAnchor="middle">{prevDateStr.split(' ').slice(0, 2).join(' ')}</SvgText>
                    <SvgText x={x1} y={scaleSize(140)} fill={isImproved ? '#1A7340' : '#E25648'} fontSize={scaleSize(10)} fontWeight="bold" textAnchor="middle">{date.split(' ').slice(0, 2).join(' ')}</SvgText>
                  </G>
                );
              })()}
            </Svg>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: trendStatusBg, borderRadius: scaleSize(12), padding: scaleSize(12), marginTop: scaleSize(8), gap: scaleSize(8) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isImproved ? '#1A7340' : '#E25648', borderRadius: scaleSize(8), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(4), gap: scaleSize(2) }}>
                <Svg width={scaleSize(10)} height={scaleSize(10)} viewBox="0 0 10 10">
                  <Path d={isImproved ? "M2 8L5 2L8 8" : "M2 2L5 8L8 2"} stroke="#FFFFFF" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={{ color: '#FFFFFF', fontSize: scaleSize(11), fontFamily: 'Inter_700Bold' }}>{isImproved ? `-${percentChange}%` : `+${percentChange}%`}</Text>
              </View>
              <Text style={{ fontSize: scaleSize(12), color: '#18182D', fontFamily: 'Inter_600SemiBold', flex: 1 }}>{isImproved ? t('improvement') : t('needsAttentionLowercase')} {t('since')} {prevDateStr}</Text>
            </View>
          </View>
        )}

        <View style={[styles.infoCard, { padding: scaleSize(11), borderRadius: scaleSize(14) }]}>
          <View style={[styles.infoIconCircle, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22) }]}>
            <WarningIcon width={scaleSize(24)} height={scaleSize(24)} color="#18182D" />
          </View>
          <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(13), color: '#18182D' }]}>{t('screeningNotDiagnosis')}</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>
              {t('screeningNotDiagnosisBody')}
            </Text>
          </View>
        </View>

        <View style={{ position: 'relative' }}>
          <Text style={[styles.sectionTitle, { fontSize: scaleSize(16) }]}>{t('topInsights')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: scaleSize(12) }}>
          {dynamicInsights.map((insight, index) => {
            const { Icon } = insight;
            const isExpanded = expandedInsight === index;
            return (
              <Pressable
                key={insight.title}
                onPress={() => setExpandedInsight(isExpanded ? null : index)}
                style={[styles.insightCard, { paddingVertical: scaleSize(17), paddingHorizontal: scaleSize(15), borderRadius: scaleSize(16), width: scaleSize(280) }]}
              >
                <View style={styles.insightHeader}>
                  <View style={[styles.insightIconBox, { width: scaleSize(40), height: scaleSize(40), borderRadius: scaleSize(20), backgroundColor: insight.color }]}>
                    <Icon width={scaleSize(20)} height={scaleSize(20)} color="#fff" />
                  </View>
                  <View style={{ marginLeft: scaleSize(10), flex: 1 }}>
                    <Text style={[styles.insightTitle, { fontSize: scaleSize(11) }]}>{insight.title}</Text>
                    <View style={[styles.statusBadgeInline, { backgroundColor: insight.statusBg, borderRadius: scaleSize(12), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3), alignSelf: 'flex-start', marginTop: scaleSize(4) }]}>
                      <Text style={[styles.statusBadgeText, { fontSize: scaleSize(9), color: insight.statusColor }]}>{t(getStatusKey(insight.status))}</Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.insightHeading, { fontSize: scaleSize(14), marginTop: scaleSize(10) }]}>{insight.heading}</Text>
                <View style={{ marginTop: scaleSize(8), gap: scaleSize(4) }}>
                  {insight.bullets.map((b, i) => (
                    <Text key={i} style={[styles.bullet, { fontSize: scaleSize(11) }]}>• {b}</Text>
                  ))}
                </View>
              </Pressable>
            );
          })}
          </ScrollView>
        </View>

        <View>
          <Text style={[styles.sectionTitle, { fontSize: scaleSize(16), marginTop: scaleSize(8) }]}>{t('developmentByDomain')}</Text>
          <Text style={[styles.sectionSubtitle, { fontSize: scaleSize(12) }]}>{t('tapAnyDomain')}</Text>
        </View>

        {domainsDetailWithScore.map((domain) => {
          const { Icon } = domain;
          const expanded = expandedDomain === domain.key;
          return (
            <Pressable key={domain.key} onPress={() => toggleDomain(domain.key)} style={[styles.domainCard, { paddingVertical: scaleSize(14), paddingHorizontal: scaleSize(16), borderRadius: scaleSize(16), borderColor: expanded ? domain.color : '#E2E4E8' }]}>
              <View style={styles.domainCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.domainCardIconBox, { width: scaleSize(32), height: scaleSize(32), borderRadius: scaleSize(9), backgroundColor: domain.color }]}>
                    <Icon width={scaleSize(20)} height={scaleSize(20)} />
                  </View>
                  <Text style={[styles.domainCardLabel, { fontSize: scaleSize(16), marginLeft: scaleSize(12) }]}>{domain.label}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(8) }}>
                  <View style={[styles.statusBadge, { backgroundColor: domain.statusBg, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6) }]}>
                    <Text style={[styles.statusBadgeText, { fontSize: scaleSize(11), color: domain.statusColor }]}>{t(getStatusKey(domain.status))}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: scaleSize(13), color: '#2D2A3A' }}>{domain.score}</Text>
                  <ChevronDown width={scaleSize(16)} height={scaleSize(16)} style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }} />
                </View>
              </View>
              {expanded && (
                <View style={{ marginTop: scaleSize(12), gap: scaleSize(10) }}>
                  <View style={{ flexDirection: 'row', gap: scaleSize(8), marginBottom: scaleSize(4) }}>
                    <Pressable
                      onPress={() => setDomainTab((prev) => ({ ...prev, [domain.key]: 'attention' }))}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(6), paddingHorizontal: scaleSize(12), paddingVertical: scaleSize(8), borderRadius: scaleSize(24), backgroundColor: domainTab[domain.key] === 'attention' ? '#535BD8' : '#F3F2FF' }}
                    >
                      <WarningIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: scaleSize(12), color: domainTab[domain.key] === 'attention' ? '#FFFFFF' : '#2D2A3A' }}>{t('attentionAreas')} ({domain.attention.length})</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setDomainTab((prev) => ({ ...prev, [domain.key]: 'strengths' }))}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(6), paddingHorizontal: scaleSize(12), paddingVertical: scaleSize(8), borderRadius: scaleSize(24), backgroundColor: domainTab[domain.key] === 'strengths' ? '#1A7340' : '#F3F2FF' }}
                    >
                      <StarIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: scaleSize(12), color: domainTab[domain.key] === 'strengths' ? '#FFFFFF' : '#2D2A3A' }}>{t('areasWorkingWell')} ({domain.strengths.length})</Text>
                    </Pressable>
                  </View>

                  {domainTab[domain.key] === 'strengths' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(6) }}>
                      <StarIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: scaleSize(12), color: '#1A7340' }}>{t('heresWhatWorkingWell')}</Text>
                    </View>
                  )}

                  {(domainTab[domain.key] === 'attention' ? domain.attention : domain.strengths).map((item: string, idx: number) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(10), padding: scaleSize(12), borderRadius: scaleSize(12), backgroundColor: domainTab[domain.key] === 'attention' ? '#F6F6F8' : '#E8F7F0' }}>
                      <View style={[styles.numberCircle, { width: scaleSize(24), height: scaleSize(24), borderRadius: scaleSize(12), backgroundColor: domainTab[domain.key] === 'attention' ? domain.statusBg : '#FFFFFF' }]}>
                        <Text style={[styles.numberText, { fontSize: scaleSize(11), color: domainTab[domain.key] === 'attention' ? domain.statusColor : '#1A7340' }]}>{idx + 1}</Text>
                      </View>
                      <Text style={[styles.bulletText, { fontSize: scaleSize(12), flex: 1, lineHeight: scaleSize(18) }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}

        <Text style={[styles.sectionTitle, { fontSize: scaleSize(16), marginTop: scaleSize(8) }]}>{t('learnMoreAboutChild')}</Text>
        {LEARN_MORE.map((item, index) => {
          const isExpanded = expandedLearnMore === index;
          return (
            <Pressable
              key={index}
              onPress={() => setExpandedLearnMore(isExpanded ? null : index)}
              style={[styles.learnMoreCard, { paddingVertical: scaleSize(8), paddingHorizontal: scaleSize(16), borderRadius: scaleSize(16), borderColor: ['#535BD8', '#C63A82', '#7D6CB7'][index % 3] }]}
            >
              <View style={styles.learnMoreHeader}>
                <Text style={[styles.learnMoreTitle, { fontSize: scaleSize(13), flex: 1 }]}>{item.title}</Text>
                <View style={[styles.learnMoreToggle, { width: scaleSize(24), height: scaleSize(24), borderRadius: scaleSize(12), backgroundColor: isExpanded ? '#535BD8' : '#F3F2FF' }]}>
                  <Text style={{ color: isExpanded ? '#fff' : '#535BD8', fontSize: scaleSize(16), fontWeight: '600' }}>{isExpanded ? '−' : '+'}</Text>
                </View>
              </View>
              {isExpanded && item.body && (
                <Text style={[styles.learnMoreBody, { fontSize: scaleSize(12), marginTop: scaleSize(10) }]}>{item.body}</Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
        <View style={styles.footerRow}>
          <Pressable
            onPress={() => generateScreeningReportPDF({ childName, score, total, result, date, screener, domainBreakdown, domainAnswers }, 'download')}
            style={({ pressed }) => [styles.downloadBtn, { height: scaleSize(52), borderRadius: scaleSize(26), flex: 1, opacity: pressed ? 0.9 : 1 }]}
          >
            <Text style={[styles.downloadBtnText, { fontSize: scaleSize(16) }]}>{t('downloadReport')}</Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.shareBtn, { height: scaleSize(52), borderRadius: scaleSize(26), width: scaleSize(122), opacity: pressed ? 0.9 : 1 }]}
          >
            <ShareIcon width={scaleSize(20)} height={scaleSize(20)} />
            <Text style={[styles.shareBtnText, { fontSize: scaleSize(14), color: '#2D2A3A', marginLeft: scaleSize(6) }]}>{t('share')}</Text>
          </Pressable>
        </View>
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
  overviewMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  overviewMetaText: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  scoreLabelRow: { flexDirection: 'row', alignItems: 'baseline' },
  scoreLabel: { fontFamily: 'Inter_700Bold', color: '#6B7180' },
  scoreValue: { fontFamily: 'Inter_800ExtraBold', color: '#18182D' },
  scoreAsterisk: { fontFamily: 'Inter_800ExtraBold', color: '#6B7180' },
  resultBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  resultBadgeText: { fontFamily: 'Inter_700Bold' },
  progressTrack: { backgroundColor: '#E2E4E8' },
  domainGrid: {},
  domainRow: { flexDirection: 'row', justifyContent: 'space-around' },
  domainItem: { alignItems: 'center' },
  domainCircle: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  checkmarkWrap: { position: 'absolute', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  domainLabel: { fontFamily: 'Inter_600SemiBold', color: '#3B3B3E' },
  disclaimer: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  summaryCard: { backgroundColor: '#E8F7F0', gap: 0 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center' },
  summaryIconBox: { justifyContent: 'center', alignItems: 'center' },
  summaryEyebrow: { fontFamily: 'Inter_700Bold', color: '#1A7340', letterSpacing: 0.5 },
  summaryTitle: { fontFamily: 'Inter_800ExtraBold', color: '#1A7340' },
  summaryScore: { fontFamily: 'Inter_700Bold', color: '#6B7180' },
  summaryDivider: { height: 1, backgroundColor: 'rgba(26, 115, 64, 0.12)' },
  summaryBody: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  infoCard: { backgroundColor: 'rgba(243, 242, 255, 0.6)', flexDirection: 'row', alignItems: 'center' },
  infoIconCircle: { backgroundColor: '#E8E7FF', justifyContent: 'center', alignItems: 'center' },
  infoTitle: { fontFamily: 'Inter_700Bold', color: '#535BD8' },
  infoBody: { fontFamily: 'Inter_400Regular', color: '#6B7180', lineHeight: 18 },
  sectionTitle: { fontFamily: 'Inter_800ExtraBold', color: '#18182D' },
  sectionSubtitle: { fontFamily: 'Inter_400Regular', color: '#6B7180', marginTop: 4 },
  insightCard: { backgroundColor: '#F8F8FF', borderWidth: 1, borderColor: '#E2E4E8' },
  insightHeader: { flexDirection: 'row', alignItems: 'center' },
  insightIconBox: { justifyContent: 'center', alignItems: 'center' },
  insightTitle: { fontFamily: 'Inter_600SemiBold', color: '#6B7180' },
  insightHeading: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  statusBadgeInline: { justifyContent: 'center', alignItems: 'center' },
  statusBadge: { justifyContent: 'center', alignItems: 'center' },
  statusBadgeText: { fontFamily: 'Inter_700Bold' },
  bullet: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  domainCard: { backgroundColor: '#F8F8FF', borderWidth: 1, borderColor: '#E2E4E8' },
  domainCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  domainCardIconBox: { justifyContent: 'center', alignItems: 'center' },
  domainCardLabel: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  subTab: { justifyContent: 'center' },
  subTabText: { fontFamily: 'Inter_600SemiBold' },
  numberedItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  numberCircle: { justifyContent: 'center', alignItems: 'center' },
  numberText: { fontFamily: 'Inter_700Bold' },
  bulletText: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  learnMoreCard: { backgroundColor: '#F8F8FF', borderWidth: 1, borderColor: '#E2E4E8' },
  learnMoreHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  learnMoreTitle: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  learnMoreToggle: { justifyContent: 'center', alignItems: 'center' },
  learnMoreBody: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  askButton: {},
  askButtonText: { fontFamily: 'Inter_700Bold', color: '#535BD8' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  downloadBtn: { backgroundColor: colors.primaryBlue, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  downloadBtnText: { fontFamily: 'Inter_700Bold', color: colors.white },
  shareBtn: { backgroundColor: '#F3F2FF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#E2E4E8' },
  shareBtnText: { fontFamily: 'Inter_700Bold', color: '#2D2A3A' },
});
