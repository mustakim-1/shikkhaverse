import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Activity, 
  Server, 
  Shield, 
  FileText, 
  Video, 
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart2,
  Settings,
  X,
  Plus,
  Send,
  Clock,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock Data
const revenueData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 2000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
  { name: 'Jul', amount: 3490 },
];

const userDistribution = [
  { name: 'Students', value: 12450 },
  { name: 'Teachers', value: 420 },
  { name: 'Admins', value: 15 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const recentLogs = [
  { id: 1, action: 'New Class Published', user: 'Dr. Ahmed', time: '10 mins ago', type: 'success' },
  { id: 2, action: 'Teacher Verification Request', user: 'Fatema Begum', time: '1 hour ago', type: 'warning' },
  { id: 3, action: 'Failed Login Attempt (Admin)', user: 'IP: 192.168.1.1', time: '2 hours ago', type: 'error' },
  { id: 4, action: 'Subscription Payment', user: 'Student ST-2024-882', time: '3 hours ago', type: 'success' },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CONTENT'>('OVERVIEW');
  const [activeModal, setActiveModal] = useState<'PUBLISH' | 'EXAM' | 'ALERT' | 'VERIFY' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Verification List State
  const [pendingUsers, setPendingUsers] = useState([
     { id: 1, name: "Fatema Begum", role: "Teacher", subject: "Physics", status: "Pending" },
     { id: 2, name: "Karim Uddin", role: "Student", subject: "Class 10", status: "Pending" },
     { id: 3, name: "Dr. A. Khan", role: "Teacher", subject: "Biology", status: "Pending" },
  ]);

  const handleAction = (msg: string) => {
      setActiveModal(null);
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
  };

  const handleVerify = (id: number, approved: boolean) => {
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      setNotification(approved ? "User Approved" : "User Rejected");
      setTimeout(() => setNotification(null), 2000);
      if (pendingUsers.length <= 1) {
          setTimeout(() => setActiveModal(null), 500);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
       {/* Notification Toast */}
       {notification && (
           <div className="fixed top-24 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in font-bold border border-emerald-400">
               <CheckCircle className="w-5 h-5" /> {notification}
           </div>
       )}

       {/* MODALS */}
       {activeModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
               <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
                   <button 
                     onClick={() => setActiveModal(null)}
                     className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                   >
                       <X className="w-5 h-5" />
                   </button>

                   {/* PUBLISH CLASS MODAL */}
                   {activeModal === 'PUBLISH' && (
                       <div className="animate-fade-in">
                           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <Video className="w-6 h-6 text-blue-400" /> Publish New Class
                           </h3>
                           <div className="space-y-4">
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Class Title</label>
                                   <input 
                                     type="text" 
                                     className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                     placeholder="e.g. HSC Physics: Chapter 5" 
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Instructor</label>
                                   <input 
                                     type="text" 
                                     className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                     placeholder="e.g. Dr. Ahmed" 
                                   />
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                       <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-400 mb-1">Time</label>
                                       <input type="time" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" />
                                   </div>
                               </div>
                               <button 
                                 onClick={() => handleAction("Class Published Successfully")}
                                 className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white mt-4 flex items-center justify-center gap-2"
                               >
                                   <Plus className="w-5 h-5" /> Publish Now
                               </button>
                           </div>
                       </div>
                   )}

                   {/* CREATE EXAM MODAL */}
                   {activeModal === 'EXAM' && (
                       <div className="animate-fade-in">
                           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <FileText className="w-6 h-6 text-purple-400" /> Create New Exam
                           </h3>
                           <div className="space-y-4">
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Exam Title</label>
                                   <input 
                                     type="text" 
                                     className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                     placeholder="e.g. Weekly Biology Quiz" 
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Subject / Category</label>
                                   <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500">
                                       <option>Physics</option>
                                       <option>Chemistry</option>
                                       <option>Biology</option>
                                       <option>Mathematics</option>
                                       <option>ICT</option>
                                   </select>
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-400 mb-1">Duration (mins)</label>
                                       <input type="number" defaultValue={30} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500" />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-400 mb-1">Total Marks</label>
                                       <input type="number" defaultValue={50} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500" />
                                   </div>
                               </div>
                               <button 
                                 onClick={() => handleAction("Exam Created Successfully")}
                                 className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white mt-4 flex items-center justify-center gap-2"
                               >
                                   <Plus className="w-5 h-5" /> Create Exam
                               </button>
                           </div>
                       </div>
                   )}

                   {/* BROADCAST ALERT MODAL */}
                   {activeModal === 'ALERT' && (
                       <div className="animate-fade-in">
                           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <AlertTriangle className="w-6 h-6 text-amber-400" /> Broadcast System Alert
                           </h3>
                           <div className="space-y-4">
                               <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-200 text-sm mb-4 flex gap-2 items-start">
                                   <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                   This message will be sent to all 12,885 users instantly via push notification and dashboard banner.
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Alert Message</label>
                                   <textarea 
                                     rows={4}
                                     className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                                     placeholder="e.g. System maintenance scheduled for tonight..." 
                                   ></textarea>
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Severity Level</label>
                                   <div className="flex gap-4 p-2 bg-slate-900 rounded-xl border border-slate-700">
                                       <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-2 rounded-lg hover:bg-slate-800">
                                           <input type="radio" name="severity" className="accent-blue-500" /> <span className="text-slate-300">Info</span>
                                       </label>
                                       <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-2 rounded-lg hover:bg-slate-800">
                                           <input type="radio" name="severity" className="accent-amber-500" defaultChecked /> <span className="text-amber-400 font-bold">Warning</span>
                                       </label>
                                       <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-2 rounded-lg hover:bg-slate-800">
                                           <input type="radio" name="severity" className="accent-red-500" /> <span className="text-red-400 font-bold">Critical</span>
                                       </label>
                                   </div>
                               </div>
                               <button 
                                 onClick={() => handleAction("Alert Broadcasted to All Users")}
                                 className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold text-white mt-4 flex items-center justify-center gap-2"
                               >
                                   <Send className="w-4 h-4" /> Send Broadcast
                               </button>
                           </div>
                       </div>
                   )}

                   {/* USER VERIFY MODAL */}
                   {activeModal === 'VERIFY' && (
                       <div className="animate-fade-in">
                           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <Shield className="w-6 h-6 text-emerald-400" /> Pending Verifications
                           </h3>
                           <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                               {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                                   <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 animate-fade-in">
                                       <div>
                                           <h4 className="font-bold text-white">{user.name}</h4>
                                           <p className="text-xs text-slate-400">{user.role} • {user.subject}</p>
                                       </div>
                                       <div className="flex gap-2">
                                           <button 
                                              onClick={() => handleVerify(user.id, false)}
                                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                              title="Reject"
                                           >
                                               <X className="w-5 h-5" />
                                           </button>
                                           <button 
                                              onClick={() => handleVerify(user.id, true)}
                                              className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
                                              title="Approve"
                                           >
                                               <CheckCircle className="w-5 h-5" />
                                           </button>
                                       </div>
                                   </div>
                               )) : (
                                   <div className="text-center py-8 text-slate-500">
                                       <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                       <p>All pending users verified!</p>
                                   </div>
                               )}
                           </div>
                       </div>
                   )}

               </div>
           </div>
       )}

       {/* Top Stats Row */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors"></div>
              <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                 <h3 className="text-3xl font-bold text-white">12,885</h3>
                 <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> +12% this week</span>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
                  <Users className="w-6 h-6" />
              </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-600/10 group-hover:bg-emerald-600/20 transition-colors"></div>
              <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Monthly Revenue</p>
                 <h3 className="text-3xl font-bold text-white">৳ 1.2M</h3>
                 <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1"><CheckCircle className="w-3 h-3" /> Target Met</span>
              </div>
              <div className="p-3 bg-emerald-600/20 rounded-xl text-emerald-400">
                  <DollarSign className="w-6 h-6" />
              </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors"></div>
              <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Sessions</p>
                 <h3 className="text-3xl font-bold text-white">1,420</h3>
                 <span className="text-xs text-slate-400 mt-1">Live Now</span>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-xl text-purple-400">
                  <Activity className="w-6 h-6" />
              </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 transition-colors"></div>
              <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">System Health</p>
                 <h3 className="text-3xl font-bold text-white">99.9%</h3>
                 <span className="text-xs text-emerald-400 mt-1">All Systems Operational</span>
              </div>
              <div className="p-3 bg-red-600/20 rounded-xl text-red-400">
                  <Server className="w-6 h-6" />
              </div>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                    Financial Overview
                 </h3>
                 <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300 focus:outline-none">
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                 </select>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Quick Actions & System Controls */}
          <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <Settings className="w-5 h-5 text-slate-400" /> Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setActiveModal('PUBLISH')}
                        className="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-xl flex flex-col items-center gap-2 transition-all group"
                      >
                          <Video className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-blue-100">Publish Class</span>
                      </button>
                      <button 
                        onClick={() => setActiveModal('EXAM')}
                        className="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-xl flex flex-col items-center gap-2 transition-all group"
                      >
                          <FileText className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-purple-100">Create Exam</span>
                      </button>
                      <button 
                        onClick={() => setActiveModal('ALERT')}
                        className="p-4 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 rounded-xl flex flex-col items-center gap-2 transition-all group"
                      >
                          <AlertTriangle className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-amber-100">Broadcast Alert</span>
                      </button>
                      <button 
                        onClick={() => setActiveModal('VERIFY')}
                        className="p-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 rounded-xl flex flex-col items-center gap-2 transition-all group"
                      >
                          <Shield className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-emerald-100">User Verify</span>
                      </button>
                  </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="font-bold mb-4 text-slate-200">User Distribution</h3>
                  <div className="h-48 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={userDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {userDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                         <span className="text-xs text-slate-500 font-bold block">TOTAL</span>
                         <span className="text-lg font-bold text-white">12.8K</span>
                     </div>
                  </div>
                  <div className="flex justify-center gap-4 text-xs mt-2">
                      {userDistribution.map((entry, index) => (
                          <div key={index} className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                              <span className="text-slate-400">{entry.name}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-3 glass-panel p-6 rounded-2xl">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-6 bg-slate-500 rounded-full"></span>
                    Recent System Activity
                 </h3>
                 <button className="text-sm text-blue-400 hover:text-blue-300">View Full Log</button>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                         <th className="py-4 px-4">Action</th>
                         <th className="py-4 px-4">User / Source</th>
                         <th className="py-4 px-4">Time</th>
                         <th className="py-4 px-4">Status</th>
                         <th className="py-4 px-4">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm text-slate-300">
                      {recentLogs.map((log) => (
                          <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                             <td className="py-4 px-4 font-bold">{log.action}</td>
                             <td className="py-4 px-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                   {log.user.charAt(0)}
                                </div>
                                {log.user}
                             </td>
                             <td className="py-4 px-4 text-slate-500">{log.time}</td>
                             <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    log.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                                    log.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                    {log.type.toUpperCase()}
                                </span>
                             </td>
                             <td className="py-4 px-4">
                                <button className="text-slate-400 hover:text-white mr-2"><Settings className="w-4 h-4" /></button>
                             </td>
                          </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       </div>
    </div>
  );
};