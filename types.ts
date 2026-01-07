
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT'
}

export enum Language {
  ENGLISH = 'en',
  BANGLA = 'bn'
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  CLASSROOM = 'CLASSROOM',
  AI_MENTOR = 'AI_MENTOR',
  VIRTUAL_LAB = 'VIRTUAL_LAB',
  EXAMS = 'EXAMS',
  COMMUNITY = 'COMMUNITY',
  SKILLS = 'SKILLS',
  PROFILE = 'PROFILE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  KNOWLEDGE_HUB = 'KNOWLEDGE_HUB',
  PARENT_DASHBOARD = 'PARENT_DASHBOARD',
  WELLNESS = 'WELLNESS',
  GAMIFICATION = 'GAMIFICATION'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string; // In a real app, this would never be on the frontend interface
  level?: string; // e.g., "HSC Candidate"
  educationSystem?: string; // e.g. "Bangla Medium"
  email?: string;
  phone?: string;
  address?: string;
  points: number;
  joinedDate: string;
  subscriptionStatus?: 'FREE' | 'PREMIUM';
  parentId?: string;
  parentPhone?: string;
  portfolio?: UserPortfolio;
  academicRecord?: AcademicRecord;
  aiUsageCount?: number;
}

export interface UserPortfolio {
  certificates: Certificate[];
  skills: Skill[];
  projects: Project[];
  clubs: ClubMembership[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  type: 'Gold Medal' | 'Completion' | 'Runner Up' | 'Participation';
}

export interface Skill {
  name: string;
  proficiency: number; // 0-100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role?: string;
}

export interface ClubMembership {
  id?: string;
  name: string;
  role: string;
  joinedDate?: string;
}

export interface EnrolledCourse {
  id: number;
  title: string;
  instructor: string;
  progress: number;
}

export interface ExamResult {
  id: number;
  title: string;
  date: string;
  marks: string;
  grade: string;
  status: 'Passed' | 'Failed';
}

export interface SubjectStrength {
  subject: string;
  A: number;
  fullMark: number;
}

export interface GrowthMetric {
  month: string;
  score: number;
}

export interface AttendanceRecord {
  date: string;
  class: string;
  status: string;
  color: string;
}

export interface WeakArea {
  topic: string;
  subject: string;
  note: string;
}

export interface AcademicRecord {
  enrolledCourses: EnrolledCourse[];
  examHistory: ExamResult[];
  subjectStrength: SubjectStrength[];
  growthData: GrowthMetric[];
  attendance: AttendanceRecord[];
  weakAreas?: WeakArea[];
}

export interface SOSAlert {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'ACTIVE' | 'RESOLVED';
}

export interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  category: 'STUDY_TIPS' | 'CAREER' | 'MOTIVATION' | 'LIFE_SKILLS';
  date: string;
  readTime: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ClubMessage {
  id: number;
  clubId: string;
  user: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Goal {
  id: number;
  text: string;
  completed: boolean;
  type: 'daily' | 'weekly';
  userId?: string;
}

export interface Post {
  id: number;
  user: string;
  content: string;
  time: string;
  likes: number;
  replies: number;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  user: string;
  content: string;
  time: string;
}

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  grade?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  time: string;
  thumbnail: string;
  isLive: boolean;
}

export type ExamSectionType = 'MCQ' | 'SQ' | 'CQ';

export interface ExamQuestionMCQ {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  marks: number;
}

export interface ExamQuestionSQ {
  id: string;
  text: string;
  marks: number;
}

export interface ExamQuestionCQ {
  id: string;
  text: string;
  marks: number;
}

export interface ExamSection {
  type: ExamSectionType;
  mcq?: ExamQuestionMCQ[];
  sq?: ExamQuestionSQ[];
  cq?: ExamQuestionCQ[];
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  createdBy: string;
  createdAt: string;
  sections: ExamSection[];
}

export interface ExamSubmission {
  examId: string;
  answers: Record<string, number | string>;
}

export interface ExamResultSummary {
  id: string;
  examId: string;
  studentId: string;
  studentName?: string;
  totalMarks: number;
  obtainedMarks: number;
  mcqCorrect: number;
  mcqTotal: number;
  published: boolean;
}

export interface PublishedClass {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  videoUrl?: string;
  publishedAt: string;
}

export interface AppNotification {
  id: string;
  type: 'CLASS' | 'DEADLINE' | 'ANNOUNCEMENT' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  read: boolean;
}
