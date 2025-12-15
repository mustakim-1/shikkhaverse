import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, BarChart2, Award, ChevronRight, Brain, Database } from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';

export const Exams: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'QUIZ' | 'RESULT'>('LIST');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  
  // AI Feedback State
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  // Mock Quiz Data
  const quiz = {
    title: "Physics: Dynamics & Force",
    duration: "20 mins",
    questions: [
      {
        q: "If the net force on an object is zero, what can be said about its acceleration?",
        options: ["It is constant but non-zero", "It is zero", "It increases", "It decreases"],
        correct: 1,
        topic: "Newton's First Law (Inertia)"
      },
      {
        q: "Which of Newton's laws explains recoil of a gun?",
        options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
        correct: 2,
        topic: "Newton's Third Law (Action-Reaction)"
      },
      {
        q: "The unit of Impulse is equivalent to which of the following?",
        options: ["Force", "Momentum", "Change in Momentum", "Energy"],
        correct: 2,
        topic: "Impulse & Momentum"
      }
    ]
  };

  const handleOptionSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = idx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setView('RESULT');
    }
  };

  const calculateScore = () => {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === quiz.questions[idx].correct) score++;
    });
    return score;
  };

  // Trigger AI Analysis when reaching Result view
  useEffect(() => {
    if (view === 'RESULT' && !aiFeedback && !isFeedbackLoading) {
        const fetchAIFeedback = async () => {
            setIsFeedbackLoading(true);
            const score = calculateScore();
            
            // Construct a prompt for the AI Coach
            const prompt = `
            ACT AS: The "Ethical Smart Learning Platform Brain" (Performance Coach).
            TASK: Analyze the student's quiz performance.
            CONTEXT:
            - Quiz Title: ${quiz.title}
            - Score: ${score}/${quiz.questions.length}
            
            QUESTION BREAKDOWN:
            ${quiz.questions.map((q, i) => `
            ${i+1}. Topic: ${q.topic}
               Result: ${answers[i] === q.correct ? "CORRECT" : "INCORRECT"}
            `).join('')}

            OUTPUT INSTRUCTION:
            - Address the student directly.
            - Provide a concise (max 60 words) feedback summary.
            - Explicitly mention which specific topic they mastered (Strong Area) and which needs review (Weak Area) based on the breakdown.
            - Be encouraging but strict about understanding concepts.
            `;

            try {
                // Pass empty history as this is a standalone analysis
                const feedback = await sendMessageToAI(prompt, []);
                setAiFeedback(feedback);
            } catch (error) {
                console.error("AI Feedback Error", error);
                setAiFeedback("Excellent effort! Please review the chapters related to your incorrect answers to strengthen your foundation.");
            } finally {
                setIsFeedbackLoading(false);
            }
        };

        fetchAIFeedback();
    }
  }, [view]);

  if (view === 'QUIZ') {
    return (
      <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto animate-fade-in">
        <div className="w-full glass-panel p-8 rounded-2xl relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center mb-8 mt-2">
            <span className="text-slate-400 text-sm font-mono">Question {currentQuestion + 1}/{quiz.questions.length}</span>
            <div className="flex items-center gap-2 text-yellow-400 font-mono bg-yellow-400/10 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4" /> 14:20
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-8 leading-relaxed">
            {quiz.questions[currentQuestion].q}
          </h3>

          <div className="space-y-4 mb-8">
            {quiz.questions[currentQuestion].options.map((opt, idx) => (
              <div 
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  answers[currentQuestion] === idx 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-100' 
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500'
                }`}
              >
                <span>{opt}</span>
                {answers[currentQuestion] === idx && <CheckCircle className="w-5 h-5 text-blue-400" />}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button 
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Finish Exam' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'RESULT') {
    const score = calculateScore();
    const percentage = (score / quiz.questions.length) * 100;
    
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in">
         <div className="glass-panel p-8 rounded-3xl max-w-2xl w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            
            <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 relative">
               <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
               <div className={`absolute inset-0 rounded-full border-4 ${percentage >= 80 ? 'border-green-500' : 'border-yellow-500'} border-t-transparent animate-spin`} style={{animationDuration: '2s'}}></div>
               <Award className={`w-10 h-10 ${percentage >= 80 ? 'text-green-400' : 'text-yellow-400'}`} />
            </div>

            <h2 className="text-3xl font-bold mb-2">Exam Complete!</h2>
            <p className="text-slate-400 mb-8">You scored {score} out of {quiz.questions.length}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <h4 className="text-sm font-bold text-slate-300 mb-2">Strong Area</h4>
                  <div className="text-green-400 flex items-center gap-2">
                     <CheckCircle className="w-4 h-4" /> {answers[0] === quiz.questions[0].correct ? quiz.questions[0].topic : quiz.questions[2].topic}
                  </div>
               </div>
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <h4 className="text-sm font-bold text-slate-300 mb-2">Needs Improvement</h4>
                  <div className="text-red-400 flex items-center gap-2">
                     <AlertCircle className="w-4 h-4" /> {answers.find((a, i) => a !== quiz.questions[i].correct) ? quiz.questions[answers.findIndex((a, i) => a !== quiz.questions[i].correct)].topic : "None"}
                  </div>
               </div>
            </div>

            {/* AI FEEDBACK SECTION */}
            <div className="p-6 bg-blue-900/20 border border-blue-500/30 rounded-2xl mb-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50"></div>
               
               <h4 className="font-bold text-blue-400 mb-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                 <Brain className={`w-4 h-4 ${isFeedbackLoading ? 'animate-pulse' : ''}`} /> 
                 AI Performance Coach Feedback
               </h4>
               
               {isFeedbackLoading ? (
                   <div className="flex flex-col items-center justify-center py-2 space-y-3">
                       <div className="flex gap-1.5">
                           <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                           <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                           <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                       </div>
                       <p className="text-xs text-slate-400 font-mono">Analyzing response patterns...</p>
                   </div>
               ) : (
                   <div className="relative">
                       <p className="text-slate-300 leading-relaxed italic animate-fade-in text-center">
                         "{aiFeedback}"
                       </p>
                   </div>
               )}
            </div>

            <button 
              onClick={() => {
                setView('LIST');
                setCurrentQuestion(0);
                setAnswers([]);
                setAiFeedback(null);
              }}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors font-bold"
            >
              Return to Exam Hall
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="flex items-center justify-between mb-2">
         <div>
           <h2 className="text-2xl font-bold">Exam Center</h2>
           <p className="text-slate-400">Test your knowledge with AI-evaluated assessments.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold">Upcoming</button>
            <button className="px-4 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-400 transition-colors">Past Papers</button>
            <button className="px-4 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-400 transition-colors">Results</button>
         </div>
       </div>

       {/* Featured Exam */}
       <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setView('QUIZ')}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent"></div>
          <div className="relative z-10">
             <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">CLOSING SOON</span>
             <h3 className="text-2xl font-bold mb-1">Weekly Physics Challenge</h3>
             <p className="text-slate-300">Topic: Dynamics & Force • 20 Questions • 500 XP</p>
          </div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="text-3xl font-bold text-blue-400">14:20</div>
             <div className="text-xs text-slate-400 uppercase tracking-widest">Time Remaining</div>
          </div>
          <button className="relative z-10 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-500/20">
             Start Exam
          </button>
       </div>

       {/* Exam Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "HSC Model Test: Biology", date: "Tomorrow, 10:00 AM", type: "Model Test" },
            { title: "Quick Math Quiz: Algebra", date: "Always Available", type: "Practice" },
            { title: "English Grammar Check", date: "Always Available", type: "Skill Check" },
          ].map((exam, idx) => (
             <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col hover:bg-slate-800/80 transition-colors">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-2 rounded-lg ${idx === 0 ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-400'}`}>
                      <BarChart2 className="w-6 h-6" />
                   </div>
                   <span className="text-xs font-bold text-slate-500 border border-slate-700 px-2 py-1 rounded">{exam.type}</span>
                </div>
                <h4 className="font-bold text-lg mb-1">{exam.title}</h4>
                <p className="text-slate-400 text-sm mb-6">{exam.date}</p>
                <button className="mt-auto w-full py-2 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 transition-colors flex items-center justify-center gap-2">
                   View Details <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          ))}
       </div>

       {/* Special Exam Prep Section */}
       <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             <Award className="w-5 h-5 text-purple-400" />
             Special Exam Preparation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {['SSC', 'HSC', 'Medical', 'BUET/Engineering'].map((exam, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-xl text-center hover:bg-slate-800/80 cursor-pointer transition-all border border-slate-700/50 hover:border-purple-500/50 group">
                   <div className="w-12 h-12 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <span className="text-xl font-bold text-slate-300 group-hover:text-purple-400">{exam[0]}</span>
                   </div>
                   <h4 className="font-bold text-slate-200">{exam}</h4>
                   <p className="text-xs text-slate-500 mt-1">12 Courses • 50+ Mock Tests</p>
                </div>
             ))}
          </div>
       </div>

       {/* Question Bank & Solutions */}
       <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             <Database className="w-5 h-5 text-blue-400" />
             Question Bank & Solutions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
                { title: "Board Questions", desc: "SSC & HSC All Boards (2015-2023)", color: "border-blue-500/30" },
                { title: "Admission Tests", desc: "BUET, Medical, DU (Last 10 Years)", color: "border-purple-500/30" },
                { title: "Model Tests", desc: "Exclusive ShikkhaVerse Premium Tests", color: "border-emerald-500/30" }
             ].map((bank, idx) => (
                <div key={idx} className={`glass-panel p-6 rounded-2xl border ${bank.color} hover:bg-slate-800/80 transition-all cursor-pointer group`}>
                   <h4 className="font-bold text-lg text-slate-200 group-hover:text-blue-400 transition-colors">{bank.title}</h4>
                   <p className="text-sm text-slate-400 mt-1 mb-4">{bank.desc}</p>
                   <button className="text-xs font-bold text-slate-300 flex items-center gap-2 group-hover:gap-3 transition-all">
                      Browse Questions <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
             ))}
          </div>
       </div>

       {/* Weakness Detector / Smart Analytics */}
       <div className="mt-8 glass-panel p-6 rounded-2xl bg-gradient-to-r from-red-900/10 to-slate-900/50 border-red-500/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
             <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-red-400">
                   <AlertCircle className="w-5 h-5" />
                   Weakness Detector
                </h3>
                <p className="text-slate-400 text-sm">AI-detected areas that need your attention.</p>
             </div>
             <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-bold border border-red-500/20 transition-colors">
                Generate Remedial Plan
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Chart/Visual Placeholder */}
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-sm text-slate-300 mb-4">Performance Gap Analysis</h4>
                <div className="space-y-3">
                   {[
                      { topic: "Organic Chemistry", score: 45, color: "bg-red-500" },
                      { topic: "Integration (Calculus)", score: 52, color: "bg-orange-500" },
                      { topic: "Newtonian Mechanics", score: 68, color: "bg-yellow-500" }
                   ].map((item, idx) => (
                      <div key={idx}>
                         <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">{item.topic}</span>
                            <span className="text-slate-400">{item.score}% Mastery</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Recommendations */}
             <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-300">Recommended Actions</h4>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-red-500/30 transition-colors cursor-pointer">
                   <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-0 h-0 border-l-[6px] border-l-red-400 border-y-[4px] border-y-transparent ml-1"></div>
                   </div>
                   <div>
                      <h5 className="font-bold text-sm text-slate-200">Watch: "Reaction Mechanisms 101"</h5>
                      <p className="text-xs text-slate-500">Based on your Chemistry errors</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-orange-500/30 transition-colors cursor-pointer">
                   <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 border-2 border-orange-400 rounded flex items-center justify-center text-[10px] font-bold">?</div>
                   </div>
                   <div>
                      <h5 className="font-bold text-sm text-slate-200">Practice: Integration Basics</h5>
                      <p className="text-xs text-slate-500">20 Questions • 15 Mins</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};