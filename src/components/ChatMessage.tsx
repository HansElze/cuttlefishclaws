import { ChatMessage as ChatMsg } from '../types';

interface Props {
  message: ChatMsg;
  agentColor?: string;
}

export default function ChatMessage({ message, agentColor }: Props) {
  return (
    <div className={`chat-message ${message.role}`}>
      <div className="chat-message-header">
        <span
          className="chat-message-role"
          style={message.role === 'assistant' ? { color: agentColor || 'var(--cyan)' } : undefined}
        >
          {message.role === 'user' ? 'Navigator' : 'Agent'}
        </span>
        <span className="chat-message-time">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="chat-message-content">
        {message.content}
        {message.streaming && <span className="cursor-blink">▊</span>}
      </div>
    </div>
  );
}
