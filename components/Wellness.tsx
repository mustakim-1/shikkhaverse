import React, { useState, useEffect } from 'react';
import { Heart, Moon, Sun, Wind, Coffee, Activity, ShieldCheck, X } from 'lucide-react';
import { translationService } from '../services/translationService';
import { dataService } from '../services/dataService';

export const Wellness: React.FC = () => {
  const t = (key: string) => translationService.t(key);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!breathingOpen || !running) return;
    let timeout: any;
    const runPhase = () => {
      if (phase === 'inhale') {
        setSeconds(4);
        timeout = setTimeout(() => setPhase('hold'), 4000);
      } else if (phase === 'hold') {
        setSeconds(7);
        timeout = setTimeout(() => setPhase('exhale'), 7000);
      } else {
        setSeconds(8);
        timeout = setTimeout(() => setPhase('inhale'), 8000);
      }
    };
    runPhase();
    return () => clearTimeout(timeout);
  }, [breathingOpen, running, phase]);

  const handleSupportClick = () => {
    dataService.addNotification({
      type: 'SYSTEM',
      title: 'Support Requested',
      message: 'A counselor will reach out to you within 15 minutes. Stay calm, we are here for you.',
      time: 'Just now'
    });
    alert("Support request sent. A counselor will contact you shortly.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('common.wellness')}</h2>
          <p className="text-slate-400">Mindfulness and mental health for students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Meditation Card */}
        <div className="glass-panel p-6 rounded-2xl hover:border-blue-500/50 transition-all group cursor-pointer">
          <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
            <Wind className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Guided Meditation</h3>
          <p className="text-slate-400 text-sm mb-4">5-minute focus session to clear your mind before studying.</p>
          <button onClick={() => { setBreathingOpen(true); setPhase('inhale'); setRunning(true); }} className="w-full py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white rounded-lg text-sm font-bold transition-all">
            Start Session
          </button>
        </div>

        {/* Sleep Tracker Card */}
        <div className="glass-panel p-6 rounded-2xl hover:border-purple-500/50 transition-all group cursor-pointer">
          <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
            <Moon className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sleep Routine</h3>
          <p className="text-slate-400 text-sm mb-4">Track your rest to ensure peak cognitive performance.</p>
          <button className="w-full py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white rounded-lg text-sm font-bold transition-all">
            Log Sleep
          </button>
        </div>

        {/* SOS Card */}
        <div className="glass-panel p-6 rounded-2xl border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all group cursor-pointer">
          <div className="p-3 bg-red-500/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Support System</h3>
          <p className="text-slate-400 text-sm mb-4">Immediate access to counselors and mental health resources.</p>
          <button 
            onClick={handleSupportClick}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all"
          >
            Get Help Now
          </button>
        </div>
      </div>

      {/* Wellness Tips */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" /> Daily Wellness Tip
        </h3>
        <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Sun className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-slate-300 italic">
            "Taking a 5-minute break every 25 minutes of studying (Pomodoro technique) helps prevent mental fatigue and keeps your focus sharp."
          </p>
        </div>
      </div>
      
      {breathingOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-2xl max-w-sm w-full text-center relative">
            <button onClick={() => { setBreathingOpen(false); setRunning(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="text-4xl font-bold text-white mb-4 capitalize">{phase}</div>
            <div className="w-40 h-40 mx-auto rounded-full bg-blue-500/20 border-4 border-blue-500/40 flex items-center justify-center animate-pulse" style={{ animationDuration: phase === 'inhale' ? '4s' : phase === 'hold' ? '7s' : '8s' }}>
              <span className="text-2xl font-mono text-blue-300">{seconds}s</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">Follow 4-7-8 breathing: inhale, hold, exhale.</p>
          </div>
        </div>
      )}
    </div>
  );
};
