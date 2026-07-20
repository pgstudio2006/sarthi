import https from 'https';

export type SendSmsResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export type VerifyOtpResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function sendOtp(phone: string, code: string): Promise<SendSmsResult> {
  const authkey = process.env.MSG91_AUTHKEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authkey || !templateId) {
    return { success: false, error: 'MSG91 not configured' };
  }

  const mobile = phone.replace(/\D/g, '');
  if (!mobile || mobile.length < 10) {
    return { success: false, error: 'Invalid phone number' };
  }

  const params = new URLSearchParams({
    template_id: templateId,
    mobile,
    otp: code,
    otp_length: process.env.MSG91_OTP_LENGTH || '6',
    otp_expiry: process.env.MSG91_OTP_EXPIRY || '5',
    realTimeResponse: process.env.MSG91_REALTIME_RESPONSE || '1',
  });

  if (process.env.MSG91_SENDER_ID) {
    params.append('sender', process.env.MSG91_SENDER_ID);
  }

  const url = new URL(`https://control.msg91.com/api/v5/otp?${params.toString()}`);

  console.log('[MSG91] SendOTP URL:', url.toString());
  console.log('[MSG91] AuthKey:', authkey ? 'set' : 'missing');
  console.log('[MSG91] Template ID:', templateId);
  console.log('[MSG91] Mobile:', mobile);

  return new Promise((resolve) => {
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          authkey,
          'Content-Type': 'application/json',
          'Content-Length': '0',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log('[MSG91] SendOTP response status:', res.statusCode);
          console.log('[MSG91] SendOTP response body:', data);
          try {
            const json = data ? JSON.parse(data) : {};
            if (json.type === 'success' || json.type === 'Success' || res.statusCode === 200) {
              resolve({ success: true, message: json.message || 'OTP sent' });
            } else {
              resolve({
                success: false,
                error: json.message || `MSG91 responded with status ${res.statusCode}`,
              });
            }
          } catch {
            resolve({ success: false, error: 'Invalid response from MSG91' });
          }
        });
      }
    );

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.end();
  });
}

export async function verifyOtpViaMsg91(phone: string, code: string): Promise<VerifyOtpResult> {
  const authkey = process.env.MSG91_AUTHKEY;

  if (!authkey) {
    return { success: false, error: 'MSG91 not configured' };
  }

  const mobile = phone.replace(/\D/g, '');
  if (!mobile || mobile.length < 10) {
    return { success: false, error: 'Invalid phone number' };
  }

  const url = new URL(`https://control.msg91.com/api/v5/otp/verify?mobile=${mobile}&otp=${encodeURIComponent(code)}`);

  return new Promise((resolve) => {
    const req = https.request(
      url,
      {
        method: 'GET',
        headers: {
          authkey,
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const json = data ? JSON.parse(data) : {};
            if (json.type === 'success' || json.type === 'Success' || res.statusCode === 200) {
              resolve({ success: true, message: json.message || 'OTP verified' });
            } else {
              resolve({
                success: false,
                error: json.message || 'Invalid or expired OTP',
              });
            }
          } catch {
            resolve({ success: false, error: 'Invalid response from MSG91' });
          }
        });
      }
    );

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.end();
  });
}
