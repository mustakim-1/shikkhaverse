import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, FileText, Download, PlayCircle, Video, X, Upload, CheckCircle, File, Image as ImageIcon, Mic, Hand, BarChart2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Assignment } from '../types';

export const Classroom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LIVE' | 'HOMEWORK' | 'TEACHER'>('LIVE');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUBMITTED'>('IDLE');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);

  useEffect(() => {
    setAssignments(dataService.getAssignments());
  }, []);

  const [isMicActive, setIsMicActive] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activePoll, setActivePoll] = useState<{question: string, options: {text: string, votes: number}[]} | null>(null);

  
  // Download State
  const [downloadingItems, setDownloadingItems] = useState<Record<string, boolean>>({});
  const [downloadedItems, setDownloadedItems] = useState<Record<string, boolean>>({});

  // Mock materials data
  const materials = [
    { id: '1', name: 'Lecture Slides: Wave Particle Duality', type: 'PDF', size: '2.4 MB', icon: FileText },
    { id: '2', name: 'Class Recording (HD)', type: 'MP4', size: '156 MB', icon: Video },
    { id: '3', name: 'Practice Problem Set 4', type: 'PDF', size: '1.1 MB', icon: File },
    { id: '4', name: 'Diagram Reference Sheet', type: 'JPG', size: '4.2 MB', icon: ImageIcon },
  ];

  const handleDownload = (id: string) => {
    setDownloadingItems(prev => ({ ...prev, [id]: true }));
    // Simulate download
    setTimeout(() => {
        setDownloadingItems(prev => ({ ...prev, [id]: false }));
        setDownloadedItems(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
             setDownloadedItems(prev => ({ ...prev, [id]: false }));
        }, 3000);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId) return;

    setSubmissionStatus('SUBMITTING');
    // Simulate network request
    setTimeout(() => {
        dataService.submitAssignment(selectedAssignmentId);
        setAssignments(dataService.getAssignments());
        setSubmissionStatus('SUBMITTED');
        // Close modal after success message
        setTimeout(() => {
            setIsAssignmentModalOpen(false);
            setSubmissionStatus('IDLE');
            setSelectedAssignmentId(null);
        }, 2000);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-fade-in relative">
      
      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-4">
        <button onClick={() => setActiveTab('LIVE')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'LIVE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Live Class</button>
        <button onClick={() => setActiveTab('HOMEWORK')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'HOMEWORK' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Homework Portal</button>
        <button onClick={() => setActiveTab('TEACHER')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'TEACHER' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Teacher Profile</button>
      </div>

      {activeTab === 'LIVE' && (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-black rounded-2xl overflow-hidden relative aspect-video group shadow-2xl border border-slate-800">
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                        <div className="text-center p-8">
                            <img src="https://picsum.photos/800/450" alt="Class Board" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                            <div className="relative z-10">
                                <PlayCircle className="w-20 h-20 text-white/80 mx-auto mb-4 hover:scale-110 transition-transform cursor-pointer" />
                                <h2 className="text-2xl font-bold text-white">Advanced Physics: Quantum Mechanics</h2>
                                <p className="text-slate-300">Live • 1,420 Students Watching</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                    </div>
                    
                    {/* Live Controls Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10">
                        <button 
                            onClick={() => setIsMicActive(!isMicActive)} 
                            className={`p-3 rounded-lg transition-all ${isMicActive ? 'bg-red-500 text-white' : 'bg-slate-800/80 text-white hover:bg-slate-700'}`}
                            title="Ask Audio Question"
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setIsHandRaised(!isHandRaised)} 
                            className={`p-3 rounded-lg transition-all ${isHandRaised ? 'bg-yellow-500 text-white' : 'bg-slate-800/80 text-white hover:bg-slate-700'}`}
                            title="Raise Hand"
                        >
                            <Hand className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActivePoll({question: "Is the concept of 'Wave-Particle Duality' clear?", options: [{text: "Yes, fully clear", votes: 45}, {text: "Needs more examples", votes: 30}, {text: "No, explain again", votes: 25}]})} 
                            className="p-3 bg-slate-800/80 text-white hover:bg-slate-700 rounded-lg transition-all"
                            title="View Polls"
                        >
                            <BarChart2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Chapter 4: Wave Particle Duality</h3>
                        <p className="text-slate-400 text-sm">Prof. Dr. Rahman • BUET Physics Dept.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsMaterialsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg text-sm border border-blue-500/50 transition-colors font-bold">
                            <Download className="w-4 h-4" /> Download Materials
                        </button>
                        <button onClick={() => setIsAssignmentModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm border border-slate-700 transition-colors">
                            <FileText className="w-4 h-4" /> Assignment
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="w-full lg:w-96 flex flex-col gap-4">
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-l-4 border-emerald-500">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-full">
                            <Users className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Attendance Marked</h4>
                            <p className="text-xs text-slate-400">You joined at 10:02 AM</p>
                        </div>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold">PRESENT</span>
                </div>
                <div className="glass-panel flex-1 rounded-2xl flex flex-col overflow-hidden h-[500px]">
                    <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                        <h4 className="font-bold flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-400" /> Live Chat
                        </h4>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 1.4k online
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Active Poll Display */}
                        {activePoll && (
                            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 mb-4 animate-fade-in-up">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-bold text-sm text-blue-400 flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4" /> Live Poll
                                    </h5>
                                    <button onClick={() => setActivePoll(null)} className="text-slate-400 hover:text-white"><X className="w-3 h-3" /></button>
                                </div>
                                <p className="text-white text-sm font-bold mb-3">{activePoll.question}</p>
                                <div className="space-y-2">
                                    {activePoll.options.map((opt, idx) => (
                                        <div key={idx} className="relative h-8 bg-slate-800 rounded-lg overflow-hidden cursor-pointer hover:bg-slate-700 transition-colors">
                                            <div className="absolute top-0 left-0 h-full bg-blue-500/30 transition-all duration-1000" style={{width: `${opt.votes}%`}}></div>
                                            <div className="absolute inset-0 flex items-center justify-between px-3">
                                                <span className="text-xs font-bold text-slate-200 z-10">{opt.text}</span>
                                                <span className="text-xs text-slate-400 z-10">{opt.votes}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {[
                            { user: "Sarah", text: "Sir, can you explain the photon part again?", color: "text-pink-400", time: "10:15" },
                            { user: "Rafiq", text: "E = hf is the formula right?", color: "text-blue-400", time: "10:16" },
                            { user: "Teacher", text: "Yes Rafiq, correct. Sarah, look at the diagram.", color: "text-emerald-400 font-bold", role: "TEACHER", time: "10:17" },
                            { user: "Admin", text: "Quiz will start in 10 mins.", color: "text-amber-400 font-bold", role: "ADMIN", time: "10:18" },
                            { user: "You", text: "Is the audio clear?", color: "text-slate-300 font-bold", time: "10:19" },
                        ].map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-bold text-xs ${msg.color} flex items-center gap-1`}>
                                        {msg.role === 'TEACHER' && <CheckCircle className="w-3 h-3" />}
                                        {msg.user}
                                    </span>
                                    <span className="text-[10px] text-slate-600">{msg.time}</span>
                                </div>
                                <div className={`px-3 py-2 rounded-xl text-sm max-w-[90%] ${
                                    msg.role === 'TEACHER' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-100' :
                                    msg.role === 'ADMIN' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100' :
                                    msg.user === 'You' ? 'bg-blue-600 text-white' :
                                    'bg-slate-800 text-slate-300'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-slate-900/50 border-t border-slate-800 flex gap-2">
                        <input type="text" placeholder="Type a doubt..." className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        <button className={`p-2 rounded-lg transition-colors ${isMicActive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                            <Mic className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'HOMEWORK' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map(assignment => (
                <div key={assignment.id} className={`glass-panel p-6 rounded-2xl ${assignment.status !== 'PENDING' ? 'opacity-75' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-lg">{assignment.title}</h3>
                            <p className="text-slate-400 text-sm">{assignment.subject} • Due: {assignment.dueDate}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            assignment.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                            assignment.status === 'SUBMITTED' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                        }`}>
                            {assignment.status === 'GRADED' && assignment.grade ? `Graded: ${assignment.grade}` : assignment.status}
                        </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">Complete the attached worksheet and upload your solution.</p>
                    {assignment.status === 'PENDING' ? (
                        <button 
                            onClick={() => {
                                setSelectedAssignmentId(assignment.id);
                                setIsAssignmentModalOpen(true);
                            }} 
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-colors"
                        >
                            Submit Assignment
                        </button>
                    ) : (
                        <button disabled className="w-full py-2 bg-slate-700 rounded-lg font-bold text-slate-400 cursor-not-allowed">
                            {assignment.status === 'SUBMITTED' ? 'Waiting for Grade' : 'View Feedback'}
                        </button>
                    )}
                </div>
            ))}
         </div>
      )}

      {activeTab === 'TEACHER' && (
         <div className="glass-panel p-8 rounded-2xl max-w-3xl mx-auto">
             <div className="flex flex-col md:flex-row items-center gap-8">
                 <div className="w-32 h-32 rounded-full bg-slate-700 overflow-hidden border-4 border-blue-500/30">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Professor" alt="Teacher" />
                 </div>
                 <div className="text-center md:text-left">
                     <h2 className="text-3xl font-bold mb-2">Dr. Ahmed Khan</h2>
                     <p className="text-blue-400 font-bold mb-4">Senior Physics Instructor</p>
                     <div className="flex gap-4 justify-center md:justify-start text-sm text-slate-400 mb-6">
                         <span>🎓 PhD in Physics, DU</span>
                         <span>⭐ 4.9/5 Rating</span>
                         <span>👨‍🏫 15 Years Exp.</span>
                     </div>
                     <p className="text-slate-300 leading-relaxed mb-6">
                         "I believe in teaching the 'Why' before the 'How'. My goal is to make Physics intuitive and fun for every student."
                     </p>
                     <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors border border-slate-600">
                         View Full Profile & Reviews
                     </button>
                 </div>
             </div>
         </div>
      )}
      
      {/* Materials Download Modal */}
      {isMaterialsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
              <button 
                onClick={() => setIsMaterialsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                  <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-400" /> Class Materials
              </h3>
              <p className="text-slate-400 text-sm mb-6">Chapter 4: Wave Particle Duality</p>

              <div className="space-y-3">
                 {materials.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-700 rounded-lg text-blue-400">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200 text-sm">{item.name}</h4>
                                <p className="text-xs text-slate-500">{item.type} • {item.size}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDownload(item.id)}
                            disabled={downloadingItems[item.id] || downloadedItems[item.id]}
                            className={`p-2 rounded-lg transition-all ${
                                downloadedItems[item.id] 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'hover:bg-blue-600 hover:text-white text-slate-400'
                            }`}
                            title="Download"
                        >
                            {downloadingItems[item.id] ? (
                                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : downloadedItems[item.id] ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <Download className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {isAssignmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
             <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
                <button 
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
  
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-400" /> Submit Assignment
                </h3>
                <p className="text-slate-400 text-sm mb-6">Chapter 4: Wave Particle Duality Worksheet</p>
  
                {submissionStatus === 'SUBMITTED' ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 relative">
                            <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
                            <CheckCircle className="w-8 h-8 text-green-400 relative z-10" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Submission Received!</h4>
                        <p className="text-slate-400">Your work has been uploaded successfully for grading.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Written Response (Optional)</label>
                            <textarea 
                              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500 min-h-[100px] resize-none"
                              placeholder="Type your answers or add comments for the teacher here..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Upload File</label>
                            <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-500/5 rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group">
                                <div className="p-3 bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-blue-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-300 group-hover:text-blue-400 transition-colors">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-500 mt-1">PDF, DOCX, JPG (Max 10MB)</p>
                                <input type="file" className="hidden" />
                            </label>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                              type="button" 
                              onClick={() => setIsAssignmentModalOpen(false)}
                              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-slate-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                              type="submit" 
                              disabled={submissionStatus === 'SUBMITTING'}
                              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                {submissionStatus === 'SUBMITTING' ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                      Uploading...
                                    </>
                                ) : (
                                    'Submit Assignment'
                                )}
                            </button>
                        </div>
                    </form>
                )}
             </div>
          </div>
      )}
    </div>
  );
};