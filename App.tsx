import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Brain, 
  FlaskConical, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  Users,
  FileText,
  Zap,
  User as UserIcon,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Shield,
  Settings,
  Activity,
  AlertCircle
} from 'lucide-react';
import { ViewState, UserRole, User } from './types';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import AIMentor from './components/AIChat';
import { Classroom } from './components/Classroom';
// import { VirtualLab } from './components/VirtualLab'; // Integrated into KnowledgeHub
import { Exams } from './components/Exams';
import { Community } from './components/Community';
import { Skills } from './components/Skills';
import { Profile } from './components/Profile';
import { Notifications } from './components/Notifications';
import { authService } from './services/authService';

import { Subscription } from './components/Subscription';
import { KnowledgeHub } from './components/KnowledgeHub';
import { ParentDashboard } from './components/ParentDashboard';

// ==========================================
// AUTH COMPONENTS
// ==========================================

const BackgroundAnimation = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px] animate-float" style={{animationDelay: '2s'}}></div>
    </div>
);

const LoginScreen: React.FC<{ onLogin: (user: User) => void, onSwitchToRegister: () => void }> = ({ onLogin, onSwitchToRegister }) => {
  const [id, setId] = useState('ST-2024-882');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    const result = authService.login(id, password);
    if (result.success && result.user) {
        onLogin(result.user);
    } else {
        setError(result.message || "Login failed.");
    }
  };

  const demoLogin = (role: 'STUDENT' | 'ADMIN') => {
      if (role === 'STUDENT') {
          setId('ST-2024-882');
          setPassword('password');
      } else {
          setId('ADMIN');
          setPassword('admin123');
      }
      setTimeout(handleLogin, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
        <BackgroundAnimation />

        <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md z-10 mx-4 border border-slate-700/50 shadow-2xl animate-fade-in">
        <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">ShikkhaVerse</h1>
            <p className="text-slate-400">The Ethical Smart Learning Ecosystem</p>
        </div>

        {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-200 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4" /> {error}
            </div>
        )}

        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">User ID / Student ID</label>
            <input 
                type="text" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="ST-2024-001 or ADMIN" 
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="••••••••" 
            />
            </div>
            <button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
            Enter Platform
            </button>
        </div>
        
        {/* Quick Demo Buttons for Presentation */}
        <div className="mt-4 flex justify-center gap-3">
            <button 
                onClick={() => demoLogin('STUDENT')}
                className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 transition-colors"
            >
                🚀 Demo Student
            </button>
            <button 
                onClick={() => demoLogin('ADMIN')}
                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/20 transition-colors"
            >
                🛡️ Demo Admin
            </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm mb-4">Don't have a Student ID?</p>
            <button 
                onClick={onSwitchToRegister}
                className="w-full py-3 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-300 font-bold transition-colors"
            >
                Create New Account
            </button>
        </div>
        </div>
    </div>
  );
};

const educationSystems = [
  { 
    id: 'bangla', 
    label: 'Bangla Medium (General)', 
    levels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5 (PSC)', 'Class 6', 'Class 7', 'Class 8 (JSC)', 'Class 9 (Science)', 'Class 9 (Commerce)', 'Class 9 (Arts)', 'Class 10 (SSC)', 'HSC (Science)', 'HSC (Commerce)', 'HSC (Arts)'] 
  },
  { 
    id: 'english_ver', 
    label: 'English Version', 
    levels: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'HSC'] 
  },
  { 
    id: 'english_med', 
    label: 'English Medium', 
    levels: ['Standard 1-5', 'Standard 6-8', 'O Level', 'A Level'] 
  },
  { 
    id: 'madrasah', 
    label: 'Madrasah', 
    levels: ['Ibtidayee', 'Dakhil', 'Alim'] 
  },
  {
    id: 'uni',
    label: 'Higher Education',
    levels: ['University Admission', 'Undergraduate', 'Postgraduate']
  }
];

