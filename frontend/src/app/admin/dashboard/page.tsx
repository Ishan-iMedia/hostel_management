'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchDashboard } from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Loading...');
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUserName(localStorage.getItem('userName') || 'Admin');

    if (!token) {
      router.replace('/login');
      return;
    }

    if (role !== 'ADMIN') {
      router.replace('/student/dashboard');
      return;
    }

    fetchDashboard('ADMIN', token)
      .then((data) => setMessage(data.message || 'Welcome Admin'))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        router.replace('/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  return (
    <main>
      <div className="card dashboard">
        <h1>Admin Dashboard</h1>
        <p>{message}</p>
        <p>Welcome, {userName}.</p>
        <button className="secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </main>
  );
}
