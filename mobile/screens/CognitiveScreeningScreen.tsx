import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useTranslation } from '../i18n';
import { useLanguage } from '../context/LanguageContext';
import { useScreening } from '../context/ScreeningContext';
import { useAuth } from '../context/AuthContext';
import BackArrow from '../assets/figma/screen18/Vector.svg';
import PauseIcon from '../assets/figma/screen18/motion_photos_paused.svg';
import FamilyStarIcon from '../assets/figma/screen23/family_star.svg';
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
    English: { text: `How often does the child have difficulty staying focused on an activity?`, tip: `The child quickly leaves one activity and moves to another without finishing.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક એક જ કામમાં લાંબા સમય સુધી ધ્યાન રાખી શકતું નથી?`, tip: `રમત, ભણતર અથવા બીજી એક્ટિવિટી કરતી વખતે બાળક થોડા જ સમયમાં બીજું કામ કરવા લાગે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा एक ही काम पर ज़्यादा देर तक ध्यान नहीं रख पाता?`, tip: `पढ़ते, खेलते या कोई एक्टिविटी करते समय बच्चा थोड़ी देर में ही दूसरी चीज़ में लग जाता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ಒಂದೇ ಕೆಲಸದ ಮೇಲೆ ಹೆಚ್ಚು ಹೊತ್ತು ಗಮನ ಇಡಲು ಕಷ್ಟಪಡುತ್ತದೆಯೇ?`, tip: `ಆಟವಾಡುವಾಗ, ಓದುವಾಗ ಅಥವಾ ಯಾವುದಾದರೂ ಚಟುವಟಿಕೆ ಮಾಡುವಾಗ ಮಗು ಸ್ವಲ್ಪ ಸಮಯದಲ್ಲೇ ಇನ್ನೊಂದು ಕೆಲಸಕ್ಕೆ ತಿರುಗುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child take much longer than expected to respond when spoken to?`, tip: `The child's name is called several times before they respond or follow a simple instruction.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `નામ બોલાવ્યા પછી અથવા સરળ સૂચના આપ્યા પછી બાળક જવાબ આપવામાં અથવા તે કામ શરૂ કરવામાં સામાન્ય કરતાં વધુ સમય લે છે?`, tip: `"અહીં આવ" અથવા "બોલ આપ" કહ્યા પછી બાળક થોડો સમય રાહ જોયા પછી જ તે કરે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या नाम पुकारने या आसान निर्देश देने पर बच्चा जवाब देने या काम शुरू करने में सामान्य से ज़्यादा समय लेता है?`, tip: `"इधर आओ" या "गेंद उठाओ" कहने पर बच्चा कुछ देर बाद ही जवाब देता है या काम शुरू करता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಹೆಸರು ಕರೆದಾಗ ಅಥವಾ ಸರಳ ಸೂಚನೆ ನೀಡಿದಾಗ ಮಗು ಉತ್ತರಿಸಲು ಅಥವಾ ಕೆಲಸ ಆರಂಭಿಸಲು ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆಯೇ?`, tip: `"ಇಲ್ಲಿ ಬಾ" ಅಥವಾ "ಚೆಂಡು ತಂದುಕೊ" ಎಂದು ಹೇಳಿದಾಗ ಮಗು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರವೇ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತದೆ ಅಥವಾ ಕೆಲಸ ಆರಂಭಿಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child remember unusual details much better than expected?`, tip: `The child remembers exact dates, routes, songs, or small details that others usually forget.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળકને અમુક વાતો અથવા વિગતો અસામાન્ય રીતે ખૂબ સારી રીતે યાદ રહે છે?`, tip: `બાળક લાંબા સમય પહેલાં સાંભળેલું ગીત, રસ્તો અથવા નાની-નાની વિગતો પણ સહેલાઈથી યાદ રાખે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चे को कुछ बातें या छोटी-छोटी बातें भी असामान्य रूप से बहुत अच्छी तरह याद रहती हैं?`, tip: `बच्चा कई दिन पहले सुना हुआ गाना, रास्ता या छोटी-छोटी बातें भी आसानी से याद रखता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗುವಿಗೆ ಕೆಲವು ವಿಷಯಗಳು ಅಥವಾ ಸಣ್ಣ ವಿವರಗಳೂ ಅಸಾಮಾನ್ಯವಾಗಿ ಚೆನ್ನಾಗಿ ನೆನಪಿರುತ್ತವೆಯೇ?`, tip: `ಹಲವು ದಿನಗಳ ಹಿಂದೆ ಕೇಳಿದ ಹಾಡು, ಹೋದ ದಾರಿ ಅಥವಾ ಸಣ್ಣ ವಿಷಯಗಳನ್ನೂ ಮಗು ಸುಲಭವಾಗಿ ನೆನಪಿಟ್ಟುಕೊಳ್ಳುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child show an exceptional skill that is much stronger than expected for their age?`, tip: `The child can solve difficult puzzles, play music, calculate numbers, or remember information far beyond what is expected for their age.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક પોતાની ઉંમર કરતાં કોઈ એક બાબતમાં અસામાન્ય રીતે ખૂબ કુશળ છે?`, tip: `બાળક મુશ્કેલ પઝલ ઝડપથી પૂર્ણ કરે, સંગીત વગાડે અથવા મોટી સંખ્યાઓ સહેલાઈથી યાદ રાખે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा अपनी उम्र के हिसाब से किसी एक काम में असामान्य रूप से बहुत अच्छा है?`, tip: `बच्चा मुश्किल पज़ल जल्दी हल कर लेता है, संगीत बजा लेता है या बड़ी संख्याएँ आसानी से याद रख लेता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ತನ್ನ ವಯಸ್ಸಿಗೆ ಹೋಲಿಸಿದರೆ ಮಗು ಯಾವುದಾದರೂ ಒಂದು ಕೆಲಸದಲ್ಲಿ ಅಸಾಮಾನ್ಯವಾಗಿ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆಯೇ?`, tip: `ಮಗು ಕಷ್ಟದ ಪಜಲ್‌ಗಳನ್ನು ಬೇಗ ಬಿಡಿಸುತ್ತದೆ, ಸಂಗೀತವನ್ನು ಸುಲಭವಾಗಿ ನುಡಿಸುತ್ತದೆ ಅಥವಾ ದೊಡ್ಡ ಸಂಖ್ಯೆಗಳನ್ನೂ ಸುಲಭವಾಗಿ ನೆನಪಿಡುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
];

