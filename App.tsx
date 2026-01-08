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
  Trophy,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Shield,
  Settings,
  Activity,
  AlertCircle,
  Phone
} from 'lucide-react';
import { ViewState, UserRole, User, Language } from './types';
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
import { Wellness } from './components/Wellness';
import { Gamification } from './components/Gamification';
import { authService } from './services/authService';
import { dataService } from './services/dataService';
import { translationService } from './services/translationService';

import { Subscription } from './components/Subscription';
import { KnowledgeHub } from './components/KnowledgeHub';
import { ParentDashboard } from './components/ParentDashboard';
import { GlobalAIAssistant } from './components/GlobalAIAssistant';

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
  const [isParentLogin, setIsParentLogin] = useState(false);

  const handleLogin = () => {
    setError(null);
    const result = authService.login(id, password, isParentLogin);
    if (result.success && result.user) {
        onLogin(result.user);
    } else {
        setError(result.message || "Login failed.");
    }
  };

  const demoLogin = (role: 'STUDENT' | 'ADMIN' | 'PARENT') => {
      if (role === 'STUDENT') {
          setIsParentLogin(false);
          setId('ST-2024-882');
          setPassword('password');
      } else if (role === 'ADMIN') {
          setIsParentLogin(false);
          setId('ADMIN');
          setPassword('admin123');
      } else if (role === 'PARENT') {
          setIsParentLogin(true);
          setId('ST-2024-882');
          setPassword('parent123');
      }
      setTimeout(handleLogin, 100);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] relative overflow-y-auto flex flex-col items-center py-20">
        <BackgroundAnimation />

        <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md z-10 mx-4 border border-slate-700/50 shadow-2xl animate-fade-in relative">
        <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">BRIGHT BD</h1>
            <p className="text-slate-400">The Ethical Smart Learning Ecosystem</p>
        </div>

        {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-200 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4" /> {error}
            </div>
        )}

        <div className="space-y-4">
            {/* Login Type Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                    onClick={() => setIsParentLogin(false)}
                    className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-all ${!isParentLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Student Login
                </button>
                <button
                    onClick={() => setIsParentLogin(true)}
                    className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-all ${isParentLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Parent Login
                </button>
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
                {isParentLogin ? 'Student ID' : 'User ID / Student ID'}
            </label>
            <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder={isParentLogin ? "e.g. ST-2024-882" : "ST-2024-001 or ADMIN"}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
                {isParentLogin ? 'Parent Code' : 'Password'}
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder={isParentLogin ? "parent123" : "••••••••"}
            />
            </div>
            <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
            {isParentLogin ? 'Access Parent Dashboard' : 'Enter Platform'}
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
            <button
                onClick={() => demoLogin('PARENT')}
                className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20 transition-colors"
            >
                👨‍👩‍👧 Demo Parent
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
    parentPhone: '',
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
        parentPhone: formData.parentPhone,
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
    <div className="min-h-screen w-full bg-[#0f172a] relative overflow-y-auto flex flex-col items-center py-20">
      <BackgroundAnimation />

      <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md z-10 mx-4 border border-slate-700/50 shadow-2xl animate-fade-in relative">
        {step === 'FORM' ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Join BRIGHT BD</h1>
              <p className="text-slate-400">The Future of Smart Learning in Bangladesh</p>
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

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Parent's Phone Number (for Emergency SOS)</label>
                <div className="relative">
                  <input 
                      type="tel" 
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors pl-12" 
                      placeholder="e.g. 01712345678" 
                  />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 italic">Emergency alerts will be sent to this number.</p>
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
             <h2 className="text-3xl font-bold text-white mb-2">Welcome to BRIGHT BD, {formData.name.split(' ')[0]}!</h2>
             <p className="text-slate-400 mb-2">Your educational profile is ready.</p>
             <p className="text-emerald-400 font-bold text-sm mb-6">{formData.level} • {educationSystems.find(s => s.id === selectedSystem)?.label}</p>
             
             <div className="bg-slate-950/80 border border-slate-700 p-8 rounded-2xl mb-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold">Your Unique Student ID</p>
                <div className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-wider select-all">
                    {generatedId}
                </div>
                <p className="text-xs text-slate-600 mt-3">Please save this ID. You will need it to login to BRIGHT BD.</p>
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
  const [language, setLanguage] = useState<Language>(translationService.getLanguage());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ posts: any[], articles: any[], classes: any[] } | null>(null);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [sosStatus, setSosStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');

  const t = (key: string) => translationService.t(key);

  // Initialize session on mount
  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      if (user.role === UserRole.ADMIN) {
        setCurrentView(ViewState.ADMIN_DASHBOARD);
      }
    }
  }, []);

  useEffect(() => {
    dataService.startViewSession(currentView);
    return () => dataService.endViewSession();
  }, [currentView]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setSearchResults(dataService.searchAll(searchQuery));
    } else {
      setSearchResults(null);
    }
  }, [searchQuery]);

  useEffect(() => {
    const unsubscribe = translationService.subscribe(setLanguage);
    return unsubscribe;
  }, []);

  // Handle successful login
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    dataService.updateUser(user);
    setIsLoggedIn(true);
    // Set default view based on role
    if (user.role === UserRole.ADMIN) {
        setCurrentView(ViewState.ADMIN_DASHBOARD);
    } else {
        setCurrentView(ViewState.DASHBOARD);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleSOS = () => {
    if (!currentUser) return;
    setIsSOSModalOpen(true);
    setSosStatus('IDLE');
  };

  const confirmSOS = () => {
    if (!currentUser) return;
    setSosStatus('SENDING');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dataService.createSOSAlert(currentUser.id, currentUser.name, {
            lat: latitude,
            lng: longitude,
            address: "Live Tracking Active"
          });
          setTimeout(() => setSosStatus('SUCCESS'), 1000);
        },
        (error) => {
          console.error("Error getting location:", error);
          dataService.createSOSAlert(currentUser.id, currentUser.name);
          setTimeout(() => setSosStatus('SUCCESS'), 1000);
        }
      );
    } else {
      dataService.createSOSAlert(currentUser.id, currentUser.name);
      setTimeout(() => setSosStatus('SUCCESS'), 1000);
    }
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
    <div className={`${isLoggedIn ? 'h-screen overflow-hidden' : 'min-h-screen overflow-y-auto'} bg-[#0f172a] text-slate-200 font-sans flex`}>
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className={`p-2 rounded-lg ${currentUser?.role === UserRole.ADMIN ? 'bg-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                {currentUser?.role === UserRole.ADMIN ? <Shield className="w-6 h-6 text-white" /> : <GraduationCap className="w-6 h-6 text-white" />}
            </div>
            <div>
                <span className="text-xl font-bold tracking-tight block leading-none">Shikkhaverse</span>
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
                    <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label={t('common.dashboard')} />
                    <NavItem view={ViewState.CLASSROOM} icon={GraduationCap} label={t('common.classroom')} />
                    <NavItem view={ViewState.VIRTUAL_LAB} icon={FlaskConical} label={t('common.virtualLab')} />
                    
                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-6 uppercase tracking-wider">Assessment</div>
                    <NavItem view={ViewState.EXAMS} icon={FileText} label={t('common.exams')} />
                    <NavItem view={ViewState.AI_MENTOR} icon={Brain} label={t('common.aiMentor')} />

                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-6 uppercase tracking-wider">Growth</div>
                    <NavItem view={ViewState.COMMUNITY} icon={Users} label={t('common.community')} />
                    <NavItem view={ViewState.SKILLS} icon={Zap} label={t('common.skills')} />
                    <NavItem view={ViewState.KNOWLEDGE_HUB} icon={BookOpen} label={t('common.knowledgeHub')} />
                    <NavItem view={ViewState.GAMIFICATION} icon={Trophy} label={t('common.gamification')} />

                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-6 uppercase tracking-wider">Wellbeing</div>
                    <NavItem view={ViewState.WELLNESS} icon={Activity} label={t('common.wellness')} />

                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 mt-6 uppercase tracking-wider">Account</div>
                    <NavItem view={ViewState.SUBSCRIPTION} icon={Zap} label={t('common.subscription')} />
                    {currentUser?.role === UserRole.PARENT && <NavItem view={ViewState.PARENT_DASHBOARD} icon={Users} label={t('common.parentDashboard')} />}
                    <NavItem view={ViewState.PROFILE} icon={UserIcon} label={t('common.profile')} />
                </>
            )}
          </nav>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            {currentUser?.role === UserRole.STUDENT && (
              <button 
                onClick={handleSOS}
                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all shadow-lg shadow-red-900/20 group"
              >
                <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold tracking-wider uppercase text-sm">Emergency SOS</span>
              </button>
            )}
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#0f172a] custom-scrollbar flex flex-col relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-[#0f172a]/90 backdrop-blur-md z-40">
           <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                 <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Shikkhaverse</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>

        {/* View Content */}
        <div className="flex-1 p-4 lg:p-8 pb-32 relative min-h-full">
           {/* Top Bar (Desktop) */}
           <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-2xl font-bold text-white capitalize">{currentView.replace('_', ' ').toLowerCase()}</h2>
                 <p className="text-slate-400 text-sm">{t('common.welcome')}, {currentUser?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                 {/* Language Toggle */}
                 <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 mr-2">
                    <button 
                        onClick={() => translationService.setLanguage(Language.ENGLISH)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${language === Language.ENGLISH ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        EN
                    </button>
                    <button 
                        onClick={() => translationService.setLanguage(Language.BANGLA)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${language === Language.BANGLA ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        বাংলা
                    </button>
                 </div>

                 <div className="relative group">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder={t('common.search')} 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 w-64 focus:w-80 transition-all" 
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Search Results Overlay */}
                    {searchResults && (
                      <div className="absolute top-full mt-2 right-0 w-96 bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in max-h-[70vh] flex flex-col">
                        <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Search Results</h3>
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                            {(searchResults.articles.length + searchResults.classes.length + searchResults.posts.length)} Found
                          </span>
                        </div>
                        
                        <div className="overflow-y-auto custom-scrollbar p-2 space-y-4">
                          {searchResults.articles.length > 0 && (
                            <div>
                              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">Knowledge Hub</div>
                              {searchResults.articles.map((article: any) => (
                                <button 
                                  key={article.id}
                                  onClick={() => {
                                    setCurrentView(ViewState.KNOWLEDGE_HUB);
                                    setSearchQuery('');
                                  }}
                                  className="w-full text-left p-3 hover:bg-slate-700/50 rounded-xl transition-colors flex items-center gap-3 group"
                                >
                                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <BookOpen className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-white">{article.title}</div>
                                    <div className="text-xs text-slate-400 line-clamp-1">{article.content}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {searchResults.classes.length > 0 && (
                            <div>
                              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">Classes</div>
                              {searchResults.classes.map((cls: any) => (
                                <button 
                                  key={cls.id}
                                  onClick={() => {
                                    setCurrentView(ViewState.CLASSROOM);
                                    setSearchQuery('');
                                  }}
                                  className="w-full text-left p-3 hover:bg-slate-700/50 rounded-xl transition-colors flex items-center gap-3 group"
                                >
                                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <GraduationCap className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-white">{cls.title}</div>
                                    <div className="text-xs text-slate-400">{cls.instructor}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {searchResults.posts.length > 0 && (
                            <div>
                              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">Community</div>
                              {searchResults.posts.map((post: any) => (
                                <button 
                                  key={post.id}
                                  onClick={() => {
                                    setCurrentView(ViewState.COMMUNITY);
                                    setSearchQuery('');
                                  }}
                                  className="w-full text-left p-3 hover:bg-slate-700/50 rounded-xl transition-colors flex items-center gap-3 group"
                                >
                                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <Users className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-white">{post.author}</div>
                                    <div className="text-xs text-slate-400 line-clamp-1">{post.content}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {searchResults.articles.length === 0 && searchResults.classes.length === 0 && searchResults.posts.length === 0 && (
                            <div className="p-8 text-center">
                              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                              <div className="text-slate-400 text-sm">No results found for "{searchQuery}"</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                 </div>
                 <Notifications />
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
           {currentView === ViewState.PARENT_DASHBOARD && currentUser && <ParentDashboard currentUser={currentUser} />}
           {currentView === ViewState.WELLNESS && <Wellness />}
           {currentView === ViewState.GAMIFICATION && <Gamification />}
        </div>
      </main>
      
      {/* Global AI Chatbot */}
      <GlobalAIAssistant currentUser={currentUser || undefined} />
      
      {/* SOS Custom Modal */}
      {isSOSModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={() => sosStatus !== 'SENDING' && setIsSOSModalOpen(false)}></div>
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-scale-up">
            <div className="p-8 text-center">
              {sosStatus === 'IDLE' && (
                <>
                  <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Emergency SOS</h2>
                  <p className="text-slate-400 mb-8">
                    This will send your current location and an alert to your parents and Shikkhaverse emergency response. Are you sure?
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsSOSModalOpen(false)}
                      className="flex-1 px-6 py-4 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmSOS}
                      className="flex-1 px-6 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                    >
                      SEND SOS
                    </button>
                  </div>
                </>
              )}

              {sosStatus === 'SENDING' && (
                <div className="py-12">
                  <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-6"></div>
                  <h2 className="text-xl font-bold text-white mb-2">Sending Alert...</h2>
                  <p className="text-slate-400">Capturing location and notifying contacts</p>
                </div>
              )}

              {sosStatus === 'SUCCESS' && (
                <>
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Alert Sent!</h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Emergency alert sent successfully. Stay calm. Help is on the way. Your parents have been notified.
                  </p>
                  <button 
                    onClick={() => setIsSOSModalOpen(false)}
                    className="w-full px-6 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Got it
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
