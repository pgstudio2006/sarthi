import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AvatarIcon from '../assets/figma/screen16/image 9 [Vectorized].svg';
import CloseIcon from '../assets/figma/screen26/Frame-32.svg';
import LanguageIcon from '../assets/figma/home/Frame 455.svg';

type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
  onLanguage: () => void;
};

export default function SideMenu({ visible, onClose, onLanguage }: SideMenuProps) {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();
  const { language, t } = useLanguage();
  const caregiver = user?.caregiverProfile;

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <SafeAreaView style={styles.safe}>
          <View style={[styles.drawer, { width: Math.min(330, width * 0.82), height: '100%' }]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{t('profileSettings')}</Text>
              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
                <CloseIcon width={18} height={18} />
              </Pressable>
            </View>

            <View style={styles.profileCard}>
              <AvatarIcon width={56} height={56} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{caregiver?.name || 'User'}</Text>
                <Text style={styles.profileRole}>{(caregiver?.role || 'PARENT').toUpperCase()}</Text>
                <Text style={styles.profileEmail}>{caregiver?.email || ''}</Text>
              </View>
            </View>

            <Pressable
              style={styles.logoutBtn}
              onPress={async () => {
                await signOut();
                navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
              }}
            >
              <Text style={styles.logoutText}>{t('logout')}</Text>
            </Pressable>

            <Pressable style={styles.languageRow} onPress={onLanguage}>
              <LanguageIcon width={24} height={24} />
              <Text style={styles.languageLabel}>{t('language')}</Text>
              <Text style={styles.languageValue}>{language}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            <Text style={styles.version}>TSAA v2.4.1 · Made with care</Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 18, 24, 0.4)',
  },
  overlay: {
    width: 60,
    height: '100%',
  },
  safe: {
    flex: 1,
    alignItems: 'flex-end',
  },
  drawer: {
    position: 'relative',
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    padding: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 44,
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    color: colors.mainBlack,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F6F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: 20,
    backgroundColor: '#5963E1',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: colors.white,
  },
  profileRole: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
  },
  profileEmail: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
  logoutBtn: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 56,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#D94C4C',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#D94C4C',
  },
  languageRow: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  languageLabel: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.mainBlack,
  },
  languageValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.grey,
    marginRight: 8,
  },
  chevron: {
    fontSize: 18,
    color: colors.grey,
    marginTop: -2,
  },
  version: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#9CA3AF',
  },
});
