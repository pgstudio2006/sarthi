export interface ReportFAQItem {
  title: string;
  body: string;
}

export interface ReportDomainInput {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  status: string;
  attention: string[];
  strengths: string[];
}

export interface ReportFAQInput {
  childName?: string;
  score: number;
  total: number;
  result: string;
  completedCount: number;
  isRepeat: boolean;
  previousScore?: { totalScore?: number; date?: string } | null;
  domains: ReportDomainInput[];
}

const DOMAIN_ADVICE: Record<string, { support: string; strength: string }> = {
  Social: {
    support:
      'Arrange short, one-on-one playdates. Model simple greetings, taking turns, and sharing. Praise any small social attempt.',
    strength:
      'Keep building social confidence by joining group play and encouraging cooperative games and turn-taking.',
  },
  Emotion: {
    support:
      'Use feeling cards and calm-down routines. Name emotions out loud and show your child healthy ways to reset.',
    strength:
      'Nurture emotion awareness by talking about feelings during daily moments and validating their emotions.',
  },
  Speech: {
    support:
      'Offer choices between two words, expand on what your child says, and use visual communication cards.',
    strength:
      'Continue daily conversation, reading, and singing to keep vocabulary and back-and-forth communication growing.',
  },
  Behavior: {
    support:
      'Use visual schedules, give clear transition warnings, and offer safe sensory breaks before situations become overwhelming.',
    strength:
      'Reinforce positive behaviour with specific praise and keep routines predictable.',
  },
  Sensory: {
    support:
      'Provide noise-reducing headphones, a quiet calm-down space, and safe sensory toys that match their needs.',
    strength:
      'Encourage safe sensory exploration through playdough, swings, or textured toys.',
  },
  Cognitive: {
    support:
      'Break tasks into tiny steps, use visual timers, and follow your child’s interests to maintain attention.',
    strength:
      'Use their interests to introduce new ideas and celebrate problem-solving success.',
  },
};

function child(name?: string) {
  return name?.trim() || 'my child';
}

function toSentence(items: string[], max = 3): string {
  const list = items.slice(0, max);
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}

function needsSupport(status: string): boolean {
  const lower = (status ?? '').toLowerCase();
  return lower.includes('support') || lower.includes('progress');
}

function isNoSigns(result: string): boolean {
  const lower = (result ?? '').toLowerCase();
  return lower.includes('no sign') || lower === 'normal';
}

function getPriorityDomains(domains: ReportDomainInput[], count = 3): ReportDomainInput[] {
  const withAttention = domains
    .filter((d) => d.attention.length > 0)
    .sort((a, b) => b.score - a.score);

  if (withAttention.length > 0) {
    return withAttention.slice(0, count);
  }

  return [...domains].sort((a, b) => b.score - a.score).slice(0, count);
}

function buildDomainFAQs(name: string, domains: ReportDomainInput[]): ReportFAQItem[] {
  const faqs: ReportFAQItem[] = [];

  for (const domain of getPriorityDomains(domains)) {
    const advice = DOMAIN_ADVICE[domain.key] ?? {
      support: 'Talk to a specialist about a focused plan for this area.',
      strength: 'Keep encouraging this skill through everyday play.',
    };

    if (domain.attention.length > 0) {
      const points = toSentence(domain.attention);
      faqs.push({
        title: `Why is ${name}'s ${domain.label} an area to focus on?`,
        body: `${name} scored ${domain.score} out of ${domain.maxScore} in the ${domain.label} domain. The behaviours that need extra support include: ${points}. ${advice.support}`,
      });
    }

    if (domain.strengths.length > 0) {
      const points = toSentence(domain.strengths);
      faqs.push({
        title: `What is ${name} doing well in ${domain.label}?`,
        body: `${name} scored ${domain.score} out of ${domain.maxScore} in the ${domain.label} domain, and the following behaviours are going well: ${points}. ${advice.strength}`,
      });
    }
  }

  return faqs;
}

