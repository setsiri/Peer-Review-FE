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
    name: 'อ.สมชาย ดวงดี',
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
  },
  {
    id: '3',
    userid: '67700000002',
    name: 'สมชาย เก่งมาก',
    email: 'somchai@student.monkup.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: '4',
    userid: '67700000003',
    name: 'สมใจ ตั้งใจเรียน',
    email: 'somjai@student.monkup.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: '5',
    userid: '67700000004',
    name: 'สมหมาย เรียนเก่ง',
    email: 'sommai@student.monkup.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: '6',
    userid: '67700000005',
    name: 'สมศรี ตั้งใจ',
    email: 'somsri@student.monkup.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: '7',
    userid: '67700000006',
    name: 'สมปอง เรียนดี',
    email: 'sompong@student.monkup.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: '8',
    userid: '67700000007',
    name: 'สมพร เก่งมาก',
    email: 'sompon@student.monkup.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: '9',
    userid: '67700000008',
    name: 'สมหวัง ตั้งใจเรียน',
    email: 'somwang@student.monkup.com',
    password: 'student123',
    role: 'student'
  }
]; 