import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { useTranslation } from '../i18n';
import Frame80Svg from '../assets/screen7/frame80.svg';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import OTPInput from '../components/OTPInput';
import CountdownTimer from '../components/CountdownTimer';
import PrimaryButton from '../components/PrimaryButton';
import PrivacyInfoCard from '../components/PrivacyInfoCard';
import ScreenLayout from '../components/ScreenLayout';
import { useResponsive } from '../utils/responsive';
import { requestOtp, verifyOtp, User } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Illustration from '../assets/screen7/illustration.svg';

const GAP_HEADER_TO_BACK = 11;
const GAP_BACK_TO_ILLUSTRATION = 24;
const GAP_ILLUSTRATION_TO_HEADING = 32;
const GAP_HEADING_TO_OTP = 32;
const GAP_OTP_TO_RESEND = 15;
const GAP_RESEND_TO_CARD = 32;

export default function OTPVerificationScreen({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { phoneNumber?: string; devOtp?: string } };
}) {
  const { t } = useTranslation();
  const { width, scaleSize, scaleFont } = useResponsive();
  const { signIn } = useAuth();
  const rawPhone = route?.params?.phoneNumber ?? '+91 ';
  const digits = rawPhone.replace(/\D/g, '').slice(-10);
  const apiPhone = `+91${digits}`;
  const displayPhone = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;

  const [otp, setOtp] = useState(route?.params?.devOtp ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError('');
    const result = await verifyOtp(apiPhone, otp);
    setLoading(false);
    if (!result.success && !__DEV__) {
      setError(result.error);
      return;
    }
    const token = result.success ? result.data.token : 'dev-token';
    const user: User = result.success
      ? result.data.user
      : {
          id: 'dev-user',
          phone: apiPhone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          caregiverProfile: null,
          children: [],
        };
    await signIn(token, user);
    navigation.navigate('CreateCaregiverProfile');
  };

  const handleResend = async () => {
    setOtp('');
    setError('');
    const result = await requestOtp(apiPhone);
    if (!result.success) {
      setError(result.error);
    }
  };

  const goBack = () => {
    navigation.navigate('PhoneAuth');
  };

  const header = (
    <Frame80Svg width={width} height={scaleSize(56)} />
  );

  const footer = (
    <View style={[styles.buttonWrapper, { gap: scaleSize(20) }]}>
      <Text style={[styles.helperText, { fontSize: scaleFont(12) }]}>
        {t('enterAll6Digits')}
      </Text>
      <PrimaryButton
        label={loading ? t('verifying') : t('continue')}
        onPress={handleContinue}
        disabled={otp.length !== 6 || loading}
      />
    </View>
  );

  return (
    <ScreenLayout header={header} footer={footer}>
      <Pressable
        onPress={goBack}
        style={[styles.backButton, { marginTop: scaleSize(GAP_HEADER_TO_BACK) }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ChevronLeftIcon width={scaleSize(16)} height={scaleSize(16)} />
        <Text style={[styles.backText, { fontSize: scaleFont(14) }]}>{t('back')}</Text>
      </Pressable>

      <View style={[styles.content, { marginTop: scaleSize(GAP_BACK_TO_ILLUSTRATION) }]}>
        <Illustration width={scaleSize(104)} height={scaleSize(107)} />

        <View style={[styles.textGroup, { marginTop: scaleSize(GAP_ILLUSTRATION_TO_HEADING), gap: scaleSize(10) }]}>
          <Text style={[styles.heading, { fontSize: scaleFont(26), lineHeight: scaleFont(34) }]}>
            {t('enter6DigitCode')}
          </Text>
          <Text style={[styles.phoneText, { fontSize: scaleFont(13) }]}>
            {t('sentTo', { phone: displayPhone })}
          </Text>
          <Pressable onPress={goBack}>
            <Text style={[styles.changeNumber, { fontSize: scaleFont(13) }]}>
              {t('changeNumber')}
            </Text>
          </Pressable>
        </View>

        <View style={{ marginTop: scaleSize(GAP_HEADING_TO_OTP) }}>
          <OTPInput value={otp} onChange={setOtp} />
        </View>

        <View style={[styles.resendRow, { marginTop: scaleSize(GAP_OTP_TO_RESEND) }]}>
          <Text style={[styles.didntGetText, { fontSize: scaleFont(12) }]}>
            {t('didntGetCode')}
          </Text>
          <CountdownTimer onResend={handleResend} />
        </View>

        {error ? (
          <Text style={[styles.error, { fontSize: scaleFont(13), marginTop: scaleSize(10) }]}>
            {error}
          </Text>
        ) : null}

        <View style={{ marginTop: scaleSize(GAP_RESEND_TO_CARD), width: '100%' }}>
          <PrivacyInfoCard
            backgroundColor={colors.privacyGreenLight}
            message={t('autoFillCode')}
            textAlign="center"
            borderRadius={12}
            paddingHorizontal={14}
            paddingVertical={13}
            messageWeight="regular"
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.grey,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  textGroup: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  heading: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    textAlign: 'center',
  },
  phoneText: {
    fontFamily: 'Inter_400Regular',
    color: '#000000',
    textAlign: 'center',
  },
  changeNumber: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.primaryBlue,
    textAlign: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  didntGetText: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
  },
  error: {
    fontFamily: 'Inter_400Regular',
    color: colors.errorRed,
    textAlign: 'center',
  },
  helperText: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    position: 'relative',
  },
});
