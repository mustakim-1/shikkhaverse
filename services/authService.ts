
import { User, UserRole } from '../types';

const STORAGE_KEY = 'shikkhaverse_users';

// Pre-seeded users for demonstration
const DEFAULT_USERS: User[] = [
  {
    id: 'ADMIN',
    name: 'System Administrator',
    role: UserRole.ADMIN,
    password: 'admin123',
    points: 0,
    joinedDate: '2023-01-01'
  },
  {
    id: 'ST-2024-882',
    name: 'Rahim Uddin',
    role: UserRole.STUDENT,
    password: 'password',
    level: 'HSC',
    educationSystem: 'bangla',
    email: 'rahim.u@example.com',
    phone: '+880 17XX-XXXXXX',
    address: 'Mirpur 10, Dhaka',
    points: 2450,
    joinedDate: '2024-01-15',
    portfolio: {
      certificates: [
        { id: '1', title: 'Physics Olympiad 2024', issuer: 'National Science Guild', date: 'Mar 15, 2024', type: 'Gold Medal' },
        { id: '2', title: 'Advanced Calculus', issuer: 'ShikkhaVerse Academy', date: 'Feb 10, 2024', type: 'Completion' },
        { id: '3', title: 'Debate Championship', issuer: 'Inter-School Forum', date: 'Jan 20, 2024', type: 'Runner Up' }
      ],
      skills: [
        { name: 'Physics Problem Solving', proficiency: 95 },
        { name: 'Calculus', proficiency: 90 },
        { name: 'Organic Chemistry', proficiency: 85 },
        { name: 'Public Speaking', proficiency: 80 },
        { name: 'Python Programming', proficiency: 75 },
        { name: 'Data Analysis', proficiency: 70 }
      ],
      projects: [
        { id: '1', title: 'Solar System Model', description: '3D simulation using Python.', role: 'Lead Developer' },
        { id: '2', title: 'Eco-Friendly City', description: 'Science fair model design.', role: 'Designer' }
      ],
      clubs: [
        { id: '1', name: 'Science Club', role: 'President', joinedDate: '2024-01-20' },
        { id: '2', name: 'Debate Club', role: 'Active Member', joinedDate: '2024-02-15' }
      ]
    },
    academicRecord: {
      enrolledCourses: [
        { id: 1, title: 'HSC Physics Masterclass', instructor: 'Dr. Ahmed', progress: 75 },
        { id: 2, title: 'Zero to Hero: Chemistry', instructor: 'Ms. Fatema', progress: 40 },
        { id: 3, title: 'Higher Math Shortcut Techniques', instructor: 'Mr. Karim', progress: 10 },
      ],
      examHistory: [
        { id: 1, title: 'Term Final: Physics', date: '12 June 2024', marks: '85/100', grade: 'A+', status: 'Passed' },
        { id: 2, title: 'Weekly Quiz: Organic Chem', date: '05 June 2024', marks: '12/20', grade: 'B', status: 'Passed' },
        { id: 3, title: 'Model Test: Math', date: '28 May 2024', marks: '45/100', grade: 'C', status: 'Failed' },
        { id: 4, title: 'Biology Chapter 4', date: '15 May 2024', marks: '28/30', grade: 'A+', status: 'Passed' },
      ],
      subjectStrength: [
        { subject: 'Physics', A: 120, fullMark: 150 },
        { subject: 'Chemistry', A: 98, fullMark: 150 },
        { subject: 'Math', A: 86, fullMark: 150 },
        { subject: 'Biology', A: 99, fullMark: 150 },
        { subject: 'English', A: 85, fullMark: 150 },
        { subject: 'ICT', A: 65, fullMark: 150 },
      ],
      growthData: [
        { month: 'Jan', score: 65 },
        { month: 'Feb', score: 68 },
        { month: 'Mar', score: 75 },
        { month: 'Apr', score: 72 },
        { month: 'May', score: 85 },
        { month: 'Jun', score: 92 },
      ],
      attendance: [
        { date: 'Today, 10:00 AM', class: 'Physics: Thermodynamics', status: 'Present', color: 'text-emerald-400' },
        { date: 'Yesterday, 04:00 PM', class: 'Math: Calculus', status: 'Present', color: 'text-emerald-400' },
        { date: '12 June, 11:00 AM', class: 'Chemistry: Organic', status: 'Late (10m)', color: 'text-yellow-400' },
        { date: '10 June, 02:00 PM', class: 'Biology: Genetics', status: 'Absent', color: 'text-red-400' },
      ],
      weakAreas: [
        { topic: 'Organic Chemistry Reactions', subject: 'Chemistry', note: 'Failed last 2 quizzes on nomenclature.' },
        { topic: 'Calculus: Integration by Parts', subject: 'Math', note: 'Struggling with formula application.' }
      ]
    },
  },
  {
    id: 'TC-2024-001',
    name: 'Dr. Ahmed Khan',
    role: UserRole.TEACHER,
    password: 'teacher123',
    email: 'dr.ahmed@shikkhaverse.com',
    points: 0,
    joinedDate: '2023-05-20'
  }
];

// Initialize storage if empty
const initStorage = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

export const authService = {
  getUsers: (): User[] => {
    initStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  },

  login: (id: string, password: string): { success: boolean; user?: User; message?: string } => {
    const users = authService.getUsers();
    // Case insensitive ID check
    const user = users.find(u => u.id.toUpperCase() === id.toUpperCase());

    if (!user) {
      return { success: false, message: "User ID not found." };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password." };
    }

    return { success: true, user };
  },

  register: (user: User): { success: boolean; message?: string } => {
    const users = authService.getUsers();
    
    // Check if ID already exists
    if (users.find(u => u.id === user.id)) {
      return { success: false, message: "User ID already exists." };
    }

    const newUsers = [...users, user];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
    return { success: true };
  }
};
