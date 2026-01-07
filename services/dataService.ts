import { ViewState, UserRole, Language } from '../types';
import type { Goal, Post, Assignment, User, ClubMessage, Article, Exam, ExamSection, ExamSubmission, ExamResultSummary, PublishedClass, AppNotification, SOSAlert } from '../types';

const STORAGE_KEYS = {
  GOALS: 'bright_bd_goals',
  POSTS: 'bright_bd_posts',
  ASSIGNMENTS: 'bright_bd_assignments',
  USERS: 'bright_bd_users',
  CURRENT_USER: 'bright_bd_current_user',
  CLUB_MESSAGES: 'bright_bd_club_messages',
  ARTICLES: 'bright_bd_articles',
  EXAMS: 'bright_bd_exams',
  CLASSES: 'bright_bd_classes',
  EXAM_RESULTS: 'bright_bd_exam_results',
  NOTIFICATIONS: 'bright_bd_notifications',
  SOS_ALERTS: 'bright_bd_sos_alerts'
};

// Initial Mock Data
const INITIAL_GOALS: Goal[] = [
  { id: 1, text: "Finish Physics Chapter 4", completed: true, type: 'daily' },
  { id: 2, text: "Submit Math Assignment", completed: false, type: 'daily' },
  { id: 3, text: "Watch Biology Live Class", completed: false, type: 'daily' },
  { id: 4, text: "Practice 20 MCQs", completed: false, type: 'daily' },
  { id: 5, text: "Complete 5 Physics Chapters", completed: false, type: 'weekly' },
  { id: 6, text: "Solve 50 Math Problems", completed: false, type: 'weekly' },
  { id: 7, text: "Attend 10 Live Classes", completed: true, type: 'weekly' },
];

const INITIAL_POSTS: Post[] = [
  { 
    id: 1, 
    user: "Member 1", 
    content: "Has anyone solved the practice problem for this week? I'm stuck on Q3.", 
    time: "2h ago", 
    likes: 5, 
    replies: 2,
    comments: [
        { id: 101, user: "Topper_01", content: "Yes! Use Newton's second law.", time: "1h ago" }
    ]
  },
  { 
    id: 2, 
    user: "Member 2", 
    content: "The debate topic for tomorrow is really interesting!", 
    time: "4h ago", 
    likes: 12, 
    replies: 5,
    comments: []
  },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
    { id: 1, title: "Thermodynamics Lab Report", subject: "Physics", dueDate: "Tomorrow", status: 'PENDING' },
    { id: 2, title: "Calculus Problem Set 3", subject: "Math", dueDate: "in 2 days", status: 'PENDING' },
    { id: 3, title: "Organic Chemistry Notes", subject: "Chemistry", dueDate: "Yesterday", status: 'SUBMITTED', grade: 'A' }
];

const INITIAL_CLUB_MESSAGES: ClubMessage[] = [
  { id: 1, clubId: 'debate', user: 'Moderator', content: 'Welcome to the Debate Club! Today\'s topic: AI in Education.', timestamp: '10:00 AM', isSystem: true },
  { id: 2, clubId: 'debate', user: 'Rahim', content: 'I think AI is a great tool for personalized learning.', timestamp: '10:05 AM' },
  { id: 3, clubId: 'coding', user: 'Admin', content: 'Hackathon starts at 3 PM.', timestamp: '09:00 AM', isSystem: true },
  { id: 4, clubId: 'english', user: 'Instructor', content: 'Practice session starts in 10 mins.', timestamp: '04:00 PM', isSystem: true },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'How to Beat Exam Stress: A Scientific Approach',
    author: 'Dr. Rina Khan',
    category: 'MOTIVATION',
    date: '12 Dec 2024',
    readTime: '5 min read',
    content: 'Stress is natural, but managing it is a skill. Learn the 4-7-8 breathing technique...'
  },
  {
    id: '2',
    title: 'Top 10 High-Paying Careers in 2030',
    author: 'Career Council',
    category: 'CAREER',
    date: '10 Dec 2024',
    readTime: '8 min read',
    content: 'The world is changing. AI, Green Energy, and Biotech are the next big things...'
  },
  {
    id: '3',
    title: 'Physics Shortcut Techniques for BUET Admission',
    author: 'Engr. S. Ahmed',
    category: 'STUDY_TIPS',
    date: '08 Dec 2024',
    readTime: '12 min read',
    content: 'Don\'t memorize formulas blindly. Understand the derivation to solve complex problems...'
  }
];

