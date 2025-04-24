// Assignment Status enum
export enum AssignmentStatus {
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW'
}

// Assignment Type enum
export enum AssignmentType {
  SUBMISSION = 'SUBMISSION',
  REVIEW = 'REVIEW'
}

// Master Assignment type
export interface MasterAssignment {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  subjectId: string;
}

// Main Assignment type
export interface AssignmentResponse {
  id: string;
  type: AssignmentType;
  status: AssignmentStatus;
  content: string;
  previousAssignmentId: string | null;
  masterId: string;
  userId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  masterAssignment: MasterAssignment;
}

export interface AssignmentSubmitRequest {
  content: string;
}
