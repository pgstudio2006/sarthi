import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Pressable,
  Modal,
} from 'react-native';
import { colors } from '../theme/colors';
import Logo from './Logo';
import OutlinedInput from './OutlinedInput';
import CityInput from './CityInput';
import ChoiceGrid from './ChoiceGrid';
import PrivacyInfoCard from './PrivacyInfoCard';
import PrimaryButton from './PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { createCaregiverProfile } from '../api/client';
import CheckIcon from '../assets/figma/screen11/check (1).svg';

const FIGMA_WIDTH = 390;

const RELATIONSHIP_OPTIONS = ['Mother', 'Father', 'Therapist', 'Teacher', 'Doctor', 'Others'];
const INDIAN_CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Vadodara',
  'Firozabad',
  'Ludhiana',
  'Rajkot',
];

export type RoleProfileVariant = {
  bannerTitle: string;
  bannerSubtitle: string;
  nameLabel: string;
  emailLabel: string;
  cityLabel: string;
  relationshipLabel: string;
  relationshipDefault: string;
  secondaryLabel: string;
  secondaryOptions: string[];
  secondaryDefault: string;
  finalLabel: string;
  finalPlaceholder: string;
  finalDefault: string;
  nextRoute: string;
  nextButtonLabel?: string;
  layout?: {
    horizontalPadding?: number;
    topPadding?: number;
    bottomPadding?: number;
    bannerTopMargin?: number;
    sectionGap?: number;
  };
};

