export interface NotificationRecord {
  id: string;
  message: string;
  createdAt: string; // ISO date
  read: boolean;
}