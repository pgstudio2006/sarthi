import { prisma } from './prisma';

export const DEV_OTP_BYPASS = process.env.DEV_OTP_BYPASS === 'true';

const OTP_TTL_MINUTES = 5;

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpExpiry(): Date {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

export async function createOtp(phone: string): Promise<string> {
  const code = generateOtpCode();
  await prisma.otp.create({
    data: {
      phone,
      code,
      expiresAt: getOtpExpiry(),
    },
  });
  return code;
}

export async function validateOtp(phone: string, code: string) {
  const otp = await prisma.otp.findFirst({
    where: {
      phone,
      code: DEV_OTP_BYPASS ? undefined : code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) {
    return null;
  }

  await prisma.otp.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return otp;
}
