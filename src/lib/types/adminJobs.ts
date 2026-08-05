export interface JobReport {
  id: string;
  jobId: string;
  reporterEmail: string;
  reason: string;
  details: string;
  createdAt: string;
  status: "pending" | "reviewed";
}