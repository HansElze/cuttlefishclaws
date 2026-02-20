import { useState, useEffect, useCallback, useRef } from 'react';
import { Agent, ChatMessage as ChatMsg, Session, AGENTS } from './types';
import { connect, disconnect, subscribe, request, isConnected } from './gateway';
import AgentCard from './components/AgentCard';
import SessionList from './components/SessionList';
import ChatPanel from './components/ChatPanel';
import QuickActions from './components/QuickActions';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(() =>
    AGENTS.map(a => ({ ...a, online: false, activeSessions: 0 }))
  );
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMsg[]>>({});
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const _streamingRef = useRef<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || null;
  const currentMessages = selectedAgent ? (chatHistory[selectedAgent.sessionKey] || []) : [];

  const fetchSessions = useCallback(async () => {
    if (!isConnected()) return;
    try {
      const res = await request('sessions.list', {}) as { sessions?: Session[] } | Session[];
      const list: Session[] = Array.isArray(res) ? res : (res as { sessions?: Session[] }).sessions || [];
      setSessions(list);

      setAgents(prev => prev.map(a => {
        const agentSessions = list.filter(s => s.key?.startsWith(`agent:${a.id}:`));
        return { ...a, online: agentSessions.length > 0, activeSessions: agentSessions.length };
      }));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    connect();
    const unsub = subscribe((msg) => {
      const ev = msg as { type: string; event?: string; payload?: Record<string, unknown> };

      if (ev.event === 'connection.status') {
        const status = (ev.payload as { status: string })?.status || 'unknown';
        setConnectionStatus(status);
        if (status === 'connected') fetchSessions();
      }

      if (ev.event === 'chat.delta') {
        const p = ev.payload as { text?: string; chunk?: string };
        const text = p.text || p.chunk || '';
        if (!text) return;

        setChatHistory(prev => {
          const updated = { ...prev };
          for (const key of Object.keys(updated)) {
            const msgs = [...updated[key]];
            const last = msgs[msgs.length - 1];
            if (last && last.streaming) {
              msgs[msgs.length - 1] = { ...last, content: last.content + text };
              updated[key] = msgs;
            }
          }
          return updated;
        });
      }

      if (ev.event === 'chat.done') {
        setChatHistory(prev => {
          const updated = { ...prev };
          for (const key of Object.keys(updated)) {
            const msgs = [...updated[key]];
            const last = msgs[msgs.length - 1];
            if (last && last.streaming) {
              msgs[msgs.length - 1] = { ...last, streaming: false };
              updated[key] = msgs;
            }
          }
          return updated;
        });
        setStreamingId(null);
        _streamingRef.current = null;
      }
    });

    const interval = setInterval(fetchSessions, 15000);
    return () => { unsub(); clearInterval(interval); disconnect(); };
  }, [fetchSessions]);

  const handleNewMessage = useCallback((msg: ChatMsg) => {
    if (!selectedAgent) return;
    const key = selectedAgent.sessionKey;
    if (msg.streaming) {
      setStreamingId(msg.id);
      _streamingRef.current = msg.id;
    }
    setChatHistory(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), msg],
    }));
  }, [selectedAgent]);

  const handleUpdateStreaming = useCallback((id: string, content: string, done: boolean) => {
    setChatHistory(prev => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].map(m =>
          m.id === id ? { ...m, content, streaming: !done } : m
        );
      }
      return updated;
    });
    if (done) { setStreamingId(null); _streamingRef.current = null; }
  }, []);

  const handleAssignTask = (agent: Agent) => setSelectedAgentId(agent.id);

  const handleCheckMemory = async (agent: Agent) => {
    setSelectedAgentId(agent.id);
    const userMsg: ChatMsg = { id: `user-${Date.now()}`, role: 'user', content: 'read MEMORY.md', timestamp: Date.now() };
    const assistantMsg: ChatMsg = { id: `assistant-${Date.now()}`, role: 'assistant', content: '', timestamp: Date.now(), streaming: true };
    const key = agent.sessionKey;
    setChatHistory(prev => ({ ...prev, [key]: [...(prev[key] || []), userMsg, assistantMsg] }));
    setStreamingId(assistantMsg.id);
    try {
      await request('chat.send', {
        message: 'read MEMORY.md',
        idempotencyKey: `dk-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        sessionKey: agent.sessionKey,
      });
    } catch (e) {
      handleUpdateStreaming(assistantMsg.id, `Error: ${e}`, true);
    }
  };

  const handleRestartGateway = async () => {
    try {
      await request('status', {});
      alert('Gateway is running and connected.');
    } catch {
      alert('Gateway unreachable');
    }
  };

  const handleSessionSelect = (sessionKey: string) => {
    const agentMatch = sessionKey.match(/^agent:(\w+):/);
    if (agentMatch) setSelectedAgentId(agentMatch[1]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="logo-emoji">🐙</span>
              <span className="logo">Cuttlefish Claws</span>
            </div>
            <div className="header-subtitle">Builder Agent Swarm Dashboard</div>
          </div>
          <span className={`connection-badge ${connectionStatus}`}>{connectionStatus}</span>
        </div>
        <button className="btn btn-sm" onClick={() => setSettingsOpen(true)}>⚙️</button>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <h3 className="section-title">Agents</h3>
          <div className="agent-list">
            {agents.map(a => (
              <AgentCard
                key={a.id}
                agent={a}
                selected={selectedAgentId === a.id}
                onSelect={() => setSelectedAgentId(a.id)}
              />
            ))}
          </div>
          <SessionList sessions={sessions} onSelect={handleSessionSelect} />
        </aside>

        <main className="main-area">
          <ChatPanel
            agent={selectedAgent}
            messages={currentMessages}
            onNewMessage={handleNewMessage}
            onUpdateStreaming={handleUpdateStreaming}
            streamingId={streamingId}
          />
        </main>

        <aside className="right-panel">
          <QuickActions
            agents={agents}
            onAssignTask={handleAssignTask}
            onCheckMemory={handleCheckMemory}
            onRestartGateway={handleRestartGateway}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </aside>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
