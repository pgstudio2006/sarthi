import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

const caregiverSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  relation: z.string().optional().or(z.literal('')),
  speciality: z.string().optional().or(z.literal('')),
  institution: z.string().optional().or(z.literal('')),
});

const childSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().min(1),
  gender: z.string().min(1),
  birthContext: z.string().min(1),
  ageInMonths: z.number().int().optional(),
});

router.post('/caregiver', async (req, res) => {
  const parse = caregiverSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid caregiver profile data' });
    return;
  }

  const data = parse.data;
  const userId = req.user!.userId;

  const profile = await prisma.caregiverProfile.upsert({
    where: { userId },
    create: { ...data, userId },
    update: data,
  });

  res.json({ success: true, profile });
});

router.post('/child', async (req, res) => {
  const parse = childSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid child profile data' });
    return;
  }

  const userId = req.user!.userId;
  const child = await prisma.childProfile.create({
    data: { ...parse.data, userId },
  });

  res.json({ success: true, child });
});

router.get('/children', async (_req, res) => {
  const userId = _req.user!.userId;
  const children = await prisma.childProfile.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ children });
});

export default router;
