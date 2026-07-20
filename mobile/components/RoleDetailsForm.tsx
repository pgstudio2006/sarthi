import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import Frame80Svg from '../assets/screen7/frame80.svg';
import ChoiceGrid from './ChoiceGrid';
import PrimaryButton from './PrimaryButton';
import ScreenLayout from './ScreenLayout';
import { useResponsive } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';
import { createCaregiverProfile } from '../api/client';

const ROLES = ['Mother', 'Father', 'Therapist', 'Teacher', 'Doctor', 'Others'];

const CONFIG: Record<string, {
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

export default function RoleDetailsForm({
  navigation,
  role,
  nextRoute,
}: {
  navigation: any;
  role: string;
  nextRoute: string;
}) {
  const { width, scaleSize, scaleFont } = useResponsive();
  const config = CONFIG[role] ?? CONFIG.Others;

  const [relationship, setRelationship] = useState<string | null>(role);
  const [secondaryChoice, setSecondaryChoice] = useState<string | null>(null);
  const [finalValue, setFinalValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signIn, user, token } = useAuth();

  const isValid =
    relationship !== null &&
    (config.secondaryOptions.length === 0 || secondaryChoice !== null) &&
    finalValue.length > 0;

  const handleContinue = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError('');
    const existing = user?.caregiverProfile;
    const input: any = {
      name: existing?.name || 'User',
      role: relationship || role,
      email: existing?.email || '',
      location: existing?.location || '',
    };
    if (relationship === 'Therapist' || relationship === 'Teacher' || relationship === 'Doctor') {
      input.speciality = secondaryChoice || '';
      input.institution = finalValue;
    } else if (relationship === 'Others') {
      input.relation = finalValue;
    } else {
      input.relation = relationship || role;
    }
    const result = await createCaregiverProfile(input);
    setSubmitting(false);
    if (result.success) {
      if (user && token) {
        await signIn(token, { ...user, caregiverProfile: result.data.profile });
      }
      navigation.navigate(nextRoute);
    } else {
      setError(result.error || 'Failed to save profile. Please try again.');
    }
  };

  const header = <Frame80Svg width={width} height={scaleSize(56)} />;

  const footer = (
    <View style={styles.footer}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <PrimaryButton
        label={submitting ? 'Saving...' : 'Continue'}
        onPress={handleContinue}
        disabled={!isValid || submitting}
      />
    </View>
  );

  return (
    <ScreenLayout header={header} footer={footer}>
      <View style={[styles.form, { gap: scaleSize(24), marginTop: scaleSize(24) }]}>
        <View style={styles.field}>
          <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
            Relationship with child
          </Text>
          <ChoiceGrid
            options={ROLES}
            selected={relationship}
            onSelect={setRelationship}
            columns={2}
          />
        </View>

        {config.secondaryOptions.length > 0 ? (
          <View style={styles.field}>
            <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
              {config.secondaryLabel}
            </Text>
            <ChoiceGrid
              options={config.secondaryOptions}
              selected={secondaryChoice}
              onSelect={setSecondaryChoice}
              columns={2}
            />
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={[styles.label, { fontSize: scaleFont(12) }]}>
            {config.finalLabel}
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
              onChangeText={setFinalValue}
              placeholder={config.finalPlaceholder}
              placeholderTextColor="#A6A6B8"
              style={[styles.inputText, { fontSize: scaleFont(16) }]}
              selectionColor={colors.primaryBlue}
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontFamily: 'Inter_500Medium',
    color: '#D94C4C',
    textAlign: 'center',
    marginBottom: 12,
  },
  form: {
    width: '100%',
  },
  field: {
    width: '100%',
    gap: 12,
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
  inputText: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    color: colors.mainBlack,
    padding: 0,
  },
  footer: {
    width: '100%',
  },
});
