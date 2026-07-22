import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useTranslation } from '../i18n';
import { useLanguage } from '../context/LanguageContext';
import { useScreening } from '../context/ScreeningContext';
import BackArrow from '../assets/figma/screen18/Vector.svg';
import PauseIcon from '../assets/figma/screen18/motion_photos_paused.svg';
import TrophyIcon from '../assets/figma/screen22/trophy.svg';
import SocialIcon from '../assets/figma/screen18/Frame-2.svg';
import EmotionIcon from '../assets/figma/screen18/Frame-5.svg';
import SpeechIcon from '../assets/figma/screen18/Frame-3.svg';
import BehaviorIcon from '../assets/figma/screen18/Frame.svg';
import SensoryIcon from '../assets/figma/screen18/Frame-4.svg';
import CognitiveIcon from '../assets/figma/screen18/Frame-1.svg';

type Language = 'English' | 'Gujarati' | 'Hindi' | 'Kannada';

type LocalizedQuestion = Record<Language, { text: string; tip: string; options: string[] }>;

const DOMAINS = [
  { key: 'Social', label: 'Social', Icon: SocialIcon, color: '#E9D4F7', activeColor: '#9651C8' },
  { key: 'Emotion', label: 'Emotion', Icon: EmotionIcon, color: '#D1E7E4', activeColor: '#2BA8A6' },
  { key: 'Speech', label: 'Speech', Icon: SpeechIcon, color: '#D6EDF9', activeColor: '#3B8DBD' },
  { key: 'Behavior', label: 'Behavior', Icon: BehaviorIcon, color: '#F7DDE9', activeColor: '#D66A8E' },
  { key: 'Sensory', label: 'Sensory', Icon: SensoryIcon, color: '#FCE5D6', activeColor: '#F4A261' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#E6E3F3', activeColor: '#7D6CB7' },
];

const QUESTIONS: LocalizedQuestion[] = [
  {
    English: { text: `How often does the child react strongly to everyday sounds, lights, smells, touch, or certain clothes?`, tip: `The child covers their ears to ordinary sounds or refuses to wear certain clothes because they feel uncomfortable.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `સામાન્ય અવાજ, સ્પર્શ, કપડાં, સુગંધ અથવા તેજ લાઇટથી બાળકને ખૂબ તકલીફ થાય છે?`, tip: `મિક્સરનો અવાજ, ચોક્કસ કપડાં અથવા તેજ લાઇટથી બાળક કાન ઢાંકી લે, કપડાં ઉતારી દે અથવા ખૂબ પરેશાન થઈ જાય.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या सामान्य आवाज़, छूने, कपड़ों, गंध या तेज़ रोशनी से बच्चे को बहुत ज़्यादा परेशानी होती है?`, tip: `मिक्सर की आवाज़, कुछ कपड़े पहनने या तेज़ रोशनी होने पर बच्चा कान ढक लेता है, कपड़े पहनने से मना कर देता है या रोने लगता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಸಾಮಾನ್ಯ ಶಬ್ದ, ಸ್ಪರ್ಶ, ಬಟ್ಟೆ, ವಾಸನೆ ಅಥವಾ ಹೆಚ್ಚು ಬೆಳಕಿನಿಂದ ಮಗುವಿಗೆ ತುಂಬಾ ತೊಂದರೆ ಆಗುತ್ತದೆಯೇ?`, tip: `ಮಿಕ್ಸಿಯ ಶಬ್ದ, ಕೆಲವು ಬಟ್ಟೆಗಳನ್ನು ಧರಿಸುವಾಗ ಅಥವಾ ಹೆಚ್ಚು ಬೆಳಕಿದ್ದಾಗ ಮಗು ಕಿವಿ ಮುಚ್ಚಿಕೊಳ್ಳುತ್ತದೆ, ಬಟ್ಟೆ ಧರಿಸಲು ನಿರಾಕರಿಸುತ್ತದೆ ಅಥವಾ ಅಳಲು ಆರಂಭಿಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child stare into space for a long time without responding?`, tip: `The child keeps staring ahead and does not respond immediately when spoken to.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક લાંબા સમય સુધી એક જગ્યાએ તાકી રહે છે અને નામ બોલાવ્યા પછી પણ તરત સામે જોતું નથી?`, tip: `જમતી વખતે અથવા રમતી વખતે નામ બોલાવો, તો પણ બાળક તરત સામે જોતું નથી.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा लंबे समय तक एक ही जगह देखता रहता है और नाम पुकारने पर भी तुरंत सामने नहीं देखता?`, tip: `माता-पिता या टीचर दो-तीन बार नाम पुकारें, फिर भी बच्चा कुछ समय तक उसी तरफ़ देखता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ಬಹಳ ಹೊತ್ತು ಒಂದೇ ಕಡೆ ನೋಡುತ್ತಿರುತ್ತದೆಯೇ ಮತ್ತು ಹೆಸರು ಕರೆದರೂ ಕೂಡಲೇ ನಿಮ್ಮ ಕಡೆ ನೋಡುವುದಿಲ್ಲವೇ?`, tip: `ಅಮ್ಮ, ಅಪ್ಪ ಅಥವಾ ಟೀಚರ್ ಎರಡು-ಮೂರು ಬಾರಿ ಹೆಸರು ಕರೆದರೂ ಮಗು ಸ್ವಲ್ಪ ಸಮಯ ಅದೇ ಕಡೆ ನೋಡುತ್ತಿರುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child have difficulty following a moving object with their eyes?`, tip: `The child finds it difficult to follow a rolling ball or a moving toy with their eyes.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `હલતી વસ્તુને જોતી વખતે બાળક તેની સાથે નજર ફેરવી શકતું નથી?`, tip: `બોલ રોલ થાય અથવા રમકડાની કાર ચાલે ત્યારે બાળક તેને સતત જોતું નથી.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या चलती हुई चीज़ को देखते समय बच्चा उसके साथ अपनी नज़र नहीं घुमा पाता?`, tip: `गेंद लुढ़कने या खिलौने की गाड़ी चलने पर बच्चा उसे लगातार नहीं देखता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಚಲಿಸುತ್ತಿರುವ ವಸ್ತುವನ್ನು ನೋಡುತ್ತಿರುವಾಗ ಅದರ ಕಡೆಗೆ ಕಣ್ಣನ್ನು ತಿರುಗಿಸಲು ಮಗುವಿಗೆ ಕಷ್ಟವಾಗುತ್ತದೆಯೇ?`, tip: `ಚೆಂಡು ಉರುಳಿದಾಗ ಅಥವಾ ಆಟದ ಕಾರು ಚಲಿಸಿದಾಗ ಮಗು ಅದನ್ನು ನಿರಂತರವಾಗಿ ನೋಡುತ್ತಿರೋದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child look at objects in unusual ways?`, tip: `The child looks at toys from the corner of their eyes or very close to their face.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક વસ્તુઓને અસામાન્ય રીતે જુએ છે?`, tip: `બાળક રમકડું ખૂબ નજીકથી જુએ અથવા આંખના ખૂણેથી જુએ.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा चीज़ों को अलग तरीके से देखता है?`, tip: `बच्चा खिलौने को बहुत पास से देखता है या आँख के कोने से देखने की कोशिश करता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ವಸ್ತುಗಳನ್ನು ಬೇರೆ ರೀತಿಯಲ್ಲಿ ನೋಡುತ್ತದೆಯೇ?`, tip: `ಮಗು ಆಟಿಕೆಯನ್ನು ತುಂಬಾ ಹತ್ತಿರದಿಂದ ನೋಡುತ್ತದೆ ಅಥವಾ ಕಣ್ಣಿನ ಬದಿಯಿಂದ ನೋಡಲು ಪ್ರಯತ್ನಿಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child seem to feel little or no pain after getting hurt?`, tip: `The child falls, gets a small cut, or bumps into something but shows little or no reaction.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `વાગે છતાં બાળક બહુ ઓછું દુખાવો બતાવે છે?`, tip: `પડી જાય, અથડાય અથવા વાગે, છતાં બાળકને ખાસ કંઈ થયું જ ન હોય એવું લાગે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या चोट लगने या गिरने पर भी बच्चा बहुत कम रोता है या दर्द होने की बात करता है?`, tip: `गिरने, टकराने या चोट लगने पर भी बच्चा बहुत कम रोता है या दर्द होने की बात नहीं करता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಬಿದ್ದರೂ ಅಥವಾ ಗಾಯವಾದರೂ ಮಗು ತುಂಬಾ ಕಡಿಮೆ ಅಳುತ್ತದೆಯೇ ಅಥವಾ ನೋವಾಗಿದೆ ಎಂದು ಹೇಳುವುದಿಲ್ಲವೇ?`, tip: `ಬಿದ್ದು, ಡಿಕ್ಕಿ ಹೊಡೆದರೂ ಅಥವಾ ಗಾಯವಾದರೂ ಮಗು ಹೆಚ್ಚು ಅಳುವುದಿಲ್ಲ ಅಥವಾ ನೋವಾಗಿದೆ ಎಂದು ಹೇಳುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child smell, touch, or taste people or objects in unusual ways?`, tip: `The child repeatedly smells toys, touches people's hair or face, or puts non-food objects into their mouth.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક વસ્તુઓને વારંવાર સૂંઘે, મોઢામાં મૂકે અથવા લોકોને વારંવાર સ્પર્શ કરે છે?`, tip: `બાળક રમકડાં સૂંઘે, લોકોના વાળ અથવા ચહેરાને વારંવાર સ્પર્શે અથવા ખાવાની વસ્તુ ન હોય તેવી વસ્તુ મોઢામાં મૂકે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा चीज़ों को बार-बार सूंघता, मुँह में डालता या लोगों को बार-बार छूता है?`, tip: `बच्चा खिलौने या दूसरी चीज़ों को बार-बार सूंघता या मुँह में डालता है, या लोगों के बाल या हाथ बार-बार छूता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ವಸ್ತುಗಳನ್ನು ಮತ್ತೆ ಮತ್ತೆ ಮೂಸುತ್ತದೆಯೇ, ಬಾಯಿಗೆ ಹಾಕುತ್ತದೆಯೇ ಅಥವಾ ಜನರನ್ನು ಪದೇ ಪದೇ ಮುಟ್ಟುತ್ತದೆಯೇ?`, tip: `ಮಗು ಆಟಿಕೆಗಳು ಅಥವಾ ಇತರ ವಸ್ತುಗಳನ್ನು ಪದೇ ಪದೇ ಮೂಸುತ್ತದೆ ಅಥವಾ ಬಾಯಿಗೆ ಹಾಕುತ್ತದೆ, ಅಥವಾ ಜನರ ಕೂದಲು ಅಥವಾ ಕೈಗಳನ್ನು ಪದೇ ಪದೇ ಮುಟ್ಟುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
];

export default function SensoryScreeningScreen({ navigation }: { navigation: any }) {
  const { scaleSize, padding, scaleFont } = useResponsive();
  const { top, bottom } = useSafeAreaInsets();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const screening = useScreening();
  const [answers, setAnswers] = useState<(number | null)[]>(
    screening.getDomainAnswers('Sensory').length === QUESTIONS.length
      ? screening.getDomainAnswers('Sensory')
      : Array(QUESTIONS.length).fill(null)
  );
  useEffect(() => {
    screening.setDomainAnswers('Sensory', answers);
  }, [answers]);
  const scrollRef = useRef<ScrollView>(null);
  const headerHeightRef = useRef(0);
  const positionsRef = useRef<number[]>([]);

  const handleSelect = useCallback((questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });

    if (questionIndex < QUESTIONS.length - 1) {
      const nextIndex = questionIndex + 1;
      const targetY = positionsRef.current[nextIndex];
      if (targetY !== undefined && scrollRef.current) {
        scrollRef.current.scrollTo({
          y: targetY - headerHeightRef.current + scaleSize(8),
          animated: true,
        });
      }
    }
  }, [scaleSize]);

  const onLayoutHeader = useCallback((event: any) => {
    headerHeightRef.current = event.nativeEvent.layout.height;
  }, []);

  const onLayoutQuestion = useCallback((questionIndex: number, event: any) => {
    positionsRef.current[questionIndex] = event.nativeEvent.layout.y;
  }, []);

  const allAnswered = answers.every((a) => a !== null);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingHorizontal: padding }]} onLayout={onLayoutHeader}>
        <View style={styles.headerTop}>
          <Text style={[styles.sectionLabel, { fontSize: scaleFont(12), color: '#F4A261' }]}>SECTION 05 OF 06</Text>
          <Pressable onPress={() => navigation.navigate('SaveExit', { sectionNumber: 5, answeredCount: answers.filter((a) => a !== null).length, totalQuestions: QUESTIONS.length })} style={styles.saveExit} hitSlop={scaleSize(10)}>
            <PauseIcon width={scaleSize(16)} height={scaleSize(16)} />
            <Text style={[styles.saveExitText, { fontSize: scaleFont(11) }]}>{t('saveExit')}</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {DOMAINS.map((domain, index) => {
            const active = domain.key === 'Sensory';
            const Icon = domain.Icon;
            const showConnector = index < DOMAINS.length - 1;
            return (
              <View key={domain.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ alignItems: 'center', width: scaleSize(52) }}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        width: scaleSize(44),
                        height: scaleSize(44),
                        borderRadius: scaleSize(12),
                        backgroundColor: active ? domain.activeColor : domain.color,
                      },
                    ]}
                  >
                    <Icon width={scaleSize(24)} height={scaleSize(24)} />
                  </View>
                  <Text
                    style={[
                      styles.tabText,
                      {
                        fontSize: scaleFont(10),
                        marginTop: scaleSize(4),
                        color: active ? domain.activeColor : '#9CA3AF',
                      },
                    ]}
                  >
                    {domain.label}
                  </Text>
                </View>
                {showConnector && (
                  <View
                    style={{
                      width: scaleSize(8),
                      height: scaleSize(2),
                      backgroundColor: '#E2E4E8',
                      marginHorizontal: scaleSize(-2),
                    }}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: padding, paddingTop: scaleSize(12) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F3F2FF',
            borderRadius: scaleSize(16),
            padding: scaleSize(16),
            gap: scaleSize(16),
          }}
        >
          <TrophyIcon width={scaleSize(32)} height={scaleSize(32)} />
          <View style={{ flex: 1, gap: scaleSize(4) }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: scaleFont(16), color: colors.mainBlack }}>
              You're doing great!
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: scaleFont(13), color: '#3B3B3E' }}>
              4 sections complete. You've answered 30 questions about your child so far.
            </Text>
            <View style={{ flexDirection: 'row', gap: scaleSize(4), marginTop: scaleSize(8) }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: scaleSize(4),
                    borderRadius: scaleSize(2),
                    backgroundColor: i < 4 ? '#535BD8' : '#E2E4E8',
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: scaleSize(140) + bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: scaleSize(12), paddingTop: scaleSize(8) }}>
          {QUESTIONS.map((question, qIndex) => (
            <View
              key={qIndex}
              style={[
                styles.card,
                {
                  borderRadius: scaleSize(20),
                  padding: scaleSize(16),
                  borderWidth: scaleSize(2),
                },
              ]}
              onLayout={(event) => onLayoutQuestion(qIndex, event)}
            >
              <Text style={[styles.questionMeta, { fontSize: scaleFont(12), marginBottom: scaleSize(8) }]}>
                Question {qIndex + 1} / {QUESTIONS.length}
              </Text>
              <Text style={[styles.questionText, { fontSize: scaleFont(16), lineHeight: scaleFont(22), marginBottom: scaleSize(12) }]}>
                {question[language].text}
              </Text>

              <View style={[styles.tipBox, { padding: scaleSize(10), borderLeftWidth: scaleSize(4), marginBottom: scaleSize(12) }]}>
                <Text style={[styles.tipText, { fontSize: scaleFont(13), lineHeight: scaleFont(18) }]}>
                  <Text style={styles.tipLabel}>Tip : </Text>
                  {question[language].tip}
                </Text>
              </View>

              <View style={{ gap: scaleSize(6) }}>
                {question[language].options.map((option, oIndex) => {
                  const selected = answers[qIndex] === oIndex;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => handleSelect(qIndex, oIndex)}
                      style={[
                        styles.option,
                        {
                          borderRadius: scaleSize(12),
                          paddingVertical: scaleSize(12),
                          paddingHorizontal: scaleSize(16),
                          borderWidth: selected ? scaleSize(2) : scaleSize(2),
                          borderColor: selected ? '#535BD8' : 'rgba(201, 213, 255, 0.6)',
                          backgroundColor: selected ? '#F3F2FF' : colors.white,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            fontSize: scaleFont(16),
                            color: selected ? '#535BD8' : colors.mainBlack,
                            fontFamily: selected ? 'Inter_700Bold' : 'Inter_600SemiBold',
                          },
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(20) + bottom }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backCircle, { width: scaleSize(56), height: scaleSize(56), borderRadius: scaleSize(28) }]}
        >
          <BackArrow width={scaleSize(12)} height={scaleSize(21)} />
        </Pressable>
        <Pressable
          onPress={() => allAnswered && navigation.navigate('CognitiveScreening')}
          style={[
            styles.continueButton,
            {
              height: scaleSize(56),
              borderRadius: scaleSize(28),
              opacity: allAnswered ? 1 : 0.6,
            },
          ]}
          disabled={!allAnswered}
        >
          <Text style={[styles.continueText, { fontSize: scaleFont(16) }]}>Continue to next section</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    color: '#9651C8',
    textAlign: 'center',
  },
  saveExit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saveExitText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
  },
  tabsContent: {
    alignItems: 'center',
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'Inter_500Medium',
  },
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: '#F8F9FC',
    borderColor: '#F1F1F1',
  },
  questionMeta: {
    fontFamily: 'Inter_600SemiBold',
    color: '#6B7180',
  },
  questionText: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  tipBox: {
    backgroundColor: 'rgba(167, 175, 200, 0.16)',
    borderColor: '#CBCEE7',
    borderStyle: 'solid',
  },
  tipText: {
    fontFamily: 'Inter_400Regular',
    color: '#3B3B3E',
  },
  tipLabel: {
    fontFamily: 'Inter_700Bold',
    color: '#535BD8',
  },
  option: {
    justifyContent: 'center',
  },
  optionText: {
    textAlign: 'left',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  backCircle: {
    backgroundColor: '#F5F6F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#535BD8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
});
