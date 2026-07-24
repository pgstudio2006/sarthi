import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useScreening } from '../context/ScreeningContext';
import { useResponsive } from '../utils/responsive';
import { colors } from '../theme/colors';
import TrophyIcon from '../assets/figma/screen20/trophy.svg';

const ORDER = ['Social', 'Emotion', 'Speech', 'Behavior', 'Sensory', 'Cognitive'];

export default function SectionProgressWidget({ currentDomain }: { currentDomain: string }) {
  const { scaleSize, scaleFont } = useResponsive();
  const { domainAnswers } = useScreening();

  const { completedSections, answeredCount } = useMemo(() => {
    const answeredCount = Object.values(domainAnswers)
      .flat()
      .filter((a) => a !== null).length;
    const currentIndex = ORDER.indexOf(currentDomain);
    let completedSections = 0;
    for (let i = 0; i < currentIndex; i++) {
      const answers = domainAnswers[ORDER[i]] || [];
      if (answers.length > 0 && answers.every((a) => a !== null)) {
        completedSections++;
      }
    }
    return { completedSections, answeredCount };
  }, [domainAnswers, currentDomain]);

  const sectionText = `${completedSections} section${completedSections === 1 ? '' : 's'} complete. You've answered ${answeredCount} questions about your child so far.`;

  return (
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
          {sectionText}
        </Text>
        <View style={{ flexDirection: 'row', gap: scaleSize(4), marginTop: scaleSize(8) }}>
          {Array.from({ length: ORDER.length }).map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: scaleSize(4),
                borderRadius: scaleSize(2),
                backgroundColor: i < completedSections ? '#535BD8' : '#E2E4E8',
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
