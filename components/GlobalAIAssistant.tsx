import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X, Mic, MicOff, Maximize2, Minimize2, MessageSquare, Trash2 } from 'lucide-react';
import { ChatMessage, User } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import { translationService } from '../services/translationService';
import { dataService } from '../services/dataService';

const DAILY_LIMIT = 20;

interface GlobalAIAssistantProps {
  currentUser?: User;
}

export const GlobalAIAssistant: React.FC<GlobalAIAssistantProps> = ({ currentUser: propUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<User | undefined>(propUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (propUser) setCurrentUser(propUser);
  }, [propUser]);

  useEffect(() => {
    // Load chat history from local storage to persist across sessions
    const saved = localStorage.getItem('lumina_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        setMessages([{
          id: 'welcome',
          role: 'model',
          text: "Greetings, Scholar. I am Lumina, your Academic Mentor. How shall we progress today?",
          timestamp: new Date(),
        }]);
      }
    } else {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: "Greetings, Scholar. I am Lumina, your Academic Mentor. I am here to guide your thinking, not to do your work. How shall we progress today?",
        timestamp: new Date(),
      }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('lumina_chat', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    const checkDailyLimit = () => {
      const usage = localStorage.getItem('ai_usage');
      const today = new Date().toDateString();
      
      if (usage) {
        const { date, count } = JSON.parse(usage);
        if (date === today) {
          setDailyCount(count);
        } else {
          // Reset for new day
          setDailyCount(0);
          localStorage.setItem('ai_usage', JSON.stringify({ date: today, count: 0 }));
        }
      } else {
        localStorage.setItem('ai_usage', JSON.stringify({ date: today, count: 0 }));
      }
    };

    checkDailyLimit();
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (dailyCount >= DAILY_LIMIT) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "⚠️ Daily limit reached. Take a break and review what you've learned today! Come back tomorrow for more guidance.",
        timestamp: new Date()
      }]);
      return;
    }

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
      const historyForAI = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, text: m.text }));

      let context = "";
      if (currentUser) {
        context = `Student Name: ${currentUser.name}, Level: ${currentUser.level}, Role: ${currentUser.role}. `;
        if (currentUser.academicRecord) {
          const weakAreas = currentUser.academicRecord.weakAreas?.map(w => w.topic).join(', ');
          if (weakAreas) context += `Weak Areas: ${weakAreas}. `;
        }
      }

      const responseText = await sendMessageToAI(userMsg.text, historyForAI, undefined, context);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      const today = new Date().toDateString();
      localStorage.setItem('ai_usage', JSON.stringify({
        date: today,
        count: newCount
      }));

      // Update user object if logged in
      if (currentUser) {
        const updatedUser = { ...currentUser, aiUsageCount: newCount };
        dataService.updateUser(updatedUser);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered a slight disturbance in the digital ether. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear our current discussion?")) {
      const welcome = {
        id: 'welcome',
        role: 'model' as const,
        text: "Greetings, Scholar. I am Lumina, your Academic Mentor. How shall we progress today?",
        timestamp: new Date(),
      };
      setMessages([welcome]);
      localStorage.removeItem('lumina_chat');
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } catch (e) {
        console.error("Speech recognition stop error:", e);
      }
    } else {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        try {
          const rec = new SR();
          const lang = translationService.getLanguage();
          rec.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
          rec.interimResults = false;
          rec.maxAlternatives = 1;
          
          rec.onstart = () => setIsListening(true);
          rec.onresult = (e: any) => {
            const text = e.results[0][0].transcript;
            if (text) {
              setInput(text);
            }
          };
          rec.onerror = (e: any) => {
            console.error("Speech recognition error:", e.error);
            setIsListening(false);
          };
          rec.onend = () => setIsListening(false);
          
          recognitionRef.current = rec;
          rec.start();
        } catch (e) {
          console.error("Speech recognition initialization error:", e);
          setIsListening(false);
        }
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-[100] group"
      >
        <div className="relative">
          <Bot className="w-7 h-7" />
          <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="absolute right-full mr-3 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask Lumina Mentor
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-[350px] md:w-[400px] bg-[#0f172a] border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col transition-all z-[100] ${isMinimized ? 'h-16' : 'h-[550px]'}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Lumina Mentor
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-slate-400">Online & Ready to Guide</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={clearChat}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            title="Clear discussion"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/10'
                      : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                  <div className={`text-[9px] mt-2 opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] text-slate-500 font-medium">
                DAILY ENERGY: <span className={dailyCount >= DAILY_LIMIT ? 'text-red-500' : 'text-blue-400'}>{DAILY_LIMIT - dailyCount} units left</span>
              </span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-1 rounded-full ${i < (5 - (dailyCount / DAILY_LIMIT * 5)) ? 'bg-blue-500' : 'bg-slate-700'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Lumina anything..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pr-24"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-700'}`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-[9px] text-center text-slate-500 mt-3">
              Lumina may provide helpful guidance. Always verify complex facts.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
