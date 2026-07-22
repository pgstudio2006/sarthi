import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { useTranslation } from '../i18n';
import Logo from '../components/Logo';

const FIGMA_WIDTH = 390;

export default function SplashScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const [targetScreen, setTargetScreen] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const onboardingValue = await AsyncStorage.getItem('onboardingCompleted');
        const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
        let next = 'LanguageSelection';
        if (storedToken) {
          next = 'Home';
        } else if (onboardingValue === 'true') {
          next = 'PhoneAuth';
        } else if (selectedLanguage) {
          next = 'AutismScreening';
        }
        if (active) {
          setTargetScreen(next);
        }
      } catch (e) {
        if (active) {
          setTargetScreen('LanguageSelection');
        }
      }
    }
    restore();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!targetScreen) return;
    const timer = setTimeout(() => {
      navigation.replace(targetScreen);
    }, 2000);
    return () => clearTimeout(timer);
  }, [targetScreen, navigation]);

  const handlePress = () => {
    if (targetScreen) {
      navigation.replace(targetScreen);
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {/* Top-left small purple */}
      <View style={[styles.ellipse, {
        top: 10 * scale,
        left: -41 * scale,
        width: 200 * scale,
        height: 200 * scale,
        backgroundColor: colors.purpleLight,
      }]} />
      {/* Top-right yellow */}
      <View style={[styles.ellipse, {
        top: -52 * scale,
        left: 242 * scale,
        width: 160 * scale,
        height: 160 * scale,
        backgroundColor: colors.yellowHalo,
      }]} />
      {/* Bottom-left purple */}
      <View style={[styles.ellipse, {
        top: 607 * scale,
        left: 84 * scale,
        width: 160 * scale,
        height: 160 * scale,
        backgroundColor: colors.purpleLight,
      }]} />
      {/* Bottom-right purple */}
      <View style={[styles.ellipse, {
        top: 590 * scale,
        left: 148 * scale,
        width: 300 * scale,
        height: 300 * scale,
        backgroundColor: colors.purpleHalo,
      }]} />

      {/* Logo and text — centered with Flexbox */}
      <View style={[styles.content, { gap: 16 * scale }]}>
        <Logo width={94 * scale} height={89.56 * scale} />
        <View style={[styles.textGroup, { gap: 4 * scale }]}>
          <Text style={[styles.title, { fontSize: 36 * scale, letterSpacing: 0.7 * scale }]} allowFontScaling={false}>SAARATHI</Text>
          <Text style={[styles.tagline, { fontSize: 14 * scale, lineHeight: 18 * scale }]} allowFontScaling={false}>
            {t('tagline')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  ellipse: {
    position: 'absolute',
    borderRadius: 9999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textGroup: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.darkBlue,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    color: colors.secondaryBlack,
    textAlign: 'center',
  },
});
