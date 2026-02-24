'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { UserRole, loginUser } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) {
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password, role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userName', data.user.name);

      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Login
        </Typography>

        {!role ? (
          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            <Card variant="outlined">
              <CardActionArea onClick={() => setRole('ADMIN')}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>
                    Admin
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Login to access admin dashboard.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>

            <Card variant="outlined">
              <CardActionArea onClick={() => setRole('STUDENT')}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>
                    Student
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Login as student or create a new account.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected portal: <strong>{role}</strong>
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              <TextField
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <TextField
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Logging in...' : `Login as ${role}`}
              </Button>

              <Button
                type="button"
                variant="text"
                onClick={() => {
                  setRole(null);
                  setError('');
                  setEmail('');
                  setPassword('');
                }}
              >
                Change Role
              </Button>
            </Box>

            {role === 'STUDENT' ? (
              <Box mt={2}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link href="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Register
                  </Link>
                </Typography>
              </Box>
            ) : null}
          </>
        )}
      </Paper>
    </Container>
  );
}
