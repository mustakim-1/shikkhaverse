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

import { dataService } from '../services/dataService';
import { ExamSectionType } from '../types';
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
  const [activeModal, setActiveModal] = useState<'PUBLISH' | 'EXAM' | 'ALERT' | 'VERIFY' | 'RESULTS' | null>(null);
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

  const [classForm, setClassForm] = useState({ title: '', instructor: '', date: '', time: '', videoUrl: '' });
  const [examForm, setExamForm] = useState({ title: '', subject: 'Physics', durationMinutes: 30, totalMarks: 50 });
  const [examSectionType, setExamSectionType] = useState<ExamSectionType>('MCQ');
  const [mcqList, setMcqList] = useState<{ text: string; options: string[]; correctIndex: number; marks: number }[]>([]);
  const [sqList, setSqList] = useState<{ text: string; marks: number }[]>([]);
  const [cqList, setCqList] = useState<{ text: string; marks: number }[]>([]);
  const resetExamBuilder = () => {
    setExamForm({ title: '', subject: 'Physics', durationMinutes: 30, totalMarks: 50 });
    setExamSectionType('MCQ');
    setMcqList([]);
    setSqList([]);
    setCqList([]);
  };
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'INFO' | 'WARNING' | 'CRITICAL'>('WARNING');
  const [publishExamId, setPublishExamId] = useState<string>('');

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
                                     value={classForm.title}
                                     onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Instructor</label>
                                   <input 
                                     type="text" 
                                     className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                     placeholder="e.g. Dr. Ahmed"
                                     value={classForm.instructor}
                                     onChange={(e) => setClassForm({ ...classForm, instructor: e.target.value })}
                                   />
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                       <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                        value={classForm.date}
                                        onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-400 mb-1">Time</label>
                                       <input type="time" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                        value={classForm.time}
                                        onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                                       />
                                   </div>
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Video URL</label>
                                   <input 
                                     type="url" 
                                     className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                     placeholder="https://example.com/video.mp4 or YouTube link"
                                     value={classForm.videoUrl}
                                     onChange={(e) => setClassForm({ ...classForm, videoUrl: e.target.value })}
                                   />
                               </div>
                               <button 
                                 onClick={() => {
                                   if (!classForm.title || !classForm.instructor || !classForm.date || !classForm.time) {
                                     setNotification("Please fill all class fields");
                                     setTimeout(() => setNotification(null), 2000);
                                     return;
                                   }
                                   dataService.publishClass({
                                     title: classForm.title,
                                     instructor: classForm.instructor,
                                     date: classForm.date,
                                     time: classForm.time,
                                     videoUrl: classForm.videoUrl
                                   });
                                   setClassForm({ title: '', instructor: '', date: '', time: '', videoUrl: '' });
                                   handleAction("Class Published Successfully");
                                 }}
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
                                     value={examForm.title}
                                     onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Subject / Category</label>
                                   <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                     value={examForm.subject}
                                     onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                                   >
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
                                       <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                        value={examForm.durationMinutes}
                                        onChange={(e) => setExamForm({ ...examForm, durationMinutes: Number(e.target.value) })}
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-400 mb-1">Total Marks</label>
                                       <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                        value={examForm.totalMarks}
                                        onChange={(e) => setExamForm({ ...examForm, totalMarks: Number(e.target.value) })}
                                       />
                                   </div>
                               </div>
                               <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                                 <div className="flex items-center justify-between mb-3">
                                   <label className="text-sm font-bold text-slate-300">Section Type</label>
                                   <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300"
                                     value={examSectionType}
                                     onChange={(e) => setExamSectionType(e.target.value as ExamSectionType)}
                                   >
                                     <option value="MCQ">MCQ</option>
                                     <option value="SQ">SQ</option>
                                     <option value="CQ">CQ</option>
                                   </select>
                                 </div>
                                 {examSectionType === 'MCQ' && (
                                   <div className="space-y-3">
                                     {mcqList.map((q, idx) => (
                                       <div key={idx} className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                                         <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mb-2" placeholder="Question" value={q.text} onChange={(e) => {
                                           const copy = [...mcqList]; copy[idx].text = e.target.value; setMcqList(copy);
                                         }} />
                                         <div className="grid grid-cols-2 gap-2">
                                           {q.options.map((opt, oi) => (
                                             <div key={oi} className="flex items-center gap-2">
                                               <input type="radio" name={`mcq-${idx}`} checked={q.correctIndex === oi} onChange={() => {
                                                 const copy = [...mcqList]; copy[idx].correctIndex = oi; setMcqList(copy);
                                               }} className="accent-purple-500" />
                                               <input className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" placeholder={`Option ${oi+1}`} value={opt} onChange={(e) => {
                                                 const copy = [...mcqList]; copy[idx].options[oi] = e.target.value; setMcqList(copy);
                                               }} />
                                             </div>
                                           ))}
                                         </div>
                                         <div className="mt-2">
                                           <input type="number" className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" placeholder="Marks" value={q.marks} onChange={(e) => {
                                             const copy = [...mcqList]; copy[idx].marks = Number(e.target.value); setMcqList(copy);
                                           }} />
                                         </div>
                                       </div>
                                     ))}
                                     <button onClick={() => setMcqList(prev => [...prev, { text: '', options: ['', '', '', ''], correctIndex: 0, marks: 1 }])} className="px-3 py-2 bg-purple-600/20 border border-purple-500/40 rounded-lg text-purple-300 text-xs font-bold">
                                       + Add MCQ
                                     </button>
                                   </div>
                                 )}
                                 {examSectionType === 'SQ' && (
                                   <div className="space-y-3">
                                     {sqList.map((q, idx) => (
                                       <div key={idx} className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                                         <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mb-2" placeholder="Question" value={q.text} onChange={(e) => {
                                           const copy = [...sqList]; copy[idx].text = e.target.value; setSqList(copy);
                                         }} />
                                         <input type="number" className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" placeholder="Marks" value={q.marks} onChange={(e) => {
                                           const copy = [...sqList]; copy[idx].marks = Number(e.target.value); setSqList(copy);
                                         }} />
                                       </div>
                                     ))}
                                     <button onClick={() => setSqList(prev => [...prev, { text: '', marks: 2 }])} className="px-3 py-2 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-300 text-xs font-bold">
                                       + Add SQ
                                     </button>
                                   </div>
                                 )}
                                 {examSectionType === 'CQ' && (
                                   <div className="space-y-3">
                                     {cqList.map((q, idx) => (
                                       <div key={idx} className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                                         <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white mb-2" placeholder="Question" value={q.text} onChange={(e) => {
                                           const copy = [...cqList]; copy[idx].text = e.target.value; setCqList(copy);
                                         }} />
                                         <input type="number" className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" placeholder="Marks" value={q.marks} onChange={(e) => {
                                           const copy = [...cqList]; copy[idx].marks = Number(e.target.value); setCqList(copy);
                                         }} />
                                       </div>
                                     ))}
                                     <button onClick={() => setCqList(prev => [...prev, { text: '', marks: 10 }])} className="px-3 py-2 bg-emerald-600/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-bold">
                                       + Add CQ
                                     </button>
                                   </div>
                                 )}
                               </div>
                               <button 
                                 onClick={() => {
                                   if (!examForm.title) {
                                     setNotification("Please enter exam title");
                                     setTimeout(() => setNotification(null), 2000);
                                     return;
                                   }
                                   const sections = [];
                                   if (mcqList.length) sections.push({ type: 'MCQ', mcq: mcqList.map((q, i) => ({ id: `mcq-${Date.now()}-${i}`, text: q.text, options: q.options, correctIndex: q.correctIndex, marks: q.marks })) });
                                   if (sqList.length) sections.push({ type: 'SQ', sq: sqList.map((q, i) => ({ id: `sq-${Date.now()}-${i}`, text: q.text, marks: q.marks })) });
                                   if (cqList.length) sections.push({ type: 'CQ', cq: cqList.map((q, i) => ({ id: `cq-${Date.now()}-${i}`, text: q.text, marks: q.marks })) });
                                   dataService.createExam({
                                     title: examForm.title,
                                     subject: examForm.subject,
                                     durationMinutes: examForm.durationMinutes,
                                     totalMarks: examForm.totalMarks,
                                     createdBy: 'ADMIN',
                                     sections
                                   });
                                   resetExamBuilder();
                                   handleAction("Exam Created Successfully");
                                 }}
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
                                     value={alertMessage}
                                     onChange={(e) => setAlertMessage(e.target.value)}
                                   ></textarea>
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Severity Level</label>
                                   <div className="flex gap-4 p-2 bg-slate-900 rounded-xl border border-slate-700">
                                       <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-2 rounded-lg hover:bg-slate-800">
                                           <input type="radio" name="severity" className="accent-blue-500" checked={alertSeverity === 'INFO'} onChange={() => setAlertSeverity('INFO')} /> <span className="text-slate-300">Info</span>
                                       </label>
                                       <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-2 rounded-lg hover:bg-slate-800">
                                           <input type="radio" name="severity" className="accent-amber-500" checked={alertSeverity === 'WARNING'} onChange={() => setAlertSeverity('WARNING')} /> <span className="text-amber-400 font-bold">Warning</span>
                                       </label>
                                       <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-2 rounded-lg hover:bg-slate-800">
                                           <input type="radio" name="severity" className="accent-red-500" checked={alertSeverity === 'CRITICAL'} onChange={() => setAlertSeverity('CRITICAL')} /> <span className="text-red-400 font-bold">Critical</span>
                                       </label>
                                   </div>
                               </div>
                               <button 
                                 onClick={() => {
                                   const msg = alertMessage.trim() || (alertSeverity === 'CRITICAL' ? 'Critical system alert' : alertSeverity === 'WARNING' ? 'System warning' : 'System information');
                                   dataService.addNotification({
                                     type: 'SYSTEM',
                                     title: `System Alert`,
                                     message: msg,
                                     time: 'Now'
                                   });
                                   setAlertMessage('');
                                   setAlertSeverity('WARNING');
                                   handleAction("Alert Broadcasted to All Users");
                                 }}
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
 
                   {/* PUBLISH RESULTS MODAL */}
                   {activeModal === 'RESULTS' && (
                       <div className="animate-fade-in">
                           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <BarChart2 className="w-6 h-6 text-green-400" /> Publish Exam Results
                           </h3>
                           <div className="space-y-4">
                               <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">Select Exam</label>
                                   <select
                                     className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-green-500"
                                     value={publishExamId}
                                     onChange={(e) => setPublishExamId(e.target.value)}
                                   >
                                     <option value="">Choose an exam</option>
                                     {dataService.getExams().map(ex => (
                                       <option key={ex.id} value={ex.id}>{ex.title} • {ex.subject}</option>
                                     ))}
                                   </select>
                               </div>
                               <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                                   <p className="text-xs text-slate-400">
                                     Pending submissions: {publishExamId ? dataService.getExamResults().filter(r => r.examId === publishExamId && !r.published).length : 0}
                                   </p>
                               </div>
                               <button
                                 onClick={() => {
                                   if (!publishExamId) {
                                     setNotification("Please select an exam");
                                     setTimeout(() => setNotification(null), 2000);
                                     return;
                                   }
                                   dataService.publishExamResults(publishExamId);
                                   setPublishExamId('');
                                   handleAction("Exam Results Published");
                                 }}
                                 className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white mt-4 flex items-center justify-center gap-2"
                               >
                                   <CheckCircle className="w-5 h-5" /> Publish Results
                               </button>
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
                        onClick={() => setActiveModal('RESULTS')}
                        className="p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-xl flex flex-col items-center gap-2 transition-all group"
                      >
                          <BarChart2 className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-green-100">Publish Results</span>
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
