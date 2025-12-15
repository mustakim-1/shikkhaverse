import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Heart, Share2, MessageCircle, Trophy, Medal, Crown, Calendar, Clock, Video, ArrowLeft, Zap, ThumbsUp, Send } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Post, ClubMessage } from '../types';

export const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CLUBS' | 'FORUM' | 'MENTORSHIP' | 'LEADERBOARD'>('CLUBS');
  const [selectedClub, setSelectedClub] = useState<any | null>(null);
  const [messages, setMessages] = useState<ClubMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [discussionThreads, setDiscussionThreads] = useState<Post[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    setDiscussionThreads(dataService.getPosts());
  }, []);

  const handleJoinClub = (club: any) => {
    setSelectedClub(club);
    setMessages(dataService.getClubMessages(club.id));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedClub) return;
    const updated = dataService.sendClubMessage(selectedClub.id, 'You', chatInput);
    setMessages(updated);
    setChatInput('');
  };

  const handleCreatePost = () => {
    if (!newThreadContent.trim()) return;
    dataService.createPost("You", newThreadContent);
    setDiscussionThreads(dataService.getPosts());
    setNewThreadContent('');
  };

  const handleLikePost = (id: number) => {
    const updated = dataService.likePost(id);
    setDiscussionThreads(updated);
  };

  const handleAddComment = (postId: number) => {
    if (!replyContent.trim()) return;
    dataService.addComment(postId, "You", replyContent);
    setDiscussionThreads(dataService.getPosts());
    setReplyContent('');
  };

  const clubs = [
    { id: 1, name: "Debate Club", members: "1.2k", color: "from-blue-600 to-indigo-600", desc: "Master the art of argumentation. Weekly topics on current affairs.", nextSession: "Today, 4:00 PM", topic: "AI vs Human Creativity" },
    { id: 2, name: "Coding Society", members: "850", color: "from-emerald-600 to-teal-600", desc: "Python, JS, and Competitive Programming.", nextSession: "Tomorrow, 8:00 PM", topic: "LeetCode Hard Challenges" },
    { id: 3, name: "English Spoken", members: "2.5k", color: "from-purple-600 to-pink-600", desc: "Practice fluency daily. 1-on-1 sessions.", nextSession: "Sat, 10:00 AM", topic: "Public Speaking Workshop" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="flex flex-col md:flex-row items-center justify-between gap-4">
         <div>
           <h2 className="text-2xl font-bold">Community Hub</h2>
           <p className="text-slate-400">Collaborate, discuss, and grow together.</p>
         </div>
         <div className="bg-slate-900 p-1 rounded-xl flex gap-1 overflow-x-auto max-w-full">
            <button 
              onClick={() => setActiveTab('CLUBS')}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'CLUBS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Clubs
            </button>
            <button 
              onClick={() => setActiveTab('FORUM')}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'FORUM' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Forum
            </button>
            <button 
              onClick={() => setActiveTab('MENTORSHIP')}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'MENTORSHIP' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mentorship
            </button>
            <button 
              onClick={() => setActiveTab('LEADERBOARD')}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'LEADERBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3 h-3" /> Leaderboard
            </button>
         </div>
       </div>

       {activeTab === 'CLUBS' && (
         <div className="animate-fade-in">
             {selectedClub ? (
                 <div className="space-y-6">
                     <button onClick={() => setSelectedClub(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
                         <ArrowLeft className="w-4 h-4" /> Back to Clubs
                     </button>
                     
                     {/* Club Header */}
                     <div className={`h-48 rounded-3xl bg-gradient-to-r ${selectedClub.color} relative p-8 flex items-end shadow-2xl`}>
                         <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-md text-white font-bold px-4 py-2 rounded-full flex items-center gap-2">
                             <Users className="w-4 h-4" /> {selectedClub.members} Members
                         </div>
                         <div>
                             <h2 className="text-4xl font-bold text-white mb-2">{selectedClub.name}</h2>
                             <p className="text-white/80 max-w-xl">{selectedClub.desc}</p>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         {/* Main Activity Area */}
                         <div className="lg:col-span-2 space-y-6">
                             <div className="glass-panel p-6 rounded-2xl border-l-4 border-blue-500">
                                 <div className="flex justify-between items-start mb-4">
                                     <div>
                                         <h3 className="font-bold text-lg text-white">Next Live Session</h3>
                                         <p className="text-slate-400">{selectedClub.topic}</p>
                                     </div>
                                     <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">UPCOMING</span>
                                 </div>
                                 <div className="flex gap-6 text-sm text-slate-300 mb-6">
                                     <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> {selectedClub.nextSession.split(',')[0]}</span>
                                     <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> {selectedClub.nextSession.split(',')[1]}</span>
                                 </div>
                                 <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                     <Video className="w-5 h-5" /> Join Waiting Room
                                 </button>
                             </div>

                             {/* Discussion Feed */}
                             {/* Live Club Chat */}
                            <div className="glass-panel p-6 rounded-2xl flex flex-col h-[500px]">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-green-400" /> Live Club Chat
                                </h3>
                                
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-xl ${
                                                msg.isSystem ? 'bg-slate-800/50 text-center w-full text-xs text-slate-400 italic' :
                                                msg.user === 'You' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
                                            }`}>
                                                {!msg.isSystem && msg.user !== 'You' && (
                                                    <div className="text-xs font-bold text-blue-400 mb-1">{msg.user}</div>
                                                )}
                                                <p className="text-sm">{msg.content}</p>
                                                {!msg.isSystem && (
                                                    <div className="text-[10px] opacity-70 mt-1 text-right">{msg.timestamp}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div className="text-center text-slate-500 py-10">
                                            No messages yet. Start the conversation!
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Type a message..."
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        className="p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors"
                                        aria-label="Send message"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                         </div>

                         {/* Sidebar */}
                         <div className="space-y-6">
                             <div className="glass-panel p-6 rounded-2xl">
                                 <h3 className="font-bold text-lg mb-4">Club Resources</h3>
                                 <div className="space-y-3">
                                     {['Rulebook.pdf', 'Weekly_Schedule.jpg', 'Reading_List_2024.pdf'].map((file, i) => (
                                         <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors group">
                                             <div className="p-2 bg-slate-800 rounded text-blue-400 group-hover:text-white transition-colors">
                                                 <MessageSquare className="w-4 h-4" /> 
                                             </div>
                                             <span className="text-sm text-slate-300">{file}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                        <div key={club.id} className="glass-panel p-0 rounded-2xl overflow-hidden group hover:ring-2 ring-blue-500/50 transition-all cursor-pointer" onClick={() => handleJoinClub(club)}>
                           <div className={`h-32 bg-gradient-to-r ${club.color} relative p-6 flex items-end`}>
                              <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Users className="w-3 h-3" /> {club.members}
                              </div>
                              <h3 className="text-2xl font-bold text-white relative z-10">{club.name}</h3>
                           </div>
                           <div className="p-6">
                              <p className="text-slate-400 text-sm mb-6 leading-relaxed h-10 line-clamp-2">
                                {club.desc}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                   {[1,2,3].map(i => (
                                     <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800"></div>
                                   ))}
                                </div>
                                <button className="px-4 py-2 bg-slate-800 group-hover:bg-white group-hover:text-slate-900 text-white text-sm font-bold rounded-lg transition-all border border-slate-700">
                                   Enter Club
                                </button>
                              </div>
                           </div>
                        </div>
                    ))}
                 </div>
             )}
         </div>
       )}

       {activeTab === 'FORUM' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Forum List */}
             <div className="lg:col-span-2 space-y-4">
                 {/* New Post Input */}
                 <div className="glass-panel p-4 rounded-xl flex gap-2">
                     <input 
                        type="text" 
                        placeholder="Ask a question or start a discussion..." 
                        className="flex-1 bg-slate-800 border-none rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newThreadContent}
                        onChange={(e) => setNewThreadContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreatePost();
                        }}
                     />
                     <button 
                        onClick={handleCreatePost}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                     >
                        Post
                     </button>
                 </div>

                 {discussionThreads.map((thread, idx) => (
                    <div key={thread.id} className="glass-panel p-6 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer group animate-fade-in" onClick={() => setExpandedPostId(expandedPostId === thread.id ? null : thread.id)}>
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300`}>
                             General
                          </span>
                       </div>
                       <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{thread.content}</h3>
                       <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Posted by {thread.user} • {thread.time}</span>
                          <div className="flex items-center gap-4">
                             <span className="flex items-center gap-1 hover:text-slate-300"><MessageSquare className="w-4 h-4" /> {thread.replies}</span>
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleLikePost(thread.id); }}
                                className="flex items-center gap-1 hover:text-red-400 transition-colors"
                             >
                                <Heart className={`w-4 h-4 ${thread.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} /> {thread.likes}
                             </button>
                             <span className="flex items-center gap-1 hover:text-blue-400"><Share2 className="w-4 h-4" /> Share</span>
                          </div>
                       </div>
                       
                       {/* Comments Section */}
                       {expandedPostId === thread.id && (
                           <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in cursor-default" onClick={e => e.stopPropagation()}>
                               <div className="space-y-3 mb-4">
                                   {thread.comments?.map(comment => (
                                       <div key={comment.id} className="bg-slate-900/50 p-3 rounded-lg">
                                           <div className="flex justify-between text-xs text-slate-400 mb-1">
                                               <span className="font-bold text-blue-400">{comment.user}</span>
                                               <span>{comment.time}</span>
                                           </div>
                                           <p className="text-sm text-slate-300">{comment.content}</p>
                                       </div>
                                   ))}
                               </div>
                               <div className="flex gap-2">
                                   <input 
                                       type="text" 
                                       placeholder="Write a reply..."
                                       className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                       value={replyContent}
                                       onChange={(e) => setReplyContent(e.target.value)}
                                       onKeyDown={(e) => e.key === 'Enter' && handleAddComment(thread.id)}
                                   />
                                   <button 
                                       onClick={() => handleAddComment(thread.id)}
                                       className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                                   >
                                       <Zap className="w-4 h-4 fill-white" />
                                   </button>
                               </div>
                           </div>
                       )}
                    </div>
                 ))}
             </div>

             {/* Sidebar Info */}
             <div className="space-y-6">
                 <div className="glass-panel p-6 rounded-2xl bg-gradient-to-b from-blue-900/20 to-slate-900/50">
                    <h3 className="font-bold mb-4">Community Rules</h3>
                    <ul className="space-y-3 text-sm text-slate-400 list-disc list-inside">
                       <li>Be respectful to teachers & peers.</li>
                       <li>No spam or promotional content.</li>
                       <li>Search before posting doubts.</li>
                       <li>Use English or Bangla only.</li>
                    </ul>
                 </div>
                 
                 <div className="glass-panel p-6 rounded-2xl">
                     <h3 className="font-bold mb-4">Top Contributors</h3>
                     {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3 mb-4 last:mb-0">
                           <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                           <div>
                              <div className="text-sm font-bold">User_{i}99</div>
                              <div className="text-xs text-emerald-400">1,240 Helps</div>
                           </div>
                        </div>
                     ))}
                 </div>
             </div>
         </div>
       )}

       {activeTab === 'MENTORSHIP' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" /> 
                  Expert Mentors
               </h3>
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                     <div key={i} className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                        <div className="flex-1">
                           <h4 className="font-bold">Dr. Mentor {i}</h4>
                           <p className="text-xs text-slate-400">Physics Expert • BUET Alumni</p>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors">Book Session</button>
                     </div>
                  ))}
               </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  1-on-1 Doubt Solving
               </h3>
               <div className="bg-slate-900/50 p-6 rounded-xl text-center border border-dashed border-slate-700">
                  <p className="text-slate-400 mb-4">Stuck on a problem? Connect with a mentor instantly.</p>
                  <button className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-colors w-full">
                     Request Live Help
                  </button>
                  <p className="text-xs text-slate-500 mt-2">Average wait time: 2 mins</p>
               </div>
            </div>
         </div>
       )}

       {activeTab === 'LEADERBOARD' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Top 3 Podium */}
            <div className="lg:col-span-3 mb-4">
                <div className="flex items-end justify-center gap-4 h-64">
                    {/* 2nd Place */}
                    <div className="w-32 bg-slate-800/50 rounded-t-2xl border-t-4 border-slate-400 p-4 flex flex-col items-center justify-end h-48 relative animate-slide-up" style={{animationDelay: '0.1s'}}>
                        <div className="absolute -top-10">
                            <div className="w-16 h-16 rounded-full border-4 border-slate-400 overflow-hidden bg-slate-700">
                                <img src="https://ui-avatars.com/api/?name=Rahim+A&background=random" alt="2nd" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-slate-400 text-slate-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-800">2</div>
                        </div>
                        <h4 className="font-bold text-slate-200 mt-8">Rahim A.</h4>
                        <p className="text-xs text-slate-400">12,450 XP</p>
                    </div>

                    {/* 1st Place */}
                    <div className="w-40 bg-gradient-to-b from-yellow-500/20 to-slate-800/50 rounded-t-2xl border-t-4 border-yellow-400 p-4 flex flex-col items-center justify-end h-60 relative z-10 animate-slide-up">
                        <div className="absolute -top-12">
                            <Crown className="w-8 h-8 text-yellow-400 absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce" />
                            <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden bg-slate-700 shadow-xl shadow-yellow-500/20">
                                <img src="https://ui-avatars.com/api/?name=Sarah+K&background=random" alt="1st" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-800">1</div>
                        </div>
                        <h4 className="font-bold text-yellow-400 mt-10 text-lg">Sarah K.</h4>
                        <p className="text-sm text-yellow-200/70 font-bold">15,200 XP</p>
                    </div>

                    {/* 3rd Place */}
                    <div className="w-32 bg-slate-800/50 rounded-t-2xl border-t-4 border-amber-700 p-4 flex flex-col items-center justify-end h-40 relative animate-slide-up" style={{animationDelay: '0.2s'}}>
                        <div className="absolute -top-10">
                            <div className="w-16 h-16 rounded-full border-4 border-amber-700 overflow-hidden bg-slate-700">
                                <img src="https://ui-avatars.com/api/?name=Tanvir+H&background=random" alt="3rd" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-amber-700 text-amber-100 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-800">3</div>
                        </div>
                        <h4 className="font-bold text-slate-200 mt-8">Tanvir H.</h4>
                        <p className="text-xs text-slate-400">11,800 XP</p>
                    </div>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="lg:col-span-2 space-y-4">
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" /> Weekly Top Performers
                    </h3>
                    <div className="space-y-2">
                        {[4,5,6,7,8,9,10].map((rank) => (
                            <div key={rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono font-bold text-slate-500 w-6 text-center">{rank}</span>
                                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                                         <img src={`https://ui-avatars.com/api/?name=User+${rank}&background=random`} alt="User" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-200 text-sm">Student {rank}</h4>
                                        <p className="text-xs text-slate-400">Dhaka College</p>
                                    </div>
                                </div>
                                <div className="font-bold text-blue-400 text-sm">
                                    {10000 - (rank * 200)} XP
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Your Rank & Stats */}
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/30">
                    <h3 className="font-bold text-slate-300 mb-2 uppercase text-xs tracking-wider">Your Ranking</h3>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-bold text-white">#42</span>
                        <span className="text-sm text-emerald-400 font-bold mb-1 flex items-center gap-1">
                             ▲ 5 places up
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">You need 150 XP to reach #41.</p>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-blue-500 w-[75%]"></div>
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-lg text-white font-bold text-sm shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 fill-current" /> Claim Daily Bonus (+50 XP)
                    </button>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Medal className="w-5 h-5 text-purple-400" /> Earned Badges
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { name: 'Early Bird', icon: '🌅', color: 'bg-orange-500/20 text-orange-400 border-orange-500/20' },
                            { name: 'Problem Solver', icon: '🧩', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
                            { name: 'Team Player', icon: '🤝', color: 'bg-green-500/20 text-green-400 border-green-500/20' },
                            { name: 'Night Owl', icon: '🦉', color: 'bg-purple-500/20 text-purple-400 border-purple-500/20' },
                            { name: 'Quiz Master', icon: '📝', color: 'bg-red-500/20 text-red-400 border-red-500/20' },
                        ].map((badge, i) => (
                            <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border ${badge.color} cursor-help`} title={badge.name}>
                                <span className="text-2xl mb-1">{badge.icon}</span>
                                <span className="text-[10px] font-bold text-center leading-tight">{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
         </div>
       )}
    </div>
  );
};