export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'solo' | 'group';
  dueDate?: Date;
}

export interface CodeSubmission {
  code: string;
  assignmentId: string;
  userId: string;
  submittedAt: Date;
} 