import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { DOMAIN_CONFIG, getDomainStatus } from '../lib/scoring';

const router = Router();

const requestSchema = z.object({
  childId: z.string().min(1),
});

const faqSchema = z.object({
  title: z.string().min(1).max(160),
  body: z.string().min(1).max(700),
});

const awarenessQuestions = [
  "My child isn't speaking yet. Should I be worried?",
  'How do I know if this is autism or just delayed speech?',
  'What early signs should I look for?',
  'At what age can autism be identified?',
  'Should I wait for a few more months?',
  'Which doctor should I consult first?',
  'Can autism be cured?',
  'Will my child be able to go to a regular school?',
  'What is developmental screening?',
  'If I have concerns, what should I do next?',
];

const progressQuestions = [
  "Why are some questions about behaviours that don't happen every day?",
  "What should I do if I'm not sure which answer to choose?",
  'My child behaves differently at home and school. How should I answer?',
  'Can I pause now and continue later?',
  'Can I change my answers before I finish?',
  'Is this screening a diagnosis?',
  'What will I receive after completing the screening?',
  'Why is it important to complete all the questions?',
  'Why do some questions seem similar?',
  'Will one answer change the entire screening result?',
];

const interpretationQuestions = [
  "What does my child's screening score mean?",
  'Does this screening confirm whether my child has autism?',
  'Which developmental areas should I focus on first?',
  'What should I do after receiving this screening report?',
  'Which specialist should I consult for my child\'s needs?',
  'How can I support my child\'s development at home?',
  'How do I share this report with my child\'s therapist or doctor?',
  'When should I repeat the screening?',
  'How can Saarathi help me track my child\'s progress?',
  "What are the next best steps for my child's development?",
];

const longitudinalQuestions = [
  'Is my child making progress compared to the last screening?',
  'Which developmental areas have improved the most over time?',
  'Which areas still need additional support?',
  'Why have some scores changed since the previous screening?',
  'How can I help my child continue improving at home?',
  "Should I update my child's developmental goals based on the latest report?",
  'How can I work with my child\'s therapist or teacher using these progress reports?',
  'What patterns can I learn from my child\'s screening history?',
  'When should I complete the next screening?',
  "How can Saarathi help me monitor my child's developmental journey over time?",
];

function fallbackAnswer(question: string, mode: string): string {
  if (question.toLowerCase().includes('diagnosis')) {
    return 'This screening is not a diagnosis. It can help organize observations and guide a conversation with a qualified developmental professional.';
  }
  if (question.toLowerCase().includes('repeat') || question.toLowerCase().includes('next screening')) {
    return 'Saarathi recommends reviewing progress over time and repeating the screening after 90 days, or as advised by your child\'s healthcare professional.';
  }
  if (mode === 'Progress Coaching & Longitudinal Guidance') {
    return 'Compare patterns across screenings rather than one score. Celebrate steady gains, note areas that remain difficult, and share the trend with your child\'s care team.';
  }
  if (mode === 'Interpretation & Guidance') {
    return 'Use the report as an educational guide, focus on the domains needing support, and discuss the observations with a qualified professional.';
  }
  return 'Every child develops differently. Observe patterns in everyday situations, use reliable developmental guidance, and begin the screening when you are ready.';
}

function buildMode(completedCount: number, inProgress: boolean) {
  if (inProgress) return 'Screening Support';
  if (completedCount > 1) return 'Progress Coaching & Longitudinal Guidance';
  if (completedCount === 1) return 'Interpretation & Guidance';
  return 'Awareness & Education';
}

async function generateWithOpenRouter(mode: string, childAgeInMonths: number | null, questions: string[], context: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'https://saarathi.care',
      'X-Title': 'Saarathi Care',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You create safe parent education for developmental screening. Never diagnose, predict autism, interpret individual answers, or create alarm. Return only JSON: {"faqs":[{"title":"...","body":"..."}]} with exactly 10 concise, empathetic, actionable cards.',
        },
        {
          role: 'user',
          content: `Mode: ${mode}\nChild age in months: ${childAgeInMonths ?? 'unknown'}\nContext: ${context}\nUse these question priorities in order:\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
        },
      ],
    }),
  });

  if (!response.ok) return null;
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return null;
  try {
    const parsed = JSON.parse(content) as { faqs?: unknown };
    const result = z.array(faqSchema).safeParse(parsed.faqs);
    return result.success && result.data.length === 10 ? result.data : null;
  } catch {
    return null;
  }
}

router.post('/faqs', requireAuth, async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'childId is required' });
    return;
  }

  const userId = req.user!.userId;
  const child = await prisma.childProfile.findFirst({ where: { id: parsed.data.childId, userId } });
  if (!child) {
    res.status(404).json({ error: 'Child not found' });
    return;
  }

  const sessions = await prisma.screeningSession.findMany({
    where: { userId, childId: child.id },
    orderBy: { startedAt: 'desc' },
    include: { responses: true },
  });
  const completed = sessions.filter((session) => session.status === 'completed');
  const active = sessions.find((session) => session.status === 'in_progress');
  const responseCount = active?.responses.length || 0;
  const progress = Math.round((responseCount / Object.values(DOMAIN_CONFIG).reduce((sum, config) => sum + config.questionCount, 0)) * 100);
  const completedDomains = [...new Set(active?.responses.map((response) => response.domain) || [])];
  const latest = completed[0];
  const domainContext = latest?.responses.reduce<Record<string, number>>((result, response) => {
    result[response.domain] = (result[response.domain] || 0) + response.score;
    return result;
  }, {}) || {};
  const priorityDomains = Object.entries(domainContext)
    .map(([domain, score]) => ({ domain, status: getDomainStatus(domain, score), score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => `${item.domain}: ${item.status}`);

  const mode = buildMode(completed.length, Boolean(active));
  const questions = active ? progressQuestions : completed.length > 1 ? longitudinalQuestions : completed.length === 1 ? interpretationQuestions : awarenessQuestions;
  const context = active
    ? `Screening progress is ${progress}%. Completed domains: ${completedDomains.join(', ') || 'none'}. Do not interpret answers.`
    : completed.length === 1
    ? `One screening is complete. Priority domains from the report: ${priorityDomains.join('; ') || 'none'}.`
    : completed.length > 1
    ? `There are ${completed.length} completed screenings. Use longitudinal progress language and never diagnose.`
    : 'No screening has been completed. Build awareness and encourage informed screening.';

  const generated = await generateWithOpenRouter(mode, child.ageInMonths, questions, context);
  const faqs = generated || questions.map((title) => ({ title, body: fallbackAnswer(title, mode) }));
  res.json({ success: true, mode, progress, completedDomains, faqs: faqs.slice(0, 10) });
});

export default router;
