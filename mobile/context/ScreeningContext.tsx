import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  startScreening,
  submitScreening,
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
  lastSubmittedAt: number | null;
  loading: boolean;
  error: string | null;
  start: (childId: string) => Promise<string | null>;
  setDomainAnswers: (domain: string, answers: (number | null)[]) => void;
  getDomainAnswers: (domain: string) => (number | null)[];
  submit: () => Promise<ScreeningScore | null>;
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
      setError('No active screening session');
      return null;
    }

    setLoading(true);
    setError(null);

    const responses: ScreeningResponseInput[] = [];
    for (const domain of DOMAIN_KEYS) {
      const answers = domainAnswers[domain] || [];
      answers.forEach((scoreValue, qIndex) => {
        if (scoreValue !== null) {
          responses.push({
            domain,
            questionIndex: qIndex,
            score: scoreValue + 1,
          });
        }
      });
    }

    const result = await submitScreening(sessionId, responses);
    setLoading(false);
    if (result.success) {
      setScore(result.data.score);
      setLastSubmittedAt(Date.now());
      return result.data.score;
    }
    setError(result.error);
    return null;
  }, [sessionId, domainAnswers]);

  const reset = useCallback(() => {
    setSessionId(null);
    setChildId(null);
    setDomainAnswersState({});
    setScore(null);
    setPreviousScore(null);
    setLastSubmittedAt(null);
    setError(null);
    setLoading(false);
  }, []);

  return (
    <ScreeningContext.Provider
      value={{
        sessionId,
        childId,
        domainAnswers,
        score,
        previousScore,
        lastSubmittedAt,
        loading,
        error,
        start,
        setDomainAnswers,
        getDomainAnswers,
        submit,
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
