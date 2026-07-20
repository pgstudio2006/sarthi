import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';
import { ChildProfile } from '../api/client';
import AvatarIcon from '../assets/figma/screen16/image 9 [Vectorized].svg';
import PlusIcon from '../assets/figma/screen25/add_2.svg';
import CloseIcon from '../assets/figma/screen26/Frame-32.svg';
import EditIcon from '../assets/figma/screen25/stylus_note.svg';

type ChildSwitcherSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelectChild: (child: ChildProfile) => void;
  onAddChild: () => void;
  onEditChild: (child: ChildProfile) => void;
};

function formatAge(ageInMonths?: number) {
  if (!ageInMonths) return '';
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  return `${years} yrs ${months} mos`;
}

export default function ChildSwitcherSheet({
  visible,
  onClose,
  onSelectChild,
  onAddChild,
  onEditChild,
}: ChildSwitcherSheetProps) {
  const { scaleSize, padding } = useResponsive();
  const { user, activeChildId, setActiveChildId } = useAuth();
  const children = user?.children || [];

  const handleSelect = (child: ChildProfile) => {
    setActiveChildId(child.id);
    onSelectChild(child);
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={[styles.handle, { width: scaleSize(40), height: scaleSize(4), borderRadius: scaleSize(999) }]} />
        <View style={styles.headerRow}>
          <Text style={[styles.title, { fontSize: scaleSize(18) }]}>Add Children</Text>
          <Pressable onPress={onClose} hitSlop={scaleSize(10)}>
            <CloseIcon width={scaleSize(20)} height={scaleSize(20)} />
          </Pressable>
        </View>
        <Text style={[styles.subtitle, { fontSize: scaleSize(13), paddingHorizontal: scaleSize(24), marginBottom: scaleSize(16) }]}>
          Add another child and track everyone's progress
        </Text>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: scaleSize(24) }}
        >
          <Text style={[styles.sectionLabel, { fontSize: scaleSize(11), marginBottom: scaleSize(10) }]}>YOUR CHILDREN</Text>

          <View style={{ gap: scaleSize(12) }}>
            {children.map((child) => {
              const isActive = child.id === activeChildId;
              return (
                <View key={child.id} style={[styles.childCard, { borderColor: isActive ? colors.primaryBlue : '#E2E4E8' }]}>
                  <Pressable
                    style={styles.childMainRow}
                    onPress={() => handleSelect(child)}
                  >
                    <View style={[styles.childAvatar, { width: scaleSize(48), height: scaleSize(48), borderRadius: scaleSize(24) }]}>
                      <AvatarIcon width={scaleSize(28)} height={scaleSize(28)} />
                    </View>
                    <View style={styles.childInfo}>
                      <View style={styles.childNameRow}>
                        <Text style={[styles.childName, { fontSize: scaleSize(16) }]}>{child.name}</Text>
                        {isActive && (
                          <View style={[styles.activeBadge, { paddingHorizontal: scaleSize(8), paddingVertical: scaleSize(2), borderRadius: scaleSize(10) }]}>
                            <Text style={[styles.activeText, { fontSize: scaleSize(10) }]}>ACTIVE</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.childAge, { fontSize: scaleSize(12) }]}>{formatAge(child.ageInMonths)}</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => onEditChild(child)}
                    style={[styles.editBtn, { width: scaleSize(32), height: scaleSize(32), borderRadius: scaleSize(16) }]}
                    hitSlop={scaleSize(10)}
                  >
                    <EditIcon width={scaleSize(16)} height={scaleSize(16)} />
                  </Pressable>
                </View>
              );
            })}

            <Pressable
              onPress={onAddChild}
              style={[styles.addChildCard, { paddingVertical: scaleSize(14), borderRadius: scaleSize(16) }]}
            >
              <View style={[styles.addChildIcon, { width: scaleSize(40), height: scaleSize(40), borderRadius: scaleSize(20) }]}>
                <PlusIcon width={scaleSize(20)} height={scaleSize(20)} />
              </View>
              <Text style={[styles.addChildText, { fontSize: scaleSize(14) }]}>Add another child</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 24, 0.53)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  handle: {
    backgroundColor: '#E2E4E8',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    color: colors.grey,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  childMainRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  childAvatar: {
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childInfo: {
    flex: 1,
    gap: 2,
  },
  childNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  childName: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  activeBadge: {
    backgroundColor: '#E3F5E8',
  },
  activeText: {
    fontFamily: 'Inter_700Bold',
    color: '#228C45',
  },
  childAge: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  editBtn: {
    backgroundColor: '#F3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#535BD8',
    borderStyle: 'dashed',
    paddingHorizontal: 14,
    gap: 12,
  },
  addChildIcon: {
    backgroundColor: '#EDFFFD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChildText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
  },
});
