import React, { useState, useEffect, useRef } from 'react';
import { 
  FlaskConical, 
  Zap, 
  ArrowLeft, 
  Microscope, 
  Info, 
  Play, 
  Pause,
  RotateCcw, 
  CheckCircle,
  AlertCircle,
  Brain,
  Target,
  Trophy,
  HelpCircle,
  MousePointer2
} from 'lucide-react';
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

  // T = 2*PI * sqrt(L/g)
  const period = 2 * Math.PI * Math.sqrt((length / 100) / gravity);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    
    // Simple Harmonic Motion
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

  // Challenge Logic
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Lab Menu
        </button>
        <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          <Zap className="w-6 h-6" /> Physics: Simple Pendulum
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Simulation Canvas */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative flex flex-col items-center justify-center bg-slate-900/50 overflow-hidden">
           {/* Planetary Background */}
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

        {/* Controls */}
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
            <button 
              onClick={reset}
              className="px-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
             <Info className="w-3 h-3" /> Mass change does not affect the time period.
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
  
  // Logistic function for pH curve
  const calculatePH = (d: number) => 1 + (13 / (1 + Math.exp(-0.4 * (d - 20))));
  
  const ph = calculatePH(drops);
  const data = Array.from({ length: drops + 1 }, (_, i) => ({
    drops: i,
    ph: calculatePH(i)
  }));

  const getSolutionColor = (ph: number) => {
    if (ph < 3) return '#ef4444'; // Red
    if (ph < 6) return '#fbbf24'; // Orange
    if (ph < 8) return '#22c55e'; // Green (Neutral)
    if (ph < 11) return '#3b82f6'; // Blue
    return '#a855f7'; // Purple
  };

  const getStatus = () => {
      if (ph >= 6.8 && ph <= 7.2) return { text: "NEUTRAL (Perfect)", color: "text-green-400", guide: "success" };
      if (ph < 7) return { text: "ACIDIC", color: "text-red-400", guide: "instruction" };
      return { text: "BASIC", color: "text-purple-400", guide: "warning" };
  };

  const status = getStatus();

  return (
    <div className="h-full flex flex-col animate-fade-in">
       {/* Header */}
       <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Lab Menu
        </button>
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <FlaskConical className="w-6 h-6" /> Chemistry: Acid-Base Titration
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Simulation Area */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative bg-slate-900/50">
           {/* Feedback Overlay */}
           <div className={`absolute top-4 left-4 right-4 p-3 rounded-xl border flex items-center justify-between ${
               status.text.includes("NEUTRAL") 
               ? 'bg-green-500/20 border-green-500/50 text-green-300' 
               : 'bg-slate-800/80 border-slate-700 text-slate-400'
           }`}>
               <span className="text-xs font-bold uppercase tracking-wider">Solution Status</span>
               <span className={`font-bold ${status.color}`}>{status.text}</span>
           </div>

           {/* Burette */}
           <div className="w-8 h-48 bg-slate-200/20 border-x border-b border-slate-400 rounded-b-lg relative mb-1 mt-12">
              <div className="absolute bottom-0 left-0 right-0 bg-slate-300/30 transition-all duration-300" style={{ height: `${Math.max(10, 100 - drops * 2)}%` }}></div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-400"></div>
           </div>
           
           <div className={`w-2 h-2 rounded-full bg-slate-300 absolute top-[280px] transition-all duration-500 ${drops > 0 ? 'animate-bounce opacity-0' : 'opacity-0'}`}></div>

           {/* Flask */}
           <div className="relative w-32 h-40">
              <div className="absolute bottom-0 w-32 h-24 rounded-full rounded-t-none border-b-4 border-slate-600 bg-slate-800/30 overflow-hidden">
                 <div 
                    className="absolute bottom-0 w-full transition-colors duration-1000 ease-in-out opacity-80"
                    style={{ 
                        height: `${40 + drops}%`, 
                        backgroundColor: getSolutionColor(ph),
                        boxShadow: `0 0 20px ${getSolutionColor(ph)}`
                    }}
                 ></div>
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-16 border-x-2 border-slate-600 bg-slate-800/10"></div>
           </div>

           <div className="mt-8 flex gap-4 w-full px-8">
              <button 
                onClick={() => setDrops(prev => Math.min(prev + 1, 50))}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <FlaskConical className="w-4 h-4" /> Add Drop (NaOH)
              </button>
              <button 
                onClick={() => setDrops(0)}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                Reset
              </button>
           </div>
        </div>

        {/* Data & Graph Area */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col gap-6">
            <LabAssistant 
               type={status.guide as any}
               text={status.text.includes("NEUTRAL") 
                 ? "Perfect! You have reached the equivalence point. The Moles of Acid equal Moles of Base." 
                 : status.text.includes("BASIC") 
                 ? "Warning: You added too much base. The solution is now alkaline. Try resetting."
                 : "Goal: Carefully add NaOH drops until the solution turns neutral (Green, pH 7)."
               } 
            />

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                            dataKey="drops" 
                            stroke="#94a3b8" 
                            label={{ value: 'Drops of NaOH', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} 
                        />
                        <YAxis 
                            domain={[0, 14]} 
                            stroke="#94a3b8" 
                            label={{ value: 'pH Level', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
                        />
                        <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                        />
                        <ReferenceLine y={7} stroke="#22c55e" strokeDasharray="3 3" label="Neutral" />
                        <Line 
                            type="monotone" 
                            dataKey="ph" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            dot={false}
                            animationDuration={300}
                        />
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
    nucleus: {
      title: "Nucleus",
      desc: "The 'brain' of the cell. It contains genetic material (DNA) and controls cellular activities.",
      color: "text-purple-400"
    },
    mitochondria: {
      title: "Mitochondria",
      desc: "The powerhouse of the cell. It generates most of the chemical energy needed to power the cell's biochemical reactions.",
      color: "text-red-400"
    },
    cytoplasm: {
      title: "Cytoplasm",
      desc: "A jelly-like substance that fills the cell and surrounds organelles. It facilitates movement of materials.",
      color: "text-blue-400"
    },
    membrane: {
      title: "Cell Membrane",
      desc: "The protective outer layer that controls what enters and leaves the cell.",
      color: "text-yellow-400"
    }
  };

  const handlePartClick = (part: string) => {
    if (!quizMode) {
        setSelectedPart(part);
        return;
    }

    if (part === quizTarget) {
        setQuizResult('correct');
        // Simple rotation of targets for demo
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
       {/* Header */}
       <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Lab Menu
        </button>
        <div className="flex items-center gap-4">
             <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                <Microscope className="w-6 h-6" /> Biology: Cell Model
            </h2>
            <button 
                onClick={() => { setQuizMode(!quizMode); setSelectedPart(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 ${
                    quizMode 
                    ? 'bg-purple-600 border-purple-500 text-white' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-purple-500'
                }`}
            >
                <HelpCircle className="w-4 h-4" /> {quizMode ? 'Exit Quiz' : 'Start Quiz'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Interactive SVG Model */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-900/50 relative overflow-hidden">
           {quizMode && (
               <div className={`absolute top-4 z-20 px-6 py-3 rounded-full font-bold backdrop-blur-md transition-colors ${
                   quizResult === 'correct' ? 'bg-green-500/80 text-white' :
                   quizResult === 'wrong' ? 'bg-red-500/80 text-white' :
                   'bg-slate-800/80 text-white border border-slate-600'
               }`}>
                   {quizResult === 'correct' ? "Correct! Well done." : 
                    quizResult === 'wrong' ? "Incorrect. Try again." : 
                    `Find the: ${cellParts[quizTarget as keyof typeof cellParts].title}`}
               </div>
           )}

           <svg viewBox="0 0 400 400" className="w-full h-full max-w-md animate-float">
              {/* Membrane */}
              <circle 
                cx="200" cy="200" r="180" 
                fill="#ecfccb" fillOpacity="0.1" stroke="#84cc16" strokeWidth="4"
                className="cursor-pointer hover:stroke-yellow-400 hover:fill-yellow-400/20 transition-all duration-300"
                onMouseEnter={() => !quizMode && setSelectedPart('membrane')}
                onClick={() => handlePartClick('membrane')}
              />
              {/* Cytoplasm */}
              <circle 
                cx="200" cy="200" r="170" 
                fill="transparent" 
                className="cursor-pointer"
                onMouseEnter={() => !quizMode && setSelectedPart('cytoplasm')}
                onClick={() => handlePartClick('cytoplasm')}
              />
              
              {/* Nucleus */}
              <g 
                className="cursor-pointer hover:scale-110 transition-transform origin-center"
                onMouseEnter={() => !quizMode && setSelectedPart('nucleus')}
                onClick={() => handlePartClick('nucleus')}
              >
                 <circle cx="200" cy="200" r="50" fill="#a855f7" fillOpacity="0.8" />
                 <circle cx="200" cy="200" r="40" fill="#7e22ce" />
                 <circle cx="200" cy="200" r="20" fill="#581c87" />
              </g>

              {/* Mitochondria 1 */}
              <g 
                className="cursor-pointer hover:scale-110 transition-transform origin-center"
                transform="translate(100, 120) rotate(45)"
                onMouseEnter={() => !quizMode && setSelectedPart('mitochondria')}
                onClick={() => handlePartClick('mitochondria')}
              >
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="#f87171" stroke="#b91c1c" strokeWidth="2" />
                <path d="M-20 0 Q-10 -10 0 0 Q10 10 20 0" stroke="#7f1d1d" fill="none" strokeWidth="2" />
              </g>

              {/* Mitochondria 2 */}
              <g 
                className="cursor-pointer hover:scale-110 transition-transform origin-center"
                transform="translate(280, 280) rotate(-30)"
                onMouseEnter={() => !quizMode && setSelectedPart('mitochondria')}
                onClick={() => handlePartClick('mitochondria')}
              >
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="#f87171" stroke="#b91c1c" strokeWidth="2" />
                <path d="M-20 0 Q-10 -10 0 0 Q10 10 20 0" stroke="#7f1d1d" fill="none" strokeWidth="2" />
              </g>
           </svg>
           
           <div className="absolute bottom-4 text-xs text-slate-500 flex items-center gap-2">
              <MousePointer2 className="w-4 h-4" /> 
              {quizMode ? "Click to identify the organelle" : "Hover over organelles to explore"}
           </div>
        </div>

        {/* Info Panel */}
        <div className="glass-panel rounded-2xl p-8 flex flex-col justify-center">
            {quizMode ? (
                <div className="text-center">
                    <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Quiz Mode Active</h3>
                    <p className="text-slate-400 mb-6">
                        Test your knowledge by identifying parts of the cell without labels.
                    </p>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-sm text-slate-300">Target: <span className="font-bold text-white uppercase">{cellParts[quizTarget as keyof typeof cellParts].title}</span></p>
                    </div>
                </div>
            ) : selectedPart ? (
                <div className="animate-fade-in">
                    <h3 className={`text-3xl font-bold mb-4 ${cellParts[selectedPart as keyof typeof cellParts].color}`}>
                        {cellParts[selectedPart as keyof typeof cellParts].title}
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        {cellParts[selectedPart as keyof typeof cellParts].desc}
                    </p>
                    <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-200">
                            <CheckCircle className="w-4 h-4 text-emerald-400" /> Key Function
                        </div>
                        <p className="text-sm text-slate-400">
                           Critical for {selectedPart === 'nucleus' ? 'genetic inheritance' : selectedPart === 'mitochondria' ? 'ATP production' : 'cell structure'}.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-500">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Microscope className="w-10 h-10 opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Cell Explorer</h3>
                    <p>Point to any part of the cell to learn its function.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN LAB MENU
// ==========================================
export const VirtualLab: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY' | null>(null);

  if (activeModule === 'PHYSICS') return <PhysicsLab onBack={() => setActiveModule(null)} />;
  if (activeModule === 'CHEMISTRY') return <ChemistryLab onBack={() => setActiveModule(null)} />;
  if (activeModule === 'BIOLOGY') return <BiologyLab onBack={() => setActiveModule(null)} />;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
       </div>

       <div className="glass-panel p-12 rounded-3xl border border-blue-500/30 text-center max-w-4xl relative z-10 shadow-2xl">
          <div className="flex justify-center gap-6 mb-8">
              <div className="p-4 bg-yellow-500/20 rounded-2xl animate-bounce" style={{animationDelay: '0s'}}>
                <Zap className="w-12 h-12 text-yellow-400" />
              </div>
              <div className="p-4 bg-blue-500/20 rounded-2xl animate-bounce" style={{animationDelay: '0.2s'}}>
                <FlaskConical className="w-12 h-12 text-blue-400" />
              </div>
              <div className="p-4 bg-emerald-500/20 rounded-2xl animate-bounce" style={{animationDelay: '0.4s'}}>
                <Microscope className="w-12 h-12 text-emerald-400" />
              </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Advanced Virtual Laboratory
          </h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            Welcome to the future of practical education. Perform complex experiments safely, 
            receive real-time AI guidance, and master concepts through interactive simulation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
                onClick={() => setActiveModule('PHYSICS')}
                className="group relative p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-yellow-500/50 rounded-2xl transition-all flex flex-col items-center gap-4 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Zap className="w-10 h-10 text-slate-400 group-hover:text-yellow-400 transition-colors" />
                <div className="relative z-10">
                    <h3 className="font-bold text-lg text-slate-200 group-hover:text-yellow-400">Physics Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Pendulum & Gravity</p>
                </div>
            </button>

            <button 
                onClick={() => setActiveModule('CHEMISTRY')}
                className="group relative p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all flex flex-col items-center gap-4 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <FlaskConical className="w-10 h-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <div className="relative z-10">
                    <h3 className="font-bold text-lg text-slate-200 group-hover:text-blue-400">Chemistry Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Titration & pH</p>
                </div>
            </button>

            <button 
                onClick={() => setActiveModule('BIOLOGY')}
                className="group relative p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all flex flex-col items-center gap-4 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Microscope className="w-10 h-10 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                <div className="relative z-10">
                    <h3 className="font-bold text-lg text-slate-200 group-hover:text-emerald-400">Biology Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Cell Structure & Quiz</p>
                </div>
            </button>
          </div>
       </div>
    </div>
  );
};