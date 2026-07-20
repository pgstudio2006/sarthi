import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import userRoutes from './routes/users';
import screeningRoutes from './routes/screening';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/screening', screeningRoutes);

async function ensureDevUser() {
  const existing = await prisma.user.findUnique({ where: { id: 'dev-user' } });
  if (!existing) {
    await prisma.user.create({
      data: { id: 'dev-user', phone: '9999999999' },
    });
    console.log('[AUTH BYPASS] Created dev-user');
  }
}

app.listen(PORT, async () => {
  try {
    await ensureDevUser();
  } catch (err) {
    console.error('[AUTH BYPASS] Failed to create dev-user:', err);
  }
  console.log(`Sarthi backend running on http://localhost:${PORT}`);
});
