import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import userRoutes from './routes/users';
import screeningRoutes from './routes/screening';
import aiRoutes from './routes/ai';
import locationRoutes from './routes/locations';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/locations', locationRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sarthi backend running on http://0.0.0.0:${PORT}`);
});
