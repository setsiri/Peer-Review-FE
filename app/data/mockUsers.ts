export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'อาจารย์สมชาย',
    email: 'ajarn.somchai@monkup.com',
    password: 'teacher123',
    role: 'teacher'
  },
  {
    id: '2',
    name: 'สมหญิง',
    email: 'somying@student.monkup.com',
    password: 'student123',
    role: 'student'
  }
]; 