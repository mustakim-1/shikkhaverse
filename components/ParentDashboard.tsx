import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Activity, FileText, AlertCircle, MapPin, Check, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import { User, SOSAlert } from '../types';

export const ParentDashboard: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [student, setStudent] = useState<User | null>(null);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);

  useEffect(() => {
    if (currentUser.parentId) {
      const users = authService.getUsers();
      const studentUser = users.find(u => u.id === currentUser.parentId);
      setStudent(studentUser || null);
      
      if (studentUser) {
        const alerts = dataService.getSOSAlerts().filter(a => a.studentId === studentUser.id);
        setSosAlerts(alerts);
      }
    }
  }, [currentUser]);

  const handleResolveSOS = (id: string) => {
    const updated = dataService.resolveSOSAlert(id);
    if (student) {
        setSosAlerts(updated.filter(a => a.studentId === student.id));
    }
  };

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 glass-panel rounded-3xl border-dashed border-2 border-slate-700">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Student Linked</h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            This parent account is not yet linked to a student. Please ensure you are using a student-linked parent ID or contact support.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const attendanceData = student.academicRecord?.attendance || [
    { date: 'Today, 10:00 AM', class: 'Physics: Thermodynamics', status: 'Present', color: 'text-emerald-400' },
    { date: 'Yesterday, 04:00 PM', class: 'Math: Calculus', status: 'Present', color: 'text-emerald-400' },
    { date: '12 June, 11:00 AM', class: 'Chemistry: Organic', status: 'Late (10m)', color: 'text-yellow-400' },
    { date: '10 June, 02:00 PM', class: 'Biology: Genetics', status: 'Absent', color: 'text-red-400' },
  ];

  const examPerformance = student.academicRecord?.subjectStrength?.map(strength => ({
    subject: strength.subject,
    score: Math.round((strength.A / strength.fullMark) * 100)
  })) || [
    { subject: 'Physics', score: 85 },
    { subject: 'Math', score: 72 },
    { subject: 'Chem', score: 90 },
    { subject: 'Bio', score: 78 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* SOS Alerts Section */}
      {sosAlerts.filter(a => a.status === 'ACTIVE').map(alert => (
        <div key={alert.id} className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 animate-pulse-slow">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                 <div className="p-4 bg-red-500 rounded-full shadow-lg shadow-red-900/50">
                    <AlertCircle className="w-8 h-8 text-white animate-bounce" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter">Emergency SOS Triggered!</h2>
                    <p className="text-slate-200 font-bold">{alert.studentName} is requesting immediate help.</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                       <Clock className="w-4 h-4" /> {new Date(alert.timestamp).toLocaleTimeString()}
                       {alert.location && (
                         <span className="flex items-center gap-1 text-blue-400 font-bold">
                            <MapPin className="w-4 h-4" /> Location Tracking Active
                         </span>
                       )}
                    </div>
                 </div>
              </div>
              <div className="flex gap-3">
                 {alert.location && (
                   <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2">
                      <MapPin className="w-5 h-5" /> View Location
                   </button>
                 )}
                 <button 
                   onClick={() => handleResolveSOS(alert.id)}
                   className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                 >
                    <Check className="w-5 h-5" /> Mark as Safe
                 </button>
              </div>
           </div>
        </div>
      ))}

      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900/20 border-blue-500/20">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full overflow-hidden border-2 border-white/20">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Student" />
            </div>
            <div>
               <h2 className="text-2xl font-bold">{student.name}'s Progress</h2>
               <p className="text-slate-400 text-sm">{student.level || 'General'} • {student.educationSystem === 'bangla' ? 'Bangla Medium' : 'Other'}</p>
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
                    <span className="text-slate-300 font-medium">{day.date}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                       day.status === 'Present' ? 'bg-green-500/20 text-green-400' :
                       day.status.startsWith('Late') ? 'bg-yellow-500/20 text-yellow-400' :
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
         {/* SOS History */}
         {sosAlerts.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl md:col-span-3">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-300">
                  <AlertCircle className="w-5 h-5 text-red-400" /> SOS Alert History
               </h3>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                           <th className="pb-3 px-2">Time</th>
                           <th className="pb-3 px-2">Location</th>
                           <th className="pb-3 px-2">Status</th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        {sosAlerts.map(alert => (
                           <tr key={alert.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                              <td className="py-4 px-2 text-slate-300">{new Date(alert.timestamp).toLocaleString()}</td>
                              <td className="py-4 px-2">
                                 {alert.location ? (
                                    <span className="flex items-center gap-1 text-blue-400">
                                       <MapPin className="w-3 h-3" /> {alert.location.address || 'Available'}
                                    </span>
                                 ) : 'Not Available'}
                              </td>
                              <td className="py-4 px-2">
                                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    alert.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                                 }`}>
                                    {alert.status}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};
