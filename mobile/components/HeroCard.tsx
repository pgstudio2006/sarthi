import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useResponsive } from '../utils/responsive';
import { colors } from '../theme/colors';
import StarIcon from '../assets/figma/screen16/Frame-10.svg';
import ListIcon from '../assets/figma/screen16/Frame-9.svg';
import ClockIcon from '../assets/figma/screen16/Frame-30.svg';

export interface HeroCardProgress {
  totalAnswered: number;
  totalQuestions: number;
  remainingQuestions: number;
  remainingSections: number;
  minutesLeft: number;
}

interface HeroCardProps {
  onPress: () => void;
  onContinue?: () => void;
  onStartNew?: () => void;
  childName?: string;
  progress?: HeroCardProgress;
  style?: ViewStyle;
}

export default function HeroCard({ onPress, onContinue, onStartNew, childName = 'Nitya', progress, style }: HeroCardProps) {
  const { scaleSize } = useResponsive();
  const progressPercent = progress ? (progress.totalAnswered / progress.totalQuestions) * 100 : 0;

  return (
    <View
      style={[
        styles.card,
        {
          marginTop: scaleSize(22),
          borderRadius: scaleSize(24),
          paddingHorizontal: scaleSize(16),
          paddingVertical: scaleSize(14),
          minHeight: scaleSize(291),
        },
        style,
      ]}
    >
      <View
        style={[
          styles.circleTop,
          {
            top: scaleSize(-75),
            right: scaleSize(28),
            width: 140,
            height: 140,
            borderRadius: 70,
          },
        ]}
      />
      <View
        style={[
          styles.circleBottomLeft,
          {
            top: scaleSize(197),
            left: scaleSize(-34),
            width: 148,
            height: 148,
            borderRadius: 74,
          },
        ]}
      />
      <View
        style={[
          styles.circleBottom,
          {
            top: scaleSize(190),
            right: scaleSize(-24),
            width: 110,
            height: 110,
            borderRadius: 55,
          },
        ]}
      />

      <View style={styles.content}>
        {progress ? (
          <View style={styles.progressContent}>
            <View style={styles.progressTop}>
              <View style={styles.progressTextGroup}>
                <Text style={[styles.title, { fontSize: scaleSize(24), lineHeight: scaleSize(30) }]}>
                  Complete your screening
                </Text>
                <Text style={[styles.subtitle, { fontSize: scaleSize(14), lineHeight: scaleSize(18), marginTop: scaleSize(12) }]}>
                  Finish the remaining {progress.remainingSections} sections to view report.
                </Text>
              </View>

              <View style={[styles.progressTrack, { borderRadius: scaleSize(4), marginTop: scaleSize(14) }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercent}%`,
                      borderRadius: scaleSize(3),
                    },
                  ]}
                />
              </View>

              <View style={[styles.metaRow, { marginTop: scaleSize(10), gap: scaleSize(12) }]}>
                <Text style={[styles.metaText, { fontSize: scaleSize(12), fontFamily: 'Inter_400Regular' }]}>
                  Question {progress.totalAnswered} of {progress.totalQuestions}
                </Text>
                <Text style={[styles.minsLeft, { fontSize: scaleSize(12) }]}>
                  ~ {progress.minutesLeft} mins left
                </Text>
              </View>
            </View>

            <View style={[styles.ctaGroup, { gap: scaleSize(12), marginTop: scaleSize(16) }]}>
              <Pressable
                onPress={onContinue || onPress}
                style={({ pressed }) => [
                  styles.cta,
                  {
                    height: scaleSize(54),
                    borderRadius: scaleSize(28),
                    opacity: pressed ? 0.95 : 1,
                  },
                ]}
              >
                <Text style={[styles.ctaText, { fontSize: scaleSize(16) }]}>Continue Where I Left Off</Text>
                <Text style={[styles.ctaArrow, { fontSize: scaleSize(20) }]}>→</Text>
              </Pressable>
              <Pressable
                onPress={onStartNew || onPress}
                style={({ pressed }) => [
                  styles.ctaOutline,
                  {
                    height: scaleSize(53),
                    borderRadius: scaleSize(28),
                    opacity: pressed ? 0.95 : 1,
                  },
                ]}
              >
                <Text style={[styles.ctaOutlineText, { fontSize: scaleSize(16) }]}>Start New Screening</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.startContent}>
            <View style={styles.startTop}>
              <View style={[styles.badge, { paddingHorizontal: scaleSize(12), paddingVertical: scaleSize(6), borderRadius: scaleSize(16), gap: scaleSize(8) }]}>
                <StarIcon width={scaleSize(20)} height={scaleSize(20)} />
                <Text style={[styles.badgeText, { fontSize: scaleSize(12) }]}>YOUR FIRST STEP</Text>
              </View>

              <Text style={[styles.title, { fontSize: scaleSize(28), lineHeight: scaleSize(34), marginTop: scaleSize(18) }]}>
                Begin {childName}&apos;s Screening
              </Text>

              <Text style={[styles.subtitle, { fontSize: scaleSize(14), lineHeight: scaleSize(20), marginTop: scaleSize(12) }]}>
                Understand {childName}&apos;s autism-related strengths and needs.
              </Text>

              <View style={[styles.metaRow, { marginTop: scaleSize(14), gap: scaleSize(25) }]}>
                <View style={[styles.metaItem, { gap: scaleSize(6) }]}>
                  <ListIcon width={scaleSize(16)} height={scaleSize(16)} />
                  <Text style={[styles.metaText, { fontSize: scaleSize(12) }]}>40 questions</Text>
                </View>
                <View style={[styles.metaItem, { gap: scaleSize(6) }]}>
                  <ClockIcon width={scaleSize(16)} height={scaleSize(16)} />
                  <Text style={[styles.metaText, { fontSize: scaleSize(12) }]}>15 mins</Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={onPress}
              style={({ pressed }) => [
                styles.cta,
                {
                  height: scaleSize(54),
                  borderRadius: scaleSize(28),
                  marginTop: scaleSize(20),
                  opacity: pressed ? 0.95 : 1,
                },
              ]}
            >
              <Text style={[styles.ctaText, { fontSize: scaleSize(16) }]}>Start Screening for free</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3F2FF',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  content: {
    zIndex: 1,
    flex: 1,
  },
  circleTop: {
    position: 'absolute',
    backgroundColor: 'rgba(124, 129, 219, 0.10)',
  },
  circleBottom: {
    position: 'absolute',
    backgroundColor: 'rgba(124, 129, 219, 0.08)',
  },
  circleBottomLeft: {
    position: 'absolute',
    backgroundColor: 'rgba(124, 129, 219, 0.08)',
  },
  progressContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progressTop: {
    gap: 0,
  },
  progressTextGroup: {
    gap: 0,
  },
  startContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  startTop: {
    gap: 0,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    color: '#B87FE5',
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.mainBlack,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderWidth: 1,
    borderColor: 'rgba(182, 184, 189, 0.5)',
    backgroundColor: colors.white,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    top: 1,
    bottom: 1,
    left: 0,
    backgroundColor: '#535BD8',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  minsLeft: {
    fontFamily: 'Inter_600SemiBold',
    color: '#6B7180',
    textAlign: 'right',
  },
  ctaGroup: {
    alignItems: 'center',
  },
  cta: {
    backgroundColor: colors.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  ctaText: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  ctaArrow: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    marginTop: -2,
  },
  ctaOutline: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#E2E4E8',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaOutlineText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#6B7180',
  },
});
