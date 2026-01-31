export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  document: string;
  language: 'en' | 'hi' | 'mr';
  history: ChatMessage[];
  message: string;
}



export enum Status {
  IDLE = 'Idle',
  CONNECTING = 'Connecting...',
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  ERROR = 'Error',
}

export interface TranscriptEntry {
  id: number;
  author: 'user' | 'model';
  text: string;
}
