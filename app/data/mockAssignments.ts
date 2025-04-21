export interface Assignment {
  id: string;
  context: string;
  masterAssignmentId: string;
  submissionAssignmentId?: string;
  userId?: string;
  groupId?: string;
  subjectId: string;
  type: 'SUBMISSION' | 'REVIEW';
  status: 
    | 'ASSIGNED' 
    | 'SUBMITTED' 
    | 'READY_TO_REVIEW' 
    | 'IN_REVIEW' 
    | 'REVIEWED' 
    | 'COMPLETED';
}

export const mockAssignments: Assignment[] = [
  // Submission Assignments
  {
    id: 'sub-1',
    context: 'เขียนบทความเกี่ยวกับ AI',
    masterAssignmentId: 'master-1',
    subjectId: 'subj-1',
    type: 'SUBMISSION',
    status: 'ASSIGNED',
    userId: 'user-1'
  },
  {
    id: 'sub-2',
    context: 'วิเคราะห์กรณีศึกษา',
    masterAssignmentId: 'master-2',
    subjectId: 'subj-1',
    type: 'SUBMISSION',
    status: 'SUBMITTED',
    userId: 'user-2'
  },
  {
    id: 'sub-3',
    context: 'ทำแบบฝึกหัดบทที่ 3',
    masterAssignmentId: 'master-3',
    subjectId: 'subj-2',
    type: 'SUBMISSION',
    status: 'READY_TO_REVIEW',
    groupId: 'group-1'
  },
  {
    id: 'sub-4',
    context: 'ส่งงานกลุ่ม',
    masterAssignmentId: 'master-4',
    subjectId: 'subj-2',
    type: 'SUBMISSION',
    status: 'IN_REVIEW',
    groupId: 'group-2'
  },
  {
    id: 'sub-5',
    context: 'ทำรายงาน',
    masterAssignmentId: 'master-5',
    subjectId: 'subj-3',
    type: 'SUBMISSION',
    status: 'REVIEWED',
    userId: 'user-3'
  },
  {
    id: 'sub-6',
    context: 'ส่งการบ้าน',
    masterAssignmentId: 'master-6',
    subjectId: 'subj-3',
    type: 'SUBMISSION',
    status: 'COMPLETED',
    userId: 'user-4'
  },

  // Review Assignments
  {
    id: 'rev-1',
    context: 'ตรวจงานเขียนบทความ',
    masterAssignmentId: 'master-1',
    submissionAssignmentId: 'sub-1',
    subjectId: 'subj-1',
    type: 'REVIEW',
    status: 'ASSIGNED',
    userId: 'user-5'
  },
  {
    id: 'rev-2',
    context: 'ตรวจวิเคราะห์กรณีศึกษา',
    masterAssignmentId: 'master-2',
    submissionAssignmentId: 'sub-2',
    subjectId: 'subj-1',
    type: 'REVIEW',
    status: 'IN_REVIEW',
    userId: 'user-6'
  },
  {
    id: 'rev-3',
    context: 'ตรวจแบบฝึกหัด',
    masterAssignmentId: 'master-3',
    submissionAssignmentId: 'sub-3',
    subjectId: 'subj-2',
    type: 'REVIEW',
    status: 'COMPLETED',
    userId: 'user-7'
  }
];
