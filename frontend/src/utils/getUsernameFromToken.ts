import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  email: string;
  username: string;
  sub: number;
  iat: number;
  exp: number;
}

export function getUsernameFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = jwtDecode<TokenPayload>(token);
    return payload.username;
  } catch (e) {
    return null;
  }
}
