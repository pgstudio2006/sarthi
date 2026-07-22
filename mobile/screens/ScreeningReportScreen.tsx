import React, { useState, useMemo, useEffect } from 'react';
import { getDynamicFAQs } from '../utils/qaLogic';
import { getAiFaqs, AiFaq } from '../api/client';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  useWindowDimensions,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScreening } from '../context/ScreeningContext';
import Svg, { Line, Circle, Path, Rect, Text as SvgText, G } from 'react-native-svg';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useTranslation } from '../i18n';
import { generateScreeningReportPDF } from '../utils/reportPdf';
import ProgressRing from '../components/ProgressRing';
import GradientBorderCard from '../components/GradientBorderCard';
import BackArrow from '../assets/figma/screen18/Vector.svg';
import CalendarIcon from '../assets/figma/screen28/calendar_month.svg';
import WarningIcon from '../assets/figma/screen28/Frame-1.svg';
import FlagIcon from '../assets/figma/screen28/Frame-10.svg';
import DownloadIcon from '../assets/figma/screen28/Frame-3.svg';
import ShareIcon from '../assets/figma/screen28/Frame-8.svg';
import ChevronDown from '../assets/figma/screen28/Frame-4.svg';
import ChevronUp from '../assets/figma/screen28/Frame-6.svg';
import Article1Icon from '../assets/figma/screen28/Frame-2.svg';
import CheckmarkIcon from '../assets/figma/screen28/Checkmark1.png';
import StarIcon from '../assets/figma/screen28/kid_star.svg';

import SocialIcon from '../assets/figma/screen28/Frame-7.svg';
import EmotionIcon from '../assets/figma/screen28/Frame-5.svg';
import SpeechIcon from '../assets/figma/screen28/Frame-15.svg';
import BehaviorIcon from '../assets/figma/screen28/Frame-14.svg';
import SensoryIcon from '../assets/figma/screen28/Frame-13.svg';
import CognitiveIcon from '../assets/figma/screen28/Frame-11.svg';

