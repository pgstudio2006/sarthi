import React from 'react';
import RoleProfileForm from '../components/RoleProfileForm';

export default function NextOnboardingScreen({ navigation }: { navigation: any }) {
  return (
    <RoleProfileForm
      navigation={navigation}
      variant={{
        bannerTitle: "You're in! Let’s create your profile.",
        bannerSubtitle: 'Let’s create your profile.',
        nameLabel: 'Your full name',
        emailLabel: 'Email',
        cityLabel: 'City',
        relationshipLabel: 'Relationship with child',
        relationshipDefault: 'Therapist',
        secondaryLabel: 'Speciality',
        secondaryOptions: ['Behaviour Therapy', 'Occupational Therapy', 'Speech Therapy'],
        secondaryDefault: 'Speech Therapy',
        finalLabel: 'Therapy centre',
        finalPlaceholder: '',
        finalDefault: '',
        nextRoute: 'Welcome',
        nextButtonLabel: 'Continue',
      }}
    />
  );
}
