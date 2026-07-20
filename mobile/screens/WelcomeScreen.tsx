import React from 'react';
import RoleProfileForm from '../components/RoleProfileForm';

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  return (
    <RoleProfileForm
      navigation={navigation}
      variant={{
        bannerTitle: "You're in! Let's personalise your experience, step by step.",
        bannerSubtitle: "Let's personalise your experience, step by step.",
        nameLabel: 'Your full name',
        emailLabel: 'Email',
        cityLabel: 'City',
        relationshipLabel: 'Relationship with child',
        relationshipDefault: 'Teacher',
        secondaryLabel: 'Role',
        secondaryOptions: ['Special Educator', 'Shadow Teacher'],
        secondaryDefault: 'Shadow Teacher',
        finalLabel: 'School or institute name',
        finalPlaceholder: 'Xyz',
        finalDefault: 'Xyz',
        nextRoute: 'DoctorProfile',
        nextButtonLabel: 'Continue',
        layout: {
          horizontalPadding: 24,
          topPadding: 24,
          bottomPadding: 24,
          bannerTopMargin: 24,
          sectionGap: 28,
        },
      }}
    />
  );
}
