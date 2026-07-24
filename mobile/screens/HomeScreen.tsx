import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  Image,
} from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressRing from '../components/ProgressRing';
import CheckmarkIcon from '../assets/figma/screen28/Checkmark1.png';
import ResultFlagIcon from '../assets/figma/screen28/Frame-10.svg';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useTranslation, useDateLocale } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useScreening } from '../context/ScreeningContext';
import { getScreeningHistory, getAiFaqs, ChildProfile, AiFaq } from '../api/client';
import { getDynamicFAQs } from '../utils/qaLogic';
import PrivacyInfoCard from '../components/PrivacyInfoCard';
import HeroCard from '../components/HeroCard';
import GradientBorderCard from '../components/GradientBorderCard';
import AvatarIcon from '../assets/figma/screen16/image 9 [Vectorized].svg';
import MenuIconSvg from '../assets/figma/screen16/Frame-9.svg';
import SpotIcon from '../assets/figma/screen16/Frame-8.svg';
import DirectionIcon from '../assets/figma/screen16/Frame-7.svg';
import EmpowerIcon from '../assets/figma/screen16/Frame-6.svg';
import SocialIcon from '../assets/figma/screen16/Frame-3.svg';
import EmotionalIcon from '../assets/figma/screen16/Frame-22.svg';
import SpeechIcon from '../assets/figma/screen16/Frame-20.svg';
import BehaviourIcon from '../assets/figma/screen16/Frame-5.svg';
import SensoryIcon from '../assets/figma/screen16/Frame-2.svg';
import CognitiveIcon from '../assets/figma/screen16/Frame-1.svg';
import WarningIcon from '../assets/figma/screen16/Frame.svg';
import HomeIcon from '../assets/figma/screen25/Frame.svg';
import JournalIcon from '../assets/figma/screen25/stylus_note.svg';
import GoalsIcon from '../assets/figma/screen25/target.svg';
import ScreeningIcon from '../assets/figma/screen25/Frame-31.svg';
import CareTeamIcon from '../assets/figma/screen25/Frame-29.svg';
import PlusIcon from '../assets/figma/screen25/add_2.svg';
import BookmarkIcon from '../assets/figma/screen26/bookmarks.svg';
import CloseIcon from '../assets/figma/screen26/Frame-32.svg';
import ChildSwitcherSheet from '../components/ChildSwitcherSheet';
import SideMenu from '../components/SideMenu';
import CalendarIcon from '../assets/figma/screen28/calendar_month.svg';
import PersonIcon from '../assets/figma/screen27/Frame-7.svg';

const SECTION_QUESTION_COUNTS = [9, 5, 9, 7, 6, 4];
const SCREENING_ROUTES = [
  'SocialScreening',
  'EmotionScreening',
  'SpeechScreening',
  'BehaviorScreening',
  'SensoryScreening',
  'CognitiveScreening',
];

const LEARN_ITEMS = [
  { titleKey: 'spotPatternsEarly', subtitleKey: 'beforeTheyBecomeConcerns', Icon: SpotIcon },
  { titleKey: 'getClearDirection', subtitleKey: 'knowWhatToDoNext', Icon: DirectionIcon },
  { titleKey: 'empowerYourself', subtitleKey: 'moveFromWorryToAction', Icon: EmpowerIcon },
];

const DOMAINS: { name: string; Icon: React.ComponentType<{ width?: number; height?: number }>; color: string }[] = [
  { name: 'Social', Icon: SocialIcon, color: '#9B4FD6' },
  { name: 'Emotional', Icon: EmotionalIcon, color: '#2DAEA8' },
  { name: 'Speech', Icon: SpeechIcon, color: '#1EA7F2' },
  { name: 'Behaviour', Icon: BehaviourIcon, color: '#F04D9B' },
  { name: 'Sensory', Icon: SensoryIcon, color: '#F57A3E' },
  { name: 'Cognitive', Icon: CognitiveIcon, color: '#7481B6' },
];

