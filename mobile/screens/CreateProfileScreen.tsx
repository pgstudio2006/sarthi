import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import Frame80Svg from '../assets/screen7/frame80.svg';
import ChoiceGrid from '../components/ChoiceGrid';
import PrimaryButton from '../components/PrimaryButton';
import PrivacyInfoCard from '../components/PrivacyInfoCard';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import ScreenLayout from '../components/ScreenLayout';
import { useAuth } from '../context/AuthContext';
import { createChildProfile } from '../api/client';
import DatePickerModal from '../components/DatePickerModal';
import {
  toISODate,
  formatISODateDisplay,
  parseISODate,
  parseDateInput,
  calculateAgeLabel,
  calculateAgeInMonths,
} from '../utils/date';
import LockPersonIcon from '../assets/screen15/lockPerson.svg';
import CalendarMonthIcon from '../assets/screen15/calendarMonth.svg';

const FIGMA_WIDTH = 390;
const GENDERS = ['Male', 'Female', 'Prefer not to say'];
const BIRTH_CONTEXT = ['Normal Birth', 'Premature < 37 weeks'];

export default function CreateProfileScreen({
  navigation,
  route,
}: {
  navigation: any;
  route?: {
    params?: {
      initialChildName?: string;
      initialDob?: string;
      initialGender?: string;
      initialBirthContext?: string;
      nextRoute?: string;
    };
  };
}) {
  const {
    initialChildName = 'Nitya Gandhi',
    initialDob = '15 May 2020',
    initialGender = 'Female',
    initialBirthContext = 'Normal Birth',
    nextRoute = 'NextOnboarding',
  } = route?.params ?? {};

  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;
  const { signIn, user, token, setActiveChildId } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const parsedInitialDob = parseDateInput(initialDob) ?? new Date(2020, 4, 15);
  const [childName, setChildName] = useState(initialChildName);
  const [dob, setDob] = useState(toISODate(parsedInitialDob));
  const [gender, setGender] = useState<string | null>(initialGender);
  const [birthContext, setBirthContext] = useState<string | null>(initialBirthContext);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dobDisplay = formatISODateDisplay(dob);
  const ageLabel = calculateAgeLabel(dob) === 'Age' ? '6 yrs 2 mos' : calculateAgeLabel(dob);

  const isValid = childName.length > 0 && dob.length > 0 && gender !== null && birthContext !== null;

  const handleContinue = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError('');
    const ageInMonths = calculateAgeInMonths(dob);
    const result = await createChildProfile({
      name: childName,
      dateOfBirth: dob,
      gender: gender || '',
      birthContext: birthContext || '',
      ageInMonths,
    });
    setSubmitting(false);
    if (result.success) {
      if (user && token) {
        signIn(token, { ...user, children: [...(user.children || []), result.data.child] });
        setActiveChildId(result.data.child.id);
      }
      if (nextRoute === 'Home') {
        navigation.goBack();
      } else {
        navigation.navigate(nextRoute);
      }
    } else {
      setError(result.error || 'Failed to create child profile. Please try again.');
    }
  };

  const goBack = () => {
    if (navigation.canGoBack?.()) navigation.goBack();
  };

  const header = <Frame80Svg width={width} height={56 * scale} />;

  const footer = (
    <View style={styles.footer}>
      <View style={styles.buttonWrapper}>
        <PrimaryButton
          label={submitting ? '' : 'Create Profile'}
          onPress={handleContinue}
          disabled={!isValid || submitting}
        />
        {submitting && (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.white} />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScreenLayout header={header} footer={footer}>
      <Pressable onPress={goBack} style={styles.backRow} hitSlop={10}>
        <ChevronLeftIcon width={14 * scale} height={14 * scale} />
        <Text style={[styles.backText, { fontSize: 13 * scale }]}>Back</Text>
      </Pressable>

      <View style={{ marginTop: 24 * scale, gap: 24 * scale }}>
        <Text style={[styles.heading, { fontSize: 26 * scale, lineHeight: 34 * scale }]}>
          Let's get to know the child
        </Text>

        <PrivacyInfoCard
          icon={<LockPersonIcon width={32 * scale} height={32 * scale} />}
          backgroundColor={colors.selectedBackground}
          title="Your responses are saved securely"
          subtitle="Your child's data is stored securely under DPDPA 2023."
          titleColor={colors.primaryBlue}
          borderRadius={16}
        />
      </View>

      <View style={{ marginTop: 24 * scale, gap: 24 * scale }}>
        <View style={{ gap: 12 * scale }}>
          <Text style={[styles.fieldLabel, { fontSize: 12 * scale }]}>Child's full name</Text>
          <View style={[styles.inputShell, { borderRadius: 16 * scale, paddingHorizontal: 16 * scale, paddingVertical: 12 * scale }]}>
            <TextInput
              value={childName}
              onChangeText={(txt) => { setChildName(txt); setError(''); }}
              style={[styles.inputText, { fontSize: 16 * scale }]}
              selectionColor={colors.primaryBlue}
            />
          </View>
        </View>

        <View style={{ gap: 12 * scale }}>
          <View style={styles.fieldHeaderRow}>
            <Text style={[styles.fieldLabel, { fontSize: 12 * scale }]}>Date of Birth</Text>
            <View style={[styles.ageBadge, { borderRadius: 8 * scale, paddingHorizontal: 12 * scale, paddingVertical: 9 * scale }]}>
              <Text style={[styles.ageBadgeText, { fontSize: 12 * scale }]}>{ageLabel}</Text>
            </View>
          </View>
          <Pressable onPress={() => setShowDatePicker(true)}>
            <View style={[styles.inputShell, styles.dateInputShell, { borderRadius: 14 * scale, paddingHorizontal: 16 * scale, paddingVertical: 12 * scale }]}>
              <TextInput
                value={dobDisplay}
                editable={false}
                pointerEvents="none"
                style={[styles.inputText, { fontSize: 16 * scale }]}
                selectionColor={colors.primaryBlue}
              />
              <CalendarMonthIcon width={24 * scale} height={24 * scale} />
            </View>
          </Pressable>
        </View>

        <View style={{ gap: 12 * scale }}>
          <Text style={[styles.fieldLabel, { fontSize: 12 * scale }]}>Gender</Text>
          <ChoiceGrid options={GENDERS} selected={gender} onSelect={(sel) => { setGender(sel); setError(''); }} columns={3} />
        </View>

        <View style={{ gap: 12 * scale }}>
          <Text style={[styles.fieldLabel, { fontSize: 12 * scale }]}>Birth context</Text>
          <ChoiceGrid options={BIRTH_CONTEXT} selected={birthContext} onSelect={(sel) => { setBirthContext(sel); setError(''); }} columns={2} />
        </View>
      </View>

      {error ? (
        <Text style={[styles.errorText, { fontSize: 14 * scale, marginTop: 12 * scale }]}>
          {error}
        </Text>
      ) : null}

      <DatePickerModal
        visible={showDatePicker}
        initialDate={parseISODate(dob)}
        maxDate={new Date()}
        onSelect={(date) => { setDob(toISODate(date)); setError(''); }}
        onClose={() => setShowDatePicker(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
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
  heading: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    textAlign: 'left',
  },
  fieldLabel: {
    fontFamily: 'Inter_700Bold',
    color: colors.grey,
    textTransform: 'uppercase',
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ageBadge: {
    backgroundColor: colors.selectedBackground,
  },
  ageBadgeText: {
    fontFamily: 'Inter_700Bold',
    color: colors.primaryBlue,
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
  footer: {
    width: '100%',
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    color: colors.errorRed,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
