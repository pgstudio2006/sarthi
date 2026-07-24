import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import AvatarIcon from '../assets/figma/screen16/image 9 [Vectorized].svg';
import CloseIcon from '../assets/figma/screen26/Frame-32.svg';
import LogoutIcon from '../assets/figma/screen25/Frame-31.svg';
import EditIcon from '../assets/figma/screen25/stylus_note.svg';
import PremiumIcon from '../assets/figma/screen25/Frame-31.svg';
import ChevronIcon from '../assets/figma/screen25/Frame-31.svg';
import EditChildIcon from '../assets/figma/screen25/stylus_note.svg';
import AvatarSmallIcon from '../assets/figma/screen16/image 9 [Vectorized].svg';
import PersonIcon from '../assets/figma/screen25/Frame-31.svg';
import CompanionIcon from '../assets/figma/screen25/Frame-31.svg';
import SubscriptionIcon from '../assets/figma/screen25/Frame-31.svg';
import NotificationIcon from '../assets/figma/screen25/Frame-31.svg';
import LanguageIcon from '../assets/figma/screen25/Frame-31.svg';
import AppearanceIcon from '../assets/figma/screen25/Frame-31.svg';
import SoundIcon from '../assets/figma/screen25/Frame-31.svg';
import PrivacyIcon from '../assets/figma/screen25/Frame-31.svg';
import SecurityIcon from '../assets/figma/screen25/Frame-31.svg';
import ExportIcon from '../assets/figma/screen25/Frame-31.svg';
import HelpIcon from '../assets/figma/screen25/Frame-31.svg';
import ContactIcon from '../assets/figma/screen25/Frame-31.svg';
import AboutIcon from '../assets/figma/screen25/Frame-31.svg';
import PlusIcon from '../assets/figma/screen25/add_2.svg';
import ShieldIcon from '../assets/figma/screen25/Frame-31.svg';
import CalendarIcon from '../assets/figma/screen25/Frame-31.svg';

type SectionItemProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  rightIcon?: React.ReactNode;
};

function SectionItem({ icon, iconBg, title, subtitle, rightText, rightIcon }: SectionItemProps) {
  const { scaleSize } = useResponsive();
  return (
    <View style={[sectionStyles.row, { height: scaleSize(60) }]}>
      <View style={[sectionStyles.rowLeft, { paddingLeft: scaleSize(16), gap: scaleSize(12) }]}>
        <View style={[sectionStyles.iconBox, { backgroundColor: iconBg, width: scaleSize(26), height: scaleSize(26), borderRadius: scaleSize(8) }]}>
          {icon}
        </View>
        <View style={sectionStyles.textGroup}>
          <Text style={[sectionStyles.rowTitle, { fontSize: scaleSize(14) }]}>{title}</Text>
          {subtitle ? <Text style={[sectionStyles.rowSubtitle, { fontSize: scaleSize(11) }]}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightText ? (
        <Text style={[sectionStyles.rightText, { fontSize: scaleSize(12), right: scaleSize(16) }]}>{rightText}</Text>
      ) : null}
      {rightIcon ? (
        <View style={{ position: 'absolute', right: scaleSize(16), top: scaleSize(18) }}>
          {rightIcon}
        </View>
      ) : null}
    </View>
  );
}

function Divider() {
  return <View style={sectionStyles.divider} />;
}

function SectionLabel({ text, top }: { text: string; top?: number }) {
  const { scaleSize } = useResponsive();
  return (
    <Text style={[sectionStyles.sectionLabel, { fontSize: scaleSize(10), top, paddingHorizontal: scaleSize(24) }]}>
      {text}
    </Text>
  );
}

function SectionCard({ children, top }: { children: React.ReactNode; top: number }) {
  const { scaleSize } = useResponsive();
  return (
    <View style={[sectionStyles.card, { top, marginHorizontal: scaleSize(20), borderRadius: scaleSize(16) }]}>
      {children}
    </View>
  );
}

