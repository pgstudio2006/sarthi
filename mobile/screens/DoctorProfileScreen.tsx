import React from 'react';
import RoleDetailsForm from '../components/RoleDetailsForm';

export default function DoctorProfileScreen({ navigation }: { navigation: any }) {
  return <RoleDetailsForm navigation={navigation} role="Doctor" nextRoute="CreateProfile" />;
}
