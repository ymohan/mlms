import { Course, Quiz, Question, User, CalendarEvent, TodoItem, Analytics } from '../types';

// Mock state management for dynamic operations
export let mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, props, state, and hooks. Perfect for beginners who want to start building modern web applications.',
    instructor: 'Sarah Johnson',
    instructorId: '2',
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    duration: 25,
    difficulty: 'beginner',
    methodologies: ['Interactive Learning', 'Hands-on Practice', 'Project-Based Learning'],
    content: [
      {
        id: '1',
        type: 'video',
        title: 'Introduction to React',
        content: 'https://example.com/react-intro.mp4',
        duration: 15,
        order: 1,
        transcript: 'Welcome to React fundamentals...',
      },
      {
        id: '2',
        type: 'text',
        title: 'JSX Basics',
        content: 'JSX is a syntax extension for JavaScript...',
        order: 2,
      },
    ],
    enrollment: 1234,
    rating: 4.8,
    price: 99,
    status: 'approved',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'JavaScript Advanced Concepts',
    description: 'Deep dive into advanced JavaScript concepts including closures, prototypes, async/await, and modern ES6+ features.',
    instructor: 'Mike Chen',
    instructorId: '3',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    duration: 40,
    difficulty: 'advanced',
    methodologies: ['Problem-Solving', 'Code Review', 'Peer Learning'],
    content: [],
    enrollment: 856,
    rating: 4.9,
    price: 149,
    status: 'approved',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Learn REST APIs, authentication, and deployment.',
    instructor: 'David Wilson',
    instructorId: '4',
    thumbnail: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    duration: 35,
    difficulty: 'intermediate',
    methodologies: ['Project-Based Learning', 'Real-world Applications', 'Collaborative Learning'],
    content: [],
    enrollment: 643,
    rating: 4.7,
    price: 129,
    status: 'approved',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    description: 'Master the fundamentals of user interface and user experience design. Learn design thinking, prototyping, and user research.',
    instructor: 'Emily Rodriguez',
    instructorId: '5',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    duration: 30,
    difficulty: 'beginner',
    methodologies: ['Design Thinking', 'Creative Problem Solving', 'User-Centered Design'],
    content: [],
    enrollment: 789,
    rating: 4.6,
    price: 89,
    status: 'approved',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '5',
    title: 'Python Data Science',
    description: 'Introduction to data science with Python. Learn pandas, numpy, matplotlib, and machine learning basics.',
    instructor: 'Dr. Alex Kim',
    instructorId: '6',
    thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    duration: 50,
    difficulty: 'intermediate',
    methodologies: ['Data-Driven Learning', 'Hands-on Analysis', 'Case Studies'],
    content: [],
    enrollment: 567,
    rating: 4.5,
    price: 179,
    status: 'approved',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '6',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native. Learn navigation, state management, and native features.',
    instructor: 'Lisa Park',
    instructorId: '7',
    thumbnail: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    duration: 45,
    difficulty: 'advanced',
    methodologies: ['Mobile-First Development', 'Cross-Platform Learning', 'App Store Deployment'],
    content: [],
    enrollment: 432,
    rating: 4.4,
    price: 199,
    status: 'pending',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-28'),
  },
];

export let mockQuizzes: Quiz[] = [
  {
    id: '1',
    courseId: '1',
    title: 'React Fundamentals Quiz',
    description: 'Test your knowledge of React basics including components, props, and state.',
    timeLimit: 30,
    maxAttempts: 3,
    passingScore: 70,
    randomizeQuestions: true,
    createdAt: new Date('2024-01-15'),
    questions: [
      {
        id: '1',
        type: 'mcq',
        question: 'What is JSX?',
        options: [
          'A JavaScript library',
          'A syntax extension for JavaScript',
          'A database query language',
          'A CSS framework'
        ],
        correctAnswers: [1],
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
        points: 10,
      },
      {
        id: '2',
        type: 'multiple',
        question: 'Which of the following are React hooks?',
        options: [
          'useState',
          'useEffect',
          'useContext',
          'useQuery'
        ],
        correctAnswers: [0, 1, 2],
        explanation: 'useState, useEffect, and useContext are built-in React hooks. useQuery is from React Query library.',
        points: 15,
      },
    ],
  },
  {
    id: '2',
    courseId: '2',
    title: 'JavaScript Advanced Quiz',
    description: 'Challenge yourself with advanced JavaScript concepts and patterns.',
    timeLimit: 45,
    maxAttempts: 2,
    passingScore: 80,
    randomizeQuestions: false,
    createdAt: new Date('2024-01-20'),
    questions: [
      {
        id: '3',
        type: 'mcq',
        question: 'What is a closure in JavaScript?',
        options: [
          'A function that returns another function',
          'A function that has access to variables in its outer scope',
          'A way to close browser windows',
          'A method to end a loop'
        ],
        correctAnswers: [1],
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.',
        points: 20,
      },
    ],
  },
];

