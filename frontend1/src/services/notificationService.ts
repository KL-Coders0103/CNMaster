import { api } from "../api/axios";


export const fetchNotificationsApi = async () => {
  return api.get("/notifications");
};

export const markAsReadApi = async (id: string) => {
  return api.patch(`/notifications/${id}/read`);
};

export const markAllAsReadApi = async () => {
  return api.patch("/notifications/read-all");
};