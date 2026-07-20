import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getToken() {
  return AsyncStorage.getItem('token');
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
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
