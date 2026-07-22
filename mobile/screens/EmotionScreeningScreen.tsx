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
import TrophyIcon from '../assets/figma/screen19/trophy.svg';
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
    English: { text: `How often does the child react in a way that does not match the situation?`, tip: `Someone gets hurt, but the child laughs instead of showing concern, or everyone is happy, but the child suddenly starts crying.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `પરિસ્થિતિ પ્રમાણે બાળકની લાગણી અથવા પ્રતિક્રિયા મેળ ખાતી નથી?`, tip: `કોઈને વાગે ત્યારે બાળક હસે, અથવા બધા ખુશ હોય ત્યારે બાળક અચાનક રડવા લાગે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चे की भावनाएँ या प्रतिक्रिया उस समय की स्थिति से मेल नहीं खाती?`, tip: `किसी को चोट लगे तो बच्चा हँसने लगे, या सब खुश हों तो बच्चा अचानक रोने लगे।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಆ ಸಮಯಕ್ಕೆ ತಕ್ಕಂತೆ ಇಲ್ಲದ ರೀತಿಯಲ್ಲಿ ಮಗು ಭಾವನೆಗಳನ್ನು ತೋರಿಸುತ್ತದೆಯೇ?`, tip: `ಯಾರಿಗಾದರೂ ನೋವಾದಾಗ ಮಗು ನಗಲು ಆರಂಭಿಸುತ್ತದೆ ಅಥವಾ ಎಲ್ಲರೂ ಸಂತೋಷವಾಗಿದ್ದಾಗ ಮಗು ಅಳಲು ಆರಂಭಿಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child react much more strongly than the situation requires?`, tip: `The child cries for a long time over a small change, like getting a different cup or toy.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `નાની વાતમાં બાળક જરૂર કરતાં ઘણી વધારે પ્રતિક્રિયા આપે છે?`, tip: `નાનું ફેરફાર થાય, જેમ કે અલગ કપ કે પ્લેટ મળે, તો બાળક લાંબા સમય સુધી રડતું રહે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या छोटी-छोटी बातों पर बच्चा ज़रूरत से ज़्यादा प्रतिक्रिया देता है?`, tip: `छोटी-सी बात, जैसे अलग कप या प्लेट मिलने पर बच्चा लंबे समय तक रोता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಸಣ್ಣ ವಿಷಯಕ್ಕೂ ಮಗು ತುಂಬಾ ಹೆಚ್ಚು ಅಳುವುದು, ಕೋಪಗೊಳ್ಳುವುದು ಅಥವಾ ಉತ್ಸಾಹ ತೋರಿಸುತ್ತದೆಯೇ?`, tip: `ಬೇರೆ ಕಪ್ ಅಥವಾ ತಟ್ಟೆ ಕೊಟ್ಟರೆ ಮಗು ಬಹಳ ಹೊತ್ತು ಅಳುತ್ತಿರುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child suddenly laugh, cry, or become excited without an obvious reason?`, tip: `The child suddenly starts laughing, crying, or jumping around even though nothing has changed.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `કોઈ સ્પષ્ટ કારણ વગર બાળક અચાનક હસવા, રડવા અથવા ખૂબ ઉત્સાહિત થવા લાગે છે?`, tip: `આસપાસ કંઈ ખાસ ન બન્યું હોય છતાં બાળક અચાનક હસવા, રડવા અથવા કૂદવા લાગે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बिना किसी साफ़ कारण के बच्चा अचानक हँसने, रोने या बहुत ज़्यादा उत्साहित होने लगता है?`, tip: `आसपास कुछ बदला न हो, फिर भी बच्चा अचानक हँसने, रोने या उछलने-कूदने लगे।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಯಾವುದೇ ಸ್ಪಷ್ಟ ಕಾರಣವಿಲ್ಲದೆ ಮಗು ಏಕಾಏಕಿ ನಗಲು, ಅಳಲು ಅಥವಾ ತುಂಬಾ ಉತ್ಸಾಹಗೊಳ್ಳಲು ಆರಂಭಿಸುತ್ತದೆಯೇ?`, tip: `ಸುತ್ತಮುತ್ತ ಏನೂ ಆಗದಿದ್ದರೂ ಮಗು ಏಕಾಏಕಿ ನಗಲು, ಅಳಲು ಅಥವಾ ಕುಣಿಯಲು ಆರಂಭಿಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child do dangerous things without seeming to understand the risk?`, tip: `The child runs towards a busy road or touches a hot object without hesitation.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક જોખમી વસ્તુઓ કે જગ્યાઓથી ડર્યા વગર ત્યાં જવાનો પ્રયત્ન કરે છે?`, tip: `બાળક રસ્તા તરફ દોડે, ગરમ વસ્તુને અડવાનો પ્રયત્ન કરે અથવા ઊંચી જગ્યાએ ચઢી જાય.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा ख़तरनाक चीज़ों या जगहों से बिना डरे वहाँ जाने की कोशिश करता है?`, tip: `बच्चा सड़क की ओर दौड़ने लगे, गर्म चीज़ छूने की कोशिश करे या ऊँची जगह पर चढ़ जाए।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಅಪಾಯವಾಗುವ ಸ್ಥಳ ಅಥವಾ ವಸ್ತುಗಳ ಬಳಿಗೆ ಮಗು ಹೆದರದೇ ಹೋಗಲು ಪ್ರಯತ್ನಿಸುತ್ತದೆಯೇ?`, tip: `ಮಗು ರಸ್ತೆಯ ಕಡೆ ಓಡುವುದು, ಬಿಸಿ ವಸ್ತುವನ್ನು ಮುಟ್ಟಲು ಹೋಗುವುದು ಅಥವಾ ಎತ್ತರದ ಜಾಗಕ್ಕೆ ಏರುವುದು.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child suddenly become very excited or upset without an obvious reason?`, tip: `The child suddenly starts crying or becomes very excited even though nothing unusual has happened.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `કોઈ સ્પષ્ટ કારણ વગર બાળક અચાનક ખૂબ ઉત્સાહિત અથવા ખૂબ અસ્વસ્થ થઈ જાય છે?`, tip: `આસપાસ કંઈ બદલાયું ન હોય છતાં બાળક અચાનક ખૂબ ખુશ થઈ જાય અથવા જોરથી રડવા લાગે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बिना किसी साफ़ कारण के बच्चा अचानक बहुत ज़्यादा उत्साहित या बहुत परेशान हो जाता है?`, tip: `बिना किसी वजह के बच्चा अचानक ज़ोर से रोने लगे या बहुत ज़्यादा उछलने-कूदने लगे।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಯಾವುದೇ ಸ್ಪಷ್ಟ ಕಾರಣವಿಲ್ಲದೆ ಮಗು ಏಕಾಏಕಿ ತುಂಬಾ ಉತ್ಸಾಹಗೊಳ್ಳುತ್ತದೆಯೇ ಅಥವಾ ತುಂಬಾ ಅಸ್ವಸ್ಥವಾಗುತ್ತದೆಯೇ?`, tip: `ಯಾವುದೇ ಕಾರಣ ಕಾಣಿಸದಿದ್ದರೂ ಮಗು ಏಕಾಏಕಿ ಜೋರಾಗಿ ಅಳಲು ಅಥವಾ ತುಂಬಾ ಓಡಾಡಲು ಆರಂಭಿಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
];

export default function EmotionScreeningScreen({ navigation }: { navigation: any }) {
  const { scaleSize, padding, scaleFont } = useResponsive();
  const { top, bottom } = useSafeAreaInsets();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const screening = useScreening();
  const [answers, setAnswers] = useState<(number | null)[]>(
    screening.getDomainAnswers('Emotion').length === QUESTIONS.length
      ? screening.getDomainAnswers('Emotion')
      : Array(QUESTIONS.length).fill(null)
  );
  useEffect(() => {
    screening.setDomainAnswers('Emotion', answers);
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
          <Text style={[styles.sectionLabel, { fontSize: scaleFont(12), color: '#2BA8A6' }]}>SECTION 02 OF 06</Text>
          <Pressable onPress={() => navigation.navigate('SaveExit', { sectionNumber: 2, answeredCount: answers.filter((a) => a !== null).length, totalQuestions: QUESTIONS.length })} style={styles.saveExit} hitSlop={scaleSize(10)}>
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
            const active = domain.key === 'Emotion';
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
              1 section complete. You've answered 9 questions about your child so far.
            </Text>
            <View style={{ flexDirection: 'row', gap: scaleSize(4), marginTop: scaleSize(8) }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: scaleSize(4),
                    borderRadius: scaleSize(2),
                    backgroundColor: i === 0 ? '#535BD8' : '#E2E4E8',
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
          onPress={() => allAnswered && navigation.navigate('SpeechScreening')}
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
