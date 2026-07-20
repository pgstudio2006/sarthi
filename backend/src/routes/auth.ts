import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { createOtp, validateOtp, DEV_OTP_BYPASS } from '../lib/otp';
import { sendOtp, verifyOtpViaMsg91 } from '../lib/sms';
import { generateToken } from '../lib/auth';

const router = Router();

const phoneSchema = z.object({
  phone: z.string().min(10).max(15),
});

const verifySchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(6),
});

router.post('/otp/request', async (req, res) => {
  const parse = phoneSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid phone number' });
    return;
  }

  const { phone } = parse.data;
  const code = await createOtp(phone);

  if (DEV_OTP_BYPASS) {
    res.json({ success: true, message: 'OTP sent', devOtp: code });
    return;
  }

  const sms = await sendOtp(phone, code);
  if (!sms.success) {
    res.status(500).json({ error: sms.error || 'Failed to send OTP' });
    return;
  }

  res.json({ success: true, message: 'OTP sent' });
});

router.post('/otp/verify', async (req, res) => {
  const parse = verifySchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid phone number or code' });
    return;
  }

  const { phone, code } = parse.data;

  if (DEV_OTP_BYPASS) {
    const otp = await validateOtp(phone, code);
    if (!otp) {
      res.status(400).json({ error: 'Invalid or expired OTP' });
      return;
    }
  } else {
    const result = await verifyOtpViaMsg91(phone, code);
    if (!result.success) {
      res.status(400).json({ error: result.error || 'Invalid or expired OTP' });
      return;
    }
  }

  const include: Prisma.UserInclude = {
    caregiverProfile: true,
    children: { orderBy: { createdAt: Prisma.SortOrder.desc } },
  };

  let user = await prisma.user.findUnique({ where: { phone }, include });
  if (!user) {
    user = await prisma.user.create({ data: { phone }, include });
  }

  const token = generateToken(user);
  res.json({ success: true, token, user });
});

export default router;
