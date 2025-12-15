import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToAI } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Greetings, Scholar. I am your Academic Mentor. I am here to guide your thinking, not to do your work. How shall we progress today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // The history for the AI should be the messages *before* the current user message
      // and should not include the current user message itself.
      // We also need to filter out the initial welcome message because Gemini history must start with 'user'.
      const historyForAI = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await sendMessageToAI(userMsg.text, historyForAI);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      // Fallback handled in service, but just in case
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-full bg-surface rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 animate-pulse-slow">
            <div className="w-full h-full bg-surface rounded-full flex items-center justify-center">
              <Bot className="text-white w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-white">Lumina Mentor</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online & Ready to Guide
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center gap-2">
            <AlertCircle size={14} className="text-yellow-500" />
            <span className="text-xs text-yellow-500 font-medium">Ethical Mode Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-white/5 text-slate-100 border border-white/10 rounded-bl-none'
              }`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-secondary uppercase tracking-wider">
                   <Sparkles size={12} /> Mentor
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-highlight rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-dark/50 backdrop-blur-md border-t border-white/10">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for guidance on a concept..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-500 mt-2">
          AI guides you through the learning process. It does not provide direct answers to ensure academic integrity.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
