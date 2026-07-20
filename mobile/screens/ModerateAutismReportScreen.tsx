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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScreening } from '../context/ScreeningContext';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { generateScreeningReportPDF } from '../utils/reportPdf';
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

import SocialIcon from '../assets/figma/screen28/Frame-7.svg';
import EmotionIcon from '../assets/figma/screen28/Frame-5.svg';
import SpeechIcon from '../assets/figma/screen28/Frame-15.svg';
import BehaviorIcon from '../assets/figma/screen28/Frame-14.svg';
import SensoryIcon from '../assets/figma/screen28/Frame-13.svg';
import CognitiveIcon from '../assets/figma/screen28/Frame-11.svg';

const DOMAINS_OVERVIEW = [
  { key: 'Social',    label: 'Social',    Icon: SocialIcon,    color: '#9651C8', ringColor: '#B87FE5' },
  { key: 'Emotion',   label: 'Emotion',   Icon: EmotionIcon,   color: '#2BA8A6', ringColor: '#4ECDC4' },
  { key: 'Speech',    label: 'Speech',    Icon: SpeechIcon,    color: '#3B8DBD', ringColor: '#6BADD6' },
  { key: 'Behavior',  label: 'Behaviour', Icon: BehaviorIcon,  color: '#D66A8E', ringColor: '#F28FAD' },
  { key: 'Sensory',   label: 'Sensory',   Icon: SensoryIcon,   color: '#F4A261', ringColor: '#F7B37E' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#7D6CB7', ringColor: '#7D6CB7' },
];

const INSIGHTS = [
  {
    title: 'Behavioural Patterns',
    heading: 'Repetitive behaviours are in control',
    status: 'Doing well',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    Icon: BehaviorIcon,
    bullets: [
      'Flexible with daily routines',
      'No repetitive behaviour concerns',
      'More restrictive behaviours observed.',
    ],
  },
  {
    title: 'Speech Development',
    heading: 'Speech matches expectations',
    status: 'Better o...',
    statusColor: '#1A7340',
    statusBg: '#E8F7F0',
    Icon: SpeechIcon,
    bullets: [
      '~12% to better o...',
      'Better o...',
      'observe...',
    ],
  },
];

const DEVELOPMENT_DOMAINS_STATIC = [
  {
    key: 'Social',
    label: 'Social',
    status: 'Needs support',
    statusColor: '#BB853E',
    statusBg: '#FEF8DC',
    color: '#9651C8',
    Icon: SocialIcon,
    score: '31/45',
    strengths: [
      'Makes eye contact when spoken to or during play',
      'Shows interest in peers during group play',
    ],
    attention: [
      'Limited social reciprocity',
      'Difficulty maintaining peer relationships',
    ],
  },
  {
    key: 'Emotion',
    label: 'Emotional',
    status: 'Needs extra support',
    statusColor: '#E25648',
    statusBg: '#FDF0EB',
    color: '#2BA8A6',
    Icon: EmotionIcon,
    score: '38/45',
    strengths: [
      'Shows affection to caregivers',
      'Can express basic feelings',
    ],
    attention: [
      'Inappropriate emotional responses',
      'Exaggerated emotional reactions',
    ],
  },
  {
    key: 'Speech',
    label: 'Speech',
    status: 'Making progress',
    statusColor: '#BB853E',
    statusBg: '#FEF8DC',
    color: '#3B8DBD',
    Icon: SpeechIcon,
    score: '31/45',
    strengths: [
      'Responds when spoken to and follows simple conversations',
      'Uses gestures to communicate needs',
    ],
    attention: [
      'Limited two-word combinations',
      'Difficulty initiating conversations',
    ],
  },
  {
    key: 'Behavior',
    label: 'Behavioural',
    status: 'Needs support',
    statusColor: '#BB853E',
    statusBg: '#FEF8DC',
    color: '#D66A8E',
    Icon: BehaviorIcon,
    score: '28/45',
    strengths: [
      'Follows simple instructions',
      'Engages in preferred activities',
    ],
    attention: [
      'Repetitive hand movements present',
      'Strong preference for routines',
    ],
  },
  {
    key: 'Sensory',
    label: 'Sensory',
    status: 'Making progress',
    statusColor: '#BB853E',
    statusBg: '#FEF8DC',
    color: '#F4A261',
    Icon: SensoryIcon,
    score: '33/45',
    strengths: [
      'Tolerates everyday sounds and textures',
      'Explores new environments with confidence',
    ],
    attention: [
      'Covers ears to loud sounds',
      'Avoids certain textures',
    ],
  },
  {
    key: 'Cognitive',
    label: 'Cognitive',
    status: 'Needs extra support',
    statusColor: '#E25648',
    statusBg: '#FDF0EB',
    color: '#7D6CB7',
    Icon: CognitiveIcon,
    score: '33/45',
    strengths: [
      'Good problem solving for familiar tasks',
      'Notices small changes',
    ],
    attention: [
      'Inconsistent attention and concentration',
      'Delayed response time',
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
    "How often does the child avoid playing or interacting with other children of a similar age?",
  ],
  Emotion: [
    "How often does the child react in a way that does not match the situation?",
    "How often does the child react much more strongly than the situation requires?",
    "How often does the child suddenly laugh, cry, or become excited without an obvious reason?",
    "How often does the child do dangerous things without seeming to understand the risk?",
    "How often does the child suddenly become very excited or upset without an obvious reason?",
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
    "How often does the child have difficulty understanding the real meaning behind what others say.",
  ],
  Behavior: [
    "How often does the child repeatedly flap their hands, rock their body, spin, or make the same movements again and again?",
    "How often does the child become unusually attached to a particular object?",
    "How often does the child seem unable to sit still or stay calm?",
    "How often does the child hit, kick, bite, push, or hurt others?",
    "How often does the child have intense tantrums that are difficult to calm?",
    "How often does the child hurt themselves on purpose?",
    "How often does the child become upset when daily routines or familiar things change?",
  ],
  Sensory: [
    "How often does the child react strongly to everyday sounds, lights, smells, touch, or certain clothes?",
    "How often does the child stare into space for a long time without responding?",
    "How often does the child have difficulty following a moving object with their eyes?",
    "How often does the child look at objects in unusual ways?",
    "How often does the child seem to feel little or no pain after getting hurt?",
    "How often does the child smell, touch, or taste people or objects in unusual ways?",
  ],
  Cognitive: [
    "How often does the child have difficulty staying focused on an activity?",
    "How often does the child take much longer than expected to respond when spoken to?",
    "How often does the child remember unusual details much better than expected?",
    "How often does the child show an exceptional skill that is much stronger than expected for their age?",
  ],
};

export default function ModerateAutismReportScreen({ navigation, route }: any) {
  const { scaleSize, padding } = useResponsive();
  const screening = useScreening();

  const childName      = route?.params?.childName     ?? 'Nitya';
  const score          = route?.params?.score         ?? 134;
  const total          = route?.params?.total         ?? 200;
  const result         = route?.params?.result        ?? 'Moderate Autism';
  const date           = route?.params?.date          ?? '8 June 2026';
  const screener       = route?.params?.screener      ?? 'Dhaval (Father)';
  const domainBreakdown = route?.params?.domainBreakdown;
  const progressFill   = Math.min(1, Math.max(0, score / total));

  // Moderate Autism colours
  const severityColor = '#EA580C';
  const severityBg    = '#FFEDD5';

  // Dynamic answers source: route params or context
  const contextAnswers = screening?.domainAnswers || {};
  const routeAnswers   = route?.params?.domainAnswers;
  const domainAnswers  = routeAnswers || contextAnswers;

  const isDomainOnTrack = (key: string) => {
    if (domainBreakdown) {
      const bd = domainBreakdown.find((b: any) => b.key === key);
      if (bd) {
        const sl = bd.status.toLowerCase();
        return sl.includes('great') || sl.includes('well');
      }
    }
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

  const domainsWithProgress = useMemo(() =>
    DOMAINS_OVERVIEW.map((d) => {
      if (domainBreakdown) {
        const bd = domainBreakdown.find((b: any) => b.key === d.key);
        if (bd) return { ...d, progress: bd.progress, ringColor: bd.statusColor };
      }
      return { ...d, progress: getDomainProgress(d.key) };
    }),
  [domainBreakdown]);

  // Build dynamic domain detail list with answers from screening responses
  const domainsDetailWithScore = useMemo(() =>
    DEVELOPMENT_DOMAINS_STATIC.map((d) => {
      let scoreStr       = d.score;
      let statusStr      = d.status;
      let statusColorStr = d.statusColor;
      let statusBgStr    = d.statusBg;

      if (domainBreakdown) {
        const bd = domainBreakdown.find((b: any) => b.key === d.key);
        if (bd) {
          scoreStr       = `${bd.score}/${bd.maxScore}`;
          statusStr      = bd.status;
          statusColorStr = bd.statusColor;
          statusBgStr    = bd.statusBg;
        }
      }

      const questions = DOMAIN_QUESTIONS[d.key] || [];
      const answers   = domainAnswers[d.key] || [];
      const attention: string[] = [];
      const strengths: string[] = [];

      if (answers && answers.length > 0) {
        questions.forEach((qText, idx) => {
          const answer = answers[idx];
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
    }),
  [domainBreakdown, domainAnswers]);

  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [domainTab, setDomainTab] = useState<Record<string, 'attention' | 'strengths'>>(() => {
    const init: Record<string, 'attention' | 'strengths'> = {};
    DEVELOPMENT_DOMAINS_STATIC.forEach((d) => { init[d.key] = d.attention.length > 0 ? 'attention' : 'strengths'; });
    return init;
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleDomain = (key: string) => setExpandedDomain((p) => (p === key ? null : key));

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Saarathi Care Screening Report\nChild: ${childName}\nResult: ${result}\nScore: ${score}/${total}\nDate: ${date}\n\nThis screening result is indicative. Consult a specialist for a detailed evaluation.`,
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const reportFAQs = getDynamicFAQs(1, false, domainsDetailWithScore.filter(d => d.status.toLowerCase().includes('need')).map(d => d.key));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: padding, paddingVertical: scaleSize(12) }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={scaleSize(10)}>
          <BackArrow width={scaleSize(12)} height={scaleSize(21)} />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: scaleSize(16) }]}>Screening Report</Text>
        <View style={{ width: scaleSize(24) }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: scaleSize(120), gap: scaleSize(16) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview card */}
        <View style={[styles.overviewCard, { padding: scaleSize(16), borderRadius: scaleSize(24), borderWidth: 1, borderColor: 'rgba(83, 91, 216, 0.21)' }]}>
          <Text style={[styles.overviewTitle, { fontSize: scaleSize(16) }]}>{childName}'s Screening Overview</Text>
          <View style={styles.overviewMetaRow}>
            <View style={styles.metaItem}>
              <CalendarIcon width={scaleSize(16)} height={scaleSize(16)} />
              <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12), marginLeft: scaleSize(6) }]}>{date}</Text>
            </View>
            <View style={styles.metaItem}>
              <PersonIcon width={scaleSize(16)} height={scaleSize(16)} />
              <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12), marginLeft: scaleSize(6) }]}>{screener}</Text>
            </View>
          </View>

          {/* Score row */}
          <View style={styles.scoreRow}>
            <View>
              <View style={styles.scoreLabelRow}>
                <Text style={[styles.scoreLabel, { fontSize: scaleSize(12) }]}>Score : </Text>
                <Text style={[styles.scoreValue, { fontSize: scaleSize(20) }]}>{score} / {total}</Text>
                <Text style={[styles.scoreAsterisk, { fontSize: scaleSize(14) }]}> *</Text>
              </View>
              <View style={[styles.resultBadge, { backgroundColor: severityBg, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6), marginTop: scaleSize(6) }]}>
                <ResultFlagIcon width={scaleSize(14)} height={scaleSize(14)} fill={severityColor} color={severityColor} />
                <Text style={[styles.resultBadgeText, { fontSize: scaleSize(12), color: severityColor, marginLeft: scaleSize(4) }]}>{result}</Text>
              </View>
            </View>
          </View>

          {/* Progress track */}
          <View style={[styles.progressTrack, { height: scaleSize(8), borderRadius: scaleSize(4), marginTop: scaleSize(12) }]}>
            <View style={{ width: `${progressFill * 100}%`, height: scaleSize(8), borderRadius: scaleSize(4), backgroundColor: severityColor }} />
          </View>

          <Text style={[styles.disclaimer, { fontSize: scaleSize(11), marginTop: scaleSize(12) }]}>
            * The score is indicative, not diagnostic. Consult a specialist for confirmation.
          </Text>

          {/* Domain rings grid */}
          <View style={[styles.domainGrid, { marginTop: scaleSize(16), gap: scaleSize(12) }]}>
            {[domainsWithProgress.slice(0, 3), domainsWithProgress.slice(3, 6)].map((row, rowIdx) => (
              <View key={rowIdx} style={styles.domainRow}>
                {row.map((domain) => {
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
                            <View style={[styles.checkmarkWrap, { width: scaleSize(20), height: scaleSize(20), borderRadius: scaleSize(10), bottom: 0, right: 0 }]}>
                              <Image source={CheckmarkIcon} style={{ width: scaleSize(20), height: scaleSize(20) }} resizeMode="contain" />
                            </View>
                          </View>
                        ) : (
                          <>
                            <ProgressRing
                              size={ringSize}
                              strokeWidth={ringThickness}
                              progress={progressVal}
                              color={severityColor}
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

        {/* Result summary card */}
        <View style={[styles.summaryCard, { padding: scaleSize(16), borderRadius: scaleSize(20), backgroundColor: severityBg }]}>
          <View style={styles.summaryHeader}>
            <View style={[styles.summaryIconBox, { width: scaleSize(48), height: scaleSize(48), borderRadius: scaleSize(12), backgroundColor: severityColor, justifyContent: 'center', alignItems: 'center' }]}>
              <ResultFlagIcon width={scaleSize(24)} height={scaleSize(24)} fill="#FFF" color="#FFF" />
            </View>
            <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
              <Text style={[styles.summaryEyebrow, { fontSize: scaleSize(10), color: severityColor }]}>SCREENING RESULT</Text>
              <Text style={[styles.summaryTitle, { fontSize: scaleSize(18), color: severityColor }]}>{result}</Text>
              <Text style={[styles.summaryScore, { fontSize: scaleSize(12), marginTop: scaleSize(2) }]}>{score} / {total}</Text>
            </View>
          </View>
          <View style={[styles.summaryDivider, { marginVertical: scaleSize(12), backgroundColor: `${severityColor}30` }]} />
          <Text style={[styles.summaryBody, { fontSize: scaleSize(12) }]}>
            {childName} shows heavy signs across emotional and sensory domains. Visiting a doctor and therapist as soon as possible is the most recommended.
          </Text>
        </View>

        {/* Not-a-diagnosis info card */}
        <View style={[styles.infoCard, { padding: scaleSize(14), borderRadius: scaleSize(14), borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' }]}>
          <WarningIcon width={scaleSize(24)} height={scaleSize(24)} />
          <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
            <Text style={[styles.infoTitle, { fontSize: scaleSize(13) }]}>A screening is not a diagnosis</Text>
            <Text style={[styles.infoBody, { fontSize: scaleSize(12) }]}>
              Screening results are not a diagnosis. They help identify developmental signals and guide your next steps.
            </Text>
          </View>
        </View>

        {/* Top Insights */}
        <Text style={[styles.sectionTitle, { fontSize: scaleSize(16) }]}>Top Insights</Text>
        {INSIGHTS.map((insight) => {
          const { Icon } = insight;
          return (
            <View key={insight.title} style={[styles.insightCard, { padding: scaleSize(14), borderRadius: scaleSize(16) }]}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIconBox, { width: scaleSize(44), height: scaleSize(44), borderRadius: scaleSize(22), backgroundColor: insight.statusBg }]}>
                  <Icon width={scaleSize(24)} height={scaleSize(24)} />
                </View>
                <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
                  <Text style={[styles.insightTitle, { fontSize: scaleSize(13), color: '#6B7180' }]}>{insight.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: insight.statusBg, borderRadius: scaleSize(10), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3), alignSelf: 'flex-start', marginTop: scaleSize(4) }]}>
                    <Text style={[styles.statusBadgeText, { fontSize: scaleSize(10), color: insight.statusColor }]}>{insight.status}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.insightHeading, { fontSize: scaleSize(14), color: '#18182D', marginTop: scaleSize(10) }]}>{insight.heading}</Text>
              <View style={{ marginTop: scaleSize(8), gap: scaleSize(4) }}>
                {insight.bullets.map((b, i) => (
                  <Text key={i} style={[styles.bullet, { fontSize: scaleSize(12) }]}>• {b}</Text>
                ))}
              </View>
            </View>
          );
        })}

        {/* Development by Domain */}
        <Text style={[styles.sectionTitle, { fontSize: scaleSize(16), marginTop: scaleSize(8) }]}>Development by Domain</Text>
        <Text style={[styles.sectionSubtitle, { fontSize: scaleSize(12) }]}>Tap any domain to see attention areas and areas working well</Text>
        {domainsDetailWithScore.map((domain) => {
          const { Icon } = domain;
          const expanded = expandedDomain === domain.key;
          const tab      = domainTab[domain.key];
          const items    = tab === 'attention' ? domain.attention : domain.strengths;
          return (
            <View key={domain.key} style={[styles.domainCard, { padding: scaleSize(14), borderRadius: scaleSize(16), borderColor: expanded ? domain.color : '#E2E4E8' }]}>
              <Pressable onPress={() => toggleDomain(domain.key)} style={styles.domainCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={[styles.domainCardIconBox, { width: scaleSize(40), height: scaleSize(40), borderRadius: scaleSize(12), backgroundColor: domain.color }]}>
                    <Icon width={scaleSize(20)} height={scaleSize(20)} />
                  </View>
                  <View style={{ marginLeft: scaleSize(12), flex: 1 }}>
                    <Text style={[styles.domainCardLabel, { fontSize: scaleSize(14) }]}>{domain.label}</Text>
                    <View style={{ flexDirection: 'row', gap: scaleSize(8), marginTop: scaleSize(4) }}>
                      <Text style={[styles.domainCardScore, { fontSize: scaleSize(11) }]}>Attention areas ({domain.attention.length})</Text>
                      <Text style={[styles.domainCardScore, { fontSize: scaleSize(11) }]}>Areas working well ({domain.strengths.length})</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(8) }}>
                  <View style={[styles.statusBadge, { backgroundColor: domain.statusBg, borderRadius: scaleSize(10), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3) }]}>
                    <Text style={[styles.statusBadgeText, { fontSize: scaleSize(10), color: domain.statusColor }]}>{domain.status}</Text>
                  </View>
                  {expanded ? <ChevronUp width={scaleSize(18)} height={scaleSize(18)} /> : <ChevronDown width={scaleSize(18)} height={scaleSize(18)} />}
                </View>
              </Pressable>

              {expanded && (
                <View style={{ marginTop: scaleSize(12), paddingTop: scaleSize(12), borderTopWidth: 1, borderTopColor: '#E2E4E8', gap: scaleSize(10) }}>
                  {/* Tab switcher */}
                  <View style={styles.domainTabs}>
                    <Pressable
                      onPress={() => setDomainTab((prev) => ({ ...prev, [domain.key]: 'attention' }))}
                      style={[styles.domainTab, tab === 'attention' && styles.domainTabActive]}
                    >
                      <WarningIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={styles.domainTabText}>Attention areas ({domain.attention.length})</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setDomainTab((prev) => ({ ...prev, [domain.key]: 'strengths' }))}
                      style={[styles.domainTab, tab === 'strengths' && styles.domainTabActive]}
                    >
                      <StarIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={styles.domainTabText}>Areas working well ({domain.strengths.length})</Text>
                    </Pressable>
                  </View>

                  {tab === 'strengths' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(6) }}>
                      <StarIcon width={scaleSize(14)} height={scaleSize(14)} />
                      <Text style={[styles.strengthHeaderText, { fontSize: scaleSize(12) }]}>Here's what working well!</Text>
                    </View>
                  )}

                  <View style={{ gap: scaleSize(10) }}>
                    {items.map((item: string, idx: number) => (
                      <View
                        key={idx}
                        style={[styles.bulletCard, { backgroundColor: tab === 'attention' ? '#F6F6F8' : '#E8F7F0' }]}
                      >
                        <View style={[styles.numberCircle, tab === 'attention' ? { backgroundColor: domain.statusBg } : { backgroundColor: '#FFFFFF' }]}>
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

        {/* Learn More About Child FAQs */}
        <Text style={[styles.sectionTitle, { fontSize: scaleSize(16), marginTop: scaleSize(8) }]}>Learn More About Child</Text>
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
                    <Text style={[styles.faqToggleText, { color: isOpen ? '#FFFFFF' : '#535BD8' }]}>{isOpen ? '−' : '+'}</Text>
                  </View>
                </View>
                {isOpen && (
                  <View style={{ paddingTop: scaleSize(12), borderTopWidth: 1, borderTopColor: '#E4E7FB', marginTop: scaleSize(10), gap: scaleSize(8) }}>
                    <Text style={[styles.faqBody, { fontSize: scaleSize(12), lineHeight: scaleSize(18) }]}>{faq.body}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer: Download + Share */}
      <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, { height: scaleSize(54), borderRadius: scaleSize(26), opacity: pressed ? 0.9 : 1 }]}
          onPress={() => generateScreeningReportPDF({ childName, score, total, result, date, screener, domainBreakdown, domainAnswers })}
        >
          <DownloadIcon width={scaleSize(20)} height={scaleSize(20)} />
          <Text style={[styles.primaryButtonText, { fontSize: scaleSize(15) }]}>Download Report</Text>
        </Pressable>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [styles.secondaryButton, { height: scaleSize(54), borderRadius: scaleSize(26), opacity: pressed ? 0.9 : 1 }]}
        >
          <ShareIcon width={scaleSize(20)} height={scaleSize(20)} />
          <Text style={[styles.secondaryButtonText, { fontSize: scaleSize(15) }]}>Share</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  overviewCard: { backgroundColor: '#F3F2FF', gap: 8 },
  overviewTitle: { fontFamily: 'Inter_700Bold', color: '#2D2A3A' },
  overviewMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  overviewMetaText: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 12 },
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
  domainLabel: { fontFamily: 'Inter_600SemiBold', color: '#3B3B3E' },
  checkmarkWrap: { position: 'absolute', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  disclaimer: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  summaryCard: { gap: 0 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center' },
  summaryIconBox: {},
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
  domainCard: { backgroundColor: '#F8F8FF', borderWidth: 1 },
  domainCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  domainCardIconBox: { justifyContent: 'center', alignItems: 'center' },
  domainCardLabel: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  domainCardScore: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  domainTabs: {
    flexDirection: 'row', gap: 4, backgroundColor: '#F3F3F6', padding: 4, borderRadius: 30,
  },
  domainTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'transparent', borderRadius: 23, paddingHorizontal: 10, paddingVertical: 8,
  },
  domainTabActive: {
    backgroundColor: '#FFFFFF', borderRadius: 23,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  domainTabText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#2D2A3A' },
  strengthHeaderText: { fontFamily: 'Inter_600SemiBold', color: '#1A7340' },
  bulletCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 12, padding: 12 },
  numberCircle: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  numberCircleText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  bulletText: { flex: 1, fontFamily: 'Inter_400Regular', color: '#2D2A3A' },
  faqCard: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E4E7FB' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  faqNumberCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F3F2FF', justifyContent: 'center', alignItems: 'center' },
  faqNumber: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#535BD8' },
  faqTitle: { flex: 1, fontFamily: 'Inter_700Bold', color: '#2D2A3A' },
  faqToggle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  faqToggleText: { fontFamily: 'Inter_700Bold', fontSize: 16, lineHeight: 20 },
  faqBody: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white,
    borderTopWidth: 1, borderTopColor: '#F3F2FF', paddingTop: 12, paddingBottom: 16, paddingHorizontal: 19,
    gap: 12, flexDirection: 'row',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 12,
  },
  primaryButton: {
    flex: 1.8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#535BD8',
  },
  primaryButtonText: { fontFamily: 'Inter_700Bold', color: colors.white },
  secondaryButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.white, borderWidth: 2, borderColor: '#E4E7FB',
  },
  secondaryButtonText: { fontFamily: 'Inter_700Bold', color: '#2D2A3A' },
});