export default function CognitiveScreeningScreen({ navigation }: { navigation: any }) {
  const { scaleSize, padding, scaleFont } = useResponsive();
  const { top, bottom } = useSafeAreaInsets();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const screening = useScreening();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<(number | null)[]>(
    screening.getDomainAnswers('Cognitive').length === QUESTIONS.length
      ? screening.getDomainAnswers('Cognitive')
      : Array(QUESTIONS.length).fill(null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    screening.setDomainAnswers('Cognitive', answers);
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
          <Text style={[styles.sectionLabel, { fontSize: scaleFont(12), color: '#7D6CB7' }]}>SECTION 06 OF 06</Text>
          <Pressable onPress={() => navigation.navigate('SaveExit', { sectionNumber: 6, answeredCount: answers.filter((a) => a !== null).length, totalQuestions: QUESTIONS.length })} style={styles.saveExit} hitSlop={scaleSize(10)}>
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
            const active = domain.key === 'Cognitive';
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
          <FamilyStarIcon width={scaleSize(32)} height={scaleSize(32)} />
          <View style={{ flex: 1, gap: scaleSize(4) }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: scaleFont(16), color: colors.mainBlack }}>
              Final section!
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: scaleFont(13), color: '#3B3B3E' }}>
              5 of 6 sections done. One more and you'll see your child's full screening report.
            </Text>
            <View style={{ flexDirection: 'row', gap: scaleSize(4), marginTop: scaleSize(8) }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: scaleSize(4),
                    borderRadius: scaleSize(2),
                    backgroundColor: i < 5 ? '#535BD8' : '#E2E4E8',
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
        {submitError ? (
          <Text style={[styles.errorText, { fontSize: scaleFont(13), marginBottom: scaleSize(8) }]}>{submitError}</Text>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(12) }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backCircle, { width: scaleSize(56), height: scaleSize(56), borderRadius: scaleSize(28) }]}
          >
            <BackArrow width={scaleSize(12)} height={scaleSize(21)} />
          </Pressable>
          <Pressable
            onPress={() => {
              if (allAnswered && !submitting) {
                setSubmitting(true);
                setSubmitError(null);
                screening
                  .submit()
                  .then((scoreData) => {
                    setSubmitting(false);
                    if (scoreData) {
                      const childName = user?.children?.find((c) => c.id === screening.childId)?.name || user?.children?.[0]?.name || 'Child';
                      const screenerName = user?.caregiverProfile?.name || 'Caregiver';
                      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                      const params = {
                        childName,
                        score: scoreData.totalScore,
                        total: scoreData.maxScore,
                        result: scoreData.result,
                        date: today,
                        screener: screenerName,
                        domainBreakdown: scoreData.domainBreakdown,
                        isRepeat: !!screening.previousScore,
                        previousScore: screening.previousScore
                          ? {
                              totalScore: screening.previousScore.totalScore,
                              result: screening.previousScore.result,
                              domainBreakdown: screening.previousScore.domainBreakdown,
                              date: (screening.previousScore as any).date || '',
                            }
                          : null,
                      };
                      const isNoAutism =
                        typeof scoreData.result === 'string' &&
                        ['no autism', 'no signs', 'normal'].some((t) =>
                          scoreData.result.toLowerCase().includes(t)
                        );
                      const isModerate =
                        typeof scoreData.result === 'string' &&
                        scoreData.result.toLowerCase().includes('moderate');
                      const isSevere =
                        typeof scoreData.result === 'string' &&
                        scoreData.result.toLowerCase().includes('severe');
                      const screenName = isNoAutism
                        ? 'NoAutismCompletion'
                        : isModerate
                        ? 'ModerateAutismCompletion'
                        : isSevere
                        ? 'SevereAutismCompletion'
                        : 'ScreeningCompletion';
                      navigation.navigate(screenName, params);
                    } else {
                      setSubmitError(screening.error || 'Failed to generate report. Please try again.');
                    }
                  })
                  .catch((err: any) => {
                    setSubmitting(false);
                    setSubmitError(err?.message || 'Something went wrong. Please try again.');
                  });
              }
            }}
            style={[
              styles.continueButton,
              {
                height: scaleSize(56),
                borderRadius: scaleSize(28),
                opacity: allAnswered ? 1 : 0.6,
              },
            ]}
            disabled={!allAnswered || submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={[styles.continueText, { fontSize: scaleFont(16) }]}>View report</Text>
            )}
          </Pressable>
        </View>
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
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#D12B2B',
    textAlign: 'center',
  },
});
