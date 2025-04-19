'use client';

import { useUser } from '../../contexts/UserContext';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TeacherAssignmentPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'teacher') {
      router.push('/dashboard/studentassignment');
    }
  }, [user, router]);

  if (!user || user.role !== 'teacher') {
    return null;
  }

  return <TeacherDashboard />;
} 