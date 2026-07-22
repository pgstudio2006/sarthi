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
import TrophyIcon from '../assets/figma/screen21/trophy.svg';
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
    English: { text: `How often does the child repeatedly flap their hands, rock their body, spin, or make the same movements again and again?`, tip: `The child keeps moving their hands, fingers, or body in the same way again and again.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક એક જ પ્રકારની શરીરની હિલચાલ વારંવાર કરે છે?`, tip: `ખુશ થાય અથવા ઉત્સાહમાં આવે ત્યારે બાળક હાથ હલાવે, શરીર હલાવે અથવા ગોળ-ગોળ ફરે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा एक ही तरह की शारीरिक हरकत बार-बार करता है?`, tip: `खुश होने या उत्साहित होने पर बच्चा बार-बार हाथ हिलाता है, शरीर झुलाता है या गोल-गोल घूमता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ಒಂದೇ ರೀತಿಯ ದೇಹದ ಚಲನೆಗಳನ್ನು ಮತ್ತೆ ಮತ್ತೆ ಮಾಡುತ್ತದೆಯೇ?`, tip: `ಸಂತೋಷವಾದಾಗ ಅಥವಾ ಉತ್ಸಾಹಗೊಂಡಾಗ ಮಗು ಕೈಗಳನ್ನು ಪದೇ ಪದೇ ಆಡಿಸುವುದು, ದೇಹವನ್ನು ಮುಂದೆ-ಹಿಂದೆ ಆಡಿಸುವುದು ಅಥವಾ ಸುತ್ತುವುದು.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child become unusually attached to a particular object?`, tip: `The child insists on carrying the same spoon, bottle, string, or toy everywhere.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક કોઈ એક વસ્તુ સાથે અસામાન્ય રીતે વધારે જોડાયેલું રહે છે?`, tip: `બાળક એક જ રમકડું, ચમચી, દોરી અથવા બોટલ હંમેશાં પોતાની સાથે રાખવા માંગે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा किसी एक चीज़ से ज़रूरत से ज़्यादा जुड़ जाता है?`, tip: `बच्चा एक ही खिलौना, बोतल, चम्मच या कपड़ा हमेशा अपने पास रखना चाहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ಯಾವುದಾದರೂ ಒಂದು ವಸ್ತುವಿನ ಮೇಲೆ ಅತಿಯಾಗಿ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆಯೇ?`, tip: `ಮಗು ಒಂದೇ ಆಟಿಕೆ, ಬಾಟಲಿ, ಚಮಚ ಅಥವಾ ಬಟ್ಟೆಯನ್ನು ಯಾವಾಗಲೂ ತನ್ನ ಜೊತೆಯಲ್ಲೇ ಇಟ್ಟುಕೊಳ್ಳಲು ಬಯಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child seem unable to sit still or stay calm?`, tip: `Even during meals or story time, the child keeps getting up, running around, or moving constantly.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળકને એક જગ્યાએ શાંતિથી બેસવામાં મુશ્કેલી પડે છે?`, tip: `જમતી વખતે, ક્લાસમાં અથવા વાર્તા સાંભળતી વખતે પણ બાળક વારંવાર ઊભું થઈ જાય અથવા સતત હલતું રહે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चे को एक जगह शांति से बैठने में कठिनाई होती है?`, tip: `खाना खाते समय, क्लास में या कहानी सुनते समय भी बच्चा बार-बार उठ जाता है या लगातार इधर-उधर घूमता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗುವಿಗೆ ಒಂದು ಜಾಗದಲ್ಲಿ ಶಾಂತವಾಗಿ ಕುಳಿತುಕೊಳ್ಳಲು ಕಷ್ಟವಾಗುತ್ತದೆಯೇ?`, tip: `ಊಟ ಮಾಡುವಾಗ, ಕ್ಲಾಸ್‌ನಲ್ಲಿ ಅಥವಾ ಕಥೆ ಕೇಳುವಾಗಲೂ ಮಗು ಪದೇ ಪದೇ ಎದ್ದು ಓಡಾಡುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child hit, kick, bite, push, or hurt others?`, tip: `When upset, the child may hit, bite, or push a family member or another child.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક ગુસ્સો આવે અથવા મનનું ન થાય ત્યારે બીજા લોકોને મારે, ધક્કો મારે અથવા ઇજા પહોંચાડે છે?`, tip: `રમકડું ન મળે અથવા મનનું ન થાય ત્યારે બાળક બીજા બાળકને મારે અથવા ધક્કો મારે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या गुस्सा आने पर या मन की बात न होने पर बच्चा दूसरे लोगों को मारता, धक्का देता या चोट पहुँचाने की कोशिश करता है?`, tip: `खिलौना न मिलने या अपनी बात पूरी न होने पर बच्चा दूसरे बच्चे को मार देता है या धक्का दे देता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಕೋಪ ಬಂದಾಗ ಅಥವಾ ಮನಸ್ಸಿನಂತೆ ಆಗದಿದ್ದಾಗ ಮಗು ಇತರರನ್ನು ಹೊಡೆಯುತ್ತದೆಯೇ, ತಳ್ಳುತ್ತದೆಯೇ ಅಥವಾ ಗಾಯಪಡಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತದೆಯೇ?`, tip: `ಆಟಿಕೆ ಸಿಗದಿದ್ದಾಗ ಅಥವಾ ತನ್ನ ಮಾತು ನಡೆಯದಿದ್ದಾಗ ಮಗು ಇನ್ನೊಬ್ಬ ಮಗುವನ್ನು ಹೊಡೆಯುತ್ತದೆ ಅಥವಾ ತಳ್ಳುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child have intense tantrums that are difficult to calm?`, tip: `The child cries, screams, or throws themselves on the floor when something doesn't go as expected.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `નાની વાતમાં બાળક ખૂબ રડે, ચીસો પાડે અથવા શાંત થવામાં લાંબો સમય લે છે?`, tip: `મનપસંદ વસ્તુ ન મળે અથવા રૂટિન બદલાય તો બાળક લાંબા સમય સુધી રડતું કે ચીસો પાડતું રહે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या छोटी-छोटी बातों पर बच्चा बहुत देर तक रोता, चिल्लाता या शांत होने में समय लेता है?`, tip: `मनपसंद चीज़ न मिलने या रूटीन बदलने पर बच्चा लंबे समय तक रोता या चिल्लाता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಸಣ್ಣ ವಿಷಯಕ್ಕೂ ಮಗು ತುಂಬಾ ಹೊತ್ತು ಅಳುತ್ತದೆಯೇ, ಜೋರಾಗಿ ಕಿರುಚುತ್ತದೆಯೇ ಅಥವಾ ಶಾಂತವಾಗಲು ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆಯೇ?`, tip: `ಇಷ್ಟದ ವಸ್ತು ಸಿಗದಿದ್ದರೆ ಅಥವಾ ರೂಟೀನ್ ಬದಲಾಗಿದರೆ ಮಗು ಬಹಳ ಹೊತ್ತು ಅಳುತ್ತಿರುತ್ತದೆ ಅಥವಾ ಕೋಪ ತೋರಿಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child hurt themselves on purpose?`, tip: `The child bangs their head, bites their hand, or hits themselves when upset or excited.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક પોતાને જ ઇજા પહોંચાડે તેવી હરકતો કરે છે?`, tip: `ગુસ્સો આવે અથવા ઉત્સાહમાં બાળક પોતાનું માથું ભીંત પર મારે, પોતાને કરડે અથવા પોતાને જ મારે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा गुस्से या उत्साह में खुद को चोट पहुँचाने जैसी हरकत करता है?`, tip: `बच्चा अपना सिर दीवार से मारता है, खुद को काटता है या खुद को मारता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಕೋಪ ಅಥವಾ ಉತ್ಸಾಹದಲ್ಲಿ ಮಗು ತನ್ನನ್ನೇ ಗಾಯಪಡಿಸಿಕೊಳ್ಳುವಂತೆ ವರ್ತಿಸುತ್ತದೆಯೇ?`, tip: `ಮಗು ತನ್ನ ತಲೆಯನ್ನು ಗೋಡೆಗೆ ಹೊಡೆಯುವುದು, ತನ್ನನ್ನೇ ಹೊಡೆಯುವುದು ಅಥವಾ ತನ್ನ ಕೈಯನ್ನು ಕಚ್ಚಿಕೊಳ್ಳುವುದು.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child become upset when daily routines or familiar things change?`, tip: `The child becomes very upset if the usual route, routine, or order of activities changes.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `દૈનિક રૂટિન અથવા ઓળખીતી વસ્તુમાં ફેરફાર થાય તો બાળક ખૂબ અસ્વસ્થ થઈ જાય છે?`, tip: `રોજ જવાના રસ્તામાં ફેરફાર થાય અથવા વસ્તુ બીજી જગ્યાએ મૂકી હોય તો બાળક ખૂબ પરેશાન થઈ જાય.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या रोज़ की आदत या रूटीन में बदलाव होने पर बच्चा बहुत परेशान हो जाता है?`, tip: `रोज़ जाने वाला रास्ता बदल जाए या कोई चीज़ अपनी जगह पर न हो, तो बच्चा बहुत परेशान हो जाता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ದಿನನಿತ್ಯದ ರೂಟೀನ್ ಅಥವಾ ಪರಿಚಿತ ವಸ್ತುಗಳಲ್ಲಿ ಬದಲಾವಣೆ ಬಂದರೆ ಮಗು ತುಂಬಾ ಅಸಮಾಧಾನಗೊಳ್ಳುತ್ತದೆಯೇ?`, tip: `ಪ್ರತಿದಿನ ಹೋಗುವ ದಾರಿ ಬದಲಾದರೆ ಅಥವಾ ವಸ್ತು ತನ್ನ ಜಾಗದಲ್ಲಿ ಇರದಿದ್ದರೆ ಮಗು ತುಂಬಾ ಬೇಸರಗೊಳ್ಳುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
];

export default function BehaviorScreeningScreen({ navigation }: { navigation: any }) {
  const { scaleSize, padding, scaleFont } = useResponsive();
  const { top, bottom } = useSafeAreaInsets();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const screening = useScreening();
  const [answers, setAnswers] = useState<(number | null)[]>(
    screening.getDomainAnswers('Behavior').length === QUESTIONS.length
      ? screening.getDomainAnswers('Behavior')
      : Array(QUESTIONS.length).fill(null)
  );
  useEffect(() => {
    screening.setDomainAnswers('Behavior', answers);
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
          <Text style={[styles.sectionLabel, { fontSize: scaleFont(12), color: '#D66A8E' }]}>SECTION 04 OF 06</Text>
          <Pressable onPress={() => navigation.navigate('SaveExit', { sectionNumber: 4, answeredCount: answers.filter((a) => a !== null).length, totalQuestions: QUESTIONS.length })} style={styles.saveExit} hitSlop={scaleSize(10)}>
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
            const active = domain.key === 'Behavior';
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
              3 sections complete. You've answered 23 questions about your child so far.
            </Text>
            <View style={{ flexDirection: 'row', gap: scaleSize(4), marginTop: scaleSize(8) }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: scaleSize(4),
                    borderRadius: scaleSize(2),
                    backgroundColor: i < 3 ? '#535BD8' : '#E2E4E8',
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
          onPress={() => allAnswered && navigation.navigate('SensoryScreening')}
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
