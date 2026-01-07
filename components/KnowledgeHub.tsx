import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calendar, User, ArrowRight, Tag, FlaskConical, Atom, Dna, FileText, Download, Search, Volume2, Plus, X, Send, ArrowLeft, Zap, Info, Play, Pause, RotateCcw, Brain, Target, Trophy, HelpCircle, Microscope } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { Article, UserRole } from '../types';
import { dataService } from '../services/dataService';

// ==========================================
// SHARED: LAB ASSISTANT COMPONENT
// ==========================================
const LabAssistant = ({ text, type = 'info' }: { text: string, type?: 'info' | 'success' | 'warning' | 'instruction' }) => (
  <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all animate-fade-in ${
    type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' :
    type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' :
    type === 'instruction' ? 'bg-purple-500/10 border-purple-500/30 text-purple-200' :
    'bg-blue-500/10 border-blue-500/30 text-blue-200'
  }`}>
    <div className={`p-2 rounded-full flex-shrink-0 ${
        type === 'success' ? 'bg-emerald-500/20' : 
        type === 'warning' ? 'bg-amber-500/20' : 
        type === 'instruction' ? 'bg-purple-500/20' : 'bg-blue-500/20'
    }`}>
        {type === 'success' ? <Trophy className="w-5 h-5" /> : 
         type === 'instruction' ? <Target className="w-5 h-5" /> :
         <Brain className="w-5 h-5" />}
    </div>
    <div>
        <h4 className="font-bold text-sm mb-1">
            {type === 'instruction' ? 'Current Objective' : 'AI Lab Partner'}
        </h4>
        <p className="text-sm opacity-90 leading-relaxed">{text}</p>
    </div>
  </div>
);

// ==========================================
// PHYSICS MODULE: SIMPLE PENDULUM SIMULATOR
// ==========================================
const PhysicsLab = ({ onBack }: { onBack: () => void }) => {
  const [length, setLength] = useState(200); // cm
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [mass, setMass] = useState(1); // kg
  const [isRunning, setIsRunning] = useState(false);
  const [angle, setAngle] = useState(Math.PI / 4); 
  const [time, setTime] = useState(0);
  const [completedChallenge, setCompletedChallenge] = useState(false);
  
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const period = 2 * Math.PI * Math.sqrt((length / 100) / gravity);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const w = Math.sqrt(gravity / (length / 100));
    const currentAngle = (Math.PI / 4) * Math.cos(w * elapsed);
    setAngle(currentAngle);
    setTime(elapsed);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - (time * 1000);
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, length, gravity]);

  useEffect(() => {
    if (gravity === 1.6 && length === 100) {
        setCompletedChallenge(true);
    }
  }, [gravity, length]);

  const reset = () => {
    setIsRunning(false);
    setAngle(Math.PI / 4);
    setTime(0);
  };

  const pivotX = 150;
  const pivotY = 20;
  const bobX = pivotX + (length * Math.sin(angle));
  const bobY = pivotY + (length * Math.cos(angle));

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Lab Menu
        </button>
        <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          <Zap className="w-6 h-6" /> Physics: Simple Pendulum
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative flex flex-col items-center justify-center bg-slate-900/50 overflow-hidden min-h-[400px]">
           <div className={`absolute inset-0 transition-opacity duration-1000 opacity-20 pointer-events-none ${
               gravity === 1.6 ? 'bg-[url("https://www.transparenttextures.com/patterns/moon.png")]' :
               gravity === 24.79 ? 'bg-orange-900/30' : ''
           }`}></div>
           <svg width="300" height="350" className="overflow-visible relative z-10">
              <rect x="50" y="10" width="200" height="10" fill="#475569" rx="4" />
              <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#94a3b8" strokeWidth="2" />
              <circle cx={bobX} cy={bobY} r={10 + mass * 2} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
           </svg>
           <div className="absolute top-4 right-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs font-mono backdrop-blur-md">
              <div className="text-slate-400">Environment: <span className="text-white font-bold">{gravity === 9.8 ? 'Earth' : gravity === 1.6 ? 'Moon' : 'Jupiter'}</span></div>
              <div className="mt-2">Period (T): <span className="text-yellow-400 font-bold text-lg">{period.toFixed(2)}s</span></div>
           </div>
        </div>
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
          <LabAssistant 
             type={completedChallenge ? "success" : "instruction"}
             text={completedChallenge 
                ? "Excellent! You've successfully simulated lunar gravity conditions. Notice how the period increased?" 
                : "Challenge: Observe the pendulum on the Moon. Set Gravity to 1.6 m/s² and Length to 100 cm."
             } 
          />
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                <span>Length (L)</span>
                <span className="text-yellow-400 font-mono">{length} cm</span>
              </label>
              <input 
                type="range" min="50" max="250" value={length} 
                onChange={(e) => { reset(); setLength(Number(e.target.value)); }}
                className="w-full accent-yellow-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gravity (g)</label>
              <div className="grid grid-cols-3 gap-2">
                 {[
                    { val: 9.8, label: 'Earth', icon: '🌍' },
                    { val: 1.6, label: 'Moon', icon: '🌑' },
                    { val: 24.79, label: 'Jupiter', icon: '🪐' }
                 ].map((opt) => (
                    <button
                        key={opt.val}
                        onClick={() => { reset(); setGravity(opt.val); }}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                            gravity === opt.val 
                                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        <div className="text-lg mb-1">{opt.icon}</div>
                        {opt.label}
                    </button>
                 ))}
              </div>
            </div>
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                <span>Mass (m)</span>
                <span className="text-yellow-400 font-mono">{mass} kg</span>
              </label>
              <input 
                type="range" min="1" max="10" value={mass} 
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-yellow-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-auto">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isRunning ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'
              }`}
            >
              {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start Oscillation</>}
            </button>
            <button onClick={reset} className="px-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CHEMISTRY MODULE: TITRATION SIMULATOR
