import { Alert } from 'react-native';

export type ScreeningReportData = {
  childName: string;
  score: number;
  total: number;
  result: string;
  date?: string;
  screener?: string;
  domainBreakdown: any[];
  domainAnswers: Record<string, (number | null)[]>;
};

const DOMAIN_QUESTIONS: Record<string, string[]> = {
  Social: [
    "How often does the child avoid looking at people's faces while talking or playing?",
    "How often does the child not smile back when someone smiles at them?",
    "How often does the child prefer to stay alone instead of joining family members or other children?",
    "How often does the child not seek help, comfort, or share excitement with a familiar person?",
    "How often does the child seem unaware of people around them?",
    "How often does the child not notice or join what other people are doing?",
    "How often does the child play alone in the same way again and again?",
    "How often does the child have difficulty waiting for their turn during play or conversation?",
    "How often does the child avoid playing or interacting with other children of a similar age?",
  ],
  Emotion: [
    "How often does the child react in a way that does not match the situation?",
    "How often does the child react much more strongly than the situation requires?",
    "How often does the child suddenly laugh, cry, or become excited without an obvious reason?",
    "How often does the child do dangerous things without seeming to understand the risk?",
    "How often does the child suddenly become very excited or upset without an obvious reason?",
  ],
  Speech: [
    "How often does the child stop using words or sentences they could previously say?",
    "How often does the child find it difficult to use gestures like pointing, waving, or nodding to communicate?",
    "How often does the child repeat the same words or phrases again and again?",
    "How often does the child repeat words or questions exactly as they hear them?",
    "How often does the child make unusual sounds instead of using words?",
    "How often does the child have difficulty starting or continuing a conversation?",
    "How often does the child use words that do not have a clear meaning to others?",
    "How often does the child refer to themselves using the wrong words, such as saying \"you\" instead of \"I\"?",
    "How often does the child have difficulty understanding the real meaning behind what others say.",
  ],
  Behavior: [
    "How often does the child repeatedly flap their hands, rock their body, spin, or make the same movements again and again?",
    "How often does the child become unusually attached to a particular object?",
    "How often does the child seem unable to sit still or stay calm?",
    "How often does the child hit, kick, bite, push, or hurt others?",
    "How often does the child have intense tantrums that are difficult to calm?",
    "How often does the child hurt themselves on purpose?",
    "How often does the child become upset when daily routines or familiar things change?",
  ],
  Sensory: [
    "How often does the child react strongly to everyday sounds, lights, smells, touch, or certain clothes?",
    "How often does the child stare into space for a long time without responding?",
    "How often does the child have difficulty following a moving object with their eyes?",
    "How often does the child look at objects in unusual ways?",
    "How often does the child seem to feel little or no pain after getting hurt?",
    "How often does the child smell, touch, or taste people or objects in unusual ways?",
  ],
  Cognitive: [
    "How often does the child have difficulty staying focused on an activity?",
    "How often does the child take much longer than expected to respond when spoken to?",
    "How often does the child remember unusual details much better than expected?",
    "How often does the child show an exceptional skill that is much stronger than expected for their age?",
  ],
};

const DOMAIN_LABELS: Record<string, string> = {
  Social: 'Social Relationships',
  Emotion: 'Emotional Responses',
  Speech: 'Speech & Communication',
  Behavior: 'Behaviour Patterns',
  Sensory: 'Sensory Responses',
  Cognitive: 'Cognitive Skills (Attention & Memory)',
};

const DOMAIN_ORDER = ['Social', 'Emotion', 'Speech', 'Behavior', 'Sensory', 'Cognitive'];

type StatusConfig = {
  label: string;
  text: string;
  bg: string;
  border: string;
  recommendation: string;
  activities: string[];
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  excellent: {
    label: 'Excellent',
    text: '#1A7340',
    bg: '#E6F4EA',
    border: '#34A853',
    recommendation: 'Strong skills in this area. Continue everyday play and practice.',
    activities: ['Keep the same daily routines', 'Praise positive interactions', 'Build on strengths with fun games'],
  },
  good: {
    label: 'Good',
    text: '#1A7340',
    bg: '#E6F4EA',
    border: '#34A853',
    recommendation: 'On track. Reinforce these skills through regular routines.',
    activities: ['Practice during playtime', 'Encourage communication', 'Celebrate small wins'],
  },
  average: {
    label: 'Average',
    text: '#B07D00',
    bg: '#FFF8E1',
    border: '#FBBC04',
    recommendation: 'Some variation is normal. Watch, encourage, and re-check over time.',
    activities: ['Add gentle practice', 'Use positive reinforcement', 'Track progress weekly'],
  },
  'needs attention': {
    label: 'Needs Attention',
    text: '#C65D00',
    bg: '#FFF3E0',
    border: '#FF9900',
    recommendation: 'Targeted practice and professional screening guidance are recommended.',
    activities: ['Practice short, focused sessions', 'Use visual supports', 'Speak with a therapist if concerns continue'],
  },
  'high priority': {
    label: 'High Priority',
    text: '#B71C1C',
    bg: '#FFEBEE',
    border: '#EA4335',
    recommendation: 'Please consult a developmental specialist for an in-depth evaluation.',
    activities: ['Seek professional evaluation', 'Start early intervention if advised', 'Create a calm, structured environment'],
  },
};

