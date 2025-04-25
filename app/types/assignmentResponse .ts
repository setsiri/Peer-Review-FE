import { Review, User } from "./review";

// Assignment Status enum
export enum AssignmentStatus {
  ASSIGNED = "ASSIGNED",
  SUBMITTED = "SUBMITTED",
  READY_TO_REVIEW = "READY_TO_REVIEW",
  IN_REVIEW = "IN_REVIEW",
  REVIEWED = "REVIEWED",
  COMPLETED = "COMPLETED",
}

// Assignment Type enum
export enum AssignmentType {
  SUBMISSION = "SUBMISSION",
  REVIEW = "REVIEW"
}

// Master Assignment type
export interface MasterAssignment {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  subjectId: string;
  isGroupAssignment: boolean,
  dueDate: string,
}

// Main Assignment type
export interface AssignmentResponse {
  id: string;
  type: AssignmentType;
  status: AssignmentStatus;
  content: string;
  previousAssignmentId: string | null;
  masterId: string;
  masterAssignment: MasterAssignment;
  userId: string;
  user: User;
  group: Group;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  reviews: Review[];
  score: number;
}

export interface AssignmentSubmitRequest {
  content: string;
}

export interface ScoreAssignmentRequest {
  score: number;
}

export interface Group {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