export let mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'React Fundamentals - Live Session',
    description: 'Interactive Q&A session with the instructor',
    date: new Date('2024-01-25T10:00:00'),
    type: 'class',
    userId: '3',
  },
  {
    id: '2',
    title: 'JavaScript Quiz Deadline',
    description: 'Submit your JavaScript advanced quiz',
    date: new Date('2024-01-22T23:59:59'),
    type: 'quiz',
    userId: '3',
  },
  {
    id: '3',
    title: 'Node.js Project Submission',
    description: 'Final project for Node.js backend course',
    date: new Date('2024-01-28T18:00:00'),
    type: 'assignment',
    userId: '3',
  },
];

export let mockTodoItems: TodoItem[] = [
  {
    id: '1',
    title: 'Complete React Hooks lesson',
    description: 'Watch the video and complete the exercises',
    completed: false,
    dueDate: new Date('2024-01-23'),
    userId: '3',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Review JavaScript closures',
    description: 'Re-read the article on closures and practice examples',
    completed: true,
    dueDate: new Date('2024-01-21'),
    userId: '3',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Prepare for Node.js quiz',
    description: 'Study chapters 1-5 and practice coding exercises',
    completed: false,
    dueDate: new Date('2024-01-24'),
    userId: '3',
    priority: 'high',
  },
];

export let mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@lms.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    language: 'en',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: new Date('2024-01-01'),
    lastActive: new Date(),
    isActive: true,
  },
  {
    id: '2',
    email: 'teacher@lms.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'teacher',
    language: 'en',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: new Date('2024-01-15'),
    lastActive: new Date(),
    isActive: true,
  },
  {
    id: '3',
    email: 'student@lms.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'student',
    language: 'en',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    createdAt: new Date('2024-02-01'),
    lastActive: new Date(),
    isActive: true,
  },
];

// CRUD operations for courses
export const createCourse = (courseData: Partial<Course>): Course => {
  const newCourse: Course = {
    id: Date.now().toString(),
    title: courseData.title || '',
    description: courseData.description || '',
    instructor: courseData.instructor || '',
    instructorId: courseData.instructorId || '',
    thumbnail: courseData.thumbnail || 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    duration: courseData.duration || 0,
    difficulty: courseData.difficulty || 'beginner',
    methodologies: courseData.methodologies || [],
    content: courseData.content || [],
    enrollment: 0,
    rating: 0,
    price: courseData.price || 0,
    status: courseData.status || 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockCourses.push(newCourse);
  return newCourse;
};

export const updateCourse = (id: string, updates: Partial<Course>): Course | null => {
  const index = mockCourses.findIndex(course => course.id === id);
  if (index !== -1) {
    mockCourses[index] = { ...mockCourses[index], ...updates, updatedAt: new Date() };
    return mockCourses[index];
  }
  return null;
};

export const deleteCourse = (id: string): boolean => {
  const index = mockCourses.findIndex(course => course.id === id);
  if (index !== -1) {
    mockCourses.splice(index, 1);
    return true;
  }
  return false;
};

// CRUD operations for users
export const createUser = (userData: Partial<User>): User => {
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email || '',
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    role: userData.role || 'student',
    language: userData.language || 'en',
    avatar: userData.avatar,
    createdAt: new Date(),
    lastActive: new Date(),
    isActive: true,
  };
  mockUsers.push(newUser);
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const index = mockUsers.findIndex(user => user.id === id);
  if (index !== -1) {
    mockUsers[index] = { ...mockUsers[index], ...updates };
    return mockUsers[index];
  }
  return null;
};

