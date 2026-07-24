import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';
import { updateChildProfile, ChildProfile } from '../api/client';
import ChoiceGrid from '../components/ChoiceGrid';
import DatePickerModal from '../components/DatePickerModal';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import {
  toISODate,
  formatISODateDisplay,
  parseISODate,
  parseDateInput,
  calculateAgeLabel,
  calculateAgeInMonths,
} from '../utils/date';
import AvatarIcon from '../assets/figma/screen16/image 9 [Vectorized].svg';
import CalendarMonthIcon from '../assets/screen15/calendarMonth.svg';
import EditIcon from '../assets/figma/screen25/stylus_note.svg';

const GENDERS = ['Male', 'Female', 'Prefer not to say'];


export default function EditChildProfileScreen({ navigation, route }: { navigation: any; route: any }) {
  const { scaleSize, padding } = useResponsive();
  const { user, token, signIn } = useAuth();
  const child: ChildProfile = route?.params?.child;

  const DEFAULT_DOB = new Date('2020-01-01');
  const initialDobDate = child?.dateOfBirth ? (parseDateInput(child.dateOfBirth) ?? DEFAULT_DOB) : DEFAULT_DOB;
  const [childName, setChildName] = useState(child?.name || '');
  const [dob, setDob] = useState(toISODate(initialDobDate));
  const [gender, setGender] = useState<string | null>(child?.gender || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const dobDisplay = formatISODateDisplay(dob);
  const ageLabel = calculateAgeLabel(dob);
  const isValid = childName.length > 0 && dob.length > 0 && gender !== null;

  const handleSave = async () => {
    if (!isValid || submitting || !child) return;
    setSubmitting(true);
    setError('');
    const ageInMonths = calculateAgeInMonths(dob);
    const result = await updateChildProfile(child.id, {
      name: childName,
      dateOfBirth: dob,
      gender: gender || '',
      ageInMonths,
    });
    setSubmitting(false);
    if (result.success) {
      if (user && token) {
        const updatedChildren = user.children?.map((c) =>
          c.id === child.id ? result.data.child : c
        ) || [];
        signIn(token, { ...user, children: updatedChildren });
      }
      navigation.goBack();
    } else {
      setError(result.error || 'Failed to update profile. Please try again.');
    }
  };

  const goBack = () => {
    if (navigation.canGoBack?.()) navigation.goBack();
  };

  if (!child) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.grey }}>No child selected.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.topBar, { paddingHorizontal: padding, paddingTop: scaleSize(16) }]}>
        <Pressable onPress={goBack} style={styles.backRow} hitSlop={scaleSize(10)}>
          <ChevronLeftIcon width={scaleSize(14)} height={scaleSize(14)} />
          <Text style={[styles.backText, { fontSize: scaleSize(13) }]}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: scaleSize(40) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.childCard, { padding: scaleSize(16), borderRadius: scaleSize(20), marginTop: scaleSize(8), borderWidth: 2, borderColor: '#5963E1' }]}>
          <View style={styles.childCardRow}>
            <View style={[styles.avatarCircle, { width: scaleSize(48), height: scaleSize(48), borderRadius: scaleSize(24), backgroundColor: '#FFEDC4' }]}>
              <AvatarIcon width={scaleSize(28)} height={scaleSize(28)} />
            </View>
            <View style={styles.childCardInfo}>
              <Text style={[styles.childCardName, { fontSize: scaleSize(16) }]}>{child.name}</Text>
              <View style={[styles.ageBadge, { borderRadius: scaleSize(8), paddingHorizontal: scaleSize(10), paddingVertical: scaleSize(4) }]}>
                <Text style={[styles.ageBadgeText, { fontSize: scaleSize(11) }]}>{ageLabel}</Text>
              </View>
            </View>
            <View style={[styles.editBadge, { width: scaleSize(32), height: scaleSize(32), borderRadius: scaleSize(16), backgroundColor: '#5963E1' }]}>
              <EditIcon width={scaleSize(16)} height={scaleSize(16)} />
            </View>
          </View>
        </View>

        <Text style={[styles.editTitle, { fontSize: scaleSize(22), marginTop: scaleSize(24) }]}>Edit Details</Text>

        <View style={{ marginTop: scaleSize(24), gap: scaleSize(24) }}>
          <View style={{ gap: scaleSize(10) }}>
            <Text style={[styles.fieldLabel, { fontSize: scaleSize(12) }]}>ENTER CHILD'S FULL NAME</Text>
            <View style={[styles.inputShell, { borderRadius: scaleSize(14), paddingHorizontal: scaleSize(16), paddingVertical: scaleSize(12) }]}>
              <TextInput
                value={childName}
                onChangeText={(txt) => { setChildName(txt); setError(''); }}
                style={[styles.inputText, { fontSize: scaleSize(16) }]}
                selectionColor={colors.primaryBlue}
              />
            </View>
          </View>

          <View style={{ gap: scaleSize(10) }}>
            <View style={styles.fieldHeaderRow}>
              <Text style={[styles.fieldLabel, { fontSize: scaleSize(12) }]}>DATE OF BIRTH</Text>
              <View style={[styles.ageBadge, { borderRadius: scaleSize(8), paddingHorizontal: scaleSize(12), paddingVertical: scaleSize(6) }]}>
                <Text style={[styles.ageBadgeText, { fontSize: scaleSize(12) }]}>{ageLabel}</Text>
              </View>
            </View>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View style={[styles.inputShell, styles.dateInputShell, { borderRadius: scaleSize(14), paddingHorizontal: scaleSize(16), paddingVertical: scaleSize(12) }]}>
                <TextInput
                  value={dobDisplay}
                  editable={false}
                  pointerEvents="none"
                  style={[styles.inputText, { fontSize: scaleSize(16) }]}
                  selectionColor={colors.primaryBlue}
                />
                <CalendarMonthIcon width={scaleSize(24)} height={scaleSize(24)} />
              </View>
            </Pressable>
          </View>

          <View style={{ gap: scaleSize(10) }}>
            <Text style={[styles.fieldLabel, { fontSize: scaleSize(12) }]}>GENDER</Text>
            <ChoiceGrid options={GENDERS} selected={gender} onSelect={(sel) => { setGender(sel); setError(''); }} columns={3} />
          </View>
        </View>

        {error ? (
          <Text style={[styles.errorText, { fontSize: scaleSize(14), marginTop: scaleSize(12) }]}>
            {error}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.saveFooter, { paddingHorizontal: padding, paddingBottom: scaleSize(16) }]}>
        <Pressable
          onPress={handleSave}
          disabled={!isValid || submitting}
          style={({ pressed }) => [
            styles.saveButton,
            { height: scaleSize(54), borderRadius: scaleSize(28), opacity: (!isValid || submitting) ? 0.5 : (pressed ? 0.9 : 1) },
          ]}
        >
          {submitting ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={[styles.saveButtonText, { fontSize: scaleSize(16) }]}>Save</Text>}
        </Pressable>
      </View>

      <DatePickerModal
        visible={showDatePicker}
        initialDate={parseISODate(dob)}
        maxDate={new Date()}
        onSelect={(date: Date) => { setDob(toISODate(date)); setError(''); }}
        onClose={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
  },
  backText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.grey,
  },
  savePill: {
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savePillText: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  saveFooter: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  childCard: {
    display: 'none',
  },
  childCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  childCardInfo: {
    flex: 1,
    gap: 4,
  },
  childCardName: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
  },
  ageBadge: {
    backgroundColor: colors.selectedBackground,
    alignSelf: 'flex-start',
  },
  ageBadgeText: {
    fontFamily: 'Inter_700Bold',
    color: colors.primaryBlue,
  },
  editBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editTitle: {
    display: 'none',
  },
  fieldLabel: {
    fontFamily: 'Inter_700Bold',
    color: colors.grey,
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputShell: {
    width: '100%',
    borderWidth: 2,
    borderColor: colors.primaryBlue,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInputShell: {
    justifyContent: 'space-between',
  },
  inputText: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
    padding: 0,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    color: colors.errorRed,
    textAlign: 'center',
  },
});
