export interface User {
  id: string;
  userid: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

export const mockUsers: User[] = [
  {
    id: '1',
    userid: 'T0000000001',
    name: 'อาจารย์สมชาย',
    email: 'ajarn.somchai@monkup.com',
    password: 'teacher123',
    role: 'teacher'
  },
  {
    id: '2',
    userid: '67700000001',
    name: 'สมหญิง เรียนดี',
    email: 'somying@student.monkup.com',
    password: 'student123',
    role: 'student'
  }
]; 