export default function RoleProfileForm({
  navigation,
  variant,
}: {
  navigation: any;
  variant: RoleProfileVariant;
}) {
  const { width } = useWindowDimensions();
  const scale = width / FIGMA_WIDTH;

  const [fullName, setFullName] = useState('Dhaval Gandhi');
  const [email, setEmail] = useState('dhaval.gandhi027@gmail.com');
  const [city, setCity] = useState('Bangalore');
  const [relationship, setRelationship] = useState<string | null>(variant.relationshipDefault);
  const [secondaryChoice, setSecondaryChoice] = useState<string | null>(variant.secondaryDefault);
  const [finalValue, setFinalValue] = useState(variant.finalDefault);
  const [citySearch, setCitySearch] = useState('');
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const layout = variant.layout ?? {};
  const { signIn, user, token } = useAuth();
  const horizontalPadding = layout.horizontalPadding ?? 24;
  const topPadding = layout.topPadding ?? 24;
  const bottomPadding = layout.bottomPadding ?? 24;
  const bannerTopMargin = layout.bannerTopMargin ?? 24;
  const sectionGap = layout.sectionGap ?? 28;

  const filteredCities = INDIAN_CITIES.filter((option) =>
    option.toLowerCase().includes(citySearch.toLowerCase())
  );

  const isValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    city.trim().length > 0 &&
    relationship !== null &&
    (variant.secondaryOptions.length === 0 || secondaryChoice !== null) &&
    finalValue.trim().length > 0;

  const handleContinue = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError('');
    const input: any = {
      name: fullName.trim(),
      role: relationship || '',
      email: email.trim(),
      location: city.trim(),
    };
    if (relationship === 'Therapist' || relationship === 'Teacher' || relationship === 'Doctor') {
      input.speciality = secondaryChoice || '';
      input.institution = finalValue.trim();
    } else if (relationship === 'Others') {
      input.relation = finalValue.trim();
    } else {
      input.relation = relationship || '';
    }
    const result = await createCaregiverProfile(input);
    setSubmitting(false);
    if (result.success) {
      if (user && token) {
        await signIn(token, { ...user, caregiverProfile: result.data.profile });
      }
      navigation.navigate(variant.nextRoute);
    } else {
      setError(result.error || 'Failed to save profile. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding * scale,
            paddingTop: topPadding * scale,
            paddingBottom: bottomPadding * scale,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Logo width={92 * scale} height={36 * scale} />

        <View style={[styles.banner, { marginTop: bannerTopMargin * scale }]}>
          <View style={styles.bannerStripe} />
          <View style={[styles.bannerInner, { paddingVertical: 12 * scale, paddingHorizontal: 14 * scale, gap: 12 * scale }]}>
            <View style={[styles.bannerIcon, { width: 48 * scale, height: 48 * scale, borderRadius: 24 * scale }]}>
              <CheckIcon width={24 * scale} height={24 * scale} />
            </View>
            <View style={styles.bannerTextColumn}>
              <Text style={[styles.bannerTitle, { fontSize: 18 * scale, lineHeight: 24 * scale }]}>
                {variant.bannerTitle}
              </Text>
              <Text style={[styles.bannerSubtitle, { fontSize: 12 * scale, lineHeight: 16 * scale }]}>
                {variant.bannerSubtitle}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: sectionGap * scale, gap: sectionGap * scale }}>
          <OutlinedInput
            label={variant.nameLabel}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

          <OutlinedInput
            label={variant.emailLabel}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CityInput
            label={variant.cityLabel}
            value={city}
            onPress={() => {
              setCitySearch('');
              setCityModalVisible(true);
            }}
          />

          <View style={{ gap: 12 * scale }}>
            <Text style={[styles.sectionLabel, { fontSize: 12 * scale }]}>{variant.relationshipLabel}</Text>
            <ChoiceGrid
              options={RELATIONSHIP_OPTIONS}
              selected={relationship}
              onSelect={setRelationship}
              columns={2}
            />
          </View>

          {variant.secondaryOptions.length > 0 ? (
            <View style={{ gap: 12 * scale }}>
              <Text style={[styles.sectionLabel, { fontSize: 12 * scale }]}>{variant.secondaryLabel}</Text>
              <ChoiceGrid
                options={variant.secondaryOptions}
                selected={secondaryChoice}
                onSelect={setSecondaryChoice}
                columns={variant.secondaryOptions.length > 3 ? 2 : 2}
              />
            </View>
          ) : null}

          <OutlinedInput
            label={variant.finalLabel}
            value={finalValue}
            onChangeText={setFinalValue}
            placeholder={variant.finalPlaceholder}
            autoCapitalize="words"
          />
        </View>

        <View style={{ marginTop: 24 * scale }}>
          <PrivacyInfoCard
            icon={<CheckIcon width={16 * scale} height={16 * scale} />}
            backgroundColor={colors.selectedBackground}
            title="You're in!"
            subtitle={variant.bannerSubtitle}
          />
        </View>

        {error ? (
          <Text style={[styles.errorText, { fontSize: 14 * scale, marginTop: 12 * scale }]}>
            {error}
          </Text>
        ) : null}

        <View style={{ marginTop: 28 * scale, position: 'relative' }}>
          <PrimaryButton
            label={submitting ? 'Saving...' : (variant.nextButtonLabel ?? 'Continue')}
            onPress={handleContinue}
            disabled={!isValid || submitting}
          />
          {submitting && (
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator color={colors.white} />
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={cityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select City</Text>
            <OutlinedInput
              label="Search"
              value={citySearch}
              onChangeText={setCitySearch}
              placeholder="Search city"
              autoCapitalize="words"
            />
            <ScrollView style={styles.modalList}>
              {filteredCities.map((option) => (
                <Pressable
                  key={option}
                  style={styles.cityRow}
                  onPress={() => {
                    setCity(option);
                    setCityModalVisible(false);
                  }}
                >
                  <Text style={styles.cityRowText}>{option}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setCityModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.selectedBackground,
    overflow: 'hidden',
  },
  bannerStripe: {
    width: 12,
    backgroundColor: colors.primaryBlue,
  },
  bannerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16A34A',
  },
  bannerTextColumn: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
  },
  bannerSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    marginTop: 2,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    color: colors.grey,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: '82%',
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#D7D9E7',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: colors.mainBlack,
    marginBottom: 16,
  },
  modalList: {
    maxHeight: 300,
    marginTop: 12,
  },
  cityRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E4E8',
  },
  cityRowText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.mainBlack,
  },
  modalClose: {
    marginTop: 12,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    color: colors.errorRed,
    textAlign: 'center',
  },
  modalCloseText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.primaryBlue,
    fontSize: 14,
  },
});