const INITIAL_EXAMS: Exam[] = [];
const INITIAL_CLASSES: PublishedClass[] = [];
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    type: 'CLASS',
    title: 'Physics Class Starting',
    message: 'HSC Physics: Thermodynamics with Dr. Ahmed starts in 10 minutes.',
    time: 'Now',
    read: false
  },
  {
    id: '2',
    type: 'DEADLINE',
    title: 'Assignment Due Soon',
    message: 'Math: Calculus Integration Worksheet is due tonight at 11:59 PM.',
    time: '2h remaining',
    read: false
  },
  {
    id: '3',
    type: 'ANNOUNCEMENT',
    title: 'Exam Schedule Released',
    message: 'The schedule for the upcoming term finals has been published.',
    time: '2 hours ago',
    read: true
  },
  {
    id: '4',
    type: 'SYSTEM',
    title: 'Maintenance Update',
    message: 'Platform scheduled for brief maintenance on Saturday at 2 AM.',
    time: '1 day ago',
    read: true
  }
];

export const dataService = {
  // --- Goals ---
  getGoals: (): Goal[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
      return INITIAL_GOALS;
    }
    return JSON.parse(stored);
  },

  addGoal: (text: string, type: 'daily' | 'weekly'): Goal => {
    const goals = dataService.getGoals();
    const newGoal: Goal = {
      id: Date.now(),
      text,
      completed: false,
      type
    };
    goals.push(newGoal);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    return newGoal;
  },

  toggleGoal: (id: number): Goal[] => {
    const goals = dataService.getGoals();
    const updated = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
    return updated;
  },

  deleteGoal: (id: number): Goal[] => {
    const goals = dataService.getGoals();
    const updated = goals.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
    return updated;
  },

  // --- Posts ---
  getPosts: (): Post[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(stored);
  },

  createPost: (user: string, content: string): Post => {
    const posts = dataService.getPosts();
    const newPost: Post = {
      id: Date.now(),
      user,
      content,
      time: 'Just now',
      likes: 0,
      replies: 0,
      comments: []
    };
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return newPost;
  },

  addComment: (postId: number, user: string, content: string): Post[] => {
    const posts = dataService.getPosts();
    const updated = posts.map(p => {
        if (p.id === postId) {
            return {
                ...p,
                replies: p.replies + 1,
                comments: [...(p.comments || []), { id: Date.now(), user, content, time: 'Just now' }]
            };
        }
        return p;
    });
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    return updated;
  },

  likePost: (postId: number): Post[] => {
    const posts = dataService.getPosts();
    const updated = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    return updated;
  },

  // --- Assignments ---
  getAssignments: (): Assignment[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
      return INITIAL_ASSIGNMENTS;
    }
    return JSON.parse(stored);
  },

  submitAssignment: (id: number): Assignment[] => {
    const assignments = dataService.getAssignments();
    const updated = assignments.map(a => a.id === id ? { ...a, status: 'SUBMITTED' as const } : a);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updated));
    return updated;
  },

  // --- Club Messages ---
  getClubMessages: (clubId: string): ClubMessage[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CLUB_MESSAGES);
    let messages: ClubMessage[] = [];
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CLUB_MESSAGES, JSON.stringify(INITIAL_CLUB_MESSAGES));
      messages = INITIAL_CLUB_MESSAGES;
    } else {
      messages = JSON.parse(stored);
    }
    return messages.filter(m => m.clubId === clubId);
  },

  sendClubMessage: (clubId: string, user: string, content: string): ClubMessage[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CLUB_MESSAGES);
    const messages: ClubMessage[] = stored ? JSON.parse(stored) : INITIAL_CLUB_MESSAGES;
    
    const newMessage: ClubMessage = {
      id: Date.now(),
      clubId,
      user,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updated = [...messages, newMessage];
    localStorage.setItem(STORAGE_KEYS.CLUB_MESSAGES, JSON.stringify(updated));
    return updated.filter(m => m.clubId === clubId);
  },

  // --- User ---
  getUsers: (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!stored) return [];
    return JSON.parse(stored);
  },

  updateUser: (user: User) => {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      const users = dataService.getUsers();
      const updated = users.map(u => u.id === user.id ? user : u);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  },
 
  deleteUser: (id: string): User[] => {
    const users = dataService.getUsers();
    const updated = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    return updated;
  },

  updateUserRole: (id: string, role: UserRole): User[] => {
    const users = dataService.getUsers();
    const updated = users.map(u => u.id === id ? { ...u, role } : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    return updated;
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // --- SOS Alerts ---
  getSOSAlerts: (): SOSAlert[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.SOS_ALERTS);
    return stored ? JSON.parse(stored) : [];
  },

  createSOSAlert: (studentId: string, studentName: string, location?: { lat: number, lng: number, address?: string }): SOSAlert => {
    const alerts = dataService.getSOSAlerts();
    const newAlert: SOSAlert = {
      id: Date.now().toString(),
      studentId,
      studentName,
      timestamp: new Date().toISOString(),
      location,
      status: 'ACTIVE'
    };
    
    const updated = [newAlert, ...alerts];
    localStorage.setItem(STORAGE_KEYS.SOS_ALERTS, JSON.stringify(updated));
    
    // Also create a notification for parents
    const users = dataService.getUsers();
    const student = users.find(u => u.id === studentId);
    if (student?.parentPhone) {
        // Mock sending SMS
        console.log(`[SMS] SOS Alert sent to parent phone: ${student.parentPhone}. Message: EMERGENCY! ${studentName} has triggered an SOS alert. Location: ${location?.address || 'Unknown'}`);
    }

    return newAlert;
  },

  resolveSOSAlert: (id: string): SOSAlert[] => {
    const alerts = dataService.getSOSAlerts();
    const updated = alerts.map(a => a.id === id ? { ...a, status: 'RESOLVED' as const } : a);
    localStorage.setItem(STORAGE_KEYS.SOS_ALERTS, JSON.stringify(updated));
    return updated;
  },

  // --- Articles ---
  getArticles: (): Article[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(stored);
  },

  addArticle: (article: Omit<Article, 'id' | 'date' | 'readTime'>): Article[] => {
    const articles = dataService.getArticles();
    const newArticle: Article = {
      id: Date.now().toString(),
      ...article,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: '5 min read' // Mock read time
    };
    const updated = [newArticle, ...articles];
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
    return updated;
  },

  deleteArticle: (id: string): Article[] => {
    const articles = dataService.getArticles();
    const updated = articles.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
    return updated;
  },

  // --- Exams ---
  getExams: (): Exam[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
      return INITIAL_EXAMS;
    }
    return JSON.parse(stored);
  },

  createExam: (payload: { title: string; subject: string; durationMinutes: number; totalMarks: number; createdBy: string; sections: ExamSection[] }): Exam => {
    const exams = dataService.getExams();
    const exam: Exam = {
      id: Date.now().toString(),
      title: payload.title,
      subject: payload.subject,
      durationMinutes: payload.durationMinutes,
      totalMarks: payload.totalMarks,
      createdBy: payload.createdBy,
      createdAt: new Date().toISOString(),
      sections: payload.sections
    };
    const updated = [exam, ...exams];
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
    return exam;
  },

  deleteExam: (id: string): Exam[] => {
    const exams = dataService.getExams();
    const updated = exams.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
    return updated;
  },

  submitExam: (submission: ExamSubmission): ExamResultSummary => {
    const exams = dataService.getExams();
    const exam = exams.find(e => e.id === submission.examId);
    if (!exam) {
      return { id: Date.now().toString(), examId: submission.examId, studentId: 'unknown', totalMarks: 0, obtainedMarks: 0, mcqCorrect: 0, mcqTotal: 0, published: false };
    }
    let obtained = 0;
    let mcqCorrect = 0;
    let mcqTotal = 0;
    exam.sections.forEach(sec => {
      if (sec.type === 'MCQ' && sec.mcq) {
        mcqTotal += sec.mcq.length;
        sec.mcq.forEach(q => {
          const ans = submission.answers[q.id];
          if (typeof ans === 'number' && ans === q.correctIndex) {
            obtained += q.marks;
            mcqCorrect += 1;
          }
        });
      }
    });
    const currentUser = dataService.getCurrentUser();
    const summary: ExamResultSummary = {
      id: Date.now().toString(),
      examId: exam.id,
      studentId: currentUser?.id || 'guest',
      studentName: currentUser?.name,
      totalMarks: exam.totalMarks,
      obtainedMarks: obtained,
      mcqCorrect,
      mcqTotal,
      published: false
    };
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
    const list: ExamResultSummary[] = stored ? JSON.parse(stored) : [];
    const updated = [summary, ...list];
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(updated));
    return summary;
  },

  getExamResults: (): ExamResultSummary[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
    return stored ? JSON.parse(stored) : [];
  },
 
  getPublishedResultsForStudent: (studentId: string): ExamResultSummary[] => {
    const list = dataService.getExamResults();
    return list.filter(r => r.studentId === studentId && r.published === true);
  },
 
  publishExamResults: (examId: string): ExamResultSummary[] => {
    const list = dataService.getExamResults();
    const updated = list.map(r => r.examId === examId ? { ...r, published: true } : r);
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(updated));
    return updated;
  },

  // --- Classes ---
  getClasses: (): PublishedClass[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
      return INITIAL_CLASSES;
    }
    return JSON.parse(stored);
  },

  publishClass: (payload: Omit<PublishedClass, 'id' | 'publishedAt'>): PublishedClass => {
    const classes = dataService.getClasses();
    const item: PublishedClass = {
      id: Date.now().toString(),
      ...payload,
      publishedAt: new Date().toISOString()
    };
    const updated = [item, ...classes];
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(updated));
    return item;
  },

  // --- Notifications ---
  getNotifications: (): AppNotification[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(stored);
  },

  addNotification: (payload: { type: AppNotification['type']; title: string; message: string; time?: string }): AppNotification[] => {
    const list = dataService.getNotifications();
    const item: AppNotification = {
      id: Date.now().toString(),
      type: payload.type,
      title: payload.title,
      message: payload.message,
      time: payload.time || 'Now',
      read: false
    };
    const updated = [item, ...list];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  markNotificationRead: (id: string): AppNotification[] => {
    const list = dataService.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  markAllNotificationsRead: (): AppNotification[] => {
    const list = dataService.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  deleteNotification: (id: string): AppNotification[] => {
    const list = dataService.getNotifications();
    const updated = list.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },
  triggerPush: async (title: string, message: string) => {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, { body: message });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: message });
      }
    } catch {}
    dataService.addNotification({ type: 'SYSTEM', title, message, time: 'Now' });
  },
  startViewSession: (view: string) => {
    const key = 'sv_analytics_sessions';
    const stored = localStorage.getItem(key);
    const sessions: any[] = stored ? JSON.parse(stored) : [];
    sessions.push({ id: Date.now(), view, start: Date.now() });
    localStorage.setItem(key, JSON.stringify(sessions));
  },
  endViewSession: () => {
    const key = 'sv_analytics_sessions';
    const stored = localStorage.getItem(key);
    const sessions: any[] = stored ? JSON.parse(stored) : [];
    const last = sessions[sessions.length - 1];
    if (last && !last.end) {
      last.end = Date.now();
      last.duration = last.end - last.start;
      sessions[sessions.length - 1] = last;
      localStorage.setItem(key, JSON.stringify(sessions));
    }
  },
  getAnalyticsSummary: () => {
    const key = 'sv_analytics_sessions';
    const stored = localStorage.getItem(key);
    const sessions: any[] = stored ? JSON.parse(stored) : [];
    const totals: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.duration) {
        totals[s.view] = (totals[s.view] || 0) + s.duration;
      }
    });
    const entries = Object.entries(totals).map(([view, ms]) => ({ view, minutes: Math.round(ms / 60000) }));
    entries.sort((a, b) => b.minutes - a.minutes);
    return entries.slice(0, 5);
  },
  searchAll: (query: string) => {
    const q = query.toLowerCase();
    const posts = dataService.getPosts().filter(p => p.content.toLowerCase().includes(q));
    const articles = dataService.getArticles().filter(a => a.title.toLowerCase().includes(q));
    const classes = dataService.getClasses().filter(c => c.title.toLowerCase().includes(q) || (c.instructor || '').toLowerCase().includes(q));
    return { posts, articles, classes };
  }
};