const DOMAIN_ACTIVITIES: Record<string, string[]> = {
  Social: ['Play turn-taking games', 'Practice eye contact and greeting', 'Use emotion picture cards'],
  Emotion: ['Name feelings during daily routines', 'Use calm-down techniques', 'Read stories about emotions'],
  Speech: ['Read aloud together daily', 'Expand on what the child says', 'Use short, clear instructions'],
  Behavior: ['Keep consistent routines', 'Use visual schedules', 'Offer simple choices'],
  Sensory: ['Provide quiet sensory breaks', 'Introduce textures gradually', 'Use movement activities'],
  Cognitive: ['Sort objects by color and shape', 'Play memory games', 'Break tasks into small steps'],
};

type CategoryConfig = {
  label: string;
  color: string;
  lightBg: string;
  explanation: string;
  recommendation: string;
};

function normalizeStatus(status?: string): string {
  if (!status) return 'average';
  const s = status.toLowerCase().trim();
  if (s.includes('excellent') || s.includes('great')) return 'excellent';
  if (s.includes('good') || s.includes('well')) return 'good';
  if (s.includes('average') || s.includes('ok') || s.includes('fair')) return 'average';
  if (s.includes('high') || s.includes('critical') || s.includes('severe')) return 'high priority';
  if (s.includes('attention') || s.includes('support') || s.includes('needs')) return 'needs attention';
  return 'average';
}

function deriveStatus(score: number, maxScore: number): string {
  const ratio = score / (maxScore || 1);
  if (ratio <= 0.25) return 'good';
  if (ratio <= 0.5) return 'average';
  if (ratio <= 0.75) return 'needs attention';
  return 'high priority';
}

function getOverallCategory(score: number): CategoryConfig {
  if (score <= 40) {
    return {
      label: 'No Signs of Autism',
      color: '#1A7340',
      lightBg: '#E6F4EA',
      explanation: 'The total score is low. No significant developmental signals were observed in this screening.',
      recommendation: 'Continue regular developmental activities and routine monitoring.',
    };
  }
  if (score <= 80) {
    return {
      label: 'Mild Signs',
      color: '#1E8E3E',
      lightBg: '#E6F4EA',
      explanation: 'A few early signals were noticed. These are not a diagnosis, but are worth watching.',
      recommendation: 'Monitor progress and consider a follow-up screening in a few weeks.',
    };
  }
  if (score <= 140) {
    return {
      label: 'Moderate Signs',
      color: '#B07D00',
      lightBg: '#FFF8E1',
      explanation: 'Several developmental signals were noted. A professional assessment is advisable.',
      recommendation: 'Speak with a developmental pediatrician or child psychiatrist for guidance.',
    };
  }
  return {
    label: 'High Signs',
    color: '#B71C1C',
    lightBg: '#FFEBEE',
    explanation: 'A high number of signals were reported. Professional evaluation is strongly recommended.',
    recommendation: 'Please consult a developmental specialist as soon as possible.',
  };
}

function statusBadge(status?: string): string {
  const key = normalizeStatus(status);
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.average;
  return `<span style="display:inline-block;padding:4px 10px;border-radius:12px;background:${cfg.bg};color:${cfg.text};border:1px solid ${cfg.border};font-size:11px;font-weight:600;">${escapeHtml(cfg.label)}</span>`;
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getScreenerRole(screener?: string): string {
  if (!screener) return 'caregiver';
  const match = screener.match(/\(([^)]+)\)/);
  return match ? match[1] : screener;
}

