import React from 'react';
import { PlayCircle, Award, TrendingUp, Zap } from 'lucide-react';

export const Skills: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
         <div>
           <h2 className="text-2xl font-bold">Skills & Growth</h2>
           <p className="text-slate-400">Prepare for life beyond the classroom.</p>
         </div>
         <div className="flex gap-2">
            <span className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
               <Award className="w-4 h-4 text-yellow-400" /> 12 Certificates Earned
            </span>
         </div>
       </div>

       {/* Hero Course */}
       <div className="w-full h-64 rounded-3xl overflow-hidden relative group cursor-pointer">
          <img src="https://picsum.photos/1200/400" alt="Freelancing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8">
             <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">TRENDING</span>
             <h3 className="text-3xl font-bold text-white mb-2">Freelancing 101: Financial Independence</h3>
             <p className="text-slate-300 max-w-xl mb-6">Learn how to start your career on Upwork, Fiverr, and build a global client base while studying.</p>
             <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                <PlayCircle className="w-5 h-5" /> Start Course
             </button>
          </div>
       </div>

       {/* Course Tracks */}
       <h3 className="text-xl font-bold pt-4">Explore Tracks</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
             { title: "Python for Beginners", category: "Coding", progress: 60, color: "text-emerald-400", bg: "bg-emerald-500" },
             { title: "Public Speaking Masterclass", category: "Soft Skills", progress: 30, color: "text-purple-400", bg: "bg-purple-500" },
             { title: "Exam Stress Management", category: "Mental Health", progress: 0, color: "text-blue-400", bg: "bg-blue-500" },
             { title: "Startup & Entrepreneurship", category: "Business", progress: 10, color: "text-yellow-400", bg: "bg-yellow-500" },
          ].map((course, idx) => (
             <div key={idx} className="glass-panel p-5 rounded-2xl hover:bg-slate-800/80 transition-colors group">
                <div className="h-32 bg-slate-800 rounded-xl mb-4 overflow-hidden relative">
                   <div className={`absolute top-2 left-2 ${course.bg}/20 ${course.color} text-xs font-bold px-2 py-1 rounded backdrop-blur-md`}>
                      {course.category}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <PlayCircle className="w-10 h-10 text-white" />
                   </div>
                </div>
                <h4 className="font-bold text-lg leading-tight mb-3">{course.title}</h4>
                
                {course.progress > 0 ? (
                  <div className="space-y-1">
                     <div className="flex justify-between text-xs text-slate-400">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                     </div>
                     <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${course.bg} rounded-full`} style={{width: `${course.progress}%`}}></div>
                     </div>
                  </div>
                ) : (
                  <button className="w-full py-2 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors">
                     Enroll Now
                  </button>
                )}
             </div>
          ))}
       </div>

       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
             <div className="p-3 bg-blue-500/20 rounded-full">
                <Zap className="w-6 h-6 text-blue-400" />
             </div>
             <div>
                <h4 className="font-bold text-2xl">4.5 Hrs</h4>
                <p className="text-xs text-slate-400">Skill Learning This Week</p>
             </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
             <div className="p-3 bg-green-500/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-400" />
             </div>
             <div>
                <h4 className="font-bold text-2xl">Level 4</h4>
                <p className="text-xs text-slate-400">Skill Profile Rank</p>
             </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
             <div className="p-3 bg-purple-500/20 rounded-full">
                <Award className="w-6 h-6 text-purple-400" />
             </div>
             <div>
                <h4 className="font-bold text-2xl">Top 10%</h4>
                <p className="text-xs text-slate-400">Among Peers</p>
             </div>
          </div>
       </div>
    </div>
  );
};