export const deleteUser = (id: string): boolean => {
  const index = mockUsers.findIndex(user => user.id === id);
  if (index !== -1) {
    mockUsers.splice(index, 1);
    return true;
  }
  return false;
};

// CRUD operations for calendar events
export const createCalendarEvent = (eventData: Partial<CalendarEvent>): CalendarEvent => {
  const newEvent: CalendarEvent = {
    id: Date.now().toString(),
    title: eventData.title || '',
    description: eventData.description || '',
    date: eventData.date || new Date(),
    type: eventData.type || 'event',
    userId: eventData.userId || '',
  };
  mockCalendarEvents.push(newEvent);
  return newEvent;
};

export const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>): CalendarEvent | null => {
  const index = mockCalendarEvents.findIndex(event => event.id === id);
  if (index !== -1) {
    mockCalendarEvents[index] = { ...mockCalendarEvents[index], ...updates };
    return mockCalendarEvents[index];
  }
  return null;
};

export const deleteCalendarEvent = (id: string): boolean => {
  const index = mockCalendarEvents.findIndex(event => event.id === id);
  if (index !== -1) {
    mockCalendarEvents.splice(index, 1);
    return true;
  }
  return false;
};

// CRUD operations for todo items
export const createTodoItem = (todoData: Partial<TodoItem>): TodoItem => {
  const newTodo: TodoItem = {
    id: Date.now().toString(),
    title: todoData.title || '',
    description: todoData.description || '',
    completed: todoData.completed || false,
    dueDate: todoData.dueDate || new Date(),
    userId: todoData.userId || '',
    priority: todoData.priority || 'medium',
  };
  mockTodoItems.push(newTodo);
  return newTodo;
};

export const updateTodoItem = (id: string, updates: Partial<TodoItem>): TodoItem | null => {
  const index = mockTodoItems.findIndex(todo => todo.id === id);
  if (index !== -1) {
    mockTodoItems[index] = { ...mockTodoItems[index], ...updates };
    return mockTodoItems[index];
  }
  return null;
};

export const deleteTodoItem = (id: string): boolean => {
  const index = mockTodoItems.findIndex(todo => todo.id === id);
  if (index !== -1) {
    mockTodoItems.splice(index, 1);
    return true;
  }
  return false;
};

// CRUD operations for quizzes
export const createQuiz = (quizData: Partial<Quiz>): Quiz => {
  const newQuiz: Quiz = {
    id: Date.now().toString(),
    courseId: quizData.courseId || '',
    title: quizData.title || '',
    description: quizData.description || '',
    timeLimit: quizData.timeLimit || 30,
    maxAttempts: quizData.maxAttempts || 3,
    passingScore: quizData.passingScore || 70,
    randomizeQuestions: quizData.randomizeQuestions || false,
    questions: quizData.questions || [],
    createdAt: new Date(),
  };
  mockQuizzes.push(newQuiz);
  return newQuiz;
};

export const updateQuiz = (id: string, updates: Partial<Quiz>): Quiz | null => {
  const index = mockQuizzes.findIndex(quiz => quiz.id === id);
  if (index !== -1) {
    mockQuizzes[index] = { ...mockQuizzes[index], ...updates };
    return mockQuizzes[index];
  }
  return null;
};

export const deleteQuiz = (id: string): boolean => {
  const index = mockQuizzes.findIndex(quiz => quiz.id === id);
  if (index !== -1) {
    mockQuizzes.splice(index, 1);
    return true;
  }
  return false;
};

export const mockAnalytics: Analytics = {
  totalUsers: 1234,
  newSignups: 89,
  activeUsers: 756,
  totalCourses: 42,
  completionRate: 78.5,
  avgRating: 4.6,
  revenue: 52340,
};