function buildReportHtml(data: ScreeningReportData): string {
  const { childName, score, total, date, screener, domainBreakdown, domainAnswers } = data;
  const category = getOverallCategory(score);
  const percent = Math.min(100, Math.round((score / (total || 1)) * 100));

  const focusDomains: string[] = [];
  const strengthDomains: string[] = [];

  const overviewRows = DOMAIN_ORDER.map((key) => {
    const bd = domainBreakdown?.find((b: any) => b.key === key);
    const label = DOMAIN_LABELS[key];
    const scoreStr = bd ? `${bd.score} / ${bd.maxScore}` : '-';
    const status = bd?.status ? normalizeStatus(bd.status) : deriveStatus(bd?.score || 0, bd?.maxScore || 1);
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.average;
    if (status === 'needs attention' || status === 'high priority') focusDomains.push(label);
    if (status === 'excellent' || status === 'good') strengthDomains.push(label);
    return `<tr>
      <td style="padding:8px 10px;border:1px solid #E2E4E8;">${escapeHtml(label)}</td>
      <td style="padding:8px 10px;border:1px solid #E2E4E8;text-align:center;font-weight:600;">${escapeHtml(scoreStr)}</td>
      <td style="padding:8px 10px;border:1px solid #E2E4E8;">${statusBadge(status)}</td>
    </tr>`;
  }).join('');

  const focusText = focusDomains.length ? focusDomains.join(' and ') : 'some domains';
  const strengthText = strengthDomains.length ? strengthDomains.join(' and ') : 'some domains';
  const resultExplanation = `${escapeHtml(childName)} shows strengths in ${escapeHtml(strengthText)}. ${focusDomains.length ? `More support may be helpful in ${escapeHtml(focusText)}.` : 'All domains are currently within a comfortable range.'}`;

  let domainDetails = '';
  DOMAIN_ORDER.forEach((key, index) => {
    const bd = domainBreakdown?.find((b: any) => b.key === key);
    const label = DOMAIN_LABELS[key];
    const scoreStr = bd ? `${bd.score} / ${bd.maxScore}` : '-';
    const status = bd?.status ? normalizeStatus(bd.status) : deriveStatus(bd?.score || 0, bd?.maxScore || 1);
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.average;
    const questions = DOMAIN_QUESTIONS[key] || [];
    const answers = domainAnswers[key] || [];

    const working: string[] = [];
    const attention: string[] = [];
    const missing: string[] = [];

    questions.forEach((q, i) => {
      const a = answers[i];
      if (a === null || a === undefined) {
        missing.push(q);
      } else if (a >= 2) {
        attention.push(q);
      } else {
        working.push(q);
      }
    });

    const workingItems = working.length
      ? working.map((q, i) => `<li style="margin:4px 0;"><span style="color:#1A7340;margin-right:6px;">&#10003;</span>${i + 1}. ${escapeHtml(q)}</li>`).join('')
      : '<li style="margin:4px 0;color:#6B7180;">No items in this category.</li>';
    const attentionItems = attention.length
      ? attention.map((q, i) => `<li style="margin:4px 0;"><span style="color:#B71C1C;margin-right:6px;">&#8226;</span>${i + 1}. ${escapeHtml(q)}</li>`).join('')
      : '<li style="margin:4px 0;color:#6B7180;">None at this time.</li>';

    let missingNote = '';
    if (missing.length) {
      missingNote = `<p style="margin:8px 0;font-size:12px;color:#6B7180;">* Note: ${getScreenerRole(screener)} did not provide an answer for the following question${missing.length > 1 ? 's' : ''} — ${missing.map(escapeHtml).join('; ')}</p>`;
    }

    const activities = (DOMAIN_ACTIVITIES[key] || []).map((a, i) => `<li style="margin:4px 0;"><span style="color:${cfg.text};margin-right:6px;">&#8226;</span>${i + 1}. ${escapeHtml(a)}</li>`).join('');
    const pageBreak = index < DOMAIN_ORDER.length - 1 ? '<div style="page-break-after:always;"></div>' : '';

    domainDetails += `
      <div style="margin-top:24px;padding:16px;border:1px solid #E2E4E8;border-radius:12px;background:#FAFAFA;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="font-size:16px;color:#2D2A3A;margin:0;">${escapeHtml(label)}</h3>
          <div>${statusBadge(status)}</div>
        </div>
        <p style="margin:4px 0 12px;font-size:14px;"><strong>Score:</strong> ${escapeHtml(scoreStr)}</p>

        <h4 style="font-size:14px;color:#1A7340;margin:12px 0 4px;">Strengths</h4>
        <ul style="padding-left:20px;font-size:12px;margin:0;">${workingItems}</ul>

        <h4 style="font-size:14px;color:#B71C1C;margin:12px 0 4px;">Areas Needing Attention</h4>
        <ul style="padding-left:20px;font-size:12px;margin:0;">${attentionItems}</ul>

        <h4 style="font-size:14px;color:${cfg.text};margin:12px 0 4px;">Recommendations</h4>
        <p style="font-size:12px;margin:0;padding-left:12px;border-left:3px solid ${cfg.border};">${escapeHtml(cfg.recommendation)}</p>

        <h4 style="font-size:14px;color:#535BD8;margin:12px 0 4px;">Suggested Activities</h4>
        <ul style="padding-left:20px;font-size:12px;margin:0;">${activities}</ul>
        ${missingNote}
      </div>
      ${pageBreak}
    `;
  });

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D2A3A; margin: 32px; }
          h1 { font-size: 22px; color: #2D2A3A; margin-bottom: 4px; }
          h2 { font-size: 16px; color: #535BD8; margin-top: 24px; margin-bottom: 12px; }
          p, li, td, th { font-size: 12px; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th { background: #F3F2FF; color: #535BD8; text-align: left; padding: 8px 10px; border: 1px solid #E2E4E8; }
          .page-break { page-break-after: always; height: 1px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(childName)}'s Autism Screening Report</h1>
        <p style="color:#6B7180;">Based on ISAA (Indian Scale for Assessment of Autism)</p>
        <p style="margin-top:16px;"><strong>Date:</strong> ${escapeHtml(date || '')} &nbsp;|&nbsp; <strong>Screener:</strong> ${escapeHtml(screener || '')}</p>

        <h2>Overall Screening Score</h2>
        <p style="font-size:14px;margin:8px 0;"><strong>${score} / ${total}</strong></p>
        <div style="width:100%;height:16px;background:#E2E4E8;border-radius:8px;overflow:hidden;margin:8px 0;">
          <div style="width:${percent}%;height:100%;background:${category.color};"></div>
        </div>

        <h2>Overall Result Category</h2>
        <div style="padding:12px 16px;background:${category.lightBg};border-left:4px solid ${category.color};border-radius:8px;margin:12px 0;">
          <p style="margin:0;font-size:16px;color:${category.color};font-weight:700;">${escapeHtml(category.label)}</p>
          <p style="margin:6px 0 0;font-size:12px;color:#2D2A3A;">${escapeHtml(category.explanation)}</p>
        </div>

        <h2>Domain Summary</h2>
        <table>
          <thead>
            <tr><th style="width:50%;">Domain</th><th style="text-align:center;">Score</th><th>Status</th></tr>
          </thead>
          <tbody>${overviewRows}</tbody>
        </table>

        <h2>Result Explanation</h2>
        <p style="font-size:12px;margin:8px 0;">${resultExplanation}</p>
        ${focusDomains.length ? `<p style="font-size:12px;margin:4px 0;"><strong>Focus Areas:</strong> ${escapeHtml(focusDomains.join(' • '))}</p>` : ''}
        ${strengthDomains.length ? `<p style="font-size:12px;margin:4px 0;"><strong>Strengths:</strong> ${escapeHtml(strengthDomains.join(' • '))}</p>` : ''}

        <h2>Medical Disclaimer</h2>
        <p style="font-size:12px;">This screening is not a diagnosis. It helps identify developmental signals and guide next steps. Please consult a child psychiatrist or developmental specialist to confirm.</p>

        <div style="page-break-after:always;"></div>

        <h2>Development by Domain</h2>
        <p style="font-size:12px;color:#6B7180;">Each section shows what is working well, where more support may be needed, and recommended activities.</p>
        ${domainDetails}

        <h2>Overall Recommendations</h2>
        <p style="font-size:12px;padding:12px;border-left:4px solid ${category.color};background:${category.lightBg};border-radius:0 8px 8px 0;">${escapeHtml(category.recommendation)}</p>

        <p style="margin-top:32px;font-size:11px;color:#6B7180;">
          This report has been prepared based on the scores given by ${escapeHtml(getScreenerRole(screener))} (from the ${total} ISAA questions).
          The "Strengths" section lists items where the score is below 2, and the "Areas Needing Attention" section lists items where the score is 3 or higher.
        </p>
      </body>
    </html>
  `;
}

export async function generateScreeningReportPDF(data: ScreeningReportData) {
  let Print: any;
  let Sharing: any;
  try {
    // @ts-ignore
    Print = require('expo-print');
    // @ts-ignore
    Sharing = require('expo-sharing');
  } catch {
    Alert.alert('PDF feature unavailable', 'Please run npm install so that expo-print and expo-sharing are available.');
    return;
  }

  if (!Print || !Print.printToFileAsync) {
    Alert.alert('PDF feature unavailable', 'expo-print module is not loaded.');
    return;
  }

  try {
    const { uri } = await Print.printToFileAsync({
      html: buildReportHtml(data),
    });

    if (Sharing && Sharing.isAvailableAsync) {
      const available = await Sharing.isAvailableAsync();
      if (available && Sharing.shareAsync) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `${data.childName} Screening Report` });
        return;
      }
    }

    Alert.alert('Report saved', `PDF saved to ${uri}`);
  } catch (err: any) {
    Alert.alert('PDF generation failed', err?.message || 'Unknown error');
  }
}
