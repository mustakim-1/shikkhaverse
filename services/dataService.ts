import { Goal, Post, Assignment, User, ClubMessage, Article, Exam, ExamSection, ExamSubmission, ExamResultSummary, PublishedClass, Notification } from '../types';

const STORAGE_KEYS = {
  GOALS: 'shikkhaverse_goals',
  POSTS: 'shikkhaverse_posts',
  ASSIGNMENTS: 'shikkhaverse_assignments',
  USERS: 'shikkhaverse_users',
  CURRENT_USER: 'shikkhaverse_current_user',
  CLUB_MESSAGES: 'shikkhaverse_club_messages',
  ARTICLES: 'shikkhaverse_articles',
  EXAMS: 'shikkhaverse_exams',
  CLASSES: 'shikkhaverse_classes',
  EXAM_RESULTS: 'shikkhaverse_exam_results',
  NOTIFICATIONS: 'shikkhaverse_notifications'
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
const INITIAL_NOTIFICATIONS: Notification[] = [
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
  updateUser: (user: User) => {
      // In a real app, this would update the backend
      // Here we just update the authService's local storage if needed, 
      // but usually authService handles the user session. 
      // We can add specific user data persistence here if we want to decouple from authService.
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },
 
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
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
  getNotifications: (): Notification[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(stored);
  },

  addNotification: (payload: { type: Notification['type']; title: string; message: string; time?: string }): Notification[] => {
    const list = dataService.getNotifications();
    const item: Notification = {
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

  markNotificationRead: (id: string): Notification[] => {
    const list = dataService.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  markAllNotificationsRead: (): Notification[] => {
    const list = dataService.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  deleteNotification: (id: string): Notification[] => {
    const list = dataService.getNotifications();
    const updated = list.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  }
};
