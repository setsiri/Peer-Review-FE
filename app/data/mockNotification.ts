export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
}

export const studentNotifications: Notification[] = [
  {
    id: '1',
    title: 'การบ้านใหม่',
    message: 'มีการบ้านใหม่ในวิชา Computer Programming',
    type: 'info',
    timestamp: '2024-04-20T10:00:00',
    isRead: false
  },
  {
    id: '2',
    title: 'คะแนนสอบ',
    message: 'คะแนนสอบกลางภาควิชา Data Structure ได้รับการเผยแพร่แล้ว',
    type: 'success',
    timestamp: '2024-04-19T15:30:00',
    isRead: true
  },
  {
    id: '3',
    title: 'การแจ้งเตือน',
    message: 'มีงานที่ต้องส่งภายใน 2 วัน',
    type: 'warning',
    timestamp: '2024-04-18T09:15:00',
    isRead: false
  }
];

export const teacherNotifications: Notification[] = [
  {
    id: '1',
    title: 'การส่งงาน',
    message: 'มีนักเรียนส่งงานวิชา Computer Programming แล้ว 5 คน',
    type: 'info',
    timestamp: '2024-04-20T11:00:00',
    isRead: false
  },
  {
    id: '2',
    title: 'การแจ้งเตือน',
    message: 'มีนักเรียนส่งงานล่าช้าในวิชา Data Structure',
    type: 'warning',
    timestamp: '2024-04-19T16:45:00',
    isRead: true
  },
  {
    id: '3',
    title: 'การแจ้งเตือน',
    message: 'มีนักเรียนส่งคำถามเกี่ยวกับการบ้าน',
    type: 'info',
    timestamp: '2024-04-18T10:30:00',
    isRead: false
  }
];
