export type Priority = "low" | "normal" | "high";

export interface SupportRequest {
  id: number;
  title: string;
  priority: Priority;
  requester: string;
  createdAt: string;
}

export type SupportRequestSubmission = Pick<
  SupportRequest,
  "title" | "requester"
> &
  Partial<Pick<SupportRequest, "priority">>;
