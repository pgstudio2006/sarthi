import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import Frame80Svg from '../assets/screen7/frame80.svg';
import PrimaryButton from '../components/PrimaryButton';
import ChoiceGrid from '../components/ChoiceGrid';
import ScreenLayout from '../components/ScreenLayout';
import { useResponsive } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';
import { createCaregiverProfile } from '../api/client';
import LocationOnIcon from '../assets/screen8/locationOn.svg';
import CheckIcon from '../assets/screen8/check.svg';
import Ellipse3Icon from '../assets/screen8/ellipse3.svg';

const ROLES = ['Mother', 'Father', 'Therapist', 'Teacher', 'Doctor', 'Others'];

const GAP_CARD_TO_FORM = 24;
const GAP_FORM_FIELDS = 24;

const ROLE_CONFIG: Record<string, {
  secondaryLabel: string;
  secondaryOptions: string[];
  finalLabel: string;
  finalPlaceholder: string;
}> = {
  Therapist: {
    secondaryLabel: 'Speciality',
    secondaryOptions: ['Behaviour Therapy', 'Occupational Therapy', 'Speech Therapy'],
    finalLabel: 'Therapy Centre',
    finalPlaceholder: 'Bumblebee child care',
  },
  Teacher: {
    secondaryLabel: 'Role',
    secondaryOptions: ['Special Educator', 'Shadow Teacher'],
    finalLabel: 'School or Institute Name',
    finalPlaceholder: 'Xyz',
  },
  Doctor: {
    secondaryLabel: 'Role',
    secondaryOptions: ['General Pediatric', 'Developmental Pediatrician', 'Pediatric Neurologist', 'Child Psychiatrist', 'Other'],
    finalLabel: 'Hospital or Clinic Name',
    finalPlaceholder: 'Xyz',
  },
  Others: {
    secondaryLabel: '',
    secondaryOptions: [],
    finalLabel: 'Your Relationship',
    finalPlaceholder: 'Xyz',
  },
};

