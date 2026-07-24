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
import SectionProgressWidget from '../components/SectionProgressWidget';
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
    English: { text: `How often does the child stop using words or sentences they could previously say?`, tip: `The child used to say words like "mummy" or "water" but no longer uses them.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક પહેલાં બોલતા શબ્દો અથવા નાના વાક્યો બોલવાનું બંધ કરી દીધું છે?`, tip: `બાળક પહેલાં "મમ્મી", "પાણી" જેવા શબ્દો બોલતું હતું, પણ હવે બોલતું નથી.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चे ने पहले जो शब्द या छोटे वाक्य बोलने शुरू किए थे, उन्हें बोलना बंद कर दिया है?`, tip: `बच्चा पहले "मम्मी", "पानी" जैसे शब्द बोलता था, लेकिन अब नहीं बोलता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮೊದಲು ಮಾತನಾಡುತ್ತಿದ್ದ ಪದಗಳು ಅಥವಾ ಸಣ್ಣ ವಾಕ್ಯಗಳನ್ನು ಮಗು ಈಗ ಮಾತನಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿದ್ದೆಯೇ?`, tip: `ಮೊದಲು "ಅಮ್ಮ", "ನೀರು" ಎಂದು ಹೇಳುತ್ತಿದ್ದ ಮಗು ಈಗ ಆ ಪದಗಳನ್ನು ಹೇಳುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child find it difficult to use gestures like pointing, waving, or nodding to communicate?`, tip: `Instead of pointing to a biscuit or waving goodbye, the child expects others to guess what they want.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક પોતાની જરૂરિયાત જણાવવા માટે ઇશારા, આંગળી ચીંધવી, હાથ હલાવવો અથવા માથું હલાવવું ઓછું કરે છે?`, tip: `પાણી જોઈએ ત્યારે આંગળી ચીંધવાને બદલે બાળક માત્ર ખેંચે છે અથવા રડવા લાગે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा अपनी बात समझाने के लिए इशारे, उंगली से दिखाना, हाथ हिलाना या सिर हिलाना कम करता है?`, tip: `पानी चाहिए होने पर बच्चा उंगली से दिखाने की बजाय सिर्फ़ खींचता है या रोने लगता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ತನ್ನ ಅಗತ್ಯವನ್ನು ಹೇಳಲು ಮಗು ಕೈ ಸನ್ನೆ, ಬೆರಳಿನಿಂದ ತೋರಿಸುವುದು, ಕೈ ಬೀಸುವುದು ಅಥವಾ ತಲೆ ಆಡಿಸುವುದನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆಯೇ?`, tip: `ನೀರು ಬೇಕಾದಾಗ ಬೆರಳಿನಿಂದ ತೋರಿಸುವ ಬದಲು ಮಗು ಕೈ ಹಿಡಿದು ಎಳೆಯುತ್ತದೆ ಅಥವಾ ಅಳಲು ಆರಂಭಿಸುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child repeat the same words or phrases again and again?`, tip: `The child repeats the same word, sentence, or dialogue many times, even when it doesn't fit the conversation.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક એક જ શબ્દ અથવા વાક્ય વારંવાર બોલે છે?`, tip: `બાળક એક જ શબ્દ કે ટીવીમાં સાંભળેલું વાક્ય ઘણી વખત સતત બોલ્યા કરે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा एक ही शब्द या वाक्य बार-बार दोहराता है?`, tip: `बच्चा एक ही शब्द या टीवी पर सुना हुआ वाक्य कई बार लगातार बोलता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ಒಂದೇ ಪದ ಅಥವಾ ವಾಕ್ಯವನ್ನು ಮತ್ತೆ ಮತ್ತೆ ಹೇಳುತ್ತದೆಯೇ?`, tip: `ಮಗು ಒಂದೇ ಪದ ಅಥವಾ ಟಿವಿಯಲ್ಲಿ ಕೇಳಿದ ವಾಕ್ಯವನ್ನು ಹಲವು ಬಾರಿ ಪುನಃ ಹೇಳುತ್ತಿರುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child repeat words or questions exactly as they hear them?`, tip: `When asked, "Do you want water?", the child repeats "Do you want water?" instead of answering.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બીજા લોકો જે બોલે છે, બાળક તે જ શબ્દો અથવા વાક્ય ફરીથી બોલે છે?`, tip: `"પાણી પીવું છે?" પૂછો તો જવાબ આપવાને બદલે બાળક "પાણી પીવું છે?" એમ જ દોહરાવે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा दूसरे लोगों की कही हुई बात को उसी तरह दोहराता है?`, tip: `"पानी पियोगे?" पूछने पर बच्चा जवाब देने की बजाय "पानी पियोगे?" ही दोहराता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಬೇರೆ ಯಾರಾದರೂ ಹೇಳಿದ ಮಾತನ್ನು ಮಗು ಅದೇ ರೀತಿಯಲ್ಲಿ ಪುನಃ ಹೇಳುತ್ತದೆಯೇ?`, tip: `"ನೀರು ಬೇಕಾ?" ಎಂದು ಕೇಳಿದರೆ ಉತ್ತರ ಕೊಡುವ ಬದಲು ಮಗು "ನೀರು ಬೇಕಾ?" ಎಂದು ಮತ್ತೆ ಹೇಳುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child make unusual sounds instead of using words?`, tip: `The child often squeals, hums, or makes repeated sounds even when they could communicate in other ways.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક વાત કરવાની જગ્યાએ વારંવાર અજાણ્યા અવાજો કરે છે?`, tip: `બાળક વારંવાર ચીસ જેવા અવાજ, હમિંગ અથવા બીજા એકસરખા અવાજો કરતું રહે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा बात करने की बजाय बार-बार अलग तरह की आवाज़ें निकालता है?`, tip: `बच्चा बार-बार चीख जैसी आवाज़, गुनगुनाना या एक जैसी आवाज़ें निकालता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಾತನಾಡುವ ಬದಲು ಮಗು ಪದೇ ಪದೇ ವಿಚಿತ್ರ ಶಬ್ದಗಳನ್ನು ಮಾಡುತ್ತದೆಯೇ?`, tip: `ಮಗು ಪದೇ ಪದೇ ಕಿರುಚುವ ಶಬ್ದ, ಗುನುಗು ಅಥವಾ ಒಂದೇ ರೀತಿಯ ಶಬ್ದಗಳನ್ನು ಮಾಡುತ್ತಿರುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child have difficulty starting or continuing a conversation?`, tip: `The child answers only with one or two words or stops talking after a very short exchange.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળકને વાત શરૂ કરવામાં અથવા વાત આગળ ચાલુ રાખવામાં મુશ્કેલી પડે છે?`, tip: `બાળક માત્ર ટૂંકો જવાબ આપે છે અને પછી વાત આગળ વધારતું નથી.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चे को बात शुरू करने या बातचीत जारी रखने में कठिनाई होती है?`, tip: `बच्चा केवल छोटा-सा जवाब देता है और फिर आगे बात नहीं करता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಾತು ಆರಂಭಿಸಲು ಅಥವಾ ಮಾತನ್ನು ಮುಂದುವರಿಸಲು ಮಗುವಿಗೆ ಕಷ್ಟವಾಗುತ್ತದೆಯೇ?`, tip: `ಮಗು ಚಿಕ್ಕ ಉತ್ತರ ನೀಡಿ ನಂತರ ಮಾತನ್ನು ಮುಂದುವರಿಸುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child use words that do not have a clear meaning to others?`, tip: `The child repeatedly says made-up words or sounds that family members cannot understand.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક એવા શબ્દો બોલે છે જેનો અર્થ બીજાને સમજાતો નથી?`, tip: `બાળક પોતાના બનાવેલા શબ્દો અથવા અવાજો વારંવાર બોલે છે, પણ તેનો અર્થ સમજાતો નથી.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा ऐसे शब्द बोलता है जिनका मतलब दूसरे लोग समझ नहीं पाते?`, tip: `बच्चा अपने बनाए हुए शब्द या आवाज़ें बार-बार बोलता है, लेकिन उनका मतलब समझ नहीं आता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಬೇರೆವರಿಗೆ ಅರ್ಥವಾಗದ ಪದಗಳನ್ನು ಮಗು ಬಳಸುತ್ತದೆಯೇ?`, tip: `ಮಗು ತನ್ನದೇ ಆದ ಪದಗಳು ಅಥವಾ ಶಬ್ದಗಳನ್ನು ಪದೇ ಪದೇ ಹೇಳುತ್ತದೆ, ಆದರೆ ಅದರ ಅರ್ಥ ಇತರರಿಗೆ ಅರ್ಥವಾಗುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child refer to themselves using the wrong words, such as saying "you" instead of "I"?`, tip: `Instead of saying "I want water," the child says "You want water" when talking about themselves.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક પોતાના વિશે વાત કરતી વખતે "હું"ની જગ્યાએ "તું" અથવા પોતાનું નામ બોલે છે?`, tip: `"મને પાણી જોઈએ" કહેવાને બદલે બાળક "તું પાણી જોઈએ" અથવા પોતાનું નામ બોલે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा अपने बारे में "मैं" की जगह "तुम" या अपना नाम बोलता है?`, tip: `"मुझे पानी चाहिए" कहने की बजाय बच्चा "तुम्हें पानी चाहिए" या अपना नाम बोलता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ತನ್ನ ಬಗ್ಗೆ ಮಾತನಾಡುವಾಗ "ನಾನು" ಬದಲು "ನೀನು" ಅಥವಾ ತನ್ನ ಹೆಸರನ್ನೇ ಹೇಳುತ್ತದೆಯೇ?`, tip: `"ನನಗೆ ನೀರು ಬೇಕು" ಎನ್ನುವ ಬದಲು ಮಗು "ನಿನಗೆ ನೀರು ಬೇಕು" ಅಥವಾ ತನ್ನ ಹೆಸರನ್ನೇ ಹೇಳುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child have difficulty understanding the real meaning behind what others say?`, tip: `When someone says "It's raining cats and dogs" or "Can you give me a hand?", the child understands only the exact words and not what they mean.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળકને લોકો શું કહેવા માંગે છે તે સમજવામાં મુશ્કેલી પડે છે?`, tip: `સરળ વાત સમજાવ્યા પછી પણ બાળક તેનો અર્થ સમજી શકતું નથી અથવા યોગ્ય રીતે જવાબ આપતું નથી.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चे को दूसरे लोग क्या कहना चाहते हैं, यह समझने में कठिनाई होती है?`, tip: `आसान बात समझाने के बाद भी बच्चा उसका मतलब नहीं समझ पाता या उसी हिसाब से जवाब नहीं देता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಇತರರು ಏನು ಹೇಳಲು ಪ್ರಯತ್ನಿಸುತ್ತಿದ್ದಾರೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮಗುವಿಗೆ ಕಷ್ಟವಾಗುತ್ತದೆಯೇ?`, tip: `ಸರಳವಾಗಿ ಹೇಳಿದ ಮಾತಿನ ಅರ್ಥವನ್ನು ಮಗು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದಿಲ್ಲ ಅಥವಾ ಅದಕ್ಕೆ ತಕ್ಕಂತೆ ಉತ್ತರ ಕೊಡುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
];

export default function SpeechScreeningScreen({ navigation }: { navigation: any }) {
  const { scaleSize, padding, scaleFont } = useResponsive();
  const { top, bottom } = useSafeAreaInsets();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const screening = useScreening();
  const [answers, setAnswers] = useState<(number | null)[]>(
    screening.getDomainAnswers('Speech').length === QUESTIONS.length
      ? screening.getDomainAnswers('Speech')
      : Array(QUESTIONS.length).fill(null)
  );
  useEffect(() => {
    screening.setDomainAnswers('Speech', answers);
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
          <Text style={[styles.sectionLabel, { fontSize: scaleFont(12), color: '#3B8DBD' }]}>SECTION 03 OF 06</Text>
          <Pressable onPress={() => navigation.navigate('SaveExit', { sectionNumber: 3, answeredCount: answers.filter((a) => a !== null).length, totalQuestions: QUESTIONS.length })} style={styles.saveExit} hitSlop={scaleSize(10)}>
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
            const active = domain.key === 'Speech';
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



      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: scaleSize(140) + bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: scaleSize(12), paddingTop: scaleSize(8) }}>
          <SectionProgressWidget currentDomain="Speech" />
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
          onPress={() => allAnswered && navigation.navigate('BehaviorScreening')}
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
