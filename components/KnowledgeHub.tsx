import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, ArrowRight, Tag, FlaskConical, Atom, Dna, FileText, Download, Search, Volume2, Plus, X, Send } from 'lucide-react';
import { Article, UserRole } from '../types';
import { dataService } from '../services/dataService';

interface KnowledgeHubProps {
  initialTab?: 'ARTICLES' | 'LIBRARY' | 'VIRTUAL_LAB';
  userRole?: UserRole;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ initialTab = 'ARTICLES', userRole }) => {
  const [activeTab, setActiveTab] = useState<'ARTICLES' | 'LIBRARY' | 'VIRTUAL_LAB'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [newArticle, setNewArticle] = useState<{title: string, category: Article['category'], content: string}>({ title: '', category: 'STUDY_TIPS', content: '' });
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(dataService.getArticles());
  }, []);

  const handlePublish = () => {
    if (!newArticle.title || !newArticle.content) return;
    
    const updatedArticles = dataService.addArticle({
        title: newArticle.title,
        category: newArticle.category,
        content: newArticle.content,
        author: 'Admin User' // In a real app, this would be the current user's name
    });
    setArticles(updatedArticles);
    setIsPublishing(false);
    setNewArticle({ title: '', category: 'STUDY_TIPS', content: '' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
           <h2 className="text-3xl font-bold mb-2">Knowledge Hub</h2>
           <p className="text-slate-400">Your ultimate resource center for learning and growth.</p>
         </div>
         
         <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
            {[
                { id: 'ARTICLES', label: 'Articles', icon: FileText },
                { id: 'LIBRARY', label: 'Digital Library', icon: BookOpen },
                { id: 'VIRTUAL_LAB', label: 'Virtual Lab', icon: FlaskConical }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
         </div>
      </div>

      {/* VIEW: ARTICLES */}
      {activeTab === 'ARTICLES' && (
          <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-200">Latest Insights</h3>
                  <div className="hidden md:flex gap-2">
                      {userRole === UserRole.ADMIN && (
                          <button 
                              onClick={() => setIsPublishing(true)}
                              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors flex items-center gap-2"
                          >
                              <Plus className="w-4 h-4" /> Publish Article
                          </button>
                      )}
                      {['All', 'Study Tips', 'Career', 'Motivation'].map((filter) => (
                          <button key={filter} className="px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 text-sm text-slate-300 transition-colors">
                              {filter}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                      <div key={article.id} className="glass-panel p-0 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group cursor-pointer">
                          <div className="h-48 bg-slate-800 relative overflow-hidden">
                              <img 
                                  src={`https://picsum.photos/seed/${article.id}/800/400`} 
                                  alt={article.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              />
                              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                  {article.category}
                              </div>
                          </div>
                          <div className="p-6">
                              <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                              </div>
                              <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                                  {article.title}
                              </h3>
                              <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                  {article.content}
                              </p>
                              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                  <div className="flex items-center gap-3">
                                      <span className="text-xs text-slate-500">{article.readTime}</span>
                                      <button className="text-slate-400 hover:text-blue-400 transition-colors" title="Read Aloud" aria-label="Read article aloud">
                                           <Volume2 className="w-4 h-4" />
                                      </button>
                                  </div>
                                  <span className="text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                      Read Article <ArrowRight className="w-4 h-4" />
                                  </span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* VIEW: DIGITAL LIBRARY */}
      {activeTab === 'LIBRARY' && (
          <div className="space-y-8 animate-fade-in">
              {/* Search Bar */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                          type="text" 
                          placeholder="Search for books, notes, or question papers..." 
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                      <select className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 flex-1 md:flex-none">
                          <option>Class 11-12</option>
                          <option>Class 9-10</option>
                          <option>Admission</option>
                      </select>
                      <select className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 flex-1 md:flex-none">
                          <option>All Subjects</option>
                          <option>Physics</option>
                          <option>Chemistry</option>
                          <option>Math</option>
                      </select>
                  </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                      { title: 'Textbooks', count: '120+', color: 'from-blue-500/20 to-blue-600/5' },
                      { title: 'Lecture Notes', count: '500+', color: 'from-purple-500/20 to-purple-600/5' },
                      { title: 'Question Bank', count: '2000+', color: 'from-emerald-500/20 to-emerald-600/5' },
                      { title: 'Solution Guides', count: '350+', color: 'from-orange-500/20 to-orange-600/5' }
                  ].map((cat, i) => (
                      <div key={i} className={`p-6 rounded-xl border border-slate-700 bg-gradient-to-br ${cat.color} hover:border-slate-500 transition-all cursor-pointer`}>
                          <h4 className="font-bold text-lg mb-1">{cat.title}</h4>
                          <p className="text-slate-400 text-sm">{cat.count} Resources</p>
                      </div>
                  ))}
              </div>

              {/* Resource List */}
              <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" /> Recent Uploads
                  </h3>
                  <div className="space-y-3">
                      {[
                          { title: 'HSC Physics 1st Paper - Tapan Sir', type: 'PDF Book', size: '25 MB', downloads: '12k' },
                          { title: 'Organic Chemistry Roadmap Note', type: 'Handwritten Note', size: '5 MB', downloads: '8.5k' },
                          { title: 'BUET Admission Test 2023 Question', type: 'Question Paper', size: '2 MB', downloads: '15k' },
                          { title: 'Biology Chapter 5 Mindmap', type: 'Infographic', size: '1.2 MB', downloads: '3k' }
                      ].map((item, i) => (
                          <div key={i} className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:bg-slate-800/80 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                      <FileText className="w-6 h-6" />
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                      <p className="text-xs text-slate-400">{item.type} • {item.size} • {item.downloads} downloads</p>
                                  </div>
                              </div>
                              <button className="p-3 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-all" aria-label={`Download ${item.title}`}>
                                  <Download className="w-5 h-5" />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* VIEW: VIRTUAL LAB */}
      {activeTab === 'VIRTUAL_LAB' && (
          <div className="space-y-8 animate-fade-in">
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                  <div className="relative z-10 max-w-2xl">
                      <h3 className="text-3xl font-bold mb-4">Interactive Virtual Laboratory</h3>
                      <p className="text-indigo-200 mb-6 text-lg">
                          Perform complex experiments safely from your device. Visualize concepts in 3D and gather real-time data.
                      </p>
                      <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                          Explore All Simulations
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Physics Card */}
                  <div className="glass-panel p-6 rounded-2xl border-t-4 border-blue-500 hover:-translate-y-1 transition-transform">
                      <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                          <Atom className="w-8 h-8 text-blue-400" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Physics Lab</h4>
                      <p className="text-slate-400 text-sm mb-6">Mechanics, Optics, Electricity & Magnetism simulations.</p>
                      <div className="space-y-2">
                          {['Pendulum Motion', 'Ohm\'s Law Circuit', 'Projectile Motion'].map((sim, i) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg text-sm hover:bg-slate-800 cursor-pointer">
                                  <span>{sim}</span>
                                  <ArrowRight className="w-4 h-4 text-slate-500" />
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Chemistry Card */}
                  <div className="glass-panel p-6 rounded-2xl border-t-4 border-purple-500 hover:-translate-y-1 transition-transform">
                      <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                          <FlaskConical className="w-8 h-8 text-purple-400" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Chemistry Lab</h4>
                      <p className="text-slate-400 text-sm mb-6">Titration, Organic Reactions, Periodic Table visualization.</p>
                      <div className="space-y-2">
                          {['Acid-Base Titration', 'Molecule Builder', 'Gas Laws'].map((sim, i) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg text-sm hover:bg-slate-800 cursor-pointer">
                                  <span>{sim}</span>
                                  <ArrowRight className="w-4 h-4 text-slate-500" />
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Biology Card */}
                  <div className="glass-panel p-6 rounded-2xl border-t-4 border-emerald-500 hover:-translate-y-1 transition-transform">
                      <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                          <Dna className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Biology Lab</h4>
                      <p className="text-slate-400 text-sm mb-6">Cell Structure, Genetics, Human Anatomy models.</p>
                      <div className="space-y-2">
                          {['Cell Division (Mitosis)', 'DNA Replication', 'Human Heart 3D'].map((sim, i) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg text-sm hover:bg-slate-800 cursor-pointer">
                                  <span>{sim}</span>
                                  <ArrowRight className="w-4 h-4 text-slate-500" />
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* PUBLISH MODAL */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Publish New Article</h3>
              <button onClick={() => setIsPublishing(false)} className="text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Article Title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Category</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({...newArticle, category: e.target.value as Article['category']})}
                >
                  <option value="STUDY_TIPS">Study Tips</option>
                  <option value="CAREER">Career</option>
                  <option value="MOTIVATION">Motivation</option>
                  <option value="LIFE_SKILLS">Life Skills</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">Content</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-40 resize-none"
                  placeholder="Write your article content here..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setIsPublishing(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePublish}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
