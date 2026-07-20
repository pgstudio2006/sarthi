import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import SuccessIcon from './SuccessIcon';

const FIGMA_WIDTH = 390;
const BANNER_HEIGHT = 83;
const STRIP_WIDTH = 12;

export default function SuccessBanner() {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  return (
    <View style={[styles.container, { height: BANNER_HEIGHT * scale, backgroundColor: '#F3F2FF' }]}>
      <View style={[styles.strip, { width: STRIP_WIDTH * scale, backgroundColor: colors.primaryBlue }]} />
      <View style={[styles.content, { gap: 12 * scale }]}>
        <SuccessIcon size={48 * scale} />
        <Text style={[styles.text, { fontSize: 18 * scale, lineHeight: 24 * scale }]}>
          You're in!{'\n'}Let's create your profile.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  strip: {
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
    textAlign: 'left',
  },
});