export default function CreateCaregiverProfileScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { width, padding, scaleSize, scaleFont } = useResponsive();
  const { signIn, user, token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [secondaryChoice, setSecondaryChoice] = useState<string | null>(null);
  const [finalValue, setFinalValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const roleConfig = role ? ROLE_CONFIG[role] : undefined;
  const needsRoleDetails = roleConfig !== undefined && role !== 'Mother' && role !== 'Father';

  const isValid =
    name.length > 0 &&
    email.length > 0 &&
    role !== null &&
    (!needsRoleDetails ||
      (roleConfig.secondaryOptions.length === 0 || secondaryChoice !== null) &&
      finalValue.length > 0);

  const handleRoleSelect = (selectedRole: string | null) => {
    setRole(selectedRole);
    setSecondaryChoice(null);
    setFinalValue('');
    setError('');
  };

  const handleContinue = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError('');
    const input: any = { name, role: role || '', email, location: city };
    if (role === 'Therapist' || role === 'Teacher' || role === 'Doctor') {
      input.speciality = secondaryChoice || '';
      input.institution = finalValue;
    } else if (role === 'Others') {
      input.relation = finalValue;
    } else {
      input.relation = role || '';
    }
    const result = await createCaregiverProfile(input);
    setSubmitting(false);
    if (result.success) {
      if (user && token) {
        signIn(token, { ...user, caregiverProfile: result.data.profile });
      }
      navigation.navigate('CreateProfile');
    } else {
      setError(result.error || 'Failed to save profile. Please try again.');
    }
  };

  const header = (
    <Frame80Svg width={width} height={scaleSize(56)} />
  );

  const footer = (
    <View style={[styles.footer, { marginTop: scaleSize(24) }]}>
      <View style={styles.buttonWrapper}>
        <PrimaryButton
          label={submitting ? '' : 'Continue'}
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
      <View
        style={[
          styles.welcomeCard,
          {
            marginTop: scaleSize(24),
            marginLeft: -padding,
            width: width - padding,
            borderRadius: scaleSize(16),
          },
        ]}
      >
        <View
          style={[
            styles.welcomeAccent,
            {
              width: scaleSize(12),
              backgroundColor: '#5963E1',
            },
          ]}
        />
        <View
          style={[
            styles.welcomeInner,
            {
              padding: scaleSize(16),
              gap: scaleSize(12),
            },
          ]}
        >
          <View style={styles.avatar}>
            <Ellipse3Icon width={scaleSize(48)} height={scaleSize(48)} />
            <View style={styles.checkOverlay}>
              <CheckIcon width={scaleSize(24)} height={scaleSize(24)} />
            </View>
          </View>
          <Text
            style={[
              styles.welcomeTitle,
              { fontSize: scaleFont(18), lineHeight: scaleFont(24) },
            ]}
          >
            {"You're in!\nLet's create your profile."}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.form,
          {
            marginTop: scaleSize(GAP_CARD_TO_FORM),
            gap: scaleSize(GAP_FORM_FIELDS),
          },
        ]}
      >
        <View style={styles.field}>
          <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
            your full name
          </Text>
          <View
            style={[
              styles.inputShell,
              {
                borderRadius: scaleSize(16),
                paddingHorizontal: scaleSize(16),
                paddingVertical: scaleSize(12),
              },
            ]}
          >
            <TextInput
              value={name}
              onChangeText={(txt) => { setName(txt); setError(''); }}
              style={[styles.inputText, { fontSize: scaleFont(16) }]}
              selectionColor={colors.primaryBlue}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
            Email
          </Text>
          <View
            style={[
              styles.inputShell,
              {
                borderRadius: scaleSize(16),
                paddingHorizontal: scaleSize(16),
                paddingVertical: scaleSize(12),
              },
            ]}
          >
            <TextInput
              value={email}
              onChangeText={(txt) => { setEmail(txt); setError(''); }}
              style={[styles.inputText, { fontSize: scaleFont(16) }]}
              selectionColor={colors.primaryBlue}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
            CITY
          </Text>
          <View
            style={[
              styles.inputShell,
              styles.cityShell,
              {
                borderRadius: scaleSize(14),
                paddingHorizontal: scaleSize(16),
                paddingVertical: scaleSize(12),
              },
            ]}
          >
            <TextInput
              value={city}
              onChangeText={(txt) => { setCity(txt); setError(''); }}
              style={[styles.inputText, { fontSize: scaleFont(16) }]}
              selectionColor={colors.primaryBlue}
            />
            <LocationOnIcon width={scaleSize(24)} height={scaleSize(24)} />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
            relationship with child
          </Text>
          <ChoiceGrid
            options={ROLES}
            selected={role}
            onSelect={handleRoleSelect}
            columns={2}
          />
        </View>

        {needsRoleDetails ? (
          <>
            {roleConfig.secondaryOptions.length > 0 ? (
              <View style={styles.field}>
                <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
                  {roleConfig.secondaryLabel}
                </Text>
                <ChoiceGrid
                  options={roleConfig.secondaryOptions}
                  selected={secondaryChoice}
                  onSelect={(sel) => { setSecondaryChoice(sel); setError(''); }}
                  columns={2}
                />
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
                {roleConfig.finalLabel}
              </Text>
              <View
                style={[
                  styles.inputShell,
                  {
                    borderRadius: scaleSize(16),
                    paddingHorizontal: scaleSize(16),
                    paddingVertical: scaleSize(12),
                  },
                ]}
              >
                <TextInput
                  value={finalValue}
                  onChangeText={(txt) => { setFinalValue(txt); setError(''); }}
                  placeholder={roleConfig.finalPlaceholder}
                  placeholderTextColor="#A6A6B8"
                  style={[styles.inputText, { fontSize: scaleFont(16) }]}
                  selectionColor={colors.primaryBlue}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </>
        ) : null}
      </View>

      {error ? (
        <Text style={[styles.errorText, { fontSize: scaleFont(14), marginTop: scaleSize(12) }]}>
          {error}
        </Text>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.selectedBackground,
    width: '100%',
  },
  welcomeAccent: {
    alignSelf: 'stretch',
  },
  welcomeInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'Inter_700Bold',
    color: colors.mainBlack,
    textAlign: 'left',
    flex: 1,
  },
  form: {
    width: '100%',
  },
  field: {
    width: '100%',
    gap: 12,
  },
  footer: {
    width: '100%',
  },
  label: {
    fontFamily: 'Inter_700Bold',
    color: colors.grey,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  inputShell: {
    width: '100%',
    borderWidth: 2,
    borderColor: colors.primaryBlue,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityShell: {
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
