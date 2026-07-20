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
import { useLanguage } from '../context/LanguageContext';
import { useScreening } from '../context/ScreeningContext';
import BackArrow from '../assets/figma/screen18/Vector.svg';
import PauseIcon from '../assets/figma/screen18/motion_photos_paused.svg';
import SocialIcon from '../assets/figma/screen18/Frame-2.svg';
import EmotionIcon from '../assets/figma/screen18/Frame-5.svg';
import SpeechIcon from '../assets/figma/screen18/Frame-3.svg';
import BehaviorIcon from '../assets/figma/screen18/Frame.svg';
import SensoryIcon from '../assets/figma/screen18/Frame-4.svg';
import CognitiveIcon from '../assets/figma/screen18/Frame-1.svg';

type Language = 'English' | 'Gujarati' | 'Hindi' | 'Kannada';

type LocalizedQuestion = Record<Language, { text: string; tip: string; options: string[] }>;

const DOMAINS = [
  { key: 'Social', label: 'Social', Icon: SocialIcon, color: '#9651C8' },
  { key: 'Emotion', label: 'Emotion', Icon: EmotionIcon, color: '#D1E7E4' },
  { key: 'Speech', label: 'Speech', Icon: SpeechIcon, color: '#D6EDF9' },
  { key: 'Behavior', label: 'Behavior', Icon: BehaviorIcon, color: '#F7DDE9' },
  { key: 'Sensory', label: 'Sensory', Icon: SensoryIcon, color: '#FCE5D6' },
  { key: 'Cognitive', label: 'Cognitive', Icon: CognitiveIcon, color: '#E6E3F3' },
];

