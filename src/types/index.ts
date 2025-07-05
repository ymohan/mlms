// Core Types for the LMS System
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  language: 'en' | 'hi' | 'ta';
  createdAt: Date;
  lastActive: Date;
  isActive: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  thumbnail: string;
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  methodologies: string[];
  content: CourseContent[];
  enrollment: number;
  rating: number;
  price: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseContent {
  id: string;
  type: 'video' | 'text' | 'image' | 'audio' | 'pdf' | 'quiz' | 'code';
  title: string;
  content: string;
  duration?: number;
  order: number;
  transcript?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  maxAttempts: number;
  questions: Question[];
  passingScore: number;
  randomizeQuestions: boolean;
  createdAt: Date;
}

export interface Question {
  id: string;
  type: 'mcq' | 'multiple' | 'image' | 'jumbled' | 'audio' | 'video';
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation?: string;
  media?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, number[]>;
  score: number;
  completedAt: Date;
  timeSpent: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  certificateUrl: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'class' | 'quiz' | 'assignment' | 'event';
  userId: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  userId: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Analytics {
  totalUsers: number;
  newSignups: number;
  activeUsers: number;
  totalCourses: number;
  completionRate: number;
  avgRating: number;
  revenue: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'file' | 'image';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  updatedAt: Date;
  updatedBy: string;
}