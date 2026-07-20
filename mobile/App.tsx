import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ScreeningProvider } from './context/ScreeningContext';
import SplashScreen from './screens/SplashScreen';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import AutismScreeningScreen from './screens/AutismScreeningScreen';
import SimpleResultsScreen from './screens/SimpleResultsScreen';
import NextStepsScreen from './screens/NextStepsScreen';
import PhoneAuthScreen from './screens/PhoneAuthScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import CreateCaregiverProfileScreen from './screens/CreateCaregiverProfileScreen';
import CreateProfileScreen from './screens/CreateProfileScreen';
import BeginScreeningScreen from './screens/BeginScreeningScreen';
import SocialScreeningScreen from './screens/SocialScreeningScreen';
import EmotionScreeningScreen from './screens/EmotionScreeningScreen';
import SpeechScreeningScreen from './screens/SpeechScreeningScreen';
import BehaviorScreeningScreen from './screens/BehaviorScreeningScreen';
import SensoryScreeningScreen from './screens/SensoryScreeningScreen';
import CognitiveScreeningScreen from './screens/CognitiveScreeningScreen';
import SaveExitScreen from './screens/SaveExitScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileSettingsScreen from './screens/ProfileSettingsScreen';
import EditChildProfileScreen from './screens/EditChildProfileScreen';
import ScreeningCompletionScreen from './screens/ScreeningCompletionScreen';
import ScreeningReportScreen from './screens/ScreeningReportScreen';
import NoAutismCompletionScreen from './screens/NoAutismCompletionScreen';
import NoAutismReportScreen from './screens/NoAutismReportScreen';
import ModerateAutismCompletionScreen from './screens/ModerateAutismCompletionScreen';
import ModerateAutismReportScreen from './screens/ModerateAutismReportScreen';
import SevereAutismCompletionScreen from './screens/SevereAutismCompletionScreen';
import SevereAutismReportScreen from './screens/SevereAutismReportScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import NextOnboardingScreen from './screens/NextOnboardingScreen';
import DoctorProfileScreen from './screens/DoctorProfileScreen';
import OtherProfileScreen from './screens/OtherProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    async function restore() {
      setAuthReady(true);
    }
    restore();
  }, []);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#FFFFFF').catch(() => {});
    NavigationBar.setButtonStyleAsync('dark').catch(() => {});
  }, []);

  if (!fontsLoaded || !authReady) {
    return null;
  }

  const initialRoute = 'Home';

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <ScreeningProvider>
          <NavigationContainer>
            <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}
          >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
          <Stack.Screen name="AutismScreening" component={AutismScreeningScreen} />
          <Stack.Screen name="SimpleResults" component={SimpleResultsScreen} />
          <Stack.Screen name="NextSteps" component={NextStepsScreen} />
          <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="CreateCaregiverProfile" component={CreateCaregiverProfileScreen} />
          <Stack.Screen
            name="CreateProfile"
            component={CreateProfileScreen}
            initialParams={{
              initialChildName: 'Nitya Gandhi',
              initialDob: '2020-05-15',
              initialGender: 'Female',
              initialBirthContext: 'Normal Birth',
              nextRoute: 'Home',
            }}
          />
          <Stack.Screen
            name="BeginScreening"
            component={BeginScreeningScreen}
            options={{ presentation: 'transparentModal' }}
          />
          <Stack.Screen name="SocialScreening" component={SocialScreeningScreen} />
          <Stack.Screen name="EmotionScreening" component={EmotionScreeningScreen} />
          <Stack.Screen name="SpeechScreening" component={SpeechScreeningScreen} />
          <Stack.Screen name="BehaviorScreening" component={BehaviorScreeningScreen} />
          <Stack.Screen name="SensoryScreening" component={SensoryScreeningScreen} />
          <Stack.Screen name="CognitiveScreening" component={CognitiveScreeningScreen} />
          <Stack.Screen name="SaveExit" component={SaveExitScreen} options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="NextOnboarding" component={NextOnboardingScreen} />
          <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
          <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
          <Stack.Screen name="EditChildProfile" component={EditChildProfileScreen} />
          <Stack.Screen name="ScreeningCompletion" component={ScreeningCompletionScreen} />
          <Stack.Screen name="ScreeningReport" component={ScreeningReportScreen} />
          <Stack.Screen name="NoAutismCompletion" component={NoAutismCompletionScreen} />
          <Stack.Screen name="NoAutismReport" component={NoAutismReportScreen} />
          <Stack.Screen name="ModerateAutismCompletion" component={ModerateAutismCompletionScreen} />
          <Stack.Screen name="ModerateAutismReport" component={ModerateAutismReportScreen} />
          <Stack.Screen name="SevereAutismCompletion" component={SevereAutismCompletionScreen} />
          <Stack.Screen name="SevereAutismReport" component={SevereAutismReportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
          </ScreeningProvider>
        <StatusBar style="dark" />
      </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
