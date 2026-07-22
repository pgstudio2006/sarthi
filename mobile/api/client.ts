import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getToken() {
  return AsyncStorage.getItem('token');
}

const MOCK_API = __DEV__ && process.env.EXPO_PUBLIC_MOCK_API === 'true';

function getDevMock<T>(path: string, options?: RequestInit): ApiResponse<T> | undefined {
  if (!MOCK_API) return undefined;
  const method = (options?.method || 'GET').toUpperCase();
  const basePath = path.split('?')[0];
  const bodyRaw = typeof options?.body === 'string' ? options.body : '{}';
  const body = JSON.parse(bodyRaw || '{}');
  const now = new Date().toISOString();

  const makeSession = (id: string, childId: string, status: string, responses: any[] = []): any => ({
    id,
    userId: 'dev-user-1',
    childId,
    status,
    startedAt: now,
    completedAt: status === 'completed' ? now : null,
    totalScore: 0,
    result: status === 'completed' ? 'Normal' : null,
    previousSessionId: null,
    responses,
  });

  const makeScore = (totalScore = 0): any => ({
    totalScore,
    maxScore: 200,
    result: 'Normal',
    disabilityPercentage: 0,
    domainBreakdown: [],
  });

  const devUser = {
    id: 'dev-user-1',
    phone: body.phone || '+910000000000',
    createdAt: now,
    updatedAt: now,
    caregiverProfile: null,
    children: [],
  };

  const key = `${method} ${basePath}`;

  if (key === 'GET /users/me') {
    return { success: true, data: { user: devUser } as T };
  }
  if (key === 'POST /auth/otp/request') {
    return { success: true, data: { message: 'OK', devOtp: '123456' } as T };
  }
  if (key === 'POST /auth/otp/verify') {
    return { success: true, data: { token: 'dev-token', user: devUser } as T };
  }
  if (key === 'POST /profile/caregiver') {
    return { success: true, data: { profile: { id: 'dev-caregiver-1', userId: 'dev-user-1', ...body } } as T };
  }
  if (key === 'POST /profile/child') {
    return { success: true, data: { child: { id: 'dev-child-1', userId: 'dev-user-1', ...body } } as T };
  }
  if (key === 'GET /profile/children') {
    return { success: true, data: { children: [] } as T };
  }
  if (key === 'POST /screening/start') {
    return { success: true, data: { session: makeSession('dev-session', body.childId, 'in_progress') } as T };
  }
  if (key === 'GET /screening/history') {
    return { success: true, data: { sessions: [] } as T };
  }
  if (key === 'GET /screening/latest') {
    return { success: true, data: { session: makeSession('dev-latest', body.childId || '', 'completed'), score: makeScore() } as T };
  }
  if (key === 'POST /ai/faqs') {
    return { success: true, data: { mode: 'normal', progress: 0, completedDomains: [], faqs: [] } as T };
  }
  if (key === 'GET /locations/search') {
    return { success: true, data: { locations: [] } as T };
  }
  if (basePath.startsWith('/profile/child/') && method === 'PATCH') {
    const childId = basePath.split('/')[3];
    return { success: true, data: { child: { id: childId, userId: 'dev-user-1', ...body } } as T };
  }
  if (basePath.startsWith('/screening/') && basePath.endsWith('/submit')) {
    const sessionId = basePath.split('/')[2];
    const responses = body.responses || [];
    const mappedResponses = responses.map((r: any, i: number) => ({
      id: `${i}`,
      sessionId,
      domain: r.domain,
      questionIndex: r.questionIndex,
      score: r.score,
    }));
    const totalScore = responses.reduce((sum: number, r: any) => sum + (r.score || 0), 0);
    return { success: true, data: { session: makeSession(sessionId, '', 'completed', mappedResponses), score: makeScore(totalScore) } as T };
  }
  const screenParts = basePath.split('/');
  if (basePath.startsWith('/screening/') && screenParts.length === 3) {
    const sessionId = screenParts[2];
    return { success: true, data: { session: makeSession(sessionId, '', 'completed'), score: makeScore() } as T };
  }
  return undefined;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  if (MOCK_API) {
    const mock = getDevMock<T>(path, options);
    if (mock) return mock;
  }
  try {
    const token = await getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { ...headers, ...options?.headers },
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: json?.error || `Request failed with status ${response.status}`,
      };
    }

    return { success: true, data: json as T };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export type RequestOtpResponse = { success: true; message: string; devOtp?: string };