const DOMAINS_OVERVIEW = [
  { key: 'Social', label: 'Social', Icon: SocialIcon, color: '#9B4FD6', ringColor: '#B87FE5' },
  { key: 'Emotion', label: 'Emotion', Icon: EmotionalIcon, color: '#2DAEA8', ringColor: '#4ECDC4' },
  { key: 'Speech', label: 'Speech', Icon: SpeechIcon, color: '#1EA7F2', ringColor: '#6BADD6' },
  { key: 'Behavior', label: 'Behaviour', Icon: BehaviourIcon, color: '#F04D9B', ringColor: '#F28FAD' },
  { key: 'Sensory', label: 'Sensory', Icon: SensoryIcon, color: '#F57A3E', ringColor: '#F7B37E' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#7481B6', ringColor: '#7481B6' },
];

const DOMAIN_SCORE_CONFIG: Record<string, { maxScore: number; ranges: { label: string; min: number; max: number; color: string }[] }> = {
  Social: { maxScore: 45, ranges: [
    { label: 'Doing great', min: 0, max: 9, color: '#1A7340' },
    { label: 'Doing well', min: 10, max: 18, color: '#1A7340' },
    { label: 'Making progress', min: 19, max: 27, color: '#BB853E' },
    { label: 'Needs support', min: 28, max: 36, color: '#E25648' },
    { label: 'Needs extra support', min: 37, max: 45, color: '#B9382E' },
  ] },
  Emotion: { maxScore: 25, ranges: [
    { label: 'Doing great', min: 0, max: 5, color: '#1A7340' },
    { label: 'Doing well', min: 6, max: 10, color: '#1A7340' },
    { label: 'Making progress', min: 11, max: 15, color: '#BB853E' },
    { label: 'Needs support', min: 16, max: 20, color: '#E25648' },
    { label: 'Needs extra support', min: 21, max: 25, color: '#B9382E' },
  ] },
  Speech: { maxScore: 45, ranges: [
    { label: 'Doing great', min: 0, max: 9, color: '#1A7340' },
    { label: 'Doing well', min: 10, max: 18, color: '#1A7340' },
    { label: 'Making progress', min: 19, max: 27, color: '#BB853E' },
    { label: 'Needs support', min: 28, max: 36, color: '#E25648' },
    { label: 'Needs extra support', min: 37, max: 45, color: '#B9382E' },
  ] },
  Behavior: { maxScore: 35, ranges: [
    { label: 'Doing great', min: 0, max: 7, color: '#1A7340' },
    { label: 'Doing well', min: 8, max: 14, color: '#1A7340' },
    { label: 'Making progress', min: 15, max: 21, color: '#BB853E' },
    { label: 'Needs support', min: 22, max: 28, color: '#E25648' },
    { label: 'Needs extra support', min: 29, max: 35, color: '#B9382E' },
  ] },
  Sensory: { maxScore: 30, ranges: [
    { label: 'Doing great', min: 0, max: 6, color: '#1A7340' },
    { label: 'Doing well', min: 7, max: 12, color: '#1A7340' },
    { label: 'Making progress', min: 13, max: 18, color: '#BB853E' },
    { label: 'Needs support', min: 19, max: 24, color: '#E25648' },
    { label: 'Needs extra support', min: 25, max: 30, color: '#B9382E' },
  ] },
  Cognitive: { maxScore: 20, ranges: [
    { label: 'Doing great', min: 0, max: 4, color: '#1A7340' },
    { label: 'Doing well', min: 5, max: 8, color: '#1A7340' },
    { label: 'Making progress', min: 9, max: 12, color: '#BB853E' },
    { label: 'Needs support', min: 13, max: 16, color: '#E25648' },
    { label: 'Needs extra support', min: 17, max: 20, color: '#B9382E' },
  ] },
};

const MAX_SCREENING_SCORE = 200;
const RESCREEN_INTERVAL_DAYS = 90;
const SCREENING_TIME_MINUTES = 15;

function classifyScreeningResult(score: number) {
  if (score < 70) return 'Normal';
  if (score <= 106) return 'Mild Autism';
  if (score <= 153) return 'Moderate Autism';
  return 'Severe Autism';
}

function getResultLabelKey(result: string): string {
  const r = result.toLowerCase();
  if (r.includes('normal') || r.includes('no signs') || r.includes('no autism')) return 'resultNormal';
  if (r.includes('mild')) return 'resultMildAutism';
  if (r.includes('moderate')) return 'resultModerateAutism';
  if (r.includes('severe')) return 'resultSevereAutism';
  return 'screeningResult';
}

function formatScreeningDate(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function normalizeCompletedSession(session: any, caregiverName?: string) {
  const domainScores: Record<string, number> = {};
  (session.responses || []).forEach((response: any) => {
    domainScores[response.domain] = (domainScores[response.domain] || 0) + Number(response.score || 0);
  });

  const score = typeof session.totalScore === 'number'
    ? session.totalScore
    : typeof session.score === 'number'
    ? session.score
    : Object.values(domainScores).reduce((sum, value) => sum + value, 0);

  const domainBreakdown = Object.entries(DOMAIN_SCORE_CONFIG).map(([key, config]) => {
    const domainScore = domainScores[key] || 0;
    const status = config.ranges.find((range) => domainScore >= range.min && domainScore <= range.max) || config.ranges[config.ranges.length - 1];
    return {
      key,
      score: domainScore,
      maxScore: config.maxScore,
      progress: config.maxScore ? domainScore / config.maxScore : 0,
      status: status.label,
      statusColor: status.color,
    };
  });

  return {
    ...session,
    score,
    total: session.total || MAX_SCREENING_SCORE,
    result: session.result || classifyScreeningResult(score),
    date: session.date || formatScreeningDate(session.completedAt || session.startedAt),
    screener: session.screener || caregiverName || 'Caregiver',
    domainBreakdown: session.domainBreakdown || domainBreakdown,
  };
}

const STEPS = [
  { step: '1', titleKey: 'submitYourObservations', subtitleKey: 'answerBehaviouralQuestions' },
  { step: '2', titleKey: 'understandDevelopmentalNeeds', subtitleKey: 'getPersonalisedReport' },
  { step: '3', titleKey: 'consultDoctor', subtitleKey: 'shareReportToDoctor' },
];

const FAQS = [
  { titleKey: 'whatIsAutism', bodyKey: 'whatIsAutismBody' },
  { titleKey: 'whatAreSuggestedNextSteps', bodyKey: 'whatAreSuggestedNextStepsBody' },
  { titleKey: 'whatTypeDoctorsVisit', bodyKey: 'whatTypeDoctorsVisitBody' },
];

export default function HomeScreen({ navigation, route }: { navigation: any; route: any }) {
  const { scaleSize, padding } = useResponsive();
  const { t, language, setLanguage } = useTranslation();
  const dateLocale = useDateLocale();
  const { user, signOut, activeChild } = useAuth();
  const screening = useScreening();
  const child = activeChild;
  const caregiver = user?.caregiverProfile;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [plusMenuVisible, setPlusMenuVisible] = useState(false);
  const [childSwitcherVisible, setChildSwitcherVisible] = useState(false);
  const [firstFoldBottom, setFirstFoldBottom] = useState(0);
  const [showBottomStartCta, setShowBottomStartCta] = useState(false);

  // Screening history and loading states
  const [screeningHistory, setScreeningHistory] = useState<any[]>([]);
  const [aiFaqs, setAiFaqs] = useState<AiFaq[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = useCallback(async (overrideChildId?: string) => {
    const id = overrideChildId || child?.id;
    if (!id) return;
    setHistoryLoading(true);
    const historyResult = await getScreeningHistory(id);
    if (historyResult.success) {
      setScreeningHistory(historyResult.data.sessions);
    }
    setHistoryLoading(false);

    const aiResult = await getAiFaqs(id);
    if (aiResult.success && aiResult.data.faqs.length > 0 && aiResult.data.mode !== 'generic') {
      setAiFaqs(aiResult.data.faqs.slice(0, 5));
    }
  }, [child?.id]);

  useEffect(() => {
    fetchHistory();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation, fetchHistory]);

  useEffect(() => {
    if (screening.lastSubmittedAt) {
      fetchHistory();
    }
  }, [screening.lastSubmittedAt, fetchHistory]);

  const completedCount = useMemo(() => {
    return screeningHistory.filter((s) => s.status === 'completed').length;
  }, [screeningHistory]);

  const activeSession = useMemo(() => {
    return screeningHistory.find((s) => s.status === 'in_progress');
  }, [screeningHistory]);

  const progressParams = route.params?.progress;
  const progress = useMemo(() => {
    if (!progressParams) return undefined;
    const sectionNumber = Math.max(1, Math.min(6, progressParams.sectionNumber || 1));
    const answeredCount = progressParams.answeredCount || 0;
    const totalForCurrent = progressParams.totalQuestions || SECTION_QUESTION_COUNTS[sectionNumber - 1];
    const totalAnswered = SECTION_QUESTION_COUNTS.slice(0, sectionNumber - 1).reduce((a, b) => a + b, 0) + answeredCount;
    const totalQuestions = SECTION_QUESTION_COUNTS.reduce((a, b) => a + b, 0);
    const remainingQuestions = totalQuestions - totalAnswered;
    const remainingSections = 6 - sectionNumber + (answeredCount < totalForCurrent ? 1 : 0);
    const minutesLeft = remainingQuestions === 0
      ? 0
      : Math.max(1, Math.ceil((remainingQuestions / totalQuestions) * SCREENING_TIME_MINUTES));
    return { totalAnswered, totalQuestions, remainingQuestions, remainingSections, minutesLeft };
  }, [progressParams]);

  // Compute database-backed progress if activeSession exists
  const computedProgress = useMemo(() => {
    if (progressParams) {
      return progress;
    }
    if (!activeSession) return undefined;

    const responses = activeSession.responses || [];
    const counts: Record<string, number> = {};
    responses.forEach((r: any) => {
      counts[r.domain] = (counts[r.domain] || 0) + 1;
    });

    const DOMAIN_KEYS = ['Social', 'Emotion', 'Speech', 'Behavior', 'Sensory', 'Cognitive'];
    
    let activeSectionIndex = 0;
    let totalAnswered = 0;
    let foundActive = false;
    for (let i = 0; i < DOMAIN_KEYS.length; i++) {
      const key = DOMAIN_KEYS[i];
      const maxCount = SECTION_QUESTION_COUNTS[i];
      const ansCount = counts[key] || 0;
      totalAnswered += ansCount;
      if (ansCount < maxCount && !foundActive) {
        activeSectionIndex = i;
        foundActive = true;
      }
    }
    
    if (totalAnswered === 40) {
      activeSectionIndex = 5;
    }

    const totalQuestions = 40;
    const remainingQuestions = totalQuestions - totalAnswered;
    const remainingSections = 6 - activeSectionIndex;
    const minutesLeft = remainingQuestions === 0
      ? 0
      : Math.max(1, Math.ceil((remainingQuestions / totalQuestions) * SCREENING_TIME_MINUTES));

    return {
      totalAnswered,
      totalQuestions,
      remainingQuestions,
      remainingSections,
      minutesLeft,
      sectionIndex: activeSectionIndex,
    };
  }, [activeSession, progressParams, progress]);

  const continueProgress = useMemo(() => {
    return progress || computedProgress;
  }, [progress, computedProgress]);

  const continueSectionIndex = useMemo(() => {
    if (progressParams) {
      return Math.max(0, Math.min(5, (progressParams.sectionNumber || 1) - 1));
    }
    return (computedProgress as any)?.sectionIndex ?? 0;
  }, [progressParams, computedProgress]);


  const LANGUAGES = ['English', 'Gujarati', 'Hindi', 'Kannada'];

  const domainColumns = useMemo(() => {
    const rows: (typeof DOMAINS[number])[][] = [];
    for (let i = 0; i < DOMAINS.length; i += 3) {
      rows.push(DOMAINS.slice(i, i + 3));
    }
    return rows;
  }, []);

  const completedSessions = useMemo(() => {
    return screeningHistory
      .filter((s) => s.status === 'completed')
      .map((session) => normalizeCompletedSession(session, caregiver?.name || t('caregiver')));
  }, [screeningHistory, caregiver?.name, t]);

  const latestCompletedSession = useMemo(() => {
    if (completedSessions.length === 0) return null;
    return completedSessions[0];
  }, [completedSessions]);

  const homePriorityDomains = useMemo(() => {
    if (!latestCompletedSession?.domainBreakdown) return [];
    return latestCompletedSession.domainBreakdown
      .filter((b: any) => (b.status ?? '').toLowerCase().includes('need'))
      .map((b: any) => b.key);
  }, [latestCompletedSession]);

  // Dynamic FAQs based on completed screening counts and active session status
  const dynamicFAQs = useMemo(() => {
    if (aiFaqs.length > 0) return aiFaqs;
    const inProgress = activeSession !== undefined;
    let progressPercent = 0;
    const completedDomains: string[] = [];
    if (inProgress && continueProgress) {
      progressPercent = Math.round((continueProgress.totalAnswered / continueProgress.totalQuestions) * 100);
      const DOMAIN_KEYS = ['Social', 'Emotion', 'Speech', 'Behavior', 'Sensory', 'Cognitive'];
      completedDomains.push(...DOMAIN_KEYS.slice(0, continueSectionIndex));
    }
    return getDynamicFAQs(completedCount, inProgress, homePriorityDomains, progressPercent, completedDomains);
  }, [aiFaqs, completedCount, activeSession, continueProgress, continueSectionIndex, homePriorityDomains]);

  // Days since last screening
  const daysSinceLastScreening = useMemo(() => {
    if (!latestCompletedSession?.date) return null;
    try {
      const parts = latestCompletedSession.date.split(' ');
      if (parts.length === 3) {
        const d = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`);
        if (!isNaN(d.getTime())) {
          return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
        }
      }
    } catch (_) {}
    return null;
  }, [latestCompletedSession]);

  const isDomainOnTrack = useCallback((key: string) => {
    if (latestCompletedSession && latestCompletedSession.domainBreakdown) {
      const bd = latestCompletedSession.domainBreakdown.find((b: any) => b.key === key);
      if (bd) {
        const statusLower = (bd.status ?? '').toLowerCase();
        return statusLower.includes('great') || statusLower.includes('well');
      }
    }
    // Default fallback rules
    if (latestCompletedSession) {
      if (latestCompletedSession.result.includes('No Signs') || latestCompletedSession.result.includes('No Autism')) {
        return true;
      }
      // For Mild Autism, typically Cognitive is on track
      if (latestCompletedSession.result.includes('Mild') && key === 'Cognitive') {
        return true;
      }
    }
    return false;
  }, [latestCompletedSession]);

  const getDomainProgress = useCallback((key: string) => {
    if (latestCompletedSession && latestCompletedSession.domainBreakdown) {
      const bd = latestCompletedSession.domainBreakdown.find((b: any) => b.key === key);
      if (bd) {
        return bd.progress;
      }
    }
    const fallbacks: Record<string, number> = {
      Social: 0.25,
      Emotion: 0.3,
      Speech: 0.4,
      Behavior: 0.2,
      Sensory: 0.35,
      Cognitive: 0.1,
    };
    return fallbacks[key] ?? 0.5;
  }, [latestCompletedSession]);

  const handleViewDetailedReport = useCallback(() => {
    if (!latestCompletedSession) return;
    const session = latestCompletedSession;
    
    let targetRoute = 'ScreeningReport';
    if (session.result.includes('Severe')) {
      targetRoute = 'SevereAutismReport';
    } else if (session.result.includes('Moderate')) {
      targetRoute = 'ModerateAutismReport';
    } else if (session.result.includes('No Signs') || session.result.includes('No Autism') || session.result.includes('Normal')) {
      targetRoute = 'NoAutismReport';
    }
    
    const answers: Record<string, number[]> = {};
    if (session.responses) {
      session.responses.forEach((r: any) => {
        if (!answers[r.domain]) {
          answers[r.domain] = [];
        }
        const val = typeof r.score === 'number' ? Math.max(0, r.score - 1) : 0;
        answers[r.domain].push(val);
      });
    }

    const prevSession = completedSessions[1];
    const isRepeat = completedSessions.length > 1;
    const previousScore = prevSession ? { totalScore: prevSession.score, result: prevSession.result, domainBreakdown: prevSession.domainBreakdown, date: prevSession.date } : null;

    navigation.navigate(targetRoute, {
      childName: child?.name || t('yourChild'),
      score: session.score,
      total: session.total,
      result: session.result,
      date: session.date || formatScreeningDate(session.completedAt) || t('latestScreening'),
      screener: session.screener || caregiver?.name || t('caregiver'),
      domainBreakdown: session.domainBreakdown,
      domainAnswers: answers,
      isRepeat,
      previousScore,
      completedCount: completedSessions.length,
      childId: child?.id,
    });
  }, [navigation, latestCompletedSession, child, caregiver?.name, completedSessions]);

  const insights = useMemo(() => {
    if (!latestCompletedSession) return [];
    
    const baseInsights = [
      {
        titleKey: 'behaviouralPatterns',
        headingKey: 'repetitiveBehavioursControl',
        statusKey: 'doingWell',
        statusColor: '#1A7340',
        statusBg: '#E8F7F0',
        Icon: BehaviourIcon,
        iconBg: '#F04D9B',
        bulletKeys: ['flexibleDailyRoutines', 'noRepetitiveConcerns', 'transitionsManageable'],
      },
      {
        titleKey: 'speechAndLanguage',
        headingKey: 'speechIsImproving',
        statusKey: 'doingGreat',
        statusColor: '#1A7340',
        statusBg: '#E8F7F0',
        Icon: SpeechIcon,
        iconBg: '#1EA7F2',
        bulletKeys: ['plus12PercentFromLastScreening', 'betterCommunicationOutcomes'],
      },
      {
        titleKey: 'socialDevelopment',
        headingKey: 'socialInteractionsProgressing',
        statusKey: 'doingWell',
        statusColor: '#1A7340',
        statusBg: '#E8F7F0',
        Icon: SocialIcon,
        iconBg: '#9B4FD6',
        bulletKeys: ['engagesWithPeers', 'eyeContactImproving', 'respondsToSocialCues'],
      },
    ];

    if (latestCompletedSession.result.includes('Severe') || latestCompletedSession.result.includes('Moderate') || latestCompletedSession.result.includes('Mild')) {
      baseInsights[0].statusKey = 'needsSupport';
      baseInsights[0].statusColor = '#D12B2B';
      baseInsights[0].statusBg = '#FDF2F2';
      baseInsights[0].headingKey = 'repetitiveBehavioursNeedMonitoring';
      baseInsights[0].bulletKeys = ['handFlappingObserved', 'difficultyRoutineChanges', 'strongAttachmentItems'];
      baseInsights[1].statusKey = 'needsSupport';
      baseInsights[1].statusColor = '#D12B2B';
      baseInsights[1].statusBg = '#FDF2F2';
      baseInsights[1].headingKey = 'speechNeedsAttention';
      baseInsights[1].bulletKeys = ['limitedVocabulary', 'difficultyFormingSentences', 'considerSpeechTherapy'];
    }
    return baseInsights;
  }, [latestCompletedSession]);

  const [expandedLearnMore, setExpandedLearnMore] = useState<number | null>(0);
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  const handleViewSessionReport = useCallback((session: any) => {
    let targetRoute = 'ScreeningReport';
    if (session.result.includes('Severe')) {
      targetRoute = 'SevereAutismReport';
    } else if (session.result.includes('Moderate')) {
      targetRoute = 'ModerateAutismReport';
    } else if (session.result.includes('No Signs') || session.result.includes('No Autism') || session.result.includes('Normal')) {
      targetRoute = 'NoAutismReport';
    }

    const answers: Record<string, number[]> = {};
    if (session.responses) {
      session.responses.forEach((r: any) => {
        if (!answers[r.domain]) answers[r.domain] = [];
        const val = typeof r.score === 'number' ? Math.max(0, r.score - 1) : 0;
        answers[r.domain].push(val);
      });
    }

    const sessionIndex = completedSessions.findIndex((s: any) => s.date === session.date && s.score === session.score);
    const prevSession = completedSessions[sessionIndex + 1];
    const isRepeat = prevSession !== undefined;
    const previousScore = prevSession ? { totalScore: prevSession.score, result: prevSession.result, domainBreakdown: prevSession.domainBreakdown, date: prevSession.date } : null;

    navigation.navigate(targetRoute, {
      childName: child?.name || t('yourChild'),
      score: session.score,
      total: session.total,
      result: session.result,
      date: session.date || '',
      screener: session.screener || t('caregiver'),
      domainBreakdown: session.domainBreakdown,
      domainAnswers: answers,
      isRepeat,
      previousScore,
      completedCount: completedSessions.length,
      childId: child?.id,
    });
  }, [navigation, child, completedSessions]);

  const continueProgressPercent = useMemo(() => {
    if (!continueProgress) return 0;
    return Math.round((continueProgress.totalAnswered / continueProgress.totalQuestions) * 100);
  }, [continueProgress]);

  const handleContinue = useCallback(() => {
    const targetRoute = SCREENING_ROUTES[continueSectionIndex];
    setPlusMenuVisible(false);
    navigation.navigate(targetRoute);
  }, [navigation, continueSectionIndex]);

  const handleStartNew = useCallback(() => {
    setPlusMenuVisible(false);
    screening.reset();
    navigation.setParams({ progress: undefined });
    navigation.navigate('BeginScreening');
  }, [navigation, screening]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: scaleSize(130) }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            setShowBottomStartCta(y > firstFoldBottom);
          }}
        >
          <View style={[styles.topBar, { paddingHorizontal: padding, paddingTop: scaleSize(16) }]}>
            <Pressable style={styles.profileBlock} onPress={() => setChildSwitcherVisible(true)} hitSlop={scaleSize(8)}>
              <View style={[styles.avatarCircle, { width: scaleSize(46), height: scaleSize(46), borderRadius: scaleSize(23) }]}>
                <AvatarIcon width={scaleSize(30)} height={scaleSize(30)} />
              </View>
              <View>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, { fontSize: scaleSize(15) }]}>{child?.name || t('yourChild')}</Text>
                  <Text style={[styles.chevron, { fontSize: scaleSize(16) }]}>▾</Text>
                </View>
                <Text style={[styles.subtitle, { fontSize: scaleSize(12) }]}>{child?.ageInMonths ? `${Math.floor(child.ageInMonths / 12)} ${dateLocale.years} ${child.ageInMonths % 12} ${dateLocale.months}` : ''}</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => setDrawerOpen(true)} style={styles.menuButton} hitSlop={scaleSize(10)}>
              <MenuIconSvg width={scaleSize(22)} height={scaleSize(22)} />
            </Pressable>
          </View>

          {latestCompletedSession && !continueProgress ? (
            <View style={{ paddingHorizontal: padding, gap: scaleSize(16), marginTop: scaleSize(16) }}>

              {/* Re-screen banner */}
              {daysSinceLastScreening !== null && daysSinceLastScreening >= RESCREEN_INTERVAL_DAYS && (
                <View style={[styles.rescreenBanner, { borderRadius: scaleSize(16), padding: scaleSize(16) }]}>
                  <Text style={[styles.rescreenMeta, { fontSize: scaleSize(11), marginBottom: scaleSize(4) }]}>
                    {t('lastScreenedXDaysAgo', { days: String(daysSinceLastScreening) })}
                  </Text>
                  <Text style={[styles.rescreenTitle, { fontSize: scaleSize(18), marginBottom: scaleSize(12) }]}>
                    {t('timeForRescreen')}{`\n`}
                    <Text style={[styles.rescreenSub, { fontSize: scaleSize(13) }]}>
                      {t('trackHowProgressing', { name: child?.name || t('yourChild') })}
                    </Text>
                  </Text>
                  <Pressable
                    onPress={handleStartNew}
                    style={({ pressed }) => [
                      styles.rescreenCta,
                      { borderRadius: scaleSize(24), height: scaleSize(46), opacity: pressed ? 0.88 : 1 },
                    ]}
                  >
                    <Text style={[styles.rescreenCtaText, { fontSize: scaleSize(15) }]}>{t('takeRescreen')}</Text>
                  </Pressable>
                </View>
              )}

              <Text style={[styles.sectionTitle, { fontSize: scaleSize(15), lineHeight: scaleSize(20), fontFamily: 'Inter_600SemiBold', color: '#18182D' }]}>{t('latestScreening')}</Text>
              
              <View style={[styles.overviewCard, { paddingTop: scaleSize(14), paddingHorizontal: scaleSize(28), borderRadius: scaleSize(20), backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E7FB', overflow: 'hidden' }]}>
                <Text style={[styles.overviewTitle, { fontSize: scaleSize(16), fontFamily: 'Inter_700Bold', color: '#2D2A3A' }]}>
                  {t('screeningOverview', { name: child?.name || t('yourChild') })}
                </Text>
                
                <View style={[styles.overviewMetaRow, { marginTop: scaleSize(8) }]}>
                  <View style={styles.metaItem}>
                    <CalendarIcon width={scaleSize(16)} height={scaleSize(16)} color="#6B7180" />
                    <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12) }]}>
                      {latestCompletedSession.date || '—'}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <PersonIcon width={scaleSize(16)} height={scaleSize(16)} />
                    <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12) }]}>
                      {latestCompletedSession.screener || t('caregiver')}
                    </Text>
                  </View>
                </View>

                <View style={[styles.overviewDivider, { marginHorizontal: scaleSize(-28), marginTop: scaleSize(12) }]} />

                <View style={[styles.scoreRow, { marginTop: scaleSize(14) }]}>
                  <View style={styles.scoreLabelRow}>
                    <Text style={[styles.scoreLabel, { fontSize: scaleSize(12) }]}>{t('scoreLabel')}</Text>
                    <Text style={[styles.scoreValue, { fontSize: scaleSize(20), fontFamily: 'Inter_800ExtraBold', color: '#18182D' }]}>
                      {latestCompletedSession.score} / {latestCompletedSession.total}
                    </Text>
                    <Text style={[styles.scoreAsterisk, { fontSize: scaleSize(14) }]}> *</Text>
                  </View>
                  
                  {(() => {
                    const colors = latestCompletedSession.result.includes('No Signs') || latestCompletedSession.result.includes('No Autism') || latestCompletedSession.result.includes('Normal')
                      ? { text: '#1A7340', bg: '#E8F7F0' }
                      : latestCompletedSession.result.includes('Moderate')
                      ? { text: '#EA580C', bg: '#FFEDD5' }
                      : latestCompletedSession.result.includes('Severe')
                      ? { text: '#A83B3B', bg: '#FDF2F2' }
                      : { text: '#BB853E', bg: '#FEF3C7' };
                    return (
                      <View style={[styles.resultBadge, { backgroundColor: colors.bg, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(6) }]}>
                        <ResultFlagIcon width={scaleSize(14)} height={scaleSize(14)} fill={colors.text} color={colors.text} />
                        <Text style={[styles.resultBadgeText, { fontSize: scaleSize(12), color: colors.text, marginLeft: scaleSize(4), fontFamily: 'Inter_700Bold' }]}>
                          {t(getResultLabelKey(latestCompletedSession.result))}
                        </Text>
                      </View>
                    );
                  })()}
                </View>

                {(() => {
                  const progressColor = latestCompletedSession.result.includes('No Signs') || latestCompletedSession.result.includes('No Autism') || latestCompletedSession.result.includes('Normal')
                    ? '#1A7340'
                    : latestCompletedSession.result.includes('Moderate')
                    ? '#EA580C'
                    : latestCompletedSession.result.includes('Severe')
                    ? '#A83B3B'
                    : '#BB853E';
                  const progress = Math.min(1, Math.max(0, latestCompletedSession.score / latestCompletedSession.total));
                  return (
                    <View style={[styles.progressTrack, { height: scaleSize(5), borderRadius: scaleSize(3), marginTop: scaleSize(10), backgroundColor: '#E2E4E8' }]}>
                      <View style={{ width: `${progress * 100}%`, height: scaleSize(5), borderRadius: scaleSize(3), backgroundColor: progressColor }} />
                    </View>
                  );
                })()}

                <Text style={[styles.disclaimer, { fontSize: scaleSize(11), marginTop: scaleSize(9), color: '#6B7180', lineHeight: scaleSize(15) }]}>
                  {t('scoreIndicative')}
                </Text>

                <View style={[styles.domainGrid, { marginTop: scaleSize(18), gap: scaleSize(14) }]}>
                  <View style={styles.domainRow}>
                    {DOMAINS_OVERVIEW.slice(0, 3).map((domain) => {
                      const { Icon } = domain;
                      const circleSize = scaleSize(50);
                      const ringGap = scaleSize(2);
                      const ringThickness = scaleSize(3);
                      const ringSize = circleSize + ringThickness + ringGap * 2;
                      const onTrack = isDomainOnTrack(domain.key);
                      const progress = getDomainProgress(domain.key);
                      
                      return (
                        <View key={domain.key} style={styles.domainItem}>
                          <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
                            {onTrack ? (
                              <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color }]}>
                                <Icon width={scaleSize(24)} height={scaleSize(24)} />
                                <View style={[styles.checkmarkWrap, { width: scaleSize(16), height: scaleSize(16), borderRadius: scaleSize(8), bottom: scaleSize(-1), right: scaleSize(-1) }]}>
                                  <Image source={CheckmarkIcon} style={{ width: scaleSize(16), height: scaleSize(16) }} resizeMode="contain" />
                                </View>
                              </View>
                            ) : (
                              <>
                                <ProgressRing
                                  size={ringSize}
                                  strokeWidth={ringThickness}
                                  progress={progress}
                                  color={domain.ringColor}
                                />
                                <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color, position: 'absolute' }]}>
                                  <Icon width={scaleSize(24)} height={scaleSize(24)} />
                                </View>
                              </>
                            )}
                          </View>
                          <Text style={[styles.domainLabel, { fontSize: scaleSize(14), marginTop: scaleSize(4), color: '#3B3B3E', fontFamily: 'Inter_700Bold' }]}>{domain.label}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.domainRow}>
                    {DOMAINS_OVERVIEW.slice(3, 6).map((domain) => {
                      const { Icon } = domain;
                      const circleSize = scaleSize(50);
                      const ringGap = scaleSize(2);
                      const ringThickness = scaleSize(3);
                      const ringSize = circleSize + ringThickness + ringGap * 2;
                      const onTrack = isDomainOnTrack(domain.key);
                      const progress = getDomainProgress(domain.key);

                      return (
                        <View key={domain.key} style={styles.domainItem}>
                          <View style={{ width: ringSize, height: ringSize, justifyContent: 'center', alignItems: 'center' }}>
                            {onTrack ? (
                              <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color }]}>
                                <Icon width={scaleSize(24)} height={scaleSize(24)} />
                                <View style={[styles.checkmarkWrap, { width: scaleSize(16), height: scaleSize(16), borderRadius: scaleSize(8), bottom: scaleSize(-1), right: scaleSize(-1) }]}>
                                  <Image source={CheckmarkIcon} style={{ width: scaleSize(16), height: scaleSize(16) }} resizeMode="contain" />
                                </View>
                              </View>
                            ) : (
                              <>
                                <ProgressRing
                                  size={ringSize}
                                  strokeWidth={ringThickness}
                                  progress={progress}
                                  color={domain.ringColor}
                                />
                                <View style={[styles.domainCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, backgroundColor: domain.color, position: 'absolute' }]}>
                                  <Icon width={scaleSize(24)} height={scaleSize(24)} />
                                </View>
                              </>
                            )}
                          </View>
                          <Text style={[styles.domainLabel, { fontSize: scaleSize(14), marginTop: scaleSize(4), color: '#3B3B3E', fontFamily: 'Inter_700Bold' }]}>{domain.label}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <Pressable
                  onPress={handleViewDetailedReport}
                  style={({ pressed }) => [
                    styles.progressPrimaryCta,
                    {
                      height: scaleSize(48),
                      borderRadius: 0,
                      marginTop: scaleSize(16),
                      marginHorizontal: scaleSize(-28),
                      opacity: pressed ? 0.9 : 1,
                    }
                  ]}
                >
                  <Text style={{ fontFamily: 'Inter_700Bold', color: '#FFF', fontSize: scaleSize(16) }}>
                    {t('viewDetailedReport')}
                  </Text>
                </Pressable>
              </View>

              <PrivacyInfoCard
                icon={<WarningIcon width={scaleSize(20)} height={scaleSize(20)} />}
                backgroundColor="#FFFFFF"
                title={t('screeningNotDiagnosis')}
                titleColor="#535BD8"
                subtitle={t('screeningNotDiagnosisBody')}
                borderWidth={1}
                borderColor="#E2E4E8"
              />

              {completedSessions.length > 1 && (
                <ScreeningTrendCard sessions={completedSessions} scaleSize={scaleSize} />
              )}

              <Text style={[styles.sectionTitle, { fontSize: scaleSize(15), fontFamily: 'Inter_600SemiBold', color: '#18182D' }]}>{t('topInsights')}</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: scaleSize(15) }}>
                {insights.map((insight, index) => {
                  const { Icon } = insight;
                  const isExpanded = expandedInsight === index;
                  return (
                    <Pressable
                      key={insight.titleKey}
                      onPress={() => setExpandedInsight(isExpanded ? null : index)}
                      style={[styles.insightCard, { paddingVertical: scaleSize(17), paddingHorizontal: scaleSize(15), borderRadius: scaleSize(20), width: scaleSize(255), minHeight: scaleSize(206), backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E4E8' }]}
                    >
                      <View style={styles.insightHeader}>
                        <View style={[styles.insightIconBox, { width: scaleSize(48), height: scaleSize(48), borderRadius: scaleSize(14), backgroundColor: insight.iconBg, justifyContent: 'center', alignItems: 'center' }]}>
                          <Icon width={scaleSize(27)} height={scaleSize(27)} />
                        </View>
                        <View style={{ marginLeft: scaleSize(10), flex: 1 }}>
                          <Text style={[styles.insightTitle, { fontSize: scaleSize(13), fontFamily: 'Inter_700Bold', color: '#18182D', lineHeight: scaleSize(20) }]}>{t(insight.titleKey)}</Text>
                          <View style={[styles.statusBadgeInline, { backgroundColor: insight.statusBg, borderRadius: scaleSize(11), paddingHorizontal: scaleSize(12), paddingVertical: scaleSize(6), alignSelf: 'flex-start', marginTop: scaleSize(4), justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[styles.statusBadgeText, { fontSize: scaleSize(12), color: insight.statusColor, fontFamily: 'Inter_700Bold' }]}>{t(insight.statusKey)}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={[styles.insightHeading, { fontSize: scaleSize(16), marginTop: scaleSize(22), fontFamily: 'Inter_700Bold', color: '#18182D', lineHeight: scaleSize(20) }]}>{t(insight.headingKey)}</Text>
                      <View style={{ marginTop: scaleSize(8), gap: scaleSize(4) }}>
                        {insight.bulletKeys.map((b: string, i: number) => (
                          <Text key={i} style={[styles.bullet, { fontSize: scaleSize(12), fontFamily: 'Inter_500Medium', color: '#6B7180', lineHeight: scaleSize(16) }]}>• {t(b)}</Text>
                        ))}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Pagination dots */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: scaleSize(6), marginTop: scaleSize(12) }}>
                {insights.map((_, index) => (
                  <View
                    key={`dot-${index}`}
                    style={{
                      width: scaleSize(8),
                      height: scaleSize(8),
                      borderRadius: scaleSize(4),
                      backgroundColor: expandedInsight === index ? '#5963E1' : '#E2E4E8',
                    }}
                  />
                ))}
              </View>

              {/* Screening History */}
              {completedSessions.length > 1 && (
                <>
                  <Text style={[styles.sectionTitle, { fontSize: scaleSize(15), fontFamily: 'Inter_600SemiBold', color: '#18182D' }]}>{t('screeningHistory')}</Text>
                  <View style={{ gap: scaleSize(10) }}>
                    {completedSessions.map((session, index) => {
                      const sessionColors = session.result.includes('No Signs') || session.result.includes('No Autism') || session.result.includes('Normal')
                        ? { text: '#1A7340', bg: '#E8F7F0' }
                        : session.result.includes('Moderate')
                        ? { text: '#EA580C', bg: '#FFEDD5' }
                        : session.result.includes('Severe')
                        ? { text: '#A83B3B', bg: '#FDF2F2' }
                        : { text: '#BB853E', bg: '#FEF3C7' };
                      return (
                        <View key={`session-${index}`} style={[styles.historyCard, { borderRadius: scaleSize(16), padding: scaleSize(14) }]}>
                          <View style={styles.historyRow}>
                            <View style={styles.historyMeta}>
                              <View style={styles.metaItem}>
                                <CalendarIcon width={scaleSize(14)} height={scaleSize(14)} color="#6B7180" />
                                <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12) }]}>{session.date || '—'}</Text>
                              </View>
                              <View style={[styles.metaItem, { marginTop: scaleSize(4) }]}>
                                <PersonIcon width={scaleSize(14)} height={scaleSize(14)} />
                                <Text style={[styles.overviewMetaText, { fontSize: scaleSize(12) }]}>{session.screener || t('caregiver')}</Text>
                              </View>
                            </View>
                          </View>
                          <View style={[styles.historyScoreRow, { marginTop: scaleSize(10) }]}>
                            <Text style={[styles.scoreValue, { fontSize: scaleSize(18), fontFamily: 'Inter_800ExtraBold', color: '#18182D' }]}>
                              {session.score} / {session.total}
                            </Text>
                            <View style={[styles.resultBadge, { backgroundColor: sessionColors.bg, borderRadius: scaleSize(16), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(5) }]}>
                              <ResultFlagIcon width={scaleSize(12)} height={scaleSize(12)} fill={sessionColors.text} color={sessionColors.text} />
                              <Text style={[styles.resultBadgeText, { fontSize: scaleSize(11), color: sessionColors.text, marginLeft: scaleSize(4), fontFamily: 'Inter_700Bold' }]}>
                                {t(getResultLabelKey(session.result))}
                              </Text>
                            </View>
                            <Pressable
                              onPress={() => handleViewSessionReport(session)}
                              style={({ pressed }) => [
                                styles.viewDetailsBtn,
                                { borderRadius: scaleSize(20), paddingHorizontal: scaleSize(14), paddingVertical: scaleSize(8), opacity: pressed ? 0.85 : 1 },
                              ]}
                            >
                              <Text style={[styles.viewDetailsBtnText, { fontSize: scaleSize(12) }]}>{t('viewDetails')}</Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}

              <Text style={[styles.sectionTitle, { fontSize: scaleSize(15), marginTop: scaleSize(4), fontFamily: 'Inter_600SemiBold', color: '#18182D' }]}>{t('learnMoreAboutChild')}</Text>
              
              <View style={{ gap: scaleSize(10) }}>
                {(dynamicFAQs.length > 0 ? dynamicFAQs.slice(0, 5) : FAQS.slice(0, 3)).map((faq, index) => {
                  const isExpanded = expandedLearnMore === index;
                  return (
                    <GradientBorderCard
                      key={index}
                      onPress={() => setExpandedLearnMore(isExpanded ? null : index)}
                      open={isExpanded}
                      borderRadius={scaleSize(16)}
                      borderWidth={scaleSize(1)}
                      padding={scaleSize(12)}
                    >
                      <View style={[styles.learnMoreHeader, { flexDirection: 'row', alignItems: 'center', gap: scaleSize(8) }]}>
                        <Text style={[styles.learnMoreTitle, { fontSize: scaleSize(14), flex: 1, fontFamily: 'Inter_500Medium', color: '#18182D' }]}>{'titleKey' in faq ? t((faq as any).titleKey) : faq.title}</Text>
                        <View style={[styles.learnMoreToggle, { width: scaleSize(20), height: scaleSize(20), borderRadius: scaleSize(10), backgroundColor: '#5963E1', justifyContent: 'center', alignItems: 'center' }]}>
                          <Text style={{ color: '#FFFFFF', fontSize: scaleSize(16), lineHeight: scaleSize(18), fontWeight: '700' }}>{isExpanded ? '−' : '+'}</Text>
                        </View>
                      </View>
                      {isExpanded && (
                        <View style={{ marginTop: scaleSize(10) }}>
                          <Text style={[styles.learnMoreBody, { fontSize: scaleSize(12), fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: scaleSize(15) }]}>
                            {'bodyKey' in faq ? t((faq as any).bodyKey) : faq.body}
                          </Text>
                        </View>
                      )}
                    </GradientBorderCard>
                  );
                })}
              </View>
            </View>
          ) : continueProgress ? (
            <View style={{ paddingHorizontal: padding, marginTop: scaleSize(16) }}>
              <HeroCard
                onPress={handleContinue}
                onContinue={handleContinue}
                onStartNew={handleStartNew}
                progress={continueProgress}
                childName={child?.name || t('yourChild')}
              />
            </View>
          ) : (
            <>
              <HeroCard
                onPress={handleStartNew}
                onContinue={continueProgress ? handleContinue : undefined}
                onStartNew={handleStartNew}
                progress={continueProgress}
                childName={child?.name || t('yourChild')}
                style={{ marginHorizontal: padding }}
              />

              <Section title={t('whyEarlyScreening')} body={t('whyEarlyScreeningBody')} scaleSize={scaleSize}>
                <View style={{ gap: scaleSize(12), marginTop: scaleSize(16) }}>
                  {LEARN_ITEMS.map((item) => {
                    const Icon = item.Icon;
                    return (
                      <View key={item.titleKey} style={styles.learnCard}>
                        <Icon width={scaleSize(48)} height={scaleSize(48)} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.learnTitle, { fontSize: scaleSize(16) }]}>{t(item.titleKey)}</Text>
                          <Text style={[styles.learnSubtitle, { fontSize: scaleSize(12), marginTop: scaleSize(4) }]}>{t(item.subtitleKey)}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </Section>

              <Section title={t('whatWillYouLearn')} body={t('whatWillYouLearnBody')} scaleSize={scaleSize}>
                <View style={{ gap: scaleSize(12), marginTop: scaleSize(16) }}>
                  {domainColumns.map((row, rowIndex) => (
                    <View key={`domain-row-${rowIndex}`} style={{ flexDirection: 'row', gap: scaleSize(12) }}>
                      {row.map((domain) => {
                        const Icon = domain.Icon;
                        return (
                          <View key={domain.name} style={[styles.domainCard, { borderRadius: scaleSize(16), padding: scaleSize(12) }]}>
                            <View style={[styles.domainIcon, { backgroundColor: domain.color, borderRadius: scaleSize(12), width: scaleSize(42), height: scaleSize(42) }]}>
                              <Icon width={scaleSize(30)} height={scaleSize(30)} />
                            </View>
                            <Text style={[styles.domainText, { fontSize: scaleSize(13) }]}>{domain.name}</Text>
                          </View>
                        );
                      })}
                      {row.length < 3
                        ? Array.from({ length: 3 - row.length }).map((_, index) => (
                            <View key={`domain-spacer-${rowIndex}-${index}`} style={{ flex: 1 }} />
                          ))
                        : null}
                    </View>
                  ))}
                </View>
              </Section>

              <View
                style={{ height: 0 }}
                onLayout={(e) => {
                  const { y, height } = e.nativeEvent.layout;
                  setFirstFoldBottom(y + height);
                }}
              />

              <Section title={t('howDoesItWork')} scaleSize={scaleSize}>
                <View style={{ gap: 0, marginTop: scaleSize(16) }}>
                  {STEPS.map((item, index) => (
                    <View key={item.step} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <View style={{ alignItems: 'center', width: scaleSize(34) }}>
                        <View style={[styles.stepBubble, { width: scaleSize(34), height: scaleSize(34), borderRadius: scaleSize(17) }]}>
                          <Text style={[styles.stepBubbleText, { fontSize: scaleSize(14) }]}>{item.step}</Text>
                        </View>
                        {index < STEPS.length - 1 && (
                          <View style={{ width: scaleSize(4), height: scaleSize(39), backgroundColor: '#F3F2FF', borderRadius: scaleSize(2), marginVertical: scaleSize(2) }} />
                        )}
                      </View>
                      <View style={{ flex: 1, paddingLeft: scaleSize(14), paddingTop: scaleSize(4) }}>
                        <Text style={[styles.stepTitle, { fontSize: scaleSize(16) }]}>{t(item.titleKey)}</Text>
                        <Text style={[styles.stepBody, { fontSize: scaleSize(13), lineHeight: scaleSize(18), marginTop: scaleSize(4) }]}>{t(item.subtitleKey)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Section>

              <Section title={t('learnBeforeYouBegin')} scaleSize={scaleSize}>
                <View style={{ gap: scaleSize(10), marginTop: scaleSize(12) }}>
                  {dynamicFAQs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <GradientBorderCard
                        key={faq.title}
                        onPress={() => setOpenFaq(isOpen ? -1 : index)}
                        open={isOpen}
                        borderRadius={scaleSize(18)}
                        borderWidth={1}
                        padding={scaleSize(14)}
                      >
                        <View style={styles.faqHeader}>
                          <Text style={[styles.faqTitle, { fontSize: scaleSize(14) }]}>{faq.title}</Text>
                          <Text style={styles.faqIcon}>{isOpen ? '−' : '+'}</Text>
                        </View>
                        {isOpen ? (
                          <Text style={[styles.faqBody, { fontSize: scaleSize(13), lineHeight: scaleSize(18), marginTop: scaleSize(10) }]}>{faq.body}</Text>
                        ) : null}
                      </GradientBorderCard>
                    );
                  })}
                </View>
              </Section>

              <View style={{ paddingHorizontal: padding, marginTop: scaleSize(18) }}>
                <PrivacyInfoCard
                  icon={<WarningIcon width={scaleSize(20)} height={scaleSize(20)} />}
                  backgroundColor={colors.selectedBackground}
                  title={t('screeningNotDiagnosis')}
                  titleColor="#535BD8"
                  subtitle={t('screeningNotDiagnosisBody')}
                />
              </View>
            </>
          )}
        </ScrollView>

        {!continueProgress && !latestCompletedSession && showBottomStartCta && (
          <View style={[styles.initialCtaFooter, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
            <Pressable
              onPress={handleStartNew}
              style={({ pressed }) => [
                styles.progressPrimaryCta,
                { height: scaleSize(54), borderRadius: scaleSize(28), opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={[styles.progressPrimaryText, { fontSize: scaleSize(16) }]}>{t('startScreeningFree')}</Text>
            </Pressable>
          </View>
        )}

        {/* FAB: always visible when a session is in progress; also visible post-screening as "New Screening" */}
        {(continueProgress || latestCompletedSession) && (
          <Pressable
            onPress={() => continueProgress ? setPlusMenuVisible(true) : handleStartNew()}
            style={({ pressed }) => [
              styles.plusButton,
              {
                width: scaleSize(64),
                height: scaleSize(64),
                borderRadius: scaleSize(32),
                bottom: scaleSize(80),
                right: scaleSize(16),
                opacity: pressed ? 0.95 : 1,
              },
            ]}
          >
            <PlusIcon width={scaleSize(32)} height={scaleSize(32)} color={colors.white} />
          </Pressable>
        )}
      </View>

      <SideMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLanguage={() => { setDrawerOpen(false); setLanguageModalVisible(true); }}
      />

      <ChildSwitcherSheet
        visible={childSwitcherVisible}
        onClose={() => setChildSwitcherVisible(false)}
        onSelectChild={(selectedChild: ChildProfile) => { fetchHistory(selectedChild.id); }}
        onAddChild={() => { setChildSwitcherVisible(false); navigation.navigate('CreateProfile', { nextRoute: 'Home' }); }}
        onEditChild={(c: ChildProfile) => { setChildSwitcherVisible(false); navigation.navigate('EditChildProfile', { child: c }); }}
      />
      <Modal
        animationType="slide"
        transparent
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable style={styles.languageBackdrop} onPress={() => setLanguageModalVisible(false)} />
        <View style={styles.languageSheet}>
          <View style={[styles.languageHandle, { width: scaleSize(40), height: scaleSize(4), borderRadius: scaleSize(999) }]} />
          <Text style={[styles.languageTitle, { fontSize: scaleSize(18) }]}>{t('selectLanguage')}</Text>
          <View style={{ gap: scaleSize(10), marginTop: scaleSize(16) }}>
            {LANGUAGES.map((lang) => {
              const selected = language === lang;
              return (
                <Pressable
                  key={lang}
                  onPress={() => {
                    setLanguage(lang as 'English' | 'Gujarati' | 'Hindi' | 'Kannada');
                    setLanguageModalVisible(false);
                  }}
                  style={[
                    styles.languageOption,
                    {
                      borderRadius: scaleSize(12),
                      paddingVertical: scaleSize(14),
                      paddingHorizontal: scaleSize(16),
                      borderWidth: scaleSize(2),
                      borderColor: selected ? '#535BD8' : 'rgba(201, 213, 255, 0.6)',
                      backgroundColor: selected ? '#F3F2FF' : colors.white,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      {
                        fontSize: scaleSize(16),
                        color: selected ? '#535BD8' : colors.mainBlack,
                        fontFamily: selected ? 'Inter_700Bold' : 'Inter_600SemiBold',
                      },
                    ]}
                  >
                    {lang}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
      {(continueProgress || plusMenuVisible) && (
        <Modal
          animationType="slide"
          transparent
          visible={plusMenuVisible}
          onRequestClose={() => setPlusMenuVisible(false)}
        >
          <View style={styles.progressModalBackdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setPlusMenuVisible(false)} />
            <View style={[styles.progressModalSheet, { padding: scaleSize(20) }]}
            >
              <View style={styles.progressModalHandle} />
              <Pressable style={styles.progressModalClose} onPress={() => setPlusMenuVisible(false)}>
                <CloseIcon width={scaleSize(16)} height={scaleSize(16)} />
              </Pressable>
              <Text style={[styles.progressModalLabel, { fontSize: scaleSize(12) }]}>{t('beforeYouContinue')}</Text>
              <Text style={[styles.progressModalTitle, { fontSize: scaleSize(22) }]}>{t('screeningInProgress')}</Text>
              <View style={[styles.progressInfoBox, { padding: scaleSize(14), marginTop: scaleSize(14) }]}>
                <View style={styles.progressInfoRow}>
                  <BookmarkIcon width={scaleSize(24)} height={scaleSize(24)} />
                  <View style={{ marginLeft: scaleSize(12) }}>
                    <Text style={[styles.progressInfoTitle, { fontSize: scaleSize(14) }]}>{t('unfinishedScreening')}</Text>
                    <Text style={[styles.progressInfoSubtitle, { fontSize: scaleSize(12) }]}>{t('sectionXOfYComplete', { section: String(continueSectionIndex + 1), total: '6', percent: String(continueProgressPercent) })}</Text>
                  </View>
                </View>
                <View style={styles.progressDots}>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <View key={idx} style={[styles.progressDot, { backgroundColor: idx <= continueSectionIndex ? '#535BD8' : '#E4E7FB' }]} />
                  ))}
                </View>
              </View>
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [styles.progressPrimaryCta, { opacity: pressed ? 0.9 : 1, height: scaleSize(54), marginTop: scaleSize(16) }]}
              >
                <Text style={[styles.progressPrimaryText, { fontSize: scaleSize(16) }]}>{t('continueScreening')}</Text>
              </Pressable>
              <Pressable
                onPress={handleStartNew}
                style={({ pressed }) => [styles.progressSecondaryCta, { opacity: pressed ? 0.9 : 1, height: scaleSize(54), marginTop: scaleSize(12) }]}
              >
                <Text style={[styles.progressSecondaryText, { fontSize: scaleSize(16) }]}>{t('startNewScreening')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

function ScreeningTrendCard({
  sessions,
  scaleSize,
}: {
  sessions: any[];
  scaleSize: (size: number) => number;
}) {
  const { t } = useTranslation();
  const plottedSessions = [...sessions]
    .slice(0, 4)
    .reverse()
    .map((session) => ({
      score: Number(session.score) || 0,
      total: Number(session.total) || 200,
      date: session.date || 'Screening',
    }));

  if (plottedSessions.length < 2) return null;

  const chartWidth = scaleSize(278);
  const chartHeight = scaleSize(112);
  const horizontalPadding = scaleSize(12);
  const verticalPadding = scaleSize(12);
  const maxScore = Math.max(...plottedSessions.map((session) => session.total), 1);
  const points = plottedSessions.map((session, index) => {
    const x = horizontalPadding + (index * (chartWidth - horizontalPadding * 2)) / (plottedSessions.length - 1);
    const y = verticalPadding + (1 - session.score / maxScore) * (chartHeight - verticalPadding * 2);
    return { x, y, ...session };
  });
  const firstScore = plottedSessions[0].score;
  const lastScore = plottedSessions[plottedSessions.length - 1].score;
  const change = lastScore - firstScore;
  const isImproved = change < 0;
  const percentChange = firstScore !== 0 ? Math.round((change / firstScore) * 100) : 0;
  const changeText = `${isImproved ? '-' : '+'}${Math.abs(percentChange)}%`;
  const improvementText = change < 0 ? t('improvementSinceLast') : change > 0 ? t('higherScoreSinceLast') : t('noChangeSinceLast');
  const trendStatusColor = isImproved ? '#1A7340' : change > 0 ? '#E25648' : '#6B7180';
  const trendStatusBg = isImproved ? '#E8F7F0' : change > 0 ? '#FDF0EB' : '#F4F5F5';
  const trendStatusText = isImproved ? t('improved') : change > 0 ? t('needsAttention') : t('inTrack');

  return (
    <View style={[styles.trendCard, { borderRadius: scaleSize(14), padding: scaleSize(12) }]}>
      <View style={styles.trendHeader}>
        <Text style={[styles.trendTitle, { fontSize: scaleSize(12) }]}>{t('scoreTrend')}</Text>
        <View style={[styles.trendStatus, { borderRadius: scaleSize(10), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(3), backgroundColor: trendStatusBg }]}>
          <Text style={[styles.trendStatusText, { fontSize: scaleSize(9), color: trendStatusColor }]}>{trendStatusText}</Text>
        </View>
      </View>
      <Svg width={chartWidth} height={chartHeight} accessibilityLabel="Screening score trend">
        {[0.25, 0.5, 0.75].map((ratio) => {
          const y = verticalPadding + ratio * (chartHeight - verticalPadding * 2);
          return <Line key={ratio} x1={horizontalPadding} y1={y} x2={chartWidth - horizontalPadding} y2={y} stroke="#E6E9F3" strokeWidth={1} />;
        })}
        <Polyline points={points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={isImproved ? '#1A7340' : change > 0 ? '#E25648' : '#5963E1'} strokeWidth={scaleSize(2)} />
        {points.map((point, index) => {
          const isLast = index === points.length - 1;
          return (
            <React.Fragment key={`${point.date}-${index}`}>
              <Circle cx={point.x} cy={point.y} r={scaleSize(3)} fill="#FFFFFF" stroke={isLast ? trendStatusColor : '#5963E1'} strokeWidth={scaleSize(1.5)} />
              <SvgText
                x={point.x}
                y={chartHeight - scaleSize(1)}
                textAnchor="middle"
                fontFamily="Inter_500Medium"
                fontSize={scaleSize(8)}
                fill={isLast ? trendStatusColor : '#6B7180'}
              >
                {point.date.split(' ').slice(0, 2).join(' ')}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={[styles.trendFooter, { marginTop: scaleSize(6) }]}>
        <View style={[styles.trendChange, { borderRadius: scaleSize(12), paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(4), backgroundColor: trendStatusBg }]}>
          <Text style={[styles.trendChangeText, { fontSize: scaleSize(10), color: trendStatusColor }]}>{changeText}</Text>
        </View>
        <Text style={[styles.trendFooterText, { fontSize: scaleSize(10) }]}>{improvementText}</Text>
      </View>
    </View>
  );
}

function Section({
  title,
  body,
  children,
  scaleSize,
}: {
  title: string;
  body?: string;
  children: React.ReactNode;
  scaleSize: (size: number) => number;
}) {
  const { padding } = useResponsive();
  return (
    <View style={{ paddingHorizontal: padding, marginTop: scaleSize(28) }}>
      <Text style={[styles.sectionTitle, { fontSize: scaleSize(22) }]}>{title}</Text>
      {body ? (
        <Text style={[styles.sectionBody, { fontSize: scaleSize(14), lineHeight: scaleSize(20), marginTop: scaleSize(8) }]}>{body}</Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    marginTop: 2,
  },
  chevron: {
    color: colors.mainBlack,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
  },
  sectionBody: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  learnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  learnTitle: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  learnSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  domainCard: {
    flex: 1,
    minHeight: 92,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domainIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainText: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepBubble: {
    backgroundColor: '#F0F1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBubbleText: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.primaryBlue,
  },
  stepTitle: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  stepBody: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  faqCard: {
    borderWidth: 1,
    borderColor: '#DFDFDF',
    backgroundColor: colors.white,
  },
  faqCardOpen: {
    borderColor: colors.primaryBlue,
    backgroundColor: '#FAFAFF',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  faqTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  faqIcon: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.primaryBlue,
    fontSize: 20,
  },
  faqBody: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    flexDirection: 'row',
  },
  drawerSheet: {
    backgroundColor: colors.white,
  },
  drawerHeader: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
  },
  drawerProfile: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatarCircleSmall: {
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerName: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  drawerMeta: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    marginTop: 2,
  },
  drawerSection: {},
  drawerSectionLabel: {
    fontFamily: 'Inter_700Bold',
    color: colors.grey,
    textTransform: 'uppercase',
  },
  drawerItem: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
  },
  logoutRow: {
    marginTop: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EAF1',
  },
  logoutText: {
    fontFamily: 'Inter_700Bold',
    color: '#D12B2B',
  },
  drawerLangRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerLangValue: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  drawerVersion: {
    fontFamily: 'Inter_500Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },
  languageButton: {
    backgroundColor: '#F5F6F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 24, 0.53)',
  },
  languageSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  languageHandle: {
    backgroundColor: '#E2E4E8',
    alignSelf: 'center',
    marginBottom: 14,
  },
  languageTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    textAlign: 'center',
  },
  languageOption: {
    justifyContent: 'center',
  },
  languageOptionText: {
    textAlign: 'left',
  },
  plusButton: {
    position: 'absolute',
    backgroundColor: '#535BD8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5963E1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 16,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E4E7FB',
    shadowColor: '#353A72',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    gap: 12,
  },
  progressBadge: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  progressTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    lineHeight: 26,
  },
  progressInfoBox: {
    borderRadius: 18,
    backgroundColor: '#F3F2FF',
    gap: 12,
  },
  progressInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfoTitle: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  progressInfoSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    marginTop: 4,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    flex: 1,
    height: 6,
    borderRadius: 999,
  },
  initialCtaFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E4E8',
    paddingTop: 12,
  },
  progressPrimaryCta: {
    backgroundColor: '#535BD8',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPrimaryText: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  progressSecondaryCta: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E1E2EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSecondaryText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
  },
  progressModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  progressModalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 32,
    gap: 12,
  },
  progressModalHandle: {
    width: 60,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#E0E1EA',
    alignSelf: 'center',
    marginBottom: 12,
  },
  progressModalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressModalLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.grey,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  progressModalTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    lineHeight: 28,
  },
  rescreenBanner: { backgroundColor: '#F3F2FF', borderWidth: 1, borderColor: '#D9DBFF' },
  rescreenMeta: { fontFamily: 'Inter_600SemiBold', color: '#535BD8', letterSpacing: 0.4, textTransform: 'uppercase' },
  rescreenTitle: { fontFamily: 'Inter_800ExtraBold', color: '#18182D', lineHeight: 26 },
  rescreenSub: { fontFamily: 'Inter_400Regular', color: '#6B7180' },
  rescreenCta: { backgroundColor: '#535BD8', justifyContent: 'center', alignItems: 'center' },
  rescreenCtaText: { fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  historyCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E7FB' },
  historyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyMeta: { gap: 2 },
  historyScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  viewDetailsBtn: { backgroundColor: '#535BD8' },
  viewDetailsBtnText: { fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  overviewCard: { backgroundColor: '#F3F2FF', gap: 8 },
  overviewDivider: { height: 1, backgroundColor: '#E7E8F5' },
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
  insightCard: { backgroundColor: '#F8F8FF', borderWidth: 1, borderColor: '#E2E4E8' },
  insightHeader: { flexDirection: 'row', alignItems: 'center' },
  insightIconBox: { justifyContent: 'center', alignItems: 'center' },
  insightTitle: { fontFamily: 'Inter_600SemiBold', color: '#6B7180' },
  insightHeading: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  statusBadgeInline: { justifyContent: 'center', alignItems: 'center' },
  statusBadgeText: { fontFamily: 'Inter_700Bold' },
  bullet: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
  trendCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E7FB' },
  trendHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trendTitle: { fontFamily: 'Inter_700Bold', color: '#535BD8' },
  trendStatus: { backgroundColor: '#DDF7D9' },
  trendStatusText: { fontFamily: 'Inter_700Bold', color: '#2E9B4E' },
  trendFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trendChange: { backgroundColor: '#E8F7F0' },
  trendChangeText: { fontFamily: 'Inter_700Bold', color: '#1A7340' },
  trendFooterText: { fontFamily: 'Inter_600SemiBold', color: '#6B7180' },
  learnMoreCard: { backgroundColor: '#F8F8FF', borderWidth: 1, borderColor: '#E2E4E8' },
  learnMoreHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  learnMoreTitle: { fontFamily: 'Inter_700Bold', color: '#18182D' },
  learnMoreToggle: { justifyContent: 'center', alignItems: 'center' },
  learnMoreBody: { fontFamily: 'Inter_400Regular', color: '#454545', lineHeight: 18 },
});
