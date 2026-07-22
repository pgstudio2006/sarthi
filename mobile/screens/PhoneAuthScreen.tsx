import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { useTranslation } from '../i18n';
import Frame80Svg from '../assets/screen6/frame80.svg';
import PhoneNumberInput from '../components/PhoneNumberInput';
import PrimaryButton from '../components/PrimaryButton';
import PrivacyInfoCard from '../components/PrivacyInfoCard';
import ScreenLayout from '../components/ScreenLayout';
import { useResponsive } from '../utils/responsive';
import { requestOtp } from '../api/client';
import LockIcon from '../assets/screen5/lock.svg';

const GAP_HEADER_TO_CONTENT = 30;
const GAP_HEADING_TO_SUBTITLE = 12;
const GAP_SUBTITLE_TO_INPUT = 20;
const GAP_INPUT_TO_INFO = 16;
const GAP_INFO_TO_CARD = 20;

export default function PhoneAuthScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const { width, scale, scaleSize, scaleFont } = useResponsive();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = phone.length === 10;

  const handleSendCode = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');

    const result = await requestOtp(`+91${phone}`);
    setLoading(false);

    if (!result.success && !__DEV__) {
      setError(result.error);
      return;
    }

    const devOtp = result.success ? result.data.devOtp : '123456';
    navigation.navigate('OTPVerification', { phoneNumber: `+91 ${phone}`, devOtp });
  };

  const header = (
    <Frame80Svg width={width} height={scaleSize(56)} />
  );

  const footer = (
    <View style={styles.buttonWrapper}>
      <PrimaryButton
        label={loading ? '' : t('sendCode')}
        onPress={handleSendCode}
        disabled={!isValid || loading}
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.white} />
        </View>
      )}
    </View>
  );

  return (
    <ScreenLayout header={header} footer={footer}>
      <View style={{ marginTop: scaleSize(GAP_HEADER_TO_CONTENT) }}>
        <View style={[styles.textGroup, { gap: scaleSize(GAP_HEADING_TO_SUBTITLE) }]}>
          <Text style={[styles.heading, { fontSize: scaleFont(30), lineHeight: scaleFont(38) }]}>
            {t('everyStepMatters')}
          </Text>
          <Text style={[styles.subtitle, { fontSize: scaleFont(14) }]}>
            {t('useMobileNumber')}
          </Text>
        </View>

        <View style={[styles.inputGroup, { marginTop: scaleSize(GAP_SUBTITLE_TO_INPUT), gap: scaleSize(GAP_INPUT_TO_INFO) }]}>
          <PhoneNumberInput value={phone} onChangeText={(text) => { setPhone(text); setError(''); }} />
          {error ? (
            <Text style={[styles.error, { fontSize: scaleFont(13) }]}>{error}</Text>
          ) : (
            <Text style={[styles.info, { fontSize: scaleFont(14), lineHeight: scaleFont(18) }]}>
              {t('otpInfoText')}
            </Text>
          )}
        </View>

        <View style={{ marginTop: scaleSize(GAP_INFO_TO_CARD) }}>
          <PrivacyInfoCard
            icon={<LockIcon width={scaleSize(32)} height={scaleSize(32)} />}
            backgroundColor={colors.privacyGreenLight}
            title={t('yourNumberPrivate')}
            subtitle={t('numberVerificationOnly')}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  textGroup: {
    alignItems: 'flex-start',
  },
  heading: {
    fontFamily: 'Inter_800ExtraBold',
    color: colors.mainBlack,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    textAlign: 'left',
  },
  inputGroup: {
    width: '100%',
  },
  info: {
    fontFamily: 'Inter_400Regular',
    color: colors.grey,
    textAlign: 'left',
  },
  error: {
    fontFamily: 'Inter_400Regular',
    color: colors.errorRed,
    textAlign: 'left',
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
