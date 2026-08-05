export interface AuditLogEntry {
  id: string;
  adminName: string;
  action: string;
  target: string;
  createdAt: string; // ISO date
}