export default function ProfileSettingsScreen({ navigation }: { navigation: any }) {
  const { scaleSize } = useResponsive();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const caregiver = user?.caregiverProfile;
  const children = user?.children || [];
  const activeChild = children.find((c) => c.id === user?.children?.[0]?.id) || children[0];

  function formatAge(ageInMonths?: number) {
    if (!ageInMonths) return '';
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return `${years} yrs ${months} mos`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />

      <View style={styles.drawer}>
        <View style={styles.statusBarPlaceholder} />

        <View style={[styles.header, { paddingHorizontal: scaleSize(16), paddingVertical: scaleSize(12) }]}>
          <Text style={[styles.headerTitle, { fontSize: scaleSize(18) }]}>Profile & Settings</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.closeButton, { width: scaleSize(32), height: scaleSize(32), borderRadius: scaleSize(16) }]}
          >
            <CloseIcon width={scaleSize(16)} height={scaleSize(16)} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: scaleSize(16) }}
        >
          {/* Profile Card */}
          <View style={[styles.profileCard, { marginHorizontal: scaleSize(16), borderRadius: scaleSize(20), marginTop: scaleSize(30) }]}>
            <View style={styles.profileCardDecor1} />
            <View style={styles.profileCardDecor2} />
            <View style={styles.profileCardDecor3} />

            <View style={[styles.profileContent, { top: scaleSize(16), left: scaleSize(16) }]}>
              <View style={styles.profileRow}>
                <View style={[styles.avatarCircle, { width: scaleSize(56), height: scaleSize(56), borderRadius: scaleSize(28) }]}>
                  <AvatarIcon width={scaleSize(32)} height={scaleSize(32)} />
                </View>
                <View style={styles.profileText}>
                  <Text style={[styles.profileName, { fontSize: scaleSize(17) }]}>{caregiver?.name || 'Dhaval Gandhi'}</Text>
                  <Text style={[styles.profileRole, { fontSize: scaleSize(9) }]}>{(caregiver?.role || 'PARENT').toUpperCase()}</Text>
                  <Text style={[styles.profileEmail, { fontSize: scaleSize(11) }]}>{caregiver?.email || 'dhaval.patel@email.com'}</Text>
                </View>
              </View>

              <View style={[styles.profileActions, { gap: scaleSize(30), marginTop: scaleSize(12) }]}>
                <Pressable style={[styles.editProfileBtn, { paddingHorizontal: scaleSize(12), borderRadius: scaleSize(14) }]}>
                  <EditIcon width={scaleSize(14)} height={scaleSize(14)} />
                  <Text style={[styles.editProfileText, { fontSize: scaleSize(11) }]}>Edit profile</Text>
                </Pressable>
                <Pressable style={[styles.premiumBtn, { width: scaleSize(86), height: scaleSize(28), borderRadius: scaleSize(14) }]}>
                  <PremiumIcon width={scaleSize(14)} height={scaleSize(14)} />
                  <Text style={[styles.premiumText, { fontSize: scaleSize(11), top: scaleSize(8), left: scaleSize(26), position: 'absolute' }]}>Premium</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* YOUR CHILDREN */}
          <SectionLabel text="YOUR CHILDREN" top={scaleSize(258 - 244)} />
          <View style={{ marginTop: scaleSize(258 - 244 + 18), marginHorizontal: scaleSize(16), gap: scaleSize(12) }}>
            {children.map((child) => {
              const isActive = child.id === activeChild?.id;
              return (
                <View key={child.id} style={[sectionStyles.childCard, { borderColor: isActive ? '#5963E1' : '#E2E4E8', paddingVertical: scaleSize(10), paddingHorizontal: scaleSize(12), borderRadius: scaleSize(14) }]}>
                  <View style={[sectionStyles.childMainRow, { gap: scaleSize(12) }]}>
                    <View style={[sectionStyles.childAvatar, { width: scaleSize(48), height: scaleSize(48), borderRadius: scaleSize(24) }]}>
                      <AvatarSmallIcon width={scaleSize(24)} height={scaleSize(24)} />
                    </View>
                    <View style={sectionStyles.childInfo}>
                      <View style={[sectionStyles.childNameRow, { gap: scaleSize(19) }]}>
                        <Text style={[sectionStyles.childName, { fontSize: scaleSize(15) }]}>{child.name}</Text>
                        {isActive && (
                          <View style={[sectionStyles.activeBadge, { borderRadius: scaleSize(8), width: scaleSize(56), height: scaleSize(16) }]}>
                            <Text style={[sectionStyles.activeText, { fontSize: scaleSize(9), width: scaleSize(56), textAlign: 'center' }]}>ACTIVE</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[sectionStyles.childAge, { fontSize: scaleSize(11) }]}>{formatAge(child.ageInMonths)}</Text>
                    </View>
                  </View>
                  <Pressable style={[sectionStyles.childEditBtn, { width: scaleSize(28), height: scaleSize(28), borderRadius: scaleSize(14) }]}>
                    <EditChildIcon width={scaleSize(14)} height={scaleSize(14)} />
                  </Pressable>
                </View>
              );
            })}

            <Pressable style={[sectionStyles.addChildBtn, { borderRadius: scaleSize(14), paddingVertical: scaleSize(11), paddingHorizontal: scaleSize(12) }]}>
              <View style={[sectionStyles.addChildIcon, { width: scaleSize(28), height: scaleSize(28), borderRadius: scaleSize(14) }]}>
                <PlusIcon width={scaleSize(14)} height={scaleSize(14)} color={colors.primaryBlue} />
              </View>
              <Text style={[sectionStyles.addChildText, { fontSize: scaleSize(13) }]}>{t('addAnotherChild')}</Text>
            </Pressable>
          </View>

          {/* ACCOUNT */}
          <SectionLabel text="ACCOUNT" top={scaleSize(472 - 400)} />
          <SectionCard top={scaleSize(472 - 400 + 18)}>
            <SectionItem
              icon={<PersonIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Personal information"
              subtitle="Name, email, phone"
            />
            <Divider />
            <SectionItem
              icon={<CompanionIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFBF8"
              title="Companions"
              subtitle="People sharing Nitya's journey"
              rightIcon={<ChevronIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
            <Divider />
            <SectionItem
              icon={<SubscriptionIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#FFEDC4"
              title="Subscription"
              subtitle="Premium · renews 12 Mar 2027"
            />
          </SectionCard>

          {/* PREFERENCES */}
          <SectionLabel text="PREFERENCES" top={scaleSize(676 - 530)} />
          <SectionCard top={scaleSize(676 - 530 + 18)}>
            <SectionItem
              icon={<NotificationIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Notifications"
              rightText="ON"
            />
            <Divider />
            <SectionItem
              icon={<LanguageIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Language"
              rightText="English"
              rightIcon={<ChevronIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
            <Divider />
            <SectionItem
              icon={<AppearanceIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Appearance"
              rightText="Light"
              rightIcon={<ChevronIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
            <Divider />
            <SectionItem
              icon={<SoundIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Sound & haptics"
              rightText="ON"
            />
          </SectionCard>

          {/* PRIVACY & DATA */}
          <SectionLabel text="PRIVACY & DATA" top={scaleSize(962 - 800)} />
          <SectionCard top={scaleSize(962 - 800 + 18)}>
            <SectionItem
              icon={<PrivacyIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Data & privacy"
              rightIcon={<ChevronIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
            <Divider />
            <SectionItem
              icon={<SecurityIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Security & 2FA"
              rightIcon={<ShieldIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
            <Divider />
            <SectionItem
              icon={<ExportIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Export your data"
              rightIcon={<ChevronIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
          </SectionCard>

          {/* SUPPORT */}
          <SectionLabel text="SUPPORT" top={scaleSize(1188 - 990)} />
          <SectionCard top={scaleSize(1188 - 990 + 18)}>
            <SectionItem
              icon={<HelpIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Help center"
              rightIcon={<ChevronIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
            <Divider />
            <SectionItem
              icon={<ContactIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="Contact us"
              rightIcon={<ChevronIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
            <Divider />
            <SectionItem
              icon={<AboutIcon width={scaleSize(14)} height={scaleSize(14)} />}
              iconBg="#EDFFFD"
              title="About TSAA"
              rightText="v2.4.1"
              rightIcon={<ChevronIcon width={scaleSize(24)} height={scaleSize(24)} />}
            />
          </SectionCard>

          {/* Logout */}
          <Pressable
            onPress={async () => {
              await signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Splash' }],
              });
            }}
            style={[styles.logoutButton, { marginHorizontal: scaleSize(20), height: scaleSize(52), borderRadius: scaleSize(26), marginTop: scaleSize(24) }]}
          >
            <LogoutIcon width={scaleSize(22)} height={scaleSize(22)} />
            <Text style={[styles.logoutText, { fontSize: scaleSize(14) }]}>Log out</Text>
          </Pressable>

          {/* Version */}
          <Text style={[styles.versionText, { fontSize: scaleSize(10), marginTop: scaleSize(12) }]}>
            TSAA v2.4.1 · Made with care
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    width: 60,
    backgroundColor: 'rgba(24, 24, 45, 0.4)',
  },
  drawer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    overflow: 'hidden',
  },
  statusBarPlaceholder: {
    height: 44,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#18182D',
    textAlign: 'left',
  },
  closeButton: {
    backgroundColor: '#F5F6F8',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileCard: {
    backgroundColor: '#5963E1',
    height: 132,
    overflow: 'hidden',
    position: 'relative',
  },
  profileCardDecor1: {
    position: 'absolute',
    top: -30,
    left: 220,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  profileCardDecor2: {
    position: 'absolute',
    top: 80,
    left: 230,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  profileCardDecor3: {
    position: 'absolute',
    top: 60,
    left: 60,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  profileContent: {
    position: 'absolute',
    width: 249,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarCircle: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    gap: 3,
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  profileRole: {
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'left',
  },
  profileEmail: {
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'left',
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 133,
    justifyContent: 'flex-end',
  },
  editProfileText: {
    fontFamily: 'Inter_500Medium',
    color: '#18182D',
  },
  premiumBtn: {
    backgroundColor: '#FFC63E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#D94C4C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    fontFamily: 'Inter_700Bold',
    color: '#D94C4C',
    textAlign: 'left',
  },
  versionText: {
    fontFamily: 'Inter_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

const sectionStyles = StyleSheet.create({
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    color: '#6B7180',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E4E8',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: '#18182D',
    textAlign: 'left',
  },
  rowSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
    textAlign: 'left',
  },
  rightText: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
    textAlign: 'right',
    position: 'absolute',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E4E8',
    marginLeft: 60,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  childMainRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  childAvatar: {
    backgroundColor: '#FFEDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childInfo: {
    flex: 1,
    gap: 6,
  },
  childNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childName: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#18182D',
  },
  activeBadge: {
    backgroundColor: '#EDFFFD',
  },
  activeText: {
    fontFamily: 'Inter_700Bold',
    color: '#5963E1',
  },
  childAge: {
    fontFamily: 'Inter_400Regular',
    color: '#6B7180',
  },
  childEditBtn: {
    backgroundColor: '#5963E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5963E1',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  addChildIcon: {
    backgroundColor: '#EDFFFD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChildText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#18182D',
  },
});
