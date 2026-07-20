import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { scoreResponses } from '../lib/scoring';

const router = Router();
router.use(requireAuth);

const responseSchema = z.object({
  domain: z.string().min(1),
  questionIndex: z.number().int().min(0),
  score: z.number().int().min(1).max(5),
});

const startSchema = z.object({
  childId: z.string().min(1),
});

const submitSchema = z.object({
  responses: z.array(responseSchema),
});

router.post('/start', async (req, res) => {
  const parse = startSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid child id' });
    return;
  }

  const userId = req.user!.userId;
  const { childId } = parse.data;

  const child = await prisma.childProfile.findFirst({
    where: { id: childId, userId },
  });
  if (!child) {
    res.status(404).json({ error: 'Child not found' });
    return;
  }

  const previousSession = await prisma.screeningSession.findFirst({
    where: { userId, childId, status: 'completed' },
    orderBy: { completedAt: 'desc' },
  });

  const session = await prisma.screeningSession.create({
    data: {
      userId,
      childId,
      status: 'in_progress',
      previousSessionId: previousSession?.id || null,
    },
  });

  res.json({ success: true, session });
});

router.get('/history', async (req, res) => {
  const userId = req.user!.userId;
  const childId = req.query.childId as string;
  if (!childId) {
    res.status(400).json({ error: 'childId query parameter is required' });
    return;
  }
  const sessions = await prisma.screeningSession.findMany({
    where: { userId, childId },
    orderBy: { startedAt: 'desc' },
    include: { responses: true },
  });
  res.json({ success: true, sessions });
});

router.post('/:id/responses', async (req, res) => {
  const parse = submitSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid responses' });
    return;
  }

  const userId = req.user!.userId;
  const sessionId = req.params.id;
  const session = await prisma.screeningSession.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  if (session.status !== 'in_progress') {
    res.status(400).json({ error: 'Session is not in progress' });
    return;
  }

  await prisma.screeningResponse.deleteMany({ where: { sessionId } });
  await prisma.screeningResponse.createMany({
    data: parse.data.responses.map((r) => ({ ...r, sessionId })),
  });

  res.json({ success: true });
});

router.post('/:id/submit', async (req, res) => {
  const parse = submitSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid responses' });
    return;
  }

  const userId = req.user!.userId;
  const sessionId = req.params.id;
  const session = await prisma.screeningSession.findFirst({
    where: { id: sessionId, userId },
    include: { child: true },
  });

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  if (session.status !== 'in_progress') {
    res.status(400).json({ error: 'Session is not in progress' });
    return;
  }

  await prisma.screeningResponse.deleteMany({ where: { sessionId } });
  await prisma.screeningResponse.createMany({
    data: parse.data.responses.map((r) => ({ ...r, sessionId })),
  });

  const scored = scoreResponses(parse.data.responses);

  const updated = await prisma.screeningSession.update({
    where: { id: sessionId },
    data: {
      status: 'completed',
      completedAt: new Date(),
      totalScore: scored.totalScore,
      result: scored.result,
    },
    include: { responses: true, child: true },
  });

  res.json({ success: true, session: updated, score: scored });
});

router.get('/latest', async (req, res) => {
  const userId = req.user!.userId;
  const childIdParse = z.string().safeParse(req.query.childId);
  if (!childIdParse.success) {
    res.status(400).json({ error: 'childId query parameter is required' });
    return;
  }
  const childId = childIdParse.data;

  const session = await prisma.screeningSession.findFirst({
    where: { userId, childId, status: 'completed' },
    orderBy: { completedAt: 'desc' },
    include: { responses: true, child: true },
  });

  if (!session) {
    res.status(404).json({ error: 'No completed screening found' });
    return;
  }

  const scored = scoreResponses(session.responses.map((r) => ({ domain: r.domain, questionIndex: r.questionIndex, score: r.score })));

  res.json({ success: true, session, score: scored });
});

router.get('/:id', async (req, res) => {
  const userId = req.user!.userId;
  const sessionId = req.params.id;

  const session = await prisma.screeningSession.findFirst({
    where: { id: sessionId, userId },
    include: { responses: true, child: true },
  });

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  const scored = session.status === 'completed'
    ? scoreResponses(session.responses.map((r) => ({ domain: r.domain, questionIndex: r.questionIndex, score: r.score })))
    : null;

  res.json({ success: true, session, score: scored });
});

export default router;
