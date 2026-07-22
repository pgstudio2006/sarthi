export const DOMAIN_CONFIG: Record<
  string,
  { maxScore: number; questionCount: number; statusRanges: { label: string; min: number; max: number; color: string; bg: string }[] }
> = {
  Social: {
    maxScore: 45,
    questionCount: 9,
    statusRanges: [
      { label: 'Doing great', min: 0, max: 9, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Doing well', min: 10, max: 18, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Making progress', min: 19, max: 27, color: '#BB853E', bg: '#FDF3E5' },
      { label: 'Needs support', min: 28, max: 36, color: '#E25648', bg: '#FDF0EB' },
      { label: 'Needs extra support', min: 37, max: 45, color: '#B9382E', bg: '#FDE8E8' },
    ],
  },
  Emotion: {
    maxScore: 25,
    questionCount: 5,
    statusRanges: [
      { label: 'Doing great', min: 0, max: 5, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Doing well', min: 6, max: 10, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Making progress', min: 11, max: 15, color: '#BB853E', bg: '#FDF3E5' },
      { label: 'Needs support', min: 16, max: 20, color: '#E25648', bg: '#FDF0EB' },
      { label: 'Needs extra support', min: 21, max: 25, color: '#B9382E', bg: '#FDE8E8' },
    ],
  },
  Speech: {
    maxScore: 45,
    questionCount: 9,
    statusRanges: [
      { label: 'Doing great', min: 0, max: 9, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Doing well', min: 10, max: 18, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Making progress', min: 19, max: 27, color: '#BB853E', bg: '#FDF3E5' },
      { label: 'Needs support', min: 28, max: 36, color: '#E25648', bg: '#FDF0EB' },
      { label: 'Needs extra support', min: 37, max: 45, color: '#B9382E', bg: '#FDE8E8' },
    ],
  },
  Behavior: {
    maxScore: 35,
    questionCount: 7,
    statusRanges: [
      { label: 'Doing great', min: 0, max: 7, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Doing well', min: 8, max: 14, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Making progress', min: 15, max: 21, color: '#BB853E', bg: '#FDF3E5' },
      { label: 'Needs support', min: 22, max: 28, color: '#E25648', bg: '#FDF0EB' },
      { label: 'Needs extra support', min: 29, max: 35, color: '#B9382E', bg: '#FDE8E8' },
    ],
  },
  Sensory: {
    maxScore: 30,
    questionCount: 6,
    statusRanges: [
      { label: 'Doing great', min: 0, max: 6, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Doing well', min: 7, max: 12, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Making progress', min: 13, max: 18, color: '#BB853E', bg: '#FDF3E5' },
      { label: 'Needs support', min: 19, max: 24, color: '#E25648', bg: '#FDF0EB' },
      { label: 'Needs extra support', min: 25, max: 30, color: '#B9382E', bg: '#FDE8E8' },
    ],
  },
  Cognitive: {
    maxScore: 20,
    questionCount: 4,
    statusRanges: [
      { label: 'Doing great', min: 0, max: 4, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Doing well', min: 5, max: 8, color: '#1A7340', bg: '#E8F7F0' },
      { label: 'Making progress', min: 9, max: 12, color: '#BB853E', bg: '#FDF3E5' },
      { label: 'Needs support', min: 13, max: 16, color: '#E25648', bg: '#FDF0EB' },
      { label: 'Needs extra support', min: 17, max: 20, color: '#B9382E', bg: '#FDE8E8' },
    ],
  },
};

export const MAX_TOTAL_SCORE = 200;

export function classifyResult(totalScore: number) {
  if (totalScore < 70) return 'Normal';
  if (totalScore <= 106) return 'Mild Autism';
  if (totalScore <= 153) return 'Moderate Autism';
  return 'Severe Autism';
}

export function disabilityPercentage(totalScore: number) {
  if (totalScore < 70) return 0;
  if (totalScore === 70) return 40;
  if (totalScore <= 88) return 50;
  if (totalScore <= 105) return 60;
  if (totalScore <= 123) return 70;
  if (totalScore <= 140) return 80;
  if (totalScore <= 158) return 90;
  return 100;
}

export function getDomainStatus(domain: string, score: number) {
  const config = DOMAIN_CONFIG[domain];
  if (!config) return { label: 'Unknown', color: '#6B7180', bg: '#F4F5F5' };
  const range = config.statusRanges.find((r) => score >= r.min && score <= r.max);
  return range ?? config.statusRanges[config.statusRanges.length - 1];
}

export interface ResponseInput {
  domain: string;
  questionIndex: number;
  score: number;
}

export function scoreResponses(responses: ResponseInput[]) {
  const domainScores: Record<string, number> = {};
  for (const r of responses) {
    domainScores[r.domain] = (domainScores[r.domain] || 0) + r.score;
  }

  const totalScore = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const result = classifyResult(totalScore);

  const domainBreakdown = Object.entries(DOMAIN_CONFIG).map(([key, config]) => {
    const score = domainScores[key] || 0;
    const status = getDomainStatus(key, score);
    return {
      key,
      score,
      maxScore: config.maxScore,
      progress: config.maxScore > 0 ? score / config.maxScore : 0,
      status: status.label,
      statusColor: status.color,
      statusBg: status.bg,
    };
  });

  return {
    totalScore,
    maxScore: MAX_TOTAL_SCORE,
    result,
    disabilityPercentage: disabilityPercentage(totalScore),
    domainBreakdown,
  };
}