// ==========================================
const ChemistryLab = ({ onBack }: { onBack: () => void }) => {
  const [drops, setDrops] = useState(0);
  const calculatePH = (d: number) => 1 + (13 / (1 + Math.exp(-0.4 * (d - 20))));
  const ph = calculatePH(drops);
  const data = Array.from({ length: drops + 1 }, (_, i) => ({
    drops: i,
    ph: calculatePH(i)
  }));
  const getSolutionColor = (ph: number) => {
    if (ph < 3) return '#ef4444';
    if (ph < 6) return '#fbbf24';
    if (ph < 8) return '#22c55e';
    if (ph < 11) return '#3b82f6';
    return '#a855f7';
  };
  const getStatus = () => {
      if (ph >= 6.8 && ph <= 7.2) return { text: "NEUTRAL (Perfect)", color: "text-green-400", guide: "success" };
      if (ph < 7) return { text: "ACIDIC", color: "text-red-400", guide: "instruction" };
      return { text: "BASIC", color: "text-purple-400", guide: "warning" };
  };
  const status = getStatus();

  return (
    <div className="h-full flex flex-col animate-fade-in">
       <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Lab Menu
        </button>
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <FlaskConical className="w-6 h-6" /> Chemistry: Acid-Base Titration
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative bg-slate-900/50 min-h-[400px]">
           <div className={`absolute top-4 left-4 right-4 p-3 rounded-xl border flex items-center justify-between ${
               status.text.includes("NEUTRAL") 
               ? 'bg-green-500/20 border-green-500/50 text-green-300' 
               : 'bg-slate-800/80 border-slate-700 text-slate-400'
           }`}>
               <span className="text-xs font-bold uppercase tracking-wider">Status</span>
               <span className={`font-bold ${status.color}`}>{status.text}</span>
           </div>
           <div className="w-8 h-48 bg-slate-200/20 border-x border-b border-slate-400 rounded-b-lg relative mb-1 mt-12">
              <div className="absolute bottom-0 left-0 right-0 bg-slate-300/30 transition-all duration-300" style={{ height: `${Math.max(10, 100 - drops * 2)}%` }}></div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-400"></div>
           </div>
           <div className="relative w-32 h-40">
              <div className="absolute bottom-0 w-32 h-24 rounded-full rounded-t-none border-b-4 border-slate-600 bg-slate-800/30 overflow-hidden">
                 <div className="absolute bottom-0 w-full transition-colors duration-1000 opacity-80"
                    style={{ height: `${40 + drops}%`, backgroundColor: getSolutionColor(ph), boxShadow: `0 0 20px ${getSolutionColor(ph)}` }}></div>
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-16 border-x-2 border-slate-600 bg-slate-800/10"></div>
           </div>
           <div className="mt-8 flex gap-4 w-full px-8">
              <button onClick={() => setDrops(prev => Math.min(prev + 1, 50))} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                <FlaskConical className="w-4 h-4" /> Add Drop (NaOH)
              </button>
              <button onClick={() => setDrops(0)} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">Reset</button>
           </div>
        </div>
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col gap-6">
            <LabAssistant type={status.guide as any} text={status.text.includes("NEUTRAL") ? "Perfect! Equivalence point reached." : status.text.includes("BASIC") ? "Too much base! Reset and try again." : "Goal: Add NaOH until pH is 7."} />
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="drops" stroke="#94a3b8" />
                        <YAxis domain={[0, 14]} stroke="#94a3b8" />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                        <ReferenceLine y={7} stroke="#22c55e" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="ph" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// BIOLOGY MODULE: CELL EXPLORER
// ==========================================
const BiologyLab = ({ onBack }: { onBack: () => void }) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState<string>('mitochondria');
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);

  const cellParts = {
    nucleus: { title: "Nucleus", desc: "The 'brain' of the cell. Contains DNA.", color: "text-purple-400" },
    mitochondria: { title: "Mitochondria", desc: "Powerhouse of the cell. Generates energy.", color: "text-red-400" },
    cytoplasm: { title: "Cytoplasm", desc: "Jelly-like substance surrounding organelles.", color: "text-blue-400" },
    membrane: { title: "Cell Membrane", desc: "Protective outer layer.", color: "text-yellow-400" }
  };

  const handlePartClick = (part: string) => {
    if (!quizMode) { setSelectedPart(part); return; }
    if (part === quizTarget) {
        setQuizResult('correct');
        setTimeout(() => {
            setQuizResult(null);
            setQuizTarget(prev => prev === 'mitochondria' ? 'nucleus' : prev === 'nucleus' ? 'membrane' : 'mitochondria');
        }, 1500);
    } else {
        setQuizResult('wrong');
        setTimeout(() => setQuizResult(null), 1500);
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
       <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Lab Menu
        </button>
        <div className="flex items-center gap-4">
             <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                <Microscope className="w-6 h-6" /> Biology: Cell Model
            </h2>
            <button onClick={() => { setQuizMode(!quizMode); setSelectedPart(null); }} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 ${quizMode ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                <HelpCircle className="w-4 h-4" /> {quizMode ? 'Exit Quiz' : 'Start Quiz'}
            </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-900/50 relative min-h-[400px]">
           {quizMode && (
               <div className={`absolute top-4 z-20 px-6 py-3 rounded-full font-bold backdrop-blur-md transition-colors ${quizResult === 'correct' ? 'bg-green-500/80 text-white' : quizResult === 'wrong' ? 'bg-red-500/80 text-white' : 'bg-slate-800/80 text-white border border-slate-600'}`}>
                   {quizResult === 'correct' ? "Correct!" : quizResult === 'wrong' ? "Incorrect!" : `Find: ${cellParts[quizTarget as keyof typeof cellParts].title}`}
               </div>
           )}
           <svg viewBox="0 0 400 400" className="w-full h-full max-w-md animate-float">
              <circle cx="200" cy="200" r="180" fill="#064e3b" stroke="#10b981" strokeWidth="4" className="cursor-pointer hover:fill-emerald-800/50 transition-colors" onClick={() => handlePartClick('membrane')} />
              <circle cx="200" cy="200" r="160" fill="#022c22" className="cursor-pointer" onClick={() => handlePartClick('cytoplasm')} />
              <circle cx="200" cy="200" r="60" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="3" className="cursor-pointer hover:fill-purple-800/50 transition-colors" onClick={() => handlePartClick('nucleus')} />
              <ellipse cx="120" cy="150" rx="30" ry="15" fill="#7f1d1d" className="cursor-pointer hover:fill-red-800/50 transition-colors" onClick={() => handlePartClick('mitochondria')} />
              <ellipse cx="280" cy="250" rx="30" ry="15" fill="#7f1d1d" className="cursor-pointer hover:fill-red-800/50 transition-colors" onClick={() => handlePartClick('mitochondria')} />
           </svg>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
            <LabAssistant text={quizMode ? "Click on the cell part requested above." : "Click any part of the cell to learn more about its function."} />
            {selectedPart && !quizMode && (
                <div className="mt-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700 animate-fade-in">
                    <h3 className={`text-2xl font-bold mb-2 ${cellParts[selectedPart as keyof typeof cellParts].color}`}>{cellParts[selectedPart as keyof typeof cellParts].title}</h3>
                    <p className="text-slate-300 leading-relaxed">{cellParts[selectedPart as keyof typeof cellParts].desc}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

interface KnowledgeHubProps {
  initialTab?: 'ARTICLES' | 'LIBRARY' | 'VIRTUAL_LAB';
  userRole?: UserRole;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ initialTab = 'ARTICLES', userRole }) => {
  const [activeTab, setActiveTab] = useState<'ARTICLES' | 'LIBRARY' | 'VIRTUAL_LAB'>(initialTab);
  const [activeModule, setActiveModule] = useState<'MENU' | 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY'>('MENU');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [newArticle, setNewArticle] = useState<{title: string, category: Article['category'], content: string}>({ title: '', category: 'STUDY_TIPS', content: '' });
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(dataService.getArticles());
  }, []);

  const handlePublish = () => {
    if (!newArticle.title || !newArticle.content) return;
    
    const updatedArticles = dataService.addArticle({
        title: newArticle.title,
        category: newArticle.category,
        content: newArticle.content,
        author: 'Admin User' // In a real app, this would be the current user's name
    });
    setArticles(updatedArticles);
    setIsPublishing(false);
    setNewArticle({ title: '', category: 'STUDY_TIPS', content: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
           <h2 className="text-3xl font-bold mb-2">Knowledge Hub</h2>
           <p className="text-slate-400">Your ultimate resource center for learning and growth.</p>
         </div>
         
         <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
            {[
                { id: 'ARTICLES', label: 'Articles', icon: FileText },
                { id: 'LIBRARY', label: 'Digital Library', icon: BookOpen },
                { id: 'VIRTUAL_LAB', label: 'Virtual Lab', icon: FlaskConical }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
         </div>
      </div>

      {/* VIEW: ARTICLES */}
      {activeTab === 'ARTICLES' && (
          <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-200">Latest Insights</h3>
                  <div className="hidden md:flex gap-2">
                      {userRole === UserRole.ADMIN && (
                          <button 
                              onClick={() => setIsPublishing(true)}
                              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors flex items-center gap-2"
                          >
                              <Plus className="w-4 h-4" /> Publish Article
                          </button>
                      )}
                      {['All', 'Study Tips', 'Career', 'Motivation'].map((filter) => (
                          <button key={filter} className="px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 text-sm text-slate-300 transition-colors">
                              {filter}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                      <div key={article.id} className="glass-panel p-0 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group cursor-pointer">
                          <div className="h-48 bg-slate-800 relative overflow-hidden">
                              <img 
                                  src={`https://picsum.photos/seed/${article.id}/800/400`} 
                                  alt={article.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              />
                              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                  {article.category}
                              </div>
                          </div>
                          <div className="p-6">
                              <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                              </div>
                              <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                                  {article.title}
                              </h3>
                              <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                  {article.content}
                              </p>
                              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                  <div className="flex items-center gap-3">
                                      <span className="text-xs text-slate-500">{article.readTime}</span>
                                      <button className="text-slate-400 hover:text-blue-400 transition-colors" title="Read Aloud" aria-label="Read article aloud">
                                           <Volume2 className="w-4 h-4" />
                                      </button>
                                  </div>
                                  <span className="text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                      Read Article <ArrowRight className="w-4 h-4" />
                                  </span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* VIEW: DIGITAL LIBRARY */}
      {activeTab === 'LIBRARY' && (
          <div className="space-y-8 animate-fade-in">
              {/* Search Bar */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                          type="text" 
                          placeholder="Search for books, notes, or question papers..." 
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                      <select className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 flex-1 md:flex-none">
                          <option>Class 11-12</option>
                          <option>Class 9-10</option>
                          <option>Admission</option>
                      </select>
                      <select className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 flex-1 md:flex-none">
                          <option>All Subjects</option>
                          <option>Physics</option>
                          <option>Chemistry</option>
                          <option>Math</option>
                      </select>
                  </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                      { title: 'Textbooks', count: '120+', color: 'from-blue-500/20 to-blue-600/5' },
                      { title: 'Lecture Notes', count: '500+', color: 'from-purple-500/20 to-purple-600/5' },
                      { title: 'Question Bank', count: '2000+', color: 'from-emerald-500/20 to-emerald-600/5' },
                      { title: 'Solution Guides', count: '350+', color: 'from-orange-500/20 to-orange-600/5' }
                  ].map((cat, i) => (
                      <div key={i} className={`p-6 rounded-xl border border-slate-700 bg-gradient-to-br ${cat.color} hover:border-slate-500 transition-all cursor-pointer`}>
                          <h4 className="font-bold text-lg mb-1">{cat.title}</h4>
                          <p className="text-slate-400 text-sm">{cat.count} Resources</p>
                      </div>
                  ))}
              </div>

              {/* Resource List */}
              <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" /> Recent Uploads
                  </h3>
                  <div className="space-y-3">
                      {[
                          { title: 'HSC Physics 1st Paper - Tapan Sir', type: 'PDF Book', size: '25 MB', downloads: '12k' },
                          { title: 'Organic Chemistry Roadmap Note', type: 'Handwritten Note', size: '5 MB', downloads: '8.5k' },
                          { title: 'BUET Admission Test 2023 Question', type: 'Question Paper', size: '2 MB', downloads: '15k' },
                          { title: 'Biology Chapter 5 Mindmap', type: 'Infographic', size: '1.2 MB', downloads: '3k' }
                      ].map((item, i) => (
                          <div key={i} className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:bg-slate-800/80 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                      <FileText className="w-6 h-6" />
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                      <p className="text-xs text-slate-400">{item.type} • {item.size} • {item.downloads} downloads</p>
                                  </div>
                              </div>
                              <button className="p-3 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-all" aria-label={`Download ${item.title}`}>
                                  <Download className="w-5 h-5" />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* VIEW: VIRTUAL LAB */}
      {activeTab === 'VIRTUAL_LAB' && (
          <div className="space-y-8 animate-fade-in min-h-[600px]">
              {activeModule === 'MENU' ? (
                  <>
                      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                          <div className="relative z-10 max-w-2xl">
                              <h3 className="text-3xl font-bold mb-4">Interactive Virtual Laboratory</h3>
                              <p className="text-indigo-200 mb-6 text-lg">
                                  Perform complex experiments safely from your device. Visualize concepts in 3D and gather real-time data.
                              </p>
                              <div className="flex flex-wrap gap-4">
                                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 text-white text-sm">
                                      <Zap className="w-4 h-4 text-yellow-400" /> Real-time Physics
                                  </div>
                                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 text-white text-sm">
                                      <FlaskConical className="w-4 h-4 text-purple-400" /> Chemistry Simulations
                                  </div>
                                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 text-white text-sm">
                                      <Microscope className="w-4 h-4 text-emerald-400" /> Biology Models
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Physics Card */}
                          <div 
                              onClick={() => setActiveModule('PHYSICS')}
                              className="glass-panel p-6 rounded-2xl border-t-4 border-blue-500 hover:-translate-y-1 transition-all cursor-pointer group"
                          >
                              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                                  <Atom className="w-8 h-8 text-blue-400" />
                              </div>
                              <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Physics Lab</h4>
                              <p className="text-slate-400 text-sm mb-6">Mechanics, Optics, Electricity & Magnetism simulations.</p>
                              <div className="space-y-2">
                                  {['Simple Pendulum', 'Ohm\'s Law Circuit', 'Projectile Motion'].map((sim, i) => (
                                      <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg text-xs text-slate-300">
                                          <span>{sim}</span>
                                          <Play className="w-3 h-3 text-blue-500" />
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Chemistry Card */}
                          <div 
                              onClick={() => setActiveModule('CHEMISTRY')}
                              className="glass-panel p-6 rounded-2xl border-t-4 border-purple-500 hover:-translate-y-1 transition-all cursor-pointer group"
                          >
                              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                                  <FlaskConical className="w-8 h-8 text-purple-400" />
                              </div>
                              <h4 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Chemistry Lab</h4>
                              <p className="text-slate-400 text-sm mb-6">Titration, Organic Reactions, Periodic Table visualization.</p>
                              <div className="space-y-2">
                                  {['Acid-Base Titration', 'Molecule Builder', 'Gas Laws'].map((sim, i) => (
                                      <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg text-xs text-slate-300">
                                          <span>{sim}</span>
                                          <Play className="w-3 h-3 text-purple-500" />
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Biology Card */}
                          <div 
                              onClick={() => setActiveModule('BIOLOGY')}
                              className="glass-panel p-6 rounded-2xl border-t-4 border-emerald-500 hover:-translate-y-1 transition-all cursor-pointer group"
                          >
                              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-colors">
                                  <Dna className="w-8 h-8 text-emerald-400" />
                              </div>
                              <h4 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">Biology Lab</h4>
                              <p className="text-slate-400 text-sm mb-6">Cell Structure, Genetics, Human Anatomy models.</p>
                              <div className="space-y-2">
                                  {['Cell Model Explorer', 'DNA Replication', 'Human Heart 3D'].map((sim, i) => (
                                      <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg text-xs text-slate-300">
                                          <span>{sim}</span>
                                          <Play className="w-3 h-3 text-emerald-500" />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </>
              ) : activeModule === 'PHYSICS' ? (
                  <PhysicsLab onBack={() => setActiveModule('MENU')} />
              ) : activeModule === 'CHEMISTRY' ? (
                  <ChemistryLab onBack={() => setActiveModule('MENU')} />
              ) : (
                  <BiologyLab onBack={() => setActiveModule('MENU')} />
              )}
          </div>
      )}

      {/* PUBLISH MODAL */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Publish New Article</h3>
              <button onClick={() => setIsPublishing(false)} className="text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Article Title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Category</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({...newArticle, category: e.target.value as Article['category']})}
                >
                  <option value="STUDY_TIPS">Study Tips</option>
                  <option value="CAREER">Career</option>
                  <option value="MOTIVATION">Motivation</option>
                  <option value="LIFE_SKILLS">Life Skills</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Content</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-40 resize-none"
                  placeholder="Write your article content here..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setIsPublishing(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePublish}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
