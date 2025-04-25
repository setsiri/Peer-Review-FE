export enum NotificationType {
  DUE_DATE = "DUE_DATE",
  ASSIGN_REVIEW = "ASSIGN_REVIEW",
  COMMENT = "COMMENT",
  REVIEWED = "REVIEWED"
}

export interface NotificationResponse {
  id: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
