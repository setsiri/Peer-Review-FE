import { NotificationType } from "@/app/types/notificaitions";

export const getNotificationTypeLabel = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.DUE_DATE:
      return "Due Date Reminder";
    case NotificationType.ASSIGN_REVIEW:
      return "Review Assignment";
    case NotificationType.COMMENT:
      return "New Comment";
    case NotificationType.REVIEWED:
      return "Assignment Reviewed";
    default:
      return "";
  }
};