const DOMAINS_OVERVIEW = [
  { key: 'Social', label: 'Social', Icon: SocialIcon, color: '#9651C8', progress: 0.75, ringColor: '#B87FE5' },
  { key: 'Emotion', label: 'Emotion', Icon: EmotionIcon, color: '#2BA8A6', progress: 0.6, ringColor: '#4ECDC4' },
  { key: 'Speech', label: 'Speech', Icon: SpeechIcon, color: '#3B8DBD', progress: 0.85, ringColor: '#6BADD6' },
  { key: 'Behavior', label: 'Behaviour', Icon: BehaviorIcon, color: '#D66A8E', progress: 0.7, ringColor: '#F28FAD' },
  { key: 'Sensory', label: 'Sensory', Icon: SensoryIcon, color: '#F4A261', progress: 1, ringColor: '#F7B37E' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#7D6CB7', progress: 0, ringColor: 'transparent' },
];

const DOMAINS_DETAIL = [
  {
    key: 'Social',
    label: 'Social',
    Icon: SocialIcon,
    color: '#9651C8',
    score: '31/45',
    status: 'Needs more support',
    statusColor: '#E25648',
    statusBg: '#FDF0EB',
    attention: [
      'Makes eye contact when spoken to or during play',
      'Names basic emotions like happy, sad, angry, scared?',
    ],
    strengths: [
      'Reacts when spoken to and follows simple conversations',
      'Shows interest in peers during group play',
      'Uses gestures to communicate needs',
    ],
  },
  {
    key: 'Emotion',
    label: 'Emotional',
    Icon: EmotionIcon,
    color: '#2BA8A6',
    score: '38/45',
    status: 'Needs extra support',
    statusColor: '#E25648',
    statusBg: '#FDF0EB',
    attention: [
      'Makes eye contact when spoken to or during play',
      'Name basic emotions like happy, sad, angry, scared?',
    ],
    strengths: [
      'Shows affection to caregivers',
      'Can express basic feelings',
      'Regulates with support',
    ],
  },
  {
    key: 'Speech',
    label: 'Speech',
    Icon: SpeechIcon,
    color: '#3B8DBD',
    score: '31/45',
    status: 'Making progress',
    statusColor: '#3B8DBD',
    statusBg: '#D6EDF9',
    attention: [
      'Uses single words',
      'Limited two-word combinations',
    ],
    strengths: [
      'Makes eye contact when spoken to or during play',
      'Name basic emotions like happy, sad, angry, scared?',
      'Responds when spoken to and follows simple conversations',
    ],
  },
  {
    key: 'Behavior',
    label: 'Behavioural',
    Icon: BehaviorIcon,
    color: '#D66A8E',
    score: '28/45',
    status: 'Needs support',
    statusColor: '#E25648',
    statusBg: '#FDF0EB',
    attention: [
      'Repetitive hand movements present',
      'Strong preference for routines',
      'Sensory seeking behaviours',
    ],
    strengths: [
      'Follows simple instructions',
      'Engages in preferred activities',
      'Responds to positive reinforcement',
    ],
  },
  {
    key: 'Sensory',
    label: 'Sensory',
    Icon: SensoryIcon,
    color: '#F4A261',
    score: '33/45',
    status: 'Doing well',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    attention: [
      'Covers ears to loud sounds',
      'Avoids certain textures',
    ],
    strengths: [
      'Seeks movement activities',
      'Enjoys deep pressure input',
      'Explores new textures with support',
    ],
  },
  {
    key: 'Cognitive',
    label: 'Cognitive',
    Icon: CognitiveIcon,
    color: '#7D6CB7',
    score: '33/45',
    status: 'Doing great',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    attention: [
      'Needs support with problem solving',
    ],
    strengths: [
      'Good problem solving for familiar tasks',
      'Notices small changes',
      'Plays with cause-and-effect toys',
    ],
  },
];

const INSIGHTS = [
  {
    title: 'Behavioural Patterns',
    heading: 'Repetitive behaviours\nare in control',
    status: 'Doing well',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    color: '#D66A8E',
    Icon: BehaviorIcon,
    bullets: [
      'Lorem Ipsum lorem Ipsum',
      'Lorem Ipsum lorem Ipsum',
      'More restrictive behaviours observed.',
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
      '+12% from last screening.',
      'Better communication outcomes observed',
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
      '+12% from last screening.',
      'Better communication outcomes observed',
    ],
  },
];

const ARTICLES = [
  {
    title: 'Suggested strategies to improve sensory issues',
    Icon: SensoryIcon,
    body: 'Autism is a neurodevelopmental difference that affects how a person communicates, interacts with others, and experiences the world. It is present from early childhood, though signs may become noticeable at different ages. Every autistic person is unique, with their own strengths, challenges, and support needs.',
    cta: 'Ask Saarathi Care →',
  },
  {
    title: 'What are the suggested next steps?',
    Icon: Article1Icon,
    body: '',
    cta: '',
  },
  {
    title: 'What type of doctors should I visit?',
    Icon: Article1Icon,
    body: '',
    cta: '',
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
    "How often does the child smell, touch, or taste people or objects in unusual ways?"
  ],
  Cognitive: [
    "How often does the child have difficulty staying focused on an activity?",
    "How often does the child take much longer than expected to respond when spoken to?",
    "How often does the child remember unusual details much better than expected?",
    "How often does the child show an exceptional skill that is much stronger than expected for their age?"
  ]
};

export default function ScreeningReportScreen({ navigation, route }: any) {
  const { scaleSize, padding } = useResponsive();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const cardWidth = width - scaleSize(32) - scaleSize(48);
  const screening = useScreening();

  const childName = route?.params?.childName ?? '';
  const score = route?.params?.score ?? 0;
  const total = route?.params?.total ?? 1;
  const result = route?.params?.result ?? '';
  const date = route?.params?.date ?? '';
  const screener = route?.params?.screener ?? '';
  const domainBreakdown = route?.params?.domainBreakdown;
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

  const isRepeat = route?.params?.isRepeat ?? false;
  const previousScore = route?.params?.previousScore ?? null;

  // Answers source: route params or context
  const contextAnswers = screening?.domainAnswers || {};
  const routeAnswers = route?.params?.domainAnswers;
  const domainAnswers = routeAnswers || contextAnswers;

  // Trend logic
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

  const isDomainOnTrack = (key: string) => {
    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === key);
      if (bd) {
        const statusLower = (bd.status ?? '').toLowerCase();
        return statusLower.includes('great') || statusLower.includes('well');
      }
    }
    if (result === 'Mild Autism' && key === 'Cognitive') return true;
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
    if (result === 'Mild Autism') {
      const fallbacks: Record<string, number> = {
        Social: 0.75,
        Emotion: 0.6,
        Speech: 0.85,
        Behavior: 0.7,
        Sensory: 0.8,
        Cognitive: 0,
      };
      return fallbacks[key] ?? 0.7;
    }
    return 0.7;
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

  const domainsDetailWithScore = DOMAINS_DETAIL.map((d) => {
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
          // If answer is 2, 3, or 4 (Often, Most, Always), it's an attention area.
          // If answer is 0 or 1 (Rarely, Sometimes), it's a strength / area working well.
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

  const [expanded, setExpanded] = useState<string[]>([]);
  const toggle = (key: string) =>
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const [activeInsight, setActiveInsight] = useState(0);
  const insightGap = scaleSize(12);
  const insightSnap = cardWidth + insightGap;

  const dynamicInsights = useMemo(() => {
    if (!domainBreakdown || domainBreakdown.length === 0) {
      return [
        {
          title: 'Social Interaction',
          heading: 'Social communication is developing',
          status: 'Doing well',
          statusColor: '#1A7340',
          statusBg: '#E8F7F0',
          color: '#9651C8',
          Icon: SocialIcon,
          bullets: [
            'Responds to name and makes eye contact occasionally.',
            'Encourage more interactive turn-taking games.',
            'Practice social play in structured environments.'
          ],
        },
        {
          title: 'Speech & Language',
          heading: 'Language development guidance',
          status: 'Needs support',
          statusColor: '#D97706',
          statusBg: '#FEF3C7',
          color: '#3B8DBD',
          Icon: SpeechIcon,
          bullets: [
            'Expressive vocabulary is developing slowly.',
            'Use visual schedules and pictures to prompt speech.',
            'Sing songs and repeat common words during playtime.'
          ],
        },
        {
          title: 'Behavioural Patterns',
          heading: 'Routines and play patterns',
          status: 'Doing well',
          statusColor: '#1A7340',
          statusBg: '#E8F7F0',
          color: '#D66A8E',
          Icon: BehaviorIcon,
          bullets: [
            'Adapts well to structured daily routines.',
            'Introduce slight changes in play to support flexibility.',
            'Provide sensory-friendly items during transitions.'
          ],
        }
      ];
    }

    const cards: any[] = [];

    // 1. Social Card
    const socialDb = domainBreakdown.find((b: any) => b.key === 'Social');
    if (socialDb) {
      const needsSupport = (socialDb.status ?? '').toLowerCase().includes('need') || Number(socialDb.score || 0) > (Number(socialDb.maxScore || 0) * 0.4);
      cards.push({
        title: 'Social Interaction',
        heading: needsSupport ? 'Social interaction needs support' : 'Social interaction is on track',
        status: socialDb.status,
        statusColor: socialDb.statusColor || (needsSupport ? '#D97706' : '#1A7340'),
        statusBg: socialDb.statusBg || (needsSupport ? '#FEF3C7' : '#E8F7F0'),
        color: '#9651C8',
        Icon: SocialIcon,
        bullets: needsSupport
          ? [
              'Shows occasional avoidance of eye contact and direct social interaction.',
              'Focus on structured one-on-one activities to ease social anxiety.',
              'Use simple gestures and facial expressions to prompt reciprocal responses.'
            ]
          : [
              'Comfortably responds to smiles and joins others in play.',
              'Continue supporting interactive play with children of similar age.',
              'Celebrate their positive interactions and social engagement.'
            ]
      });
    }

    // 2. Speech Card
    const speechDb = domainBreakdown.find((b: any) => b.key === 'Speech');
    const prevSpeechDb = previousScore?.domainBreakdown?.find((b: any) => b.key === 'Speech');
    if (speechDb) {
      const needsSupport = (speechDb.status ?? '').toLowerCase().includes('need') || Number(speechDb.score || 0) > (Number(speechDb.maxScore || 0) * 0.4);
      const isImproved = prevSpeechDb ? Number(speechDb.score || 0) < Number(prevSpeechDb.score || 0) : false;
      cards.push({
        title: 'Speech & Language',
        heading: isImproved
          ? 'Speech and language is improving'
          : needsSupport
          ? 'Communication channels need support'
          : 'Speech & language is on track',
        status: speechDb.status,
        statusColor: speechDb.statusColor || (needsSupport ? '#D97706' : '#1A7340'),
        statusBg: speechDb.statusBg || (needsSupport ? '#FEF3C7' : '#E8F7F0'),
        color: '#3B8DBD',
        Icon: SpeechIcon,
        bullets: isImproved
          ? [
              'Positive reduction in speech delay markers since the last screening.',
              'Consistent therapy and home practice are producing positive outcomes.',
              'Continue language modeling and labeling everyday items.'
            ]
          : needsSupport
          ? [
              'Speech delay signals or repetitive sounds observed.',
              'Incorporate visual cards and options to help express immediate needs.',
              'Read books together and highlight keywords with emphasis.'
            ]
          : [
              'Meets language and verbal expression milestones appropriately.',
              'Encourage complex sentences and back-and-forth storytelling.',
              'Involve them in interactive conversation during regular routines.'
            ]
      });
    }

    // 3. Behavior Card
    const behaviorDb = domainBreakdown.find((b: any) => b.key === 'Behavior');
    if (behaviorDb) {
      const needsSupport = (behaviorDb.status ?? '').toLowerCase().includes('need') || Number(behaviorDb.score || 0) > (Number(behaviorDb.maxScore || 0) * 0.4);
      cards.push({
        title: 'Behavioral Patterns',
        heading: needsSupport ? 'Repetitive patterns need guidance' : 'Daily behaviors are well-balanced',
        status: behaviorDb.status,
        statusColor: behaviorDb.statusColor || (needsSupport ? '#D97706' : '#1A7340'),
        statusBg: behaviorDb.statusBg || (needsSupport ? '#FEF3C7' : '#E8F7F0'),
        color: '#D66A8E',
        Icon: BehaviorIcon,
        bullets: needsSupport
          ? [
              'Repetitive movements or high attachment to routines observed.',
              'Use visual timetables to provide structure and ease transition stress.',
              'Introduce tiny modifications to their favorite routines gradually.'
            ]
          : [
              'Adapts easily to changes and plays flexibly with toys.',
              'Provide safe and diverse play environments to expand interests.',
              'Encourage imaginative pretend play to build creative flexibility.'
            ]
      });
    }

    return cards;
  }, [domainBreakdown, previousScore]);

  const completedCount = route?.params?.completedCount ?? (isRepeat ? 2 : 1);
  const priorityDomains = useMemo(() => {
    if (!domainBreakdown) return [];
    return domainBreakdown
      .filter((b: any) => (b.status ?? '').toLowerCase().includes('need'))
      .map((b: any) => b.key);
  }, [domainBreakdown]);

  const [reportFAQs, setReportFAQs] = useState<AiFaq[]>(() =>
    getDynamicFAQs(completedCount, false, priorityDomains)
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
  }, [childId, completedCount, priorityDomains]);

  const [domainTab, setDomainTab] = useState<Record<string, 'attention' | 'strengths'>>(() => {
    const initial: Record<string, 'attention' | 'strengths'> = {};
    domainsDetailWithScore.forEach((d) => {
      initial[d.key] = d.attention.length ? 'attention' : 'strengths';
    });
    return initial;
  });

  const [openReportFaq, setOpenReportFaq] = useState<number | null>(0);

  const handleShare = async () => {
    try {
      const shareResult = await Share.share({
        message: t('shareReportMessage', { name: childName, result: t(resultLabelKey), score: String(score), total: String(total), date }),
      });
      if (shareResult.action === Share.sharedAction) {
        if (shareResult.activityType) {
          // shared with activity type
        } else {
          // shared
        }
      } else if (shareResult.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingHorizontal: padding, paddingVertical: scaleSize(10) }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.8 : 1 }]}
        >
          <BackArrow width={scaleSize(12)} height={scaleSize(21)} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={[styles.headerTitle, { fontSize: scaleSize(16) }]}>{t('screeningReport')}</Text>
          <View style={styles.dateRow}>
            <CalendarIcon width={scaleSize(14)} height={scaleSize(14)} />
            <Text style={[styles.dateText, { fontSize: scaleSize(12) }]}>{date}</Text>
          </View>
        </View>
        <View style={{ width: scaleSize(40) }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: padding,
          paddingTop: scaleSize(4),
          paddingBottom: scaleSize(120),
          gap: scaleSize(16),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.overviewCard, { padding: scaleSize(12), borderRadius: scaleSize(24) }]}>
          <View style={[styles.overviewHeader, { paddingBottom: scaleSize(10) }]}>
            <Text style={[styles.overviewTitle, { fontSize: scaleSize(14) }]}>{t('screeningOverviewForName', { name: childName })}</Text>
            <View style={styles.overviewMetaRow}>
              <View style={styles.metaItem}>
                <CalendarIcon width={scaleSize(16)} height={scaleSize(16)} />
                <Text style={[styles.metaText, { fontSize: scaleSize(12) }]}>{date}</Text>
              </View>
              <View style={styles.metaItem}>
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
            <View style={[styles.resultBadge, { borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6) }]}>
              <FlagIcon width={scaleSize(14)} height={scaleSize(14)} fill="#BB853E" color="#BB853E" />
              <Text style={[styles.resultBadgeText, { fontSize: scaleSize(12) }]}>{t(resultLabelKey)}</Text>
            </View>
          </View>

          <View style={[styles.progressTrack, { height: scaleSize(6), borderRadius: scaleSize(3), marginTop: scaleSize(8) }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, height: scaleSize(6), borderRadius: scaleSize(3) }]} />
          </View>

          <Text style={[styles.disclaimer, { fontSize: scaleSize(12), marginTop: scaleSize(8) }]}>
            {t('scoreDisclaimer')}
          </Text>

          <View style={[styles.domainGrid, { marginTop: scaleSize(12), gap: scaleSize(12) }]}>
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <View key={rowIndex} style={[styles.domainRow, { gap: scaleSize(12) }]}>
                {domainsWithProgress.slice(rowIndex * 3, rowIndex * 3 + 3).map((domain) => {
                  const { Icon } = domain;
                  const circleSize = scaleSize(70);
                  const ringGap = scaleSize(3);
                  const ringThickness = scaleSize(3);
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
                            <Icon width={scaleSize(30)} height={scaleSize(30)} />
                          </View>
                        </View>
                      ) : (
                        <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
                          <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color }]}>
                            <Icon width={scaleSize(30)} height={scaleSize(30)} />
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

        <View style={[styles.resultCard, { padding: scaleSize(14), borderRadius: scaleSize(20) }]}>
          <View style={styles.resultCardHeader}>
            <View style={[styles.resultIconBox, { width: scaleSize(56), height: scaleSize(56), borderRadius: scaleSize(14) }]}>
              <FlagIcon width={scaleSize(28)} height={scaleSize(28)} />
            </View>
            <View style={styles.resultCardTitles}>
              <Text style={[styles.resultCardEyebrow, { fontSize: scaleSize(10) }]}>{t('screeningResult')}</Text>
              <Text style={[styles.resultCardResult, { fontSize: scaleSize(18) }]}>{t(resultLabelKey)}</Text>
              <Text style={[styles.resultCardScore, { fontSize: scaleSize(12) }]}>{score} / {total}</Text>
            </View>
          </View>
          <View style={[styles.resultDivider, { height: scaleSize(1), marginVertical: scaleSize(10) }]} />
          <Text style={[styles.resultDescription, { fontSize: scaleSize(12) }]}>
            {t(resultDescKey, { name: childName })}
          </Text>
        </View>

        <View style={[styles.infoCard, { padding: scaleSize(10), borderRadius: scaleSize(14) }]}>
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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scaleSize(16) }]}>{t('topInsights')}</Text>
          {hasHistory && (
            <View style={[styles.trendCard, { padding: scaleSize(16), borderRadius: scaleSize(16), backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E4E8', marginBottom: scaleSize(16) }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scaleSize(16) }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: scaleSize(14), color: '#2D2A3A' }}>{t('scoreTrend')}</Text>
                <View style={[styles.trendBadge, { backgroundColor: trendStatusBg, borderRadius: scaleSize(10), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3), flexDirection: 'row', alignItems: 'center' }]}>
                  <Text style={[styles.trendBadgeText, { fontSize: scaleSize(10), color: trendStatusColor, fontFamily: 'Inter_700Bold' }]}>
                    {isImproved ? '↓ ' + t('improved') : '↑ ' + t('needsAttention')}
                  </Text>
                </View>
              </View>

              {/* SVG Trend Chart */}
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={width - scaleSize(64)} height={scaleSize(200)}>
                  {/* Draw Grid Lines & Y labels */}
                  {[70, 90, 110, 130].map((val) => {
                    const yVal = scaleSize(165) - ((val - 60) / 80) * scaleSize(120);
                    return (
                      <G key={val}>
                        <Line
                          x1={scaleSize(35)}
                          y1={yVal}
                          x2={width - scaleSize(84)}
                          y2={yVal}
                          stroke="#E2E4E8"
                          strokeWidth={1}
                          strokeDasharray="4 4"
                        />
                        <SvgText
                          x={scaleSize(25)}
                          y={yVal + 3}
                          fill="#9E9EA0"
                          fontSize={scaleSize(10)}
                          textAnchor="end"
                          fontFamily="Inter_500Medium"
                        >
                          {val}
                        </SvgText>
                      </G>
                    );
                  })}

                  {/* X Coordinates */}
                  {(() => {
                    const x0 = scaleSize(35);
                    const plotW = (width - scaleSize(84)) - x0;
                    const interval = plotW / 3;
                    const x1 = x0 + interval;
                    const x2 = x0 + 2 * interval;
                    const x3 = x0 + plotW;

                    const y0 = scaleSize(165) - ((92 - 60) / 80) * scaleSize(120);
                    const y1 = scaleSize(165) - ((98 - 60) / 80) * scaleSize(120);
                    const y2 = scaleSize(165) - (((prevScoreVal ?? 104) - 60) / 80) * scaleSize(120);
                    const y3 = scaleSize(165) - (((currentScoreVal ?? 83) - 60) / 80) * scaleSize(120);

                    const renderScoreBadge = (bx: number, by: number, title: string, scoreVal: number, badgeColor: string) => {
                      const badgeW = scaleSize(40);
                      const badgeH = scaleSize(24);
                      return (
                        <G>
                          <Rect
                            x={bx - badgeW / 2}
                            y={by - badgeH - scaleSize(10)}
                            width={badgeW}
                            height={badgeH}
                            rx={scaleSize(6)}
                            ry={scaleSize(6)}
                            fill={badgeColor}
                          />
                          <SvgText
                            x={bx}
                            y={by - badgeH - scaleSize(10) + scaleSize(8)}
                            fill="#FFFFFF"
                            fontSize={scaleSize(7)}
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {title}
                          </SvgText>
                          <SvgText
                            x={bx}
                            y={by - badgeH - scaleSize(10) + scaleSize(18)}
                            fill="#FFFFFF"
                            fontSize={scaleSize(9)}
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {scoreVal}
                          </SvgText>
                          <Path
                            d={`M ${bx - 3} ${by - scaleSize(10)} L ${bx + 3} ${by - scaleSize(10)} L ${bx} ${by - scaleSize(6)} Z`}
                            fill={badgeColor}
                          />
                        </G>
                      );
                    };

                    return (
                      <G>
                        {/* Connecting lines */}
                        <Line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#535BD8" strokeWidth={2} />
                        <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#535BD8" strokeWidth={2} />
                        <Line x1={x2} y1={y2} x2={x3} y2={y3} stroke={isImproved ? '#1A7340' : '#E25648'} strokeWidth={3} />

                        {/* Dots */}
                        <Circle cx={x0} cy={y0} r={3} fill="#535BD8" />
                        <Circle cx={x1} cy={y1} r={3} fill="#535BD8" />
                        
                        <Circle cx={x2} cy={y2} r={5} fill="#535BD8" />
                        <Circle cx={x2} cy={y2} r={8} stroke="rgba(83, 91, 216, 0.2)" strokeWidth={3} fill="none" />

                        <Circle cx={x3} cy={y3} r={5} fill={isImproved ? '#1A7340' : '#E25648'} />
                        <Circle cx={x3} cy={y3} r={8} stroke={isImproved ? 'rgba(26, 115, 64, 0.2)' : 'rgba(226, 86, 72, 0.2)'} strokeWidth={3} fill="none" />

                        {/* X Axis Labels */}
                        <SvgText x={x0} y={scaleSize(185)} fill="#9E9EA0" fontSize={scaleSize(10)} textAnchor="middle">Oct '25</SvgText>
                        <SvgText x={x1} y={scaleSize(185)} fill="#9E9EA0" fontSize={scaleSize(10)} textAnchor="middle">Jan '26</SvgText>
                        <SvgText x={x2} y={scaleSize(185)} fill="#535BD8" fontSize={scaleSize(10)} fontWeight="bold" textAnchor="middle">2 Jun</SvgText>
                        <SvgText x={x3} y={scaleSize(185)} fill={isImproved ? '#1A7340' : '#E25648'} fontSize={scaleSize(10)} fontWeight="bold" textAnchor="middle">
                          {date.split(' ').slice(0, 2).join(' ')}
                        </SvgText>

                        {/* Floating Badges */}
                        {renderScoreBadge(x2, y2, t('test1'), prevScoreVal ?? 104, '#535BD8')}
                        {renderScoreBadge(x3, y3, t('test2'), currentScoreVal ?? 83, isImproved ? '#1A7340' : '#E25648')}
                      </G>
                    );
                  })()}
                </Svg>
              </View>

              {/* Improvement Summary Block */}
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: trendStatusBg, borderRadius: scaleSize(12), padding: scaleSize(12), marginTop: scaleSize(8), gap: scaleSize(8) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isImproved ? '#1A7340' : '#E25648', borderRadius: scaleSize(8), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(4), gap: scaleSize(2) }}>
                  <Svg width={scaleSize(10)} height={scaleSize(10)} viewBox="0 0 10 10">
                    <Path
                      d={isImproved ? "M2 8L5 2L8 8" : "M2 2L5 8L8 2"}
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text style={{ color: '#FFFFFF', fontSize: scaleSize(11), fontFamily: 'Inter_700Bold' }}>
                    {isImproved ? `-${percentChange}%` : `+${percentChange}%`}
                  </Text>
                </View>
                <Text style={{ fontSize: scaleSize(12), color: '#18182D', fontFamily: 'Inter_600SemiBold', flex: 1 }}>
                  {isImproved ? t('improvement') : t('needsAttentionLowercase')} {t('since')} {prevDateStr}
                </Text>
              </View>
            </View>
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={insightSnap}
            contentContainerStyle={{ gap: insightGap, paddingRight: scaleSize(16) }}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / insightSnap);
              setActiveInsight(Math.max(0, Math.min(dynamicInsights.length - 1, idx)));
            }}
          >
            {dynamicInsights.map((insight, index) => {
              const { Icon } = insight;
              return (
                <View key={insight.title + index} style={[styles.insightCard, { width: cardWidth, borderRadius: scaleSize(16), padding: scaleSize(12) }]}>
                  <View style={[styles.insightHeader, { gap: scaleSize(12) }]}>
                    <View style={[styles.insightIconBox, { width: scaleSize(48), height: scaleSize(48), borderRadius: scaleSize(13), backgroundColor: insight.color }]}>
                      <Icon width={scaleSize(24)} height={scaleSize(24)} />
                    </View>
                    <View style={{ flex: 1, gap: scaleSize(4) }}>
                      <Text style={[styles.insightTitle, { fontSize: scaleSize(14) }]}>{insight.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: insight.statusBg, borderRadius: scaleSize(10), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3), alignSelf: 'flex-start' }]}>
                        <Text style={[styles.statusBadgeText, { fontSize: scaleSize(10), color: insight.statusColor }]}>{t(getStatusKey(insight.status))}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.insightHeading, { fontSize: scaleSize(14), lineHeight: scaleSize(20) }]}>{insight.heading}</Text>
                  {insight.bullets.map((bullet: string, idx: number) => (
                    <View key={idx} style={styles.bulletRow}>
                      <View style={[styles.bullet, { width: scaleSize(6), height: scaleSize(6), borderRadius: scaleSize(3), backgroundColor: insight.statusColor }]} />
                      <Text style={[styles.bulletText, { fontSize: scaleSize(12), lineHeight: scaleSize(18) }]}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.dotsRow}>
            {dynamicInsights.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === activeInsight && styles.dotActive,
                  { width: scaleSize(8), height: scaleSize(8), borderRadius: scaleSize(4) },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scaleSize(16) }]}>{t('developmentByDomain')}</Text>
          <Text style={[styles.sectionSubtitle, { fontSize: scaleSize(12), marginBottom: scaleSize(8) }]}>
            {t('tapAnyDomain')}
          </Text>
          <View style={[styles.domainList, { gap: scaleSize(12) }]}>
            {domainsDetailWithScore.map((domain) => {
              const { Icon } = domain;
              const open = expanded.includes(domain.key);
              const tab = domainTab[domain.key];
              const items = tab === 'attention' ? domain.attention : domain.strengths;
              return (
                <View
                  key={domain.key}
                  style={[styles.domainRowCard, { padding: scaleSize(12), borderRadius: scaleSize(14), borderColor: open ? domain.color : 'rgba(0,0,0,0.08)' }]}
                >
                  <Pressable onPress={() => toggle(domain.key)} style={styles.domainRowHead}>
                    <View style={[styles.domainSmallIconBox, { backgroundColor: domain.color }]}>
                      <Icon width={scaleSize(18)} height={scaleSize(18)} />
                    </View>
                    <Text style={[styles.domainRowTitle, { fontSize: scaleSize(15) }]}>{domain.label}</Text>
                    <View style={styles.domainRowRight}>
                      <View style={[styles.statusBadge, { backgroundColor: domain.statusBg, borderRadius: scaleSize(10), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3) }]}>
                        <Text style={[styles.statusBadgeText, { fontSize: scaleSize(10), color: domain.statusColor }]}>{t(getStatusKey(domain.status))}</Text>
                      </View>
                      <Text style={[styles.domainScore, { fontSize: scaleSize(13) }]}>{domain.score}</Text>
                      {open ? <ChevronUp width={scaleSize(18)} height={scaleSize(18)} /> : <ChevronDown width={scaleSize(18)} height={scaleSize(18)} />}
                    </View>
                  </Pressable>
                  {open && (
                    <View style={[styles.domainDetails, { paddingTop: scaleSize(12) }]}>
                      <View style={styles.domainTabs}>
                        <Pressable
                          onPress={() => setDomainTab((prev) => ({ ...prev, [domain.key]: 'attention' }))}
                          style={[
                            styles.domainTab,
                            tab === 'attention' && styles.domainTabActive,
                          ]}
                        >
                          <WarningIcon width={scaleSize(14)} height={scaleSize(14)} />
                          <Text style={styles.domainTabText}>{t('attentionAreas')} ({domain.attention.length})</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => setDomainTab((prev) => ({ ...prev, [domain.key]: 'strengths' }))}
                          style={[
                            styles.domainTab,
                            tab === 'strengths' && styles.domainTabActive,
                          ]}
                        >
                          <StarIcon width={scaleSize(14)} height={scaleSize(14)} />
                          <Text style={styles.domainTabText}>{t('areasWorkingWell')} ({domain.strengths.length})</Text>
                        </Pressable>
                      </View>
                      {tab === 'strengths' && (
                        <View style={[styles.strengthHeader, { gap: scaleSize(6) }]}>
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
                                { width: scaleSize(20), height: scaleSize(20), borderRadius: scaleSize(10) },
                              ]}
                            >
                              <Text style={[styles.numberCircleText, { fontSize: scaleSize(10), color: tab === 'attention' ? domain.statusColor : '#1A7340' }]}>{idx + 1}</Text>
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
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scaleSize(16) }]}>{t('learnMoreAboutChild')}</Text>
          <View style={[styles.articleList, { gap: scaleSize(8) }]}>
            {reportFAQs.map((faq, index) => {
              const isOpen = openReportFaq === index;
              return (
                <GradientBorderCard
                  key={faq.title}
                  onPress={() => setOpenReportFaq(isOpen ? null : index)}
                  open={isOpen}
                  borderRadius={scaleSize(14)}
                  borderWidth={2}
                  padding={0}
                >
                  <View style={{ padding: scaleSize(12) }}>
                    <View style={styles.learnMoreHeader}>
                      <View style={styles.learnMoreNumberCircle}>
                        <Text style={styles.learnMoreNumber}>{index + 1}</Text>
                      </View>
                      <Text style={[styles.learnMoreTitle, { fontSize: scaleSize(13) }]}>{faq.title}</Text>
                      <View style={[styles.learnMoreToggle, { backgroundColor: isOpen ? '#535BD8' : '#F3F2FF' }]}>
                        <Text style={[styles.learnMoreToggleText, { color: isOpen ? '#FFFFFF' : '#535BD8', fontSize: scaleSize(16) }]}>
                          {isOpen ? '−' : '+'}
                        </Text>
                      </View>
                    </View>
                    {isOpen && (
                      <View style={[styles.learnMoreBody, { paddingTop: scaleSize(10), borderTopWidth: 1, borderTopColor: '#E4E7FB', marginTop: scaleSize(8) }]}>
                        <Text style={[styles.learnMoreBodyText, { fontSize: scaleSize(12), lineHeight: scaleSize(16) }]}>
                          {faq.body}
                        </Text>
                        <Pressable style={styles.learnMoreCta}>
                          <Text style={[styles.learnMoreCtaText, { fontSize: scaleSize(12) }]}>{t('askSaarathiCare')} →</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </GradientBorderCard>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
        <Pressable
          onPress={() => generateScreeningReportPDF({ childName, score, total, result, date, screener, domainBreakdown, domainAnswers })}
          style={({ pressed }) => [styles.primaryButton, { height: scaleSize(54), borderRadius: scaleSize(27), opacity: pressed ? 0.9 : 1 }]}
        >
          <DownloadIcon width={scaleSize(20)} height={scaleSize(20)} />
          <Text style={[styles.primaryButtonText, { fontSize: scaleSize(15) }]}>{t('downloadReport')}</Text>
        </Pressable>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [styles.secondaryButton, { height: scaleSize(54), borderRadius: scaleSize(27), opacity: pressed ? 0.9 : 1 }]}
        >
          <ShareIcon width={scaleSize(20)} height={scaleSize(20)} />
          <Text style={[styles.secondaryButtonText, { fontSize: scaleSize(15) }]}>{t('share')}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleBlock: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#2D2A3A',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  dateText: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#2D2A3A',
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  overviewCard: {
    backgroundColor: '#F3F2FF',
    borderWidth: 1,
    borderColor: '#E2E4E8',
    gap: 8,
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
    backgroundColor: '#FEF8DC',
    borderWidth: 1,
    borderColor: '#BB853E',
  },
  resultBadgeText: {
    fontFamily: 'Inter_700Bold',
    color: '#18182D',
  },
  progressTrack: {
    backgroundColor: '#E2E4E8',
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#BB853E',
  },
  disclaimer: {
    fontFamily: 'Inter_400Regular',
    color: '#18182D',
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
    backgroundColor: '#FEF8DC',
    gap: 4,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultIconBox: {
    backgroundColor: '#BB853E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCardTitles: {
    gap: 2,
  },
  resultCardEyebrow: {
    fontFamily: 'Inter_700Bold',
    color: '#BB853E',
  },
  resultCardResult: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#18182D',
  },
  resultCardScore: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  resultDivider: {
    backgroundColor: '#D8AC43',
  },
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
  insightCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    gap: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIconBox: {
    backgroundColor: '#F3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  statusBadge: {
    borderRadius: 10,
  },
  statusBadgeText: {
    fontFamily: 'Inter_700Bold',
  },
  insightHeading: {
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  dot: {
    backgroundColor: '#D9D9D9',
  },
  dotActive: {
    backgroundColor: '#535BD8',
  },
  domainList: {},
  domainRowCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  domainRowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  domainSmallIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainRowTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  domainRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainScore: {
    fontFamily: 'Inter_600SemiBold',
    color: '#2D2A3A',
  },
  domainDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    gap: 12,
  },
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
  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthHeaderText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#1A7340',
  },
  numberCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberCircleText: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    color: '#2D2A3A',
  },
  bulletCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F6F6F8',
    borderRadius: 12,
    padding: 12,
  },
  articleList: {},
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F8FA',
  },
  articleIconBox: {
    backgroundColor: '#E8E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  articleDivider: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  articleBody: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  articleCta: {
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
  },
  learnMoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  learnMoreNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnMoreNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#535BD8',
  },
  learnMoreTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    color: '#2D2A3A',
  },
  learnMoreToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnMoreToggleText: {
    fontFamily: 'Inter_700Bold',
    lineHeight: 20,
  },
  learnMoreBody: {
    gap: 8,
  },
  learnMoreBodyText: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  learnMoreCta: {
    marginTop: 4,
  },
  learnMoreCtaText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#535BD8',
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E4E8',
  },
  trendBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadgeText: {
    fontFamily: 'Inter_700Bold',
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
    flexDirection: 'row',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1.5,
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
  footerIconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
