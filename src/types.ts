export interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  role: string;
  sessionKey: string;
  online: boolean;
  activeSessions: number;
}

export interface Session {
  key: string;
  agentId: string;
  kind: string;
  lastActivity: string;
  channel?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  streaming?: boolean;
}

export const AGENTS: Omit<Agent, 'online' | 'activeSessions'>[] = [
  { id: 'main', name: 'Ceph', emoji: '🐙', color: '#00d4ff', role: 'Lead Builder Agent', sessionKey: 'agent:main:main' },
  { id: 'trib', name: 'Tributary', emoji: '🦑', color: '#4f46e5', role: 'Intel & Analysis', sessionKey: 'agent:trib:main' },
  { id: 'reef', name: 'Reef', emoji: '🪸', color: '#10b981', role: 'Operator & UI', sessionKey: 'agent:reef:main' },
];
