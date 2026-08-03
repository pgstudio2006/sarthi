import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import {
  startScreening,
  submitScreening,
  saveProgress as saveProgressApi,
  getLatestScreening,
  ScreeningResponseInput,
  ScreeningScore,
  ScreeningSession,
} from '../api/client';

type DomainAnswers = Record<string, (number | null)[]>;

type ScreeningContextType = {
  sessionId: string | null;
  childId: string | null;
  domainAnswers: DomainAnswers;
  score: ScreeningScore | null;
  previousScore: ScreeningScore | null;
  lastCompletedSession: any;
  lastSubmittedAt: number | null;
  loading: boolean;
  error: string | null;
  getDomainAnswers: (domain: string) => (number | null)[];
  setDomainAnswers: (domain: string, answers: (number | null)[]) => void;
  start: (childId: string) => Promise<string | null>;
  submit: () => Promise<ScreeningScore | null>;
  saveProgress: () => Promise<void>;
  resumeSession: (session: any) => void;
  reset: () => void;
};

const ScreeningContext = createContext<ScreeningContextType | null>(null);

const DOMAIN_KEYS = ['Social', 'Emotion', 'Speech', 'Behavior', 'Sensory', 'Cognitive'];

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [domainAnswers, setDomainAnswersState] = useState<DomainAnswers>({});
  const [score, setScore] = useState<ScreeningScore | null>(null);
  const [previousScore, setPreviousScore] = useState<ScreeningScore | null>(null);
  const [lastCompletedSession, setLastCompletedSession] = useState<any>(null);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (cid: string) => {
    setLoading(true);
    setError(null);
    setDomainAnswersState({});
    setScore(null);
    setPreviousScore(null);
    setChildId(cid);

    try {
      const result = await startScreening(cid);
      if (result.success) {
        setSessionId(result.data.session.id);
        if (result.data.session.previousSessionId) {
          const prev = await getLatestScreening(cid);
          if (prev.success) {
            const scoreWithDate = {
              ...prev.data.score,
              date: prev.data.session.completedAt
                ? new Date(prev.data.session.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : ''
            };
            setPreviousScore(scoreWithDate);
          }
        }
        setLoading(false);
        return result.data.session.id;
      } else {
        setError(result.error || 'Failed to start screening');
        setLoading(false);
        return null;
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to start screening');
      setLoading(false);
      return null;
    }
  }, []);

  const setDomainAnswers = useCallback((domain: string, answers: (number | null)[]) => {
    setDomainAnswersState((prev) => ({ ...prev, [domain]: answers }));
  }, []);

  const getDomainAnswers = useCallback(
    (domain: string) => domainAnswers[domain] || [],
    [domainAnswers]
  );

  const submit = useCallback(async () => {
    if (!sessionId) {
      const message = 'No active screening session';
      setError(message);
      throw new Error(message);
    }

    setLoading(true);
    setError(null);

    try {
      const responses: ScreeningResponseInput[] = [];
      for (const domain of DOMAIN_KEYS) {
        const answers = domainAnswers[domain] || [];
        answers.forEach((scoreValue, qIndex) => {
          if (scoreValue !== null && scoreValue !== undefined) {
            const score = Number(scoreValue) + 1;
            if (!Number.isFinite(score) || score < 1 || score > 5) {
              throw new Error(`Invalid answer for ${domain} question ${qIndex + 1}`);
            }
            responses.push({
              domain,
              questionIndex: qIndex,
              score,
            });
          }
        });
      }

      const result = await submitScreening(sessionId, responses);
      if (!result.success) {
        const message = result.error || 'Failed to generate report';
        setError(message);
        throw new Error(message);
      }
      if (!result.data?.score) {
        const message = 'Report score missing from server response';
        setError(message);
        throw new Error(message);
      }

      setScore(result.data.score);
      const completedSession = {
        ...result.data.session,
        childId: result.data.session?.childId || childId,
        totalScore: result.data.score?.totalScore,
        score: result.data.score?.totalScore,
        total: result.data.score?.maxScore,
        result: result.data.score?.result,
        domainBreakdown: result.data.score?.domainBreakdown,
      };
      setLastCompletedSession(completedSession);
      setLastSubmittedAt(Date.now());
      setLoading(false);
      return result.data.score;
    } catch (err: any) {
      setLoading(false);
      const message = err?.message || 'Failed to generate report';
      setError(message);
      throw new Error(message);
    }
  }, [sessionId, domainAnswers, childId]);

  const saveProgress = useCallback(async () => {
    if (!sessionId) return;
    const responses: ScreeningResponseInput[] = [];
    for (const domain of DOMAIN_KEYS) {
      const answers = domainAnswers[domain] || [];
      answers.forEach((scoreValue, qIndex) => {
        if (scoreValue !== null && scoreValue !== undefined) {
          const score = Number(scoreValue) + 1;
          if (Number.isFinite(score) && score >= 1 && score <= 5) {
            responses.push({ domain, questionIndex: qIndex, score });
          }
        }
      });
    }
    const result = await saveProgressApi(sessionId, responses);
    if (!result.success) {
      console.warn('[ScreeningContext] saveProgress failed:', result.error);
    }
  }, [sessionId, domainAnswers]);

  const resumeSession = useCallback((session: any) => {
    if (!session?.id) return;
    setSessionId(session.id);
    setChildId(session.childId || null);
    setScore(null);
    setPreviousScore(null);
    setLastCompletedSession(null);
    setLastSubmittedAt(null);
    setError(null);
    setLoading(false);

    const restored: DomainAnswers = {};
    (session.responses || []).forEach((r: any) => {
      if (r.domain && typeof r.questionIndex === 'number' && typeof r.score === 'number') {
        if (!restored[r.domain]) restored[r.domain] = [];
        const answer = r.score - 1;
        if (answer >= 0 && answer <= 4) {
          restored[r.domain][r.questionIndex] = answer;
        }
      }
    });
    setDomainAnswersState(restored);
  }, []);

  const reset = useCallback(() => {
    setSessionId(null);
    setChildId(null);
    setDomainAnswersState({});
    setScore(null);
    setPreviousScore(null);
    setLastCompletedSession(null);
    setLastSubmittedAt(null);
    setError(null);
    setLoading(false);
  }, []);

  // Auto-save progress when answers change, and immediately when the app goes to background
  useEffect(() => {
    if (!sessionId || Object.keys(domainAnswers).length === 0) return;
    const timeout = setTimeout(() => {
      saveProgress();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [domainAnswers, sessionId, saveProgress]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        saveProgress();
      }
    });
    return () => subscription.remove();
  }, [saveProgress]);

  return (
    <ScreeningContext.Provider
      value={{
        sessionId,
        childId,
        domainAnswers,
        score,
        previousScore,
        lastCompletedSession,
        lastSubmittedAt,
        loading,
        error,
        start,
        setDomainAnswers,
        getDomainAnswers,
        submit,
        saveProgress,
        resumeSession,
        reset,
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const context = useContext(ScreeningContext);
  if (!context) {
    throw new Error('useScreening must be used within a ScreeningProvider');
  }
  return context;
}