const QUESTIONS: LocalizedQuestion[] = [
  {
    English: { text: `How often does the child avoid looking at people's faces while talking or playing?`, tip: `When someone calls the child's name, they keep looking at a toy instead of looking at the person.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `વાત કરતી વખતે કે રમતી વખતે બાળક સામેની વ્યક્તિના ચહેરા તરફ જોવાનું કેટલા વખત ટાળે છે?`, tip: `કોઈ બાળકનું નામ બોલાવે ત્યારે તે વ્યક્તિ તરફ જોવાને બદલે રમકડું જોતું રહે છે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बात करते या खेलते समय बच्चा सामने वाले के चेहरे की ओर देखने से बचता है?`, tip: `नाम पुकारने पर भी बच्चा सामने देखने के बजाय अपने खिलौने को ही देखता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಾತನಾಡುವಾಗ ಅಥವಾ ಆಟವಾಡುವಾಗ ಮಗು ಎದುರಿರುವ ವ್ಯಕ್ತಿಯ ಕಣ್ಣಿನಲ್ಲಿ ನೋಡುವುದನ್ನು ತಪ್ಪಿಸುತ್ತದೆಯೇ?`, tip: `ಹೆಸರು ಕರೆದರೂ ಮಗು ಎದುರಿಗೆ ನೋಡುವ ಬದಲು ತನ್ನ ಆಟಿಕೆಯನ್ನೇ ನೋಡುತ್ತಿರುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child not smile back when someone smiles at them?`, tip: `When a parent or teacher smiles at the child, they show little or no smile in return.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `કોઈ વ્યક્તિ બાળકને જોઈને સ્મિત કરે ત્યારે બાળક કેટલા વખત સામે સ્મિત કરતું નથી?`, tip: `મમ્મી, પપ્પા અથવા ટીચર સ્મિત કરે, છતાં બાળક સામે સ્મિત ન કરે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या कोई मुस्कुराए तो बच्चा उसके जवाब में मुस्कुराता नहीं है?`, tip: `माता-पिता, टीचर या कोई परिचित मुस्कुराए, फिर भी बच्चा वापस मुस्कुराता नहीं है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಯಾರಾದರೂ ಮಗುವಿನ ಕಡೆ ನಗಿದಾಗ, ಮಗು ಕೂಡಾ ಹಿಂದಿರುಗಿ ನಗುವುದಿಲ್ಲವೇ?`, tip: `ಅಮ್ಮ, ಅಪ್ಪ, ಟೀಚರ್ ಅಥವಾ ಪರಿಚಿತರು ನಗಿದರೂ ಮಗು ನಗುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child prefer to stay alone instead of joining family members or other children?`, tip: `While everyone is sitting together or children are playing, the child prefers to stay alone.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક કેટલા વખત પરિવારના સભ્યો અથવા બીજા બાળકો સાથે રહેવાને બદલે એકલું રહેવાનું પસંદ કરે છે?`, tip: `ઘરે બધા સાથે બેઠા હોય અથવા બાળકો રમતા હોય ત્યારે બાળક એકલું જ રહે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा परिवार या दूसरे बच्चों के साथ रहने की बजाय अकेले रहना पसंद करता है?`, tip: `घर में सब साथ बैठे हों या बच्चे खेल रहे हों, तब भी बच्चा अकेला ही रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ಕುಟುಂಬದವರ ಅಥವಾ ಇತರ ಮಕ್ಕಳ ಜೊತೆ ಇರುವುದಕ್ಕಿಂತ ಒಂಟಿಯಾಗಿ ಇರಲು ಇಷ್ಟಪಡುತ್ತದೆಯೇ?`, tip: `ಮನೆಯಲ್ಲಿ ಎಲ್ಲರೂ ಒಟ್ಟಿಗೆ ಇದ್ದರೂ ಅಥವಾ ಮಕ್ಕಳು ಆಟವಾಡುತ್ತಿದ್ದರೂ ಮಗು ಒಂಟಿಯಾಗಿಯೇ ಇರುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child not seek help, comfort, or share excitement with a familiar person?`, tip: `After getting hurt or seeing something exciting, the child does not go to a parent, teacher, or caregiver.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળકને મદદ, સાંત્વના અથવા કંઈક ખુશીની વાત શેર કરવાની જરૂર હોય ત્યારે તે ઓળખીતી વ્યક્તિ પાસે કેટલા વખત જતું નથી?`, tip: `પડી જાય અથવા કંઈક નવું દેખાય, છતાં બાળક મમ્મી, પપ્પા, ટીચર અથવા સંભાળ રાખનાર પાસે ન જાય.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या ज़रूरत पड़ने पर बच्चा मदद, सहारा या अपनी खुशी किसी परिचित व्यक्ति के साथ साझा नहीं करता?`, tip: `गिरने या कुछ नया देखने के बाद भी बच्चा माता-पिता, टीचर या देखभाल करने वाले के पास नहीं जाता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಅಗತ್ಯವಿದ್ದಾಗ ಮಗು ಸಹಾಯ, ಸಾಂತ್ವನ ಅಥವಾ ಸಂತೋಷವನ್ನು ಪರಿಚಿತ ವ್ಯಕ್ತಿಯೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲವೇ?`, tip: `ಬಿದ್ದಾಗ ಅಥವಾ ಹೊಸದನ್ನು ನೋಡಿದಾಗ ಮಗು ಅಮ್ಮ, ಅಪ್ಪ ಅಥವಾ ಟೀಚರ್ ಬಳಿಗೆ ಹೋಗುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child seem unaware of people around them?`, tip: `A familiar person enters the room or speaks to the child, but the child shows little or no response.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક કેટલા વખત તેની આસપાસના લોકો તરફ ધ્યાન આપતું નથી?`, tip: `ઓળખીતું વ્યક્તિ વાત કરે અથવા રૂમમાં આવે, છતાં બાળક બહુ ઓછો પ્રતિભાવ આપે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा अपने आसपास के लोगों पर कम ध्यान देता है?`, tip: `कोई परिचित व्यक्ति बात करे या कमरे में आए, फिर भी बच्चा उसकी ओर कम ध्यान देता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ತನ್ನ ಸುತ್ತಲಿರುವ ಜನರ ಕಡೆ ಹೆಚ್ಚು ಗಮನ ಕೊಡದೆ ಇರುತ್ತದೆಯೇ?`, tip: `ಪರಿಚಿತ ವ್ಯಕ್ತಿ ಮಾತನಾಡಿದರೂ ಅಥವಾ ಕೋಣೆಗೆ ಬಂದರೂ ಮಗು ಅವರ ಕಡೆ ಹೆಚ್ಚು ಗಮನ ಕೊಡುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child not notice or join what other people are doing?`, tip: `Everyone claps, stands up, or joins an activity, but the child continues doing something else.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બીજા લોકો જે કરે છે તેમાં બાળક કેટલા વખત ધ્યાન આપતું નથી અથવા જોડાતું નથી?`, tip: `બધા તાળી પાડે, ઊભા થાય અથવા કોઈ એક્ટિવિટીમાં જોડાય, છતાં બાળક પોતાનું જ કામ કરતું રહે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा दूसरे लोग जो कर रहे हैं, उसमें ध्यान नहीं देता या शामिल नहीं होता?`, tip: `सब लोग ताली बजाएँ, खड़े हों या किसी एक्टिविटी में शामिल हों, फिर भी बच्चा अपना ही काम करता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಇತರರು ಮಾಡುತ್ತಿರುವ ಕೆಲಸ ಅಥವಾ ಚಟುವಟಿಕೆಗೆ ಮಗು ಗಮನ ಕೊಡದೆ ಅಥವಾ ಅದರಲ್ಲಿ ಸೇರದೆ ಇರುತ್ತದೆಯೇ?`, tip: `ಎಲ್ಲರೂ ಚಪ್ಪಾಳೆ ತಟ್ಟಿದರೂ ಅಥವಾ ಆಟದಲ್ಲಿ ಸೇರಿಕೊಂಡರೂ ಮಗು ತನ್ನದೇ ಕೆಲಸದಲ್ಲಿ ಇರುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child play alone in the same way again and again?`, tip: `The child spends a long time lining up toys, spinning objects, or repeating the same activity instead of trying different kinds of play.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક કેટલા વખત એકલું રહીને એક જ પ્રકારની પ્લે અથવા એક્ટિવિટી વારંવાર કરે છે?`, tip: `બાળક લાંબા સમય સુધી એક જ રમકડા સાથે એકસરખી રીતે રમે અથવા એક જ કામ વારંવાર કરે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा अकेले एक ही तरह की प्ले या एक्टिविटी बार-बार करता है?`, tip: `बच्चा लंबे समय तक एक ही खिलौने या एक ही खेल को बार-बार दोहराता रहता है।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ಒಂಟಿಯಾಗಿ ಒಂದೇ ರೀತಿಯ ಆಟ ಅಥವಾ ಚಟುವಟಿಕೆಯನ್ನು ಮತ್ತೆ ಮತ್ತೆ ಮಾಡುತ್ತದೆಯೇ?`, tip: `ಮಗು ಒಂದೇ ಆಟಿಕೆಯಿಂದ ಅಥವಾ ಒಂದೇ ಆಟವನ್ನು ಬಹಳ ಹೊತ್ತು ಪುನಃ ಪುನಃ ಆಡುತ್ತಿರುತ್ತದೆ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child have difficulty waiting for their turn during play or conversation?`, tip: `While playing with others, the child finds it difficult to wait for their turn.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બીજા બાળકો સાથે રમતી વખતે બાળકને પોતાનો વારો આવવાની રાહ જોવામાં કેટલા વખત મુશ્કેલી પડે છે?`, tip: `બીજા બાળકો સાથે રમતી વખતે બાળક બધાને વારો આપવાને બદલે પોતે જ રમતું રહે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या दूसरे बच्चों के साथ खेलते समय बच्चे को अपनी बारी का इंतज़ार करने में कठिनाई होती है?`, tip: `साथ में खेलते समय बच्चा अपनी बारी के बाद भी खिलौना या खेल दूसरों को नहीं देता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಇತರ ಮಕ್ಕಳ ಜೊತೆ ಆಟವಾಡುವಾಗ ಮಗು ತನ್ನ ಸರದಿಗಾಗಿ ಕಾಯಲು ಕಷ್ಟಪಡುತ್ತದೆಯೇ?`, tip: `ಆಟವಾಡುವಾಗ ಮಗು ತನ್ನ ಸರದಿ ಮುಗಿದ ನಂತರವೂ ಆಟಿಕೆ ಅಥವಾ ಚೆಂಡನ್ನು ಇನ್ನೊಬ್ಬರಿಗೆ ಕೊಡುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
  {
    English: { text: `How often does the child avoid playing or interacting with other children of a similar age?`, tip: `Other children are playing nearby, but the child does not try to join or interact with them.`, options: ['Rarely', 'Sometimes', 'Often', 'Most of the times', 'Almost Always'] },
    Gujarati: { text: `બાળક કેટલા વખત પોતાની ઉંમરના બીજા બાળકો સાથે રમવાનું અથવા વાત કરવાનું ટાળે છે?`, tip: `બીજા બાળકો રમતા હોય છતાં બાળક તેમની સાથે જોડાવાનો પ્રયાસ ન કરે.`, options: ['ભાગ્યે જ', 'ક્યારેક', 'ઘણી વખત', 'મોટાભાગે', 'લગભગ હંમેશા'] },
    Hindi: { text: `क्या बच्चा अपनी उम्र के दूसरे बच्चों के साथ खेलना या बात करना पसंद नहीं करता?`, tip: `दूसरे बच्चे साथ खेल रहे हों, फिर भी बच्चा उनके साथ जुड़ने की कोशिश नहीं करता।`, options: ['बहुत कम', 'कभी-कभी', 'अक्सर', 'ज़्यादातर', 'लगभग हमेशा'] },
    Kannada: { text: `ಮಗು ತನ್ನ ವಯಸ್ಸಿನ ಮಕ್ಕಳ ಜೊತೆ ಆಟವಾಡಲು ಅಥವಾ ಮಾತನಾಡಲು ಆಸಕ್ತಿ ತೋರಿಸುವುದಿಲ್ಲವೇ?`, tip: `ಇತರ ಮಕ್ಕಳು ಆಟವಾಡುತ್ತಿದ್ದರೂ ಮಗು ಅವರ ಜೊತೆ ಸೇರಲು ಪ್ರಯತ್ನಿಸುವುದಿಲ್ಲ.`, options: ['ಬಹಳ ಕಡಿಮೆ', 'ಕೆಲವೊಮ್ಮೆ', 'ಆಗಾಗ್ಗೆ', 'ಹೆಚ್ಚಿನ ಸಮಯ', 'ಬಹುತೇಕ ಯಾವಾಗಲೂ'] },
  },
];

export default function SocialScreeningScreen({ navigation }: { navigation: any }) {
  const { scaleSize, padding, scaleFont } = useResponsive();
  const { top, bottom } = useSafeAreaInsets();
  const { language } = useLanguage();
  const screening = useScreening();
  const [answers, setAnswers] = useState<(number | null)[]>(
    screening.getDomainAnswers('Social').length === QUESTIONS.length
      ? screening.getDomainAnswers('Social')
      : Array(QUESTIONS.length).fill(null)
  );
  useEffect(() => {
    screening.setDomainAnswers('Social', answers);
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
          <Text style={[styles.sectionLabel, { fontSize: scaleFont(12) }]}>SECTION 01 OF 06</Text>
          <Pressable onPress={() => navigation.navigate('SaveExit', { sectionNumber: 1, answeredCount: answers.filter((a) => a !== null).length, totalQuestions: QUESTIONS.length })} style={styles.saveExit} hitSlop={scaleSize(10)}>
            <PauseIcon width={scaleSize(16)} height={scaleSize(16)} />
            <Text style={[styles.saveExitText, { fontSize: scaleFont(11) }]}>Save & Exit</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {DOMAINS.map((domain, index) => {
            const active = domain.key === 'Social';
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
                        backgroundColor: domain.color,
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
                        color: active ? '#9651C8' : '#9CA3AF',
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
          onPress={() => allAnswered && navigation.navigate('EmotionScreening')}
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
