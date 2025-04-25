import { User } from "@/app/types/review";

export const getFullName = (user?: User) => {
  return `${user?.firstName || ""} ${user?.lastName || ""}`;
};
