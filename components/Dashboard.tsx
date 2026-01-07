import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Play, BookOpen, Award, TrendingUp, Calendar, Filter, ChevronDown, CheckCircle, Circle, Bell, Plus, Trash2 } from 'lucide-react';
import { User, Goal } from '../types';
import { dataService } from '../services/dataService';

const performanceData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 75 },
  { name: 'Wed', score: 72 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 90 },
  { name: 'Sun', score: 88 },
];

const studyHoursData = [
  { day: 'Sun', hours: 2 },
  { day: 'Mon', hours: 4 },
  { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 5 },
  { day: 'Thu', hours: 4.5 },
];

const taskDistributionData = [
  { name: 'Completed', value: 12, color: '#10b981' },
  { name: 'Pending', value: 5, color: '#f59e0b' },
  { name: 'Overdue', value: 2, color: '#ef4444' },
];

// Enhanced Mock Data for Schedule with filtering tags
const allScheduleData = [
  { 
    id: 1, 
    title: "HSC Physics: Thermodynamics", 
    time: "LIVE NOW", 
    instructor: "Dr. Ahmed", 
    system: "bangla", 
    level: "HSC", 
    isLive: true 
  },
  { 
    id: 2, 
    title: "Math: Calculus Integration", 
    time: "16:00 PM", 
    instructor: "Ms. Fatema", 
    system: "bangla", 
    level: "HSC", 
    isLive: false 
  },
  { 
    id: 3, 
    title: "Class 10 Biology: Genetics", 
    time: "18:00 PM", 
    instructor: "Mr. Khan", 
    system: "english_ver", 
    level: "Class 10", 
    isLive: false 
  },
  { 
    id: 4, 
    title: "O Level Physics: Forces", 
    time: "Tomorrow", 
    instructor: "Mrs. Johnson", 
    system: "english_med", 
    level: "O Level", 
    isLive: false 
  },
  { 
    id: 5, 
    title: "Alim Fiqh: Basics", 
    time: "Tomorrow", 
    instructor: "Mwl. Kabir", 
    system: "madrasah", 
    level: "Alim", 
    isLive: false 
  },
  { 
    id: 6, 
    title: "Virtual Lab: Titration", 
    time: "Tomorrow", 
    instructor: "Chemistry Dept", 
    system: "all", 
    level: "all", 
    isLive: false 
  }
];

