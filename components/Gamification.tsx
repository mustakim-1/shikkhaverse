import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Zap, Star, Target, Award, TrendingUp, ShoppingCart, Gift } from 'lucide-react';
import { translationService } from '../services/translationService';
import { dataService } from '../services/dataService';

export const Gamification: React.FC = () => {
  const t = (key: string) => translationService.t(key);
  const [streak, setStreak] = useState(0);
  const [leaderboard, setLeaderboard] = useState(dataService.getLeaderboard());
  const user = dataService.getCurrentUser();
  const [points, setPoints] = useState<number>(user?.points || 0);

  useEffect(() => {
    setLeaderboard(dataService.getLeaderboard());
  }, [points]);

  useEffect(() => {
    const key = 'sv_streak';
    const stored = localStorage.getItem(key);
    const today = new Date().toDateString();
    if (!stored) {
      localStorage.setItem(key, JSON.stringify({ last: today, streak: 1 }));
      setStreak(1);
    } else {
      const obj = JSON.parse(stored);
      if (obj.last !== today) {
        const last = new Date(obj.last);
        const diff = (new Date(today).getTime() - last.getTime()) / 86400000;
        const next = diff <= 1 ? obj.streak + 1 : 1;
        localStorage.setItem(key, JSON.stringify({ last: today, streak: next }));
        setStreak(next);
      } else {
        setStreak(obj.streak);
      }
    }
  }, []);
  const marketplace = [
    { id: 'theme_neon', name: 'Neon Theme', cost: 300 },
    { id: 'avatar_star', name: 'Star Avatar', cost: 200 },
    { id: 'badge_helper', name: 'Helper Badge', cost: 150 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('common.gamification')}</h2>
          <p className="text-slate-400">Level up your learning journey.</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-yellow-500/20 rounded-full">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">Level 12</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Current Rank</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">{points} XP</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Points</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-full">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">{streak} Day</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Study Streak</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges Section */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Medal className="w-6 h-6 text-purple-400" /> Recent Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: 'Early Bird', icon: '🌅', color: 'bg-orange-500/20 text-orange-400' },
              { name: 'Math Wiz', icon: '📐', color: 'bg-blue-500/20 text-blue-400' },
              { name: 'Consistent', icon: '🔥', color: 'bg-red-500/20 text-red-400' },
              { name: 'helper', icon: '🤝', color: 'bg-green-500/20 text-green-400' },
              { name: 'Quick Learner', icon: '⚡', color: 'bg-yellow-500/20 text-yellow-400' },
              { name: 'Night Owl', icon: '🦉', color: 'bg-indigo-500/20 text-indigo-400' },
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors bg-slate-800/30">
                <span className="text-3xl mb-2">{badge.icon}</span>
                <span className="text-xs font-bold text-center text-slate-300">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Section */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-red-400" /> Active Challenges
            </h3>
            <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase">Daily</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded-full uppercase border border-purple-500/30">Weekly</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Physics Master', progress: 75, reward: '100 XP', type: 'Daily' },
              { title: 'Weekly Scholar', progress: 20, reward: '500 XP', type: 'Weekly' },
              { title: 'Help 3 Peers', progress: 33, reward: '150 XP', type: 'Daily' },
            ].map((challenge, idx) => (
              <div key={idx} className={`p-4 rounded-xl bg-slate-800/50 border ${challenge.type === 'Weekly' ? 'border-purple-500/30 shadow-lg shadow-purple-500/5' : 'border-slate-700'}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white">{challenge.title}</h4>
                    {challenge.type === 'Weekly' && <span className="text-[8px] bg-purple-500 text-white px-1 rounded uppercase">Bonus</span>}
                  </div>
                  <span className="text-xs font-bold text-yellow-400">{challenge.reward}</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${challenge.type === 'Weekly' ? 'bg-purple-500' : 'bg-blue-500'} transition-all duration-1000`} 
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Progress</span>
                  <span className="text-[10px] text-slate-400 font-bold">{challenge.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-yellow-400" /> Reward Marketplace
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketplace.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">{item.name}</div>
                <div className="text-xs text-slate-400">{item.cost} XP</div>
              </div>
              <button
                onClick={() => {
                  if (points >= item.cost) {
                    const newPoints = -item.cost;
                    dataService.updateUserPoints(newPoints);
                    setPoints(prev => prev - item.cost);
                    dataService.addNotification({ type: 'ANNOUNCEMENT', title: 'Reward Redeemed', message: `You have redeemed: ${item.name}`, time: 'Now' });
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 ${points >= item.cost ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
              >
                <Gift className="w-4 h-4" /> Redeem
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" /> Top Scholars (Leaderboard)
        </h3>
        <div className="space-y-4">
          {leaderboard.map((entry, idx) => (
            <div key={idx} className={`flex items-center justify-between p-4 rounded-xl ${entry.name === user?.name ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-slate-800/50 border border-slate-700'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-500 text-slate-900' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-orange-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                  {entry.rank}
                </div>
                <span className={`font-bold ${entry.name === user?.name ? 'text-blue-400' : 'text-slate-200'}`}>{entry.name} {entry.name === user?.name && '(You)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white">{entry.points} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
