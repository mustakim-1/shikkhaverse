import React from 'react';
import { User, CheckCircle, XCircle, AlertTriangle, Clock, Activity, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ParentDashboard: React.FC = () => {
  const attendanceData = [
    { day: 'Sun', status: 'Present' },
    { day: 'Mon', status: 'Present' },
    { day: 'Tue', status: 'Late' },
    { day: 'Wed', status: 'Present' },
    { day: 'Thu', status: 'Absent' },
  ];

  const examPerformance = [
    { subject: 'Physics', score: 85 },
    { subject: 'Math', score: 72 },
    { subject: 'Chem', score: 90 },
    { subject: 'Bio', score: 78 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900/20 border-blue-500/20">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full overflow-hidden border-2 border-white/20">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Student" />
            </div>
            <div>
               <h2 className="text-2xl font-bold">Rahim's Progress</h2>
               <p className="text-slate-400 text-sm">Class 10 • Science Group</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Attendance Card */}
         <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <Clock className="w-5 h-5 text-blue-400" /> Attendance (This Week)
            </h3>
            <div className="space-y-3">
               {attendanceData.map((day, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-slate-300 font-medium">{day.day}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                       day.status === 'Present' ? 'bg-green-500/20 text-green-400' :
                       day.status === 'Late' ? 'bg-yellow-500/20 text-yellow-400' :
                       'bg-red-500/20 text-red-400'
                    }`}>
                       {day.status}
                    </span>
                 </div>
               ))}
            </div>
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
               <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
               <div>
                  <p className="text-red-300 text-sm font-bold">Absent Alert</p>
                  <p className="text-red-400/70 text-xs">Rahim was absent on Thursday without leave application.</p>
               </div>
            </div>
         </div>

         {/* Performance Chart */}
         <div className="glass-panel p-6 rounded-2xl md:col-span-2">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <Activity className="w-5 h-5 text-purple-400" /> Exam Performance
            </h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={examPerformance}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                     <XAxis dataKey="subject" stroke="#94a3b8" />
                     <YAxis stroke="#94a3b8" />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        cursor={{ fill: '#334155', opacity: 0.2 }}
                     />
                     <Bar dataKey="score" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Teacher Remarks */}
      <div className="glass-panel p-6 rounded-2xl">
         <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> Teacher Remarks
         </h3>
         <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-emerald-500">
               <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-200">Physics Teacher</h4>
                  <span className="text-xs text-slate-500">Yesterday</span>
               </div>
               <p className="text-slate-400 text-sm">"Rahim is doing great in numerical problems but needs to focus more on theory definitions."</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-yellow-500">
               <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-200">Class Teacher</h4>
                  <span className="text-xs text-slate-500">2 days ago</span>
               </div>
               <p className="text-slate-400 text-sm">"Please ensure he completes the homework on time. He missed the last two submissions."</p>
            </div>
         </div>
      </div>
    </div>
  );
};
