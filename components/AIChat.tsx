import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, AlertCircle, Image as ImageIcon, X, Mic, MicOff, Volume2 } from 'lucide-react';
import { ChatMessage, User } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import { translationService } from '../services/translationService';

interface AIChatProps {
  currentUser?: User;
}

const DAILY_LIMIT = 20;

const AIChat: React.FC<AIChatProps> = ({ currentUser }) => {
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dailyCount, setDailyCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load daily usage from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem('ai_usage');
    if (stored) {
        const { date, count } = JSON.parse(stored);
        if (date === today) {
            setDailyCount(count);
        } else {
            // Reset if new day
            setDailyCount(0);
            localStorage.setItem('ai_usage', JSON.stringify({ date: today, count: 0 }));
        }
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

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
    const imageToSend = selectedImage;
    setSelectedImage(null); // Clear image after sending
    setIsLoading(true);

    try {
      // The history for the AI should be the messages *before* the current user message
      // and should not include the current user message itself.
      // We also need to filter out the initial welcome message because Gemini history must start with 'user'.
      const historyForAI = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, text: m.text }));

      // Construct context from currentUser
      let context = "";
      if (currentUser) {
        context = `Student Name: ${currentUser.name}, Level: ${currentUser.level}, Role: ${currentUser.role}. `;
        if (currentUser.academicRecord) {
            const weakAreas = currentUser.academicRecord.weakAreas?.map(w => w.topic).join(', ');
            if (weakAreas) context += `Weak Areas: ${weakAreas}. `;
        }
      }

      const responseText = await sendMessageToAI(userMsg.text, historyForAI, imageToSend || undefined, context);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(responseText);
        const lang = translationService.getLanguage();
        utter.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
        window.speechSynthesis.speak(utter);
      }

      // Update daily count only after successful response
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      localStorage.setItem('ai_usage', JSON.stringify({
        date: new Date().toDateString(),
        count: newCount
      }));
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
        <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400">
                Limit: <span className={`${dailyCount >= DAILY_LIMIT ? 'text-red-500' : 'text-emerald-500'}`}>{dailyCount}/{DAILY_LIMIT}</span>
            </div>
            <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center gap-2">
                <AlertCircle size={14} className="text-yellow-500" />
                <span className="text-xs text-yellow-500 font-medium">Ethical Mode</span>
            </div>
            <button
              onClick={() => {
                setVoiceEnabled(v => !v);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold ${voiceEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'} border border-slate-700`}
              title="Toggle voice responses"
            >
              <Volume2 className="w-4 h-4" />
            </button>
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
        {selectedImage && (
            <div className="mb-2 relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-16 rounded-lg border border-white/20" />
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white hover:bg-red-600"
                >
                    <X size={12} />
                </button>
            </div>
        )}
        <div className="relative flex items-center gap-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Upload Image"
          >
            <ImageIcon size={20} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for guidance or upload a math problem..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="absolute right-2 p-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
          <button
            onClick={() => {
              if (isListening) {
                setIsListening(false);
                try {
                  recognitionRef.current && recognitionRef.current.stop();
                } catch {}
              } else {
                const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                if (SR) {
                  const rec = new SR();
                  const lang = translationService.getLanguage();
                  rec.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
                  rec.interimResults = false;
                  rec.maxAlternatives = 1;
                  rec.onresult = (e: any) => {
                    const text = e.results[0][0].transcript;
                    setInput(text);
                  };
                  rec.onend = () => setIsListening(false);
                  recognitionRef.current = rec;
                  setIsListening(true);
                  rec.start();
                }
              }
            }}
            className="absolute right-14 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-all"
            title="Voice input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
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
