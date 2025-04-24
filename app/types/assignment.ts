export interface Assignment {
  id: string;
  title: string;
  subtitle?: string; // ชื่อที่จะแสดงในหน้ารายละเอียด
  description: string;
  type: 'solo' | 'group' | 'review';
  status?: 'submitted' | 'assigned' | 'reviewed' | 'completed';
  createdAt?: Date;
  dueDate?: Date;
  assignedTo?: string;
  targetAssignment?: string; // สำหรับ review assignment เท่านั้น
}

export interface CodeSubmission {
  code: string;
  assignmentId: string;
  userId: string;
  submittedAt: Date;
}
