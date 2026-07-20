import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import Logo from '../components/Logo';
import BookmarksIcon from '../assets/figma/screen24/bookmarks.svg';
import CloseIcon from '../assets/figma/screen24/close.svg';

const saveExitHero = require('../assets/figma/screen24/save_exit_hero.png');

export default function SaveExitScreen() {
  const { scaleSize, padding, scaleFont } = useResponsive();
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const sectionNumber = route.params?.sectionNumber ?? 1;
  const answeredCount = route.params?.answeredCount ?? 0;
  const totalQuestions = route.params?.totalQuestions ?? 1;

  const percent = Math.min(
    100,
    Math.round(
      ((sectionNumber - 1 + answeredCount / totalQuestions) / 6) * 100
    )
  );
  const filledBars = Math.min(6, Math.max(0, Math.round((percent / 100) * 6)));

  return (
    <SafeAreaView style={[styles.container, { paddingTop: top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingHorizontal: padding }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(6) }}>
          <Logo width={scaleSize(35)} height={scaleSize(35)} />
          <Text
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: scaleFont(20),
              letterSpacing: scaleSize(1),
              color: '#535BD8',
            }}
          >
            SAARTHI
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: scaleSize(32),
            height: scaleSize(32),
            borderRadius: scaleSize(16),
            backgroundColor: '#F5F6F8',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CloseIcon width={scaleSize(16)} height={scaleSize(16)} />
        </Pressable>
      </View>

      <View style={[styles.content, { paddingHorizontal: padding, paddingBottom: bottom }]}>
        <View style={{ alignItems: 'center', gap: scaleSize(32) }}>
          <Image
            source={saveExitHero}
            style={{
              width: scaleSize(240),
              height: scaleSize(240),
              borderRadius: scaleSize(120),
            }}
            resizeMode="cover"
          />

          <View style={{ alignItems: 'center', gap: scaleSize(16) }}>
            <Text
              style={{
                fontFamily: 'Inter_700Bold',
                fontSize: scaleFont(30),
                textAlign: 'center',
                color: '#2D2A3A',
              }}
            >
              We know{'\n'}parenting is busy!
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: scaleFont(14),
                lineHeight: scaleFont(19),
                textAlign: 'center',
                color: '#6B7180',
                maxWidth: scaleSize(310),
              }}
            >
              Your progress has been saved.{"\n"}You can pick up right where you left off.
            </Text>
          </View>

          <View
            style={{
              width: '100%',
              backgroundColor: '#F3F2FF',
              borderRadius: scaleSize(16),
              padding: scaleSize(16),
              gap: scaleSize(14),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scaleSize(8) }}>
              <BookmarksIcon width={scaleSize(28)} height={scaleSize(28)} />
              <View style={{ gap: scaleSize(4) }}>
                <Text
                  style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: scaleFont(14),
                    color: '#535BD8',
                  }}
                >
                  Progress saved
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: scaleFont(12),
                    color: '#3B3B3E',
                  }}
                >
                  Section {sectionNumber} of 6 : {percent}% complete
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: scaleSize(2), alignItems: 'center', justifyContent: 'center' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: scaleSize(42),
                    height: scaleSize(6),
                    borderRadius: scaleSize(30),
                    backgroundColor: i < filledBars ? '#535BD8' : colors.white,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={{ gap: scaleSize(12), marginTop: scaleSize(24) }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              height: scaleSize(54),
              borderRadius: scaleSize(28),
              backgroundColor: '#535BD8',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_700Bold',
                fontSize: scaleFont(16),
                color: colors.white,
              }}
            >
              Continue where I left off
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate('Home', {
                progress: { sectionNumber, answeredCount, totalQuestions },
              })
            }
            style={{
              height: scaleSize(53),
              borderRadius: scaleSize(24),
              backgroundColor: colors.white,
              borderWidth: scaleSize(2),
              borderColor: '#E2E4E8',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: scaleFont(16),
                color: '#6B7180',
              }}
            >
              Finish later
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 24,
  },
});
