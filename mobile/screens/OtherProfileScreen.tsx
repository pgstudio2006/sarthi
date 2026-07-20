import React from 'react';
import RoleDetailsForm from '../components/RoleDetailsForm';

export default function OtherProfileScreen({ navigation }: { navigation: any }) {
  return <RoleDetailsForm navigation={navigation} role="Others" nextRoute="CreateProfile" />;
}
