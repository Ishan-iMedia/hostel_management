const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type UserRole = 'ADMIN' | 'STUDENT';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null;
  role: UserRole;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const registerStudent = async (payload: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

export const loginUser = async (payload: {
  email: string;
  password: string;
  role: UserRole;
}) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data: LoginResponse | { message?: string } = await res.json();
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || 'Login failed');
  }

  return data as LoginResponse;
};

export const fetchDashboard = async (role: UserRole, token: string) => {
  const path = role === 'ADMIN' ? '/api/admin/dashboard' : '/api/student/dashboard';
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch dashboard');
  }

  return data;
};
