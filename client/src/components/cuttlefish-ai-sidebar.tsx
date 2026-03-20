import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ModelViewerComponent from './model-viewer-component';
import { sendChatMessage } from '@/lib/chat';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface CuttlefishAISidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CuttlefishAISidebar({ isOpen, onClose }: CuttlefishAISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey — I'm Trib, Cuttlefish Labs' public-facing agent. I'm constitutionally governed, which means my ethical kernel can't be overridden by anyone, including my creators. Ask me anything about what we're building.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setIsThinking(true);

    try {
      const reply = await sendChatMessage(messageToSend);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm temporarily offline. Check out the white paper or join our Discord!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-sm bg-black text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out",
          "flex flex-col",
          "max-h-[100dvh] overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="bg-black border-b border-white/10 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/ceph-avatar-tight.jpg" alt="Cuttlefish Icon" className="w-10 h-10 rounded-full object-cover" />
              <h2 className="text-base md:text-lg font-semibold text-white">Cuttlefish AI Guide</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 3D Model Viewer */}
        <div className="p-3 md:p-4 bg-black">
          <ModelViewerComponent
            src="/3d_widget_david.glb"
            alt="Cuttlefish AI Guide 3D Model"
            isThinking={isThinking}
          />
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 min-h-0">
          <ScrollArea className="flex-1 px-3 py-2 md:p-4 overflow-auto">
            <div className="space-y-3 md:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.isUser ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[90%] rounded-lg px-3 py-2 text-sm md:text-base",
                      message.isUser
                        ? "bg-cyan-700 text-white"
                        : "bg-neutral-900 text-white"
                    )}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-60 text-gray-400">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900 rounded-lg p-3 text-sm text-white">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      </div>
                      <span className="text-gray-300">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollAnchorRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 md:p-4 border-t border-white/10 bg-black">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Cuttlefish Labs..."
                disabled={isLoading}
                className="flex-1 bg-neutral-800 text-white placeholder-gray-400 border border-white/10"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