export const Dashboard: React.FC<{currentUser: User}> = ({ currentUser }) => {
  const [filterSystem, setFilterSystem] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalType, setGoalType] = useState<'daily' | 'weekly'>('daily');
  const [newGoalText, setNewGoalText] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  useEffect(() => {
    setGoals(dataService.getGoals());
  }, []);

  const toggleGoal = (id: number) => {
    const updated = dataService.toggleGoal(id);
    setGoals(updated);
  };

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    dataService.addGoal(newGoalText, goalType);
    setGoals(dataService.getGoals());
    setNewGoalText("");
    setIsAddingGoal(false);
  };

  const handleDeleteGoal = (id: number) => {
    const updated = dataService.deleteGoal(id);
    setGoals(updated);
  };
  
  const currentGoals = goals.filter(g => g.type === goalType);

  // Filter Logic
  const filteredSchedule = allScheduleData.filter(item => {
    const systemMatch = filterSystem === 'all' || item.system === 'all' || item.system === filterSystem;
    const levelMatch = filterLevel === 'all' || item.level === 'all' || item.level === filterLevel;
    return systemMatch && levelMatch;
  });

  return (
    <div className="animate-fade-in space-y-8">
      {/* Top Welcome Section */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-900/40 to-slate-900/40 border-blue-500/20">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
              <p className="text-slate-400">You have <span className="text-blue-400 font-bold">2 assignments</span> due today and <span className="text-emerald-400 font-bold">1 live class</span> starting soon.</p>
          </div>
          <div className="flex gap-4">
              <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Your Level</p>
                  <p className="text-xl font-bold text-white">{currentUser.level || 'General'}</p>
              </div>
              <div className="w-px bg-slate-700 h-10"></div>
              <div className="text-right">
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Current XP</p>
                   <p className="text-xl font-bold text-yellow-400">{currentUser.points}</p>
              </div>
          </div>
      </div>

      {/* Attendance Alert (Mock) */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between gap-4 animate-pulse-slow">
         <div className="flex items-center gap-4">
            <div className="p-2 bg-red-500/20 rounded-full hidden md:block">
                <Bell className="w-5 h-5 text-red-400" />
            </div>
            <div>
                <h4 className="font-bold text-red-200">Attendance Alert</h4>
                <p className="text-sm text-slate-400">You were marked absent for <span className="text-white font-bold">Physics: Thermodynamics</span> yesterday. A report has been sent to your parent's dashboard.</p>
            </div>
         </div>
         <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
            View Report
         </button>
      </div>

      {/* Content Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
                <Filter className="w-5 h-5 text-blue-400" />
            </div>
            <div>
                <h3 className="font-bold text-sm text-slate-200">Personalize Feed</h3>
                <p className="text-xs text-slate-400">Filter content by curriculum</p>
            </div>
         </div>
         
         <div className="flex gap-3 w-full md:w-auto">
             <div className="relative group">
                 <select 
                    value={filterSystem}
                    onChange={(e) => setFilterSystem(e.target.value)}
                    className="appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:border-blue-500 cursor-pointer min-w-[160px]"
                 >
                    <option value="all">All Systems</option>
                    <option value="bangla">Bangla Medium</option>
                    <option value="english_ver">English Version</option>
                    <option value="english_med">English Medium</option>
                    <option value="madrasah">Madrasah</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
             </div>

             <div className="relative group">
                 <select 
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:border-blue-500 cursor-pointer min-w-[140px]"
                 >
                    <option value="all">All Levels</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="HSC">HSC</option>
                    <option value="O Level">O Level</option>
                    <option value="Alim">Alim</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
             </div>
         </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <Award className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-2xl font-bold">{currentUser.points}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">XP Points</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-500 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
            <span className="text-2xl font-bold">Top 5%</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Class Rank</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <BookOpen className="w-8 h-8 text-emerald-400 mb-2" />
            <span className="text-2xl font-bold">8/10</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Daily Goals</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500 opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <Calendar className="w-8 h-8 text-amber-400 mb-2" />
            <span className="text-2xl font-bold">95%</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Attendance</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Progress
            </h3>
            <div className="relative">
                <button className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-white transition-colors">
                    Last Week <ChevronDown className="w-3 h-3" />
                </button>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    tick={{fontSize: 12}} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                />
                <YAxis 
                    stroke="#94a3b8" 
                    tick={{fontSize: 12}} 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-10}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                    itemStyle={{ color: '#a78bfa' }}
                    cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Next Class / Schedule (Filtered) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                Up Next
              </h3>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                {filteredSchedule.length} Classes
              </span>
           </div>
           
           <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
             {filteredSchedule.length > 0 ? (
                 filteredSchedule.map((item) => (
                    <div key={item.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            {item.isLive ? (
                                <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded animate-pulse">LIVE NOW</span>
                            ) : (
                                <span className={`text-xs font-bold px-2 py-1 rounded ${item.system === 'bangla' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {item.time}
                                </span>
                            )}
                            {item.isLive && <Play className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />}
                        </div>
                        <h4 className="font-bold text-lg leading-tight">{item.title}</h4>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-slate-400">{item.instructor}</p>
                            <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-700 px-1 rounded">{item.level}</span>
                        </div>
                    </div>
                 ))
             ) : (
                 <div className="text-center py-10 text-slate-500">
                    <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No classes found for this filter.</p>
                 </div>
             )}
           </div>
        </div>

        {/* Study Hours Line Chart & Goals */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Goals Widget */}
            <div className="glass-panel p-6 rounded-2xl flex-1">
               <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className={`w-2 h-6 rounded-full ${goalType === 'daily' ? 'bg-emerald-500' : 'bg-purple-500'}`}></span>
                    {goalType === 'daily' ? 'Daily Goals' : 'Weekly Targets'}
                  </h3>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => setGoalType('daily')}
                       className={`text-xs font-bold px-2 py-1 rounded transition-colors ${goalType === 'daily' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                     >
                       Daily
                     </button>
                     <button 
                       onClick={() => setGoalType('weekly')}
                       className={`text-xs font-bold px-2 py-1 rounded transition-colors ${goalType === 'weekly' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}
                     >
                       Weekly
                     </button>
                  </div>
               </div>
               
               <div className="space-y-3">
                  {/* Add Goal Input */}
                  {isAddingGoal ? (
                    <div className="flex items-center gap-2 mb-2 animate-fade-in">
                        <input 
                            autoFocus
                            type="text" 
                            value={newGoalText}
                            onChange={(e) => setNewGoalText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Type goal..."
                        />
                        <button onClick={handleAddGoal} className="text-emerald-400 hover:text-emerald-300">
                            <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsAddingGoal(false)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                  ) : (
                    <button 
                        onClick={() => setIsAddingGoal(true)}
                        className="w-full py-2 border border-dashed border-slate-700 rounded-xl text-slate-500 text-sm hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2 mb-2"
                    >
                        <Plus className="w-4 h-4" /> Add New Goal
                    </button>
                  )}

                  {currentGoals.map((goal) => (
                      <div key={goal.id} className="flex items-center justify-between group p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3 flex-1" onClick={() => toggleGoal(goal.id)}>
                            {goal.completed ? (
                                <CheckCircle className={`w-5 h-5 flex-shrink-0 ${goalType === 'daily' ? 'text-emerald-400' : 'text-purple-400'}`} />
                            ) : (
                                <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${goal.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{goal.text}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-opacity">
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                  ))}
               </div>
            </div>

            {/* Task Distribution Chart */}
            <div className="glass-panel p-6 rounded-2xl h-64 flex flex-col">
               <h3 className="font-bold mb-2 text-sm text-slate-400 uppercase tracking-wider">Assignments Status</h3>
               <div className="flex-1 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex flex-col gap-2 ml-4">
                    {taskDistributionData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-slate-300">{item.name}</span>
                            <span className="font-bold text-white">{item.value}</span>
                        </div>
                    ))}
                </div>
               </div>
            </div>

            {/* Focus Chart */}
            <div className="glass-panel p-6 rounded-2xl h-64">
               <h3 className="font-bold mb-4 text-sm text-slate-400 uppercase tracking-wider">Focus Hours Trend</h3>
               <div className="h-full w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studyHoursData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                    />
                    <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill:'#10b981'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>

        {/* Recent Achievements */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
            Recent Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                  { title: "Early Bird", desc: "Joined 5 classes on time", icon: "🌅" },
                  { title: "Quiz Master", desc: "Scored 100% in Biology", icon: "🧬" },
                  { title: "Helper", desc: "Answered 3 forum doubts", icon: "🤝" },
                  { title: "Streak", desc: "7 Days Learning Streak", icon: "🔥" },
              ].map((badge, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h4 className="font-bold text-slate-200">{badge.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{badge.desc}</p>
                  </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};