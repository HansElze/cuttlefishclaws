import { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMsg, Agent } from '../types';
import { request } from '../gateway';
import ChatMessage from './ChatMessage';

interface Props {
  agent: Agent | null;
  messages: ChatMsg[];
  onNewMessage: (msg: ChatMsg) => void;
  onUpdateStreaming: (id: string, content: string, done: boolean) => void;
  streamingId: string | null;
}

export default function ChatPanel({ agent, messages, onNewMessage, onUpdateStreaming, streamingId }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !agent) return;
    const text = input.trim();
    setInput('');

    const userMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    onNewMessage(userMsg);

    const assistantId = `assistant-${Date.now()}`;
    const assistantMsg: ChatMsg = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    };
    onNewMessage(assistantMsg);

    try {
      await request('chat.send', {
        message: text,
        idempotencyKey: `dk-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        sessionKey: agent.sessionKey,
      });
    } catch (e) {
      onUpdateStreaming(assistantId, `Error: ${e}`, true);
    }
  };

  const abort = () => {
    if (agent) {
      request('chat.abort', { sessionKey: agent.sessionKey }).catch(() => {});
    }
  };

  if (!agent) {
    return (
      <div className="chat-panel empty">
        <div className="chat-empty-state">
          <span className="chat-empty-icon">🐙</span>
          <p>Select an agent to start chatting</p>
          <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-dim)' }}>
            Ceph • Tributary • Reef
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header" style={{ borderColor: agent.color }}>
        <span className="chat-header-emoji">{agent.emoji}</span>
        <div>
          <span className="chat-header-name">{agent.name}</span>
          <span className="chat-header-role"> — {agent.role}</span>
        </div>
        <span className="chat-header-key">{agent.sessionKey}</span>
      </div>
      <div className="chat-messages">
        {messages.map(m => (
          <ChatMessage key={m.id} message={m} agentColor={agent.color} />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <textarea
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          placeholder={`Message ${agent.name}...`}
          rows={2}
        />
        <div className="chat-input-actions">
          {streamingId && <button className="btn btn-danger" onClick={abort}>Stop</button>}
          <button className="btn btn-primary" onClick={send} disabled={!input.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}
