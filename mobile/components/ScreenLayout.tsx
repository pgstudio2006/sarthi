import React, { ReactNode } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

type ScreenLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  keyboardAvoiding?: boolean;
  scrollable?: boolean;
  bottomPadding?: number;
};

export default function ScreenLayout({
  header,
  children,
  footer,
  keyboardAvoiding = true,
  scrollable = true,
  bottomPadding = 16,
}: ScreenLayoutProps) {
  const { padding, scaleSize } = useResponsive();

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: padding, paddingBottom: scaleSize(bottomPadding) },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        { paddingHorizontal: padding, paddingBottom: scaleSize(bottomPadding) },
      ]}
    >
      {children}
    </View>
  );

  const body = (
    <SafeAreaView style={styles.safeArea}>
      {header}
      <View style={styles.body}>
        {content}
        {footer && (
          <View style={[styles.footer, { paddingHorizontal: padding, paddingBottom: scaleSize(bottomPadding) }]}>
            {footer}
          </View>
        )}
      </View>
    </SafeAreaView>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {body}
      </KeyboardAvoidingView>
    );
  }

  return body;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    width: '100%',
  },
});