export type VerifyOtpResponse = {
  token: string;
  user: User;
};

export async function requestOtp(phone: string): Promise<ApiResponse<RequestOtpResponse>> {
  return request('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<ApiResponse<VerifyOtpResponse>> {
  return request('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
}

export type User = {
  id: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  caregiverProfile: CaregiverProfile | null;
  children: ChildProfile[];
};

export type CaregiverProfile = {
  id: string;
  userId: string;
  name: string;
  role: string;
  email?: string;
  location?: string;
  relation?: string;
  speciality?: string;
  institution?: string;
};

export type ChildProfile = {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  birthContext: string;
  ageInMonths?: number;
};

export async function getMe(): Promise<ApiResponse<{ user: User }>> {
  return request('/users/me', { method: 'GET' });
}

export type CreateCaregiverProfileInput = {
  name: string;
  role: string;
  email?: string;
  location?: string;
  relation?: string;
  speciality?: string;
  institution?: string;
};

export type LocationSuggestion = {
  label: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
};

export async function searchLocations(query: string): Promise<ApiResponse<{ locations: LocationSuggestion[] }>> {
  return request(`/locations/search?q=${encodeURIComponent(query)}`, { method: 'GET' });
}

export async function createCaregiverProfile(
  input: CreateCaregiverProfileInput
): Promise<ApiResponse<{ profile: CaregiverProfile }>> {
  return request('/profile/caregiver', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export type CreateChildProfileInput = {
  name: string;
  dateOfBirth: string;
  gender: string;
  birthContext: string;
  ageInMonths?: number;
};

export async function createChildProfile(
  input: CreateChildProfileInput
): Promise<ApiResponse<{ child: ChildProfile }>> {
  return request('/profile/child', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getChildren(): Promise<ApiResponse<{ children: ChildProfile[] }>> {
  return request('/profile/children', { method: 'GET' });
}

export type UpdateChildProfileInput = {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  birthContext?: string;
  ageInMonths?: number;
};

export async function updateChildProfile(
  childId: string,
  input: UpdateChildProfileInput
): Promise<ApiResponse<{ child: ChildProfile }>> {
  return request(`/profile/child/${childId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export type ScreeningResponseInput = {
  domain: string;
  questionIndex: number;
  score: number;
};

export type DomainBreakdown = {
  key: string;
  score: number;
  maxScore: number;
  progress: number;
  status: string;
  statusColor: string;
  statusBg: string;
};

export type ScreeningScore = {
  totalScore: number;
  maxScore: number;
  result: string;
  disabilityPercentage: number;
  domainBreakdown: DomainBreakdown[];
};

export type ScreeningSession = {
  id: string;
  userId: string;
  childId: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  totalScore: number | null;
  result: string | null;
  previousSessionId: string | null;
  responses: ScreeningResponseRow[];
  child?: ChildProfile;
};

export type ScreeningResponseRow = {
  id: string;
  sessionId: string;
  domain: string;
  questionIndex: number;
  score: number;
};

export async function startScreening(
  childId: string
): Promise<ApiResponse<{ session: ScreeningSession }>> {
  return request('/screening/start', {
    method: 'POST',
    body: JSON.stringify({ childId }),
  });
}

export async function submitScreening(
  sessionId: string,
  responses: ScreeningResponseInput[]
): Promise<ApiResponse<{ session: ScreeningSession; score: ScreeningScore }>> {
  return request(`/screening/${sessionId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ responses }),
  });
}

export async function getLatestScreening(
  childId: string
): Promise<ApiResponse<{ session: ScreeningSession; score: ScreeningScore }>> {
  return request(`/screening/latest?childId=${encodeURIComponent(childId)}`, {
    method: 'GET',
  });
}

export type AiFaq = { title: string; body: string };

export async function getAiFaqs(
  childId: string
): Promise<ApiResponse<{ mode: string; progress: number; completedDomains: string[]; faqs: AiFaq[] }>> {
  return request('/ai/faqs', {
    method: 'POST',
    body: JSON.stringify({ childId }),
  });
}

export async function getScreeningHistory(
  childId: string
): Promise<ApiResponse<{ sessions: ScreeningSession[] }>> {
  return request(`/screening/history?childId=${encodeURIComponent(childId)}`, {
    method: 'GET',
  });
}

export async function getScreeningById(
  sessionId: string
): Promise<ApiResponse<{ session: ScreeningSession; score: ScreeningScore | null }>> {
  return request(`/screening/${sessionId}`, { method: 'GET' });
}