function buildFirstScreeningFAQs(input: ReportFAQInput, priorityDomains: ReportDomainInput[]): ReportFAQItem[] {
  const name = child(input.childName);
  const priorityLabels = priorityDomains.map((d) => d.label).join(', ');
  const firstPriority = priorityDomains[0];
  const resultText = isNoSigns(input.result)
    ? 'fewer developmental signals'
    : 'the level of developmental signals captured';

  const faqs: ReportFAQItem[] = [
    {
      title: `What does ${name}'s screening score of ${input.score}/${input.total} mean?`,
      body: `The total score is ${input.score} out of ${input.total}, which falls in the "${input.result}" range. This is not a diagnosis; it shows ${resultText} and helps start a focused conversation with a professional.`,
    },
    {
      title: `Does this confirm whether ${name} has autism?`,
      body: `No. A screening is not a diagnosis. A qualified developmental pediatrician, child psychologist, or pediatric neurologist should review these results with their own observations.`,
    },
  ];

  if (priorityLabels) {
    const focusText = isNoSigns(input.result)
      ? `the relative focus areas are: ${priorityLabels}. Continue supporting these through everyday play and monitor milestones.`
      : `the priority areas to focus on are: ${priorityLabels}. Start with small, practical activities for ${firstPriority?.label || 'the first area'} and track what you notice.`;
    faqs.push({
      title: `Which developmental areas should I focus on first?`,
      body: `Based on this report, ${focusText}`,
    });

    faqs.push({
      title: `What should I do after receiving this report?`,
      body: `Download the PDF report, book a consultation with a specialist, and try the practical tips above for ${firstPriority?.label || 'priority areas'} at home. Bring the report to the appointment.`,
    });
  } else {
    faqs.push({
      title: `Which developmental areas should I focus on first?`,
      body: `All six areas are doing well in this screening. Keep supporting social play, communication, and routine to maintain these strengths.`,
    });

    faqs.push({
      title: `What should I do after receiving this report?`,
      body: `Save the PDF report, continue the activities that are already working, and discuss any concerns with your pediatrician at the next visit.`,
    });
  }

  faqs.push(
    {
      title: `Which specialist should I consult for ${name}'s needs?`,
      body: `A developmental pediatrician, child psychologist, or pediatric neurologist can do a full evaluation. Your regular pediatrician can provide a referral.`,
    },
    {
      title: `How can I support ${name}'s development at home?`,
      body: `Use everyday routines: model language, keep a visual schedule, give sensory breaks, and practice one new skill at a time. The domain-specific tips above are a good starting point.`,
    },
    {
      title: `When should I repeat the screening?`,
      body: `It is generally recommended to repeat the screening every 3 to 6 months to monitor progress, track changes, or after starting therapy.`,
    },
    {
      title: `How can Saarathi help me track ${name}'s progress?`,
      body: `Saarathi saves every screening, shows domain-level trends, and helps you share clear reports with your care team over time.`,
    }
  );

  return faqs;
}

function buildRepeatFAQs(input: ReportFAQInput, priorityDomains: ReportDomainInput[]): ReportFAQItem[] {
  const name = child(input.childName);
  const prev = input.previousScore?.totalScore ?? 0;
  const current = input.score;
  const diff = current - prev;
  const direction = diff < 0 ? 'improved' : diff > 0 ? 'needs continued attention' : 'stayed the same';
  const trend = diff < 0
    ? `This is an improvement of ${Math.abs(diff)} points, which is encouraging.`
    : diff > 0
    ? `The score is ${diff} points higher than last time. Continue the strategies in the priority areas.`
    : `The score is the same as last time. Keep tracking and working on the priority areas.`;

  const priorityLabels = priorityDomains.map((d) => d.label).join(', ');

  const faqs: ReportFAQItem[] = [
    {
      title: `Is ${name} making progress compared to the last screening?`,
      body: `The previous total score was ${prev} and the current total is ${input.score} out of ${input.total}. ${trend}`,
    },
    {
      title: `Which areas still need the most support?`,
      body: `The priority areas in this screening are: ${priorityLabels || 'none flagged'}. These are the best places to focus energy and support right now.`,
    },
    {
      title: `Why have some scores changed since the previous screening?`,
      body: `Fluctuations are normal. They can be influenced by new environments, developmental transitions, or the effects of ongoing therapy. Use the domain rings to see where the biggest change happened.`,
    },
    {
      title: `How can I help ${name} keep improving at home?`,
      body: `Target the priority areas with daily routines, sensory breaks, and communication practice. Share this report with your therapist to align home and therapy goals.`,
    },
    {
      title: `When should I complete the next screening?`,
      body: `Continue screening every 3 months, or as advised by your therapist, to maintain a clear record of progress.`,
    },
    {
      title: `How can I work with ${name}'s therapist or teacher using these reports?`,
      body: `Use the domain breakdown to align on strategies, ensuring the same techniques are used at home, school, and therapy.`,
    },
    {
      title: `How can Saarathi help me monitor ${name}'s journey over time?`,
      body: `Saarathi stores every screening, visualizes score trends, and helps you share clear progress charts with your care team.`,
    },
  ];

  if (input.previousScore?.date) {
    faqs.push({
      title: `What patterns can I learn from ${name}'s screening history?`,
      body: `Comparing this report to the one from ${input.previousScore.date} shows that the total score moved from ${prev} to ${current}. Review domain rings to see which areas are improving and which are steady.`,
    });
  }

  return faqs;
}

export function getReportFAQs(input: ReportFAQInput): ReportFAQItem[] {
  const name = child(input.childName);
  const domainFaqs = buildDomainFAQs(name, input.domains);
  const priorityDomains = getPriorityDomains(input.domains);

  const generalFaqs = input.isRepeat
    ? buildRepeatFAQs(input, priorityDomains)
    : buildFirstScreeningFAQs(input, priorityDomains);

  const seen = new Set<string>();
  const out: ReportFAQItem[] = [];

  for (const item of [...domainFaqs, ...generalFaqs]) {
    if (seen.has(item.title)) continue;
    seen.add(item.title);
    out.push(item);
    if (out.length >= 10) break;
  }

  // If we somehow have fewer than 10, pad with a safe general set.
  while (out.length < 10) {
    const placeholder = {
      title: `What else can I do to support ${name}?`,
      body: 'Keep observing your child in everyday situations, use the tips above consistently, and share the report with your care team to plan the next steps.',
    };
    if (!seen.has(placeholder.title)) {
      seen.add(placeholder.title);
      out.push(placeholder);
    } else {
      break;
    }
  }

  return out.slice(0, 10);
}