const RegisterScreen: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [generatedId, setGeneratedId] = useState('');
  
  const [selectedSystem, setSelectedSystem] = useState(educationSystems[0].id);
  const [formData, setFormData] = useState({
    name: '',
    level: educationSystems[0].levels[11], // Default to Class 10
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT // Default
  });

  // Update level options when system changes
  const currentLevels = educationSystems.find(s => s.id === selectedSystem)?.levels || [];

  useEffect(() => {
    setFormData(prev => ({ ...prev, level: currentLevels[0] }));
  }, [selectedSystem]);

  const handleRegister = () => {
    if (!formData.name || !formData.password) {
        alert("Please fill in all fields.");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const newId = `ST-${year}-${randomNum}`;
    
    // Create new user object
    const newUser: User = {
        id: newId,
        name: formData.name,
        role: formData.role,
        password: formData.password,
        level: formData.level,
        educationSystem: selectedSystem,
        points: 0,
        joinedDate: new Date().toLocaleDateString('en-GB')
    };

    const result = authService.register(newUser);

    if (result.success) {
        setGeneratedId(newId);
        setStep('SUCCESS');
    } else {
        alert(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      <BackgroundAnimation />

      <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md z-10 mx-4 border border-slate-700/50 shadow-2xl animate-fade-in">
        {step === 'FORM' ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Join ShikkhaVerse</h1>
              <p className="text-slate-400">Choose your path and start learning.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    placeholder="e.g. Rahim Uddin" 
                />
              </div>

              {/* Education Category Selection */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Education Category</label>
                   <div className="relative">
                     <select 
                        value={selectedSystem}
                        onChange={(e) => setSelectedSystem(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                     >
                        {educationSystems.map(sys => (
                            <option key={sys.id} value={sys.id}>{sys.label}</option>
                        ))}
                     </select>
                     <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Class / Level</label>
                   <div className="relative">
                    <select 
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                    >
                        {currentLevels.map(lvl => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                    </select>
                    <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Create Password</label>
                <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    placeholder="Min 8 characters" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Confirm Password</label>
                <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    placeholder="Re-enter password" 
                />
              </div>
              
              <button 
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-2"
              >
                Generate Student ID & Join
              </button>
            </div>
            
            <div className="mt-6 text-center">
                <button onClick={onSwitchToLogin} className="text-slate-400 hover:text-white text-sm font-bold">
                    Already have an ID? Login
                </button>
            </div>
          </>
        ) : (
          <div className="text-center animate-fade-in py-4">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping"></div>
                <CheckCircle className="w-12 h-12 text-emerald-400 relative z-10" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">Welcome, {formData.name.split(' ')[0]}!</h2>
             <p className="text-slate-400 mb-2">Your educational profile is ready.</p>
             <p className="text-emerald-400 font-bold text-sm mb-6">{formData.level} • {educationSystems.find(s => s.id === selectedSystem)?.label}</p>
             
             <div className="bg-slate-950/80 border border-slate-700 p-8 rounded-2xl mb-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold">Your Unique Student ID</p>
                <div className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-wider select-all">
                    {generatedId}
                </div>
                <p className="text-xs text-slate-600 mt-3">Please save this ID. You will need it to login.</p>
             </div>

             <button 
                onClick={onSwitchToLogin}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
             >
                Proceed to Login <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle successful login
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    // Set default view based on role
    if (user.role === UserRole.ADMIN) {
        setCurrentView(ViewState.ADMIN_DASHBOARD);
    } else {
        setCurrentView(ViewState.DASHBOARD);
    }
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
  };

  // AUTH FLOW
  if (!isLoggedIn) {
    if (authMode === 'REGISTER') {
        return <RegisterScreen onSwitchToLogin={() => setAuthMode('LOGIN')} />;
    }
    return <LoginScreen onLogin={handleLoginSuccess} onSwitchToRegister={() => setAuthMode('REGISTER')} />;
  }

  // MAIN APP UI
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === view 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30 font-semibold' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className={`p-2 rounded-lg ${currentUser?.role === UserRole.ADMIN ? 'bg-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                {currentUser?.role === UserRole.ADMIN ? <Shield className="w-6 h-6 text-white" /> : <GraduationCap className="w-6 h-6 text-white" />}
            </div>
            <div>
                <span className="text-xl font-bold tracking-tight block leading-none">ShikkhaVerse</span>
                {currentUser?.role === UserRole.ADMIN && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Administrator</span>}
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {currentUser?.role === UserRole.ADMIN ? (
                <>
                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-4 uppercase tracking-wider">Management</div>
                    <NavItem view={ViewState.ADMIN_DASHBOARD} icon={LayoutDashboard} label="Overview" />
                    <NavItem view={ViewState.COMMUNITY} icon={Users} label="User Control" />
                    <NavItem view={ViewState.CLASSROOM} icon={Settings} label="System Settings" />
                    
                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-6 uppercase tracking-wider">Monitoring</div>
                    <NavItem view={ViewState.AI_MENTOR} icon={Activity} label="AI Logs" />
                    <NavItem view={ViewState.EXAMS} icon={FileText} label="Content Review" />
                </>
            ) : (
                <>
                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-4 uppercase tracking-wider">Learning</div>
                    <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
                    <NavItem view={ViewState.CLASSROOM} icon={GraduationCap} label="Live Classes" />
                    <NavItem view={ViewState.VIRTUAL_LAB} icon={FlaskConical} label="Virtual Lab" />
                    
                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-6 uppercase tracking-wider">Assessment</div>
                    <NavItem view={ViewState.EXAMS} icon={FileText} label="Exams & Quiz" />
                    <NavItem view={ViewState.AI_MENTOR} icon={Brain} label="AI Mentor" />

                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-6 uppercase tracking-wider">Growth</div>
                    <NavItem view={ViewState.COMMUNITY} icon={Users} label="Community" />
                    <NavItem view={ViewState.SKILLS} icon={Zap} label="Skills" />
                    <NavItem view={ViewState.KNOWLEDGE_HUB} icon={BookOpen} label="Knowledge Hub" />

                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-6 uppercase tracking-wider">Account</div>
                    <NavItem view={ViewState.SUBSCRIPTION} icon={Zap} label="Subscription" />
                    <NavItem view={ViewState.PARENT_DASHBOARD} icon={Users} label="Parent Access" />
                    <NavItem view={ViewState.PROFILE} icon={UserIcon} label="My Profile" />
                </>
            )}
          </nav>

          <div className="pt-6 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-[#0f172a]/90 backdrop-blur-md z-40">
           <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                 <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">ShikkhaVerse</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
           {/* Top Bar (Desktop) */}
           <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-2xl font-bold text-white capitalize">{currentView.replace('_', ' ').toLowerCase()}</h2>
                 <p className="text-slate-400 text-sm">Welcome back, {currentUser?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search..." className="bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64 transition-all" />
                 </div>
                 <button className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></span>
                 </button>
              </div>
           </div>

           {currentView === ViewState.DASHBOARD && currentUser && <Dashboard currentUser={currentUser} />}
           {currentView === ViewState.ADMIN_DASHBOARD && <AdminDashboard />}
           {currentView === ViewState.CLASSROOM && <Classroom />}
           {currentView === ViewState.AI_MENTOR && <AIMentor currentUser={currentUser} />}
           {currentView === ViewState.VIRTUAL_LAB && <KnowledgeHub initialTab="VIRTUAL_LAB" userRole={currentUser?.role} />}
           {currentView === ViewState.EXAMS && <Exams />}
           {currentView === ViewState.COMMUNITY && <Community />}
           {currentView === ViewState.SKILLS && <Skills />}
           {currentView === ViewState.PROFILE && currentUser && <Profile currentUser={currentUser} onLogout={handleLogout} />}
           {currentView === ViewState.SUBSCRIPTION && <Subscription />}
           {currentView === ViewState.KNOWLEDGE_HUB && <KnowledgeHub userRole={currentUser?.role} />}
           {currentView === ViewState.PARENT_DASHBOARD && <ParentDashboard />}
        </div>
      </main>
      
      {/* Global AI Chatbot */}
    </div>
  );
};

export default App;
