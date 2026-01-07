import React, { useState } from 'react';
import { 
  User as UserIcon, 
  CreditCard, 
  Settings, 
  LogOut, 
  BookOpen, 
  Award, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  Clock,
  Shield,
  Folder,
  ArrowDownCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { User, UserRole } from '../types';

interface ProfileProps {
  currentUser: User;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ACADEMIC' | 'EXAMS' | 'ANALYTICS' | 'PORTFOLIO'>('OVERVIEW');

  // Determine role-based badge color
  const getRoleBadge = () => {
    switch(currentUser.role) {
      case UserRole.ADMIN: return "bg-red-500/20 text-red-400 border-red-500/20";
      case UserRole.TEACHER: return "bg-purple-500/20 text-purple-400 border-purple-500/20";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const academic = currentUser.academicRecord;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-10">
       {/* Profile Header Card */}
       <div className="glass-panel p-0 rounded-3xl mb-8 relative overflow-hidden">
          {/* Cover Image */}
          <div className={`h-40 relative ${
            currentUser.role === UserRole.ADMIN ? 'bg-gradient-to-r from-red-900 to-slate-900' : 
            'bg-gradient-to-r from-blue-900 to-indigo-900'
          }`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>
          
          <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative z-10 w-32 h-32 rounded-3xl border-4 border-[#0f172a] bg-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
                 {currentUser.role === UserRole.ADMIN ? (
                   <Shield className="w-16 h-16 text-slate-500" />
                 ) : (
                   <img src={`https://ui-avatars.com/api/?name=${currentUser.name}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                 )}
              </div>
              
              {/* Main Info */}
              <div className="flex-1 mb-2 text-center md:text-left">
                 <h2 className="text-3xl font-bold text-white mb-1">{currentUser.name}</h2>
                 <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                    <span className={`px-2 py-0.5 rounded text-sm border ${getRoleBadge()}`}>{currentUser.role}</span>
                    <span>•</span>
                    <span>{currentUser.level || 'Staff'}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">ID: {currentUser.id}</span>
                 </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-2 w-full md:w-auto">
                 <button className="flex-1 md:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl transition-all font-bold flex items-center justify-center gap-2">
                    <Settings className="w-4 h-4" /> Edit Profile
                 </button>
                 <button onClick={onLogout} className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-bold" aria-label="Logout">
                    <LogOut className="w-5 h-5" />
                 </button>
              </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-8 flex overflow-x-auto border-t border-slate-700/50">
              {[
                  { id: 'OVERVIEW', label: 'Personal Info', icon: UserIcon },
                  { id: 'ACADEMIC', label: 'Academic Journey', icon: BookOpen },
                  { id: 'EXAMS', label: 'Exam Records', icon: FileText },
                  { id: 'ANALYTICS', label: 'Performance & Growth', icon: TrendingUp },
                  { id: 'PORTFOLIO', label: 'Portfolio & Certificates', icon: Award },
              ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'border-blue-500 text-blue-400' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                      <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
              ))}
          </div>
       </div>

       {/* CONTENT SECTIONS */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar (Always Visible Info) */}
          <div className="space-y-6">
             {/* Contact Info Card */}
             <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Mail className="w-4 h-4" /></div>
                      <div>
                         <p className="text-slate-500 text-xs">Email Address</p>
                         <p className="text-slate-200">{currentUser.email || 'Not provided'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Phone className="w-4 h-4" /></div>
                      <div>
                         <p className="text-slate-500 text-xs">Phone Number</p>
                         <p className="text-slate-200">{currentUser.phone || 'Not provided'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><MapPin className="w-4 h-4" /></div>
                      <div>
                         <p className="text-slate-500 text-xs">Address</p>
                         <p className="text-slate-200">{currentUser.address || 'Not provided'}</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Subscription Status */}
             <div className="glass-panel p-6 rounded-2xl border-l-4 border-emerald-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10"><CreditCard className="w-24 h-24" /></div>
                <h3 className="text-lg font-bold text-white mb-1">Premium Plan</h3>
                <p className="text-slate-400 text-xs mb-4">Active until Dec 31, 2024</p>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">ACTIVE</span>
             </div>
          </div>

          {/* Right Content Area (Dynamic) */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* VIEW: OVERVIEW */}
              {activeTab === 'OVERVIEW' && (
                  <div className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="glass-panel p-6 rounded-2xl">
                              <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Total XP Earned</h4>
                              <div className="text-3xl font-bold text-white flex items-center gap-2">
                                  {currentUser.points} <span className="text-sm text-emerald-400 font-medium">+150 this week</span>
                              </div>
                          </div>
                          <div className="glass-panel p-6 rounded-2xl">
                              <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Class Attendance</h4>
                              <div className="text-3xl font-bold text-white flex items-center gap-2">
                                  92% <span className="text-sm text-blue-400 font-medium">Excellent</span>
                              </div>
                          </div>
                      </div>

                      <div className="glass-panel p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-4">About Me</h3>
                          <p className="text-slate-300 leading-relaxed">
                             I am a {currentUser.role.toLowerCase()} at BRIGHT BD. Joined on {currentUser.joinedDate}.
                             Focused on achieving academic excellence and mastering concepts deeply.
                          </p>
                      </div>

                      <div className="glass-panel p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-4">Parent Access</h3>
                          <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                              <div>
                                  <p className="text-sm text-slate-400">Parent Dashboard Code</p>
                                  <p className="text-xl font-mono font-bold text-white tracking-widest mt-1">P{currentUser.id.split('-')[1] || '000'}X</p>
                              </div>
                              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors">
                                  Copy Code
                              </button>
                          </div>
                          <p className="text-xs text-slate-500 mt-2">
                              Share this code with your guardian to let them monitor your attendance and exam results.
                          </p>
                      </div>
                  </div>
              )}

              {/* VIEW: ACADEMIC */}
              {activeTab === 'ACADEMIC' && (
                  <div className="space-y-6 animate-fade-in">
                      <div className="glass-panel p-6 rounded-2xl">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="font-bold text-lg flex items-center gap-2">
                                  <BookOpen className="w-5 h-5 text-blue-400" /> Enrolled Courses
                              </h3>
                              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{academic?.enrolledCourses.length || 0} Active</span>
                          </div>
                          <div className="space-y-4">
                              {academic?.enrolledCourses.map((course) => (
                                  <div key={course.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                                      <div className="flex justify-between items-start mb-2">
                                          <div>
                                              <h4 className="font-bold text-white">{course.title}</h4>
                                              <p className="text-sm text-slate-400">{course.instructor}</p>
                                          </div>
                                          <span className="text-xs font-bold text-blue-400">{course.progress}%</span>
                                      </div>
                                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                      </div>
                                  </div>
                              )) || <p className="text-slate-500">No courses enrolled.</p>}
                          </div>
                      </div>

                      <div className="glass-panel p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                              <Clock className="w-5 h-5 text-emerald-400" /> Recent Attendance
                          </h3>
                          <div className="space-y-4">
                              {academic?.attendance.map((record, i) => (
                                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                                      <div>
                                          <h4 className="text-sm font-bold text-slate-200">{record.class}</h4>
                                          <p className="text-xs text-slate-500">{record.date}</p>
                                      </div>
                                      <span className={`text-xs font-bold ${record.color} px-2 py-1 bg-slate-800 rounded`}>
                                          {record.status}
                                      </span>
                                  </div>
                              )) || <p className="text-slate-500">No attendance records found.</p>}
                          </div>
                      </div>
                  </div>
              )}

              {/* VIEW: EXAMS */}
              {activeTab === 'EXAMS' && (
                  <div className="space-y-6 animate-fade-in">
                      {/* Exam Performance Chart */}
                      <div className="glass-panel p-6 rounded-2xl h-80">
                          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-blue-400" /> Exam Scores Overview
                          </h3>
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart 
                                data={(academic?.examHistory || []).map(e => ({
                                    name: e.title.split(' ')[0], // Shorten name
                                    score: parseInt(e.marks) || 0,
                                    full: 100 // Assuming 100 for now
                                }))}
                              >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                  <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                                  <YAxis stroke="#94a3b8" tick={{fontSize: 12}} domain={[0, 100]} />
                                  <Tooltip 
                                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                      cursor={{fill: '#334155', opacity: 0.2}}
                                  />
                                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>

                      <div className="glass-panel p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-purple-400" /> Exam History
                          </h3>
                          <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm">
                                  <thead>
                                      <tr className="border-b border-slate-700 text-slate-400">
                                          <th className="pb-3 pl-2">Exam Name</th>
                                          <th className="pb-3">Date</th>
                                          <th className="pb-3">Score</th>
                                          <th className="pb-3">Grade</th>
                                          <th className="pb-3">Status</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800">
                                      {academic?.examHistory.map((exam) => (
                                          <tr key={exam.id} className="group hover:bg-slate-800/30 transition-colors">
                                              <td className="py-4 pl-2 font-bold text-white">{exam.title}</td>
                                              <td className="py-4 text-slate-400">{exam.date}</td>
                                              <td className="py-4 text-slate-300">{exam.marks}</td>
                                              <td className="py-4 font-bold text-blue-400">{exam.grade}</td>
                                              <td className="py-4">
                                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                      exam.status === 'Passed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                                  }`}>
                                                      {exam.status}
                                                  </span>
                                              </td>
                                          </tr>
                                      )) || <tr><td colSpan={5} className="py-4 text-center text-slate-500">No exam history found.</td></tr>}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              )}

              {/* VIEW: ANALYTICS */}
              {activeTab === 'ANALYTICS' && (
                  <div className="space-y-6 animate-fade-in">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Subject Strength Radar */}
                          <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col items-center justify-center">
                              <h3 className="font-bold text-slate-300 mb-4 w-full text-left flex items-center gap-2">
                                  <Award className="w-4 h-4 text-yellow-400" /> Subject Strength
                              </h3>
                              <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={academic?.subjectStrength || []}>
                                      <PolarGrid stroke="#334155" />
                                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                      <Radar name="Marks" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                  </RadarChart>
                              </ResponsiveContainer>
                          </div>

                          {/* Growth Chart */}
                          <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col items-center justify-center">
                              <h3 className="font-bold text-slate-300 mb-4 w-full text-left flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Improvement Graph
                              </h3>
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={academic?.growthData || []}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                      <XAxis dataKey="month" stroke="#64748b" tick={{fontSize: 12}} />
                                      <YAxis stroke="#64748b" tick={{fontSize: 12}} domain={[0, 100]} />
                                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                      <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{r:4, fill:'#10b981'}} />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                       </div>

                       <div className="glass-panel p-6 rounded-2xl border border-red-500/20">
                           <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-400">
                               <AlertCircle className="w-5 h-5" /> Focus Required (Weak Areas)
                           </h3>
                           <div className="space-y-3">
                               {(academic?.weakAreas || []).map((weakness, i) => (
                                   <div key={i} className="flex items-start gap-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                                       <div className="w-2 h-2 mt-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                       <div>
                                           <h4 className="font-bold text-slate-200">{weakness.topic}</h4>
                                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{weakness.subject}</span>
                                           <p className="text-sm text-slate-400 mt-1">{weakness.note}</p>
                                           <button className="mt-3 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                               Start Practice Session <CheckCircle className="w-3 h-3" />
                                           </button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                  </div>
              )}



              {/* VIEW: PORTFOLIO */}
              {activeTab === 'PORTFOLIO' && (
                  <div className="space-y-6 animate-fade-in">
                      {/* Certificates Section */}
                      <div className="glass-panel p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                              <Award className="w-5 h-5 text-yellow-400" /> Certificates & Achievements
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(currentUser.portfolio?.certificates || []).map((cert, i) => (
                                  <div key={i} className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 hover:border-yellow-500/50 transition-all group relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                          <Award className="w-16 h-16" />
                                      </div>
                                      <h4 className="font-bold text-white mb-1 relative z-10">{cert.title}</h4>
                                      <p className="text-xs text-slate-400 mb-4 relative z-10">{cert.issuer} • {cert.date}</p>
                                      <div className="flex justify-between items-end relative z-10">
                                          <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">{cert.type}</span>
                                          <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                              Download <ArrowDownCircle className="w-3 h-3" />
                                          </button>
                                      </div>
                                  </div>
                              ))}
                              {(!currentUser.portfolio?.certificates || currentUser.portfolio.certificates.length === 0) && (
                                <p className="text-slate-400 italic">No certificates yet.</p>
                              )}
                          </div>
                      </div>

                      {/* Skills & Endorsements */}
                      <div className="glass-panel p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-blue-400" /> Skills & Competencies
                          </h3>
                          <div className="flex flex-wrap gap-3">
                              {(currentUser.portfolio?.skills || []).map((skill, i) => (
                                  <div key={i} className="px-4 py-2 bg-slate-800 rounded-full border border-slate-700 flex items-center gap-2 hover:bg-slate-700 transition-colors cursor-default">
                                      <span className="text-sm font-medium text-slate-200">{skill.name}</span>
                                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{skill.proficiency}%</span>
                                  </div>
                              ))}
                               {(!currentUser.portfolio?.skills || currentUser.portfolio.skills.length === 0) && (
                                <p className="text-slate-400 italic">No skills listed yet.</p>
                              )}
                          </div>
                      </div>

                      {/* Projects & Clubs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="glass-panel p-6 rounded-2xl">
                              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Folder className="w-5 h-5 text-emerald-400" /> Projects</h3>
                              <div className="space-y-4">
                                  {(currentUser.portfolio?.projects || []).map((project, i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <h4 className="font-bold text-sm">{project.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1">{project.description}</p>
                                        <p className="text-[10px] text-blue-400 mt-1 uppercase font-bold">{project.role}</p>
                                    </div>
                                  ))}
                                   {(!currentUser.portfolio?.projects || currentUser.portfolio.projects.length === 0) && (
                                    <p className="text-slate-400 italic">No projects added.</p>
                                  )}
                              </div>
                          </div>
                          <div className="glass-panel p-6 rounded-2xl">
                              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-purple-400" /> Club Memberships</h3>
                              <div className="space-y-4">
                                  {(currentUser.portfolio?.clubs || []).map((club, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${i % 2 === 0 ? 'bg-purple-600' : 'bg-green-600'}`}>
                                          {club.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{club.name}</h4>
                                            <p className="text-xs text-slate-400">{club.role}</p>
                                        </div>
                                    </div>
                                  ))}
                                  {(!currentUser.portfolio?.clubs || currentUser.portfolio.clubs.length === 0) && (
                                    <p className="text-slate-400 italic">No club memberships.</p>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              )}

          </div>
       </div>
    </div>
  );
};