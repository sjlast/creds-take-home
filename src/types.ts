export type Priority = 'low' | 'normal' | 'high';

export interface SupportRequest {
  id: number;
  title: string;
  priority: Priority;
  requester: string;
  createdAt: string;
}
