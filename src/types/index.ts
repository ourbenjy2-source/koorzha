export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Report {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  likesCount: number;
  dislikesCount: number;
  fakeReportCount: number;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}

export type View = 'assistant' | 'community';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}
