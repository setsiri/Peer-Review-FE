export interface CreateReviewRequest {
  content: string;
  assignmentId: string;
}

export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  reviewId: string;
  userId: string;
  user: User;
}

export interface Review {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  assignmentId: string;
  userId: string;
  user: User;
  comments: Comment[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  groupId: string | null;
  subjectId: string | null;
}

export interface CreateCommentRequest {
  content: string;
  replyTo?: string;
  reviewId: string;
}
