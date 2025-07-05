import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AuthForm from './components/auth/AuthForm';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AdminDashboard from './components/dashboard/AdminDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import CourseList from './components/courses/CourseList';
import CourseBuilder from './components/course/CourseBuilder';
import QuizEngine from './components/quiz/QuizEngine';
import QuizBuilder from './components/quiz/QuizBuilder';
import NotificationCenter from './components/notifications/NotificationCenter';
import CertificateGenerator from './components/certificates/CertificateGenerator';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import MessageCenter from './components/messaging/MessageCenter';
import UserManagement from './components/admin/UserManagement';
import CalendarView from './components/calendar/CalendarView';
import ProfileEditor from './components/profile/ProfileEditor';
import { useNotifications } from './hooks/useNotifications';
import { usePushNotifications } from './hooks/usePushNotifications';
import { 
  mockCourses, 
  mockCalendarEvents, 
  mockTodoItems, 
  mockUsers,
  createCourse,
  updateCourse,
  deleteCourse,
  createUser,
  updateUser,
  deleteUser,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem
} from './data/mockData';
import { Course, Quiz, User as UserType, Conversation, Message } from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCourseBuilder, setShowCourseBuilder] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    addNotification 
  } = useNotifications(user?.id || '');
  
  const { 
    isSupported: isPushSupported, 
    permission: pushPermission, 
    sendNotification 
  } = usePushNotifications();

  const mockConversations: Conversation[] = [
    {
      id: '1',
      participants: [user!, mockUsers.find(u => u.id !== user?.id)!].filter(Boolean),
      lastMessage: {
        id: '1',
        senderId: mockUsers.find(u => u.id !== user?.id)?.id || '',
        receiverId: user?.id || '',
        content: 'Hi! I have a question about the React course.',
        timestamp: new Date(),
        read: false,
        type: 'text',
      },
      unreadCount: 1,
    },
  ];

  if (!user) {
    return (
      <AuthForm
        isLogin={isLoginMode}
        onToggle={() => setIsLoginMode(!isLoginMode)}
      />
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  const renderContent = () => {
    if (showProfileEditor) {
      return (
        <ProfileEditor
          onSave={(updates) => {
            console.log('Profile updated:', updates);
            setShowProfileEditor(false);
            addNotification({
              userId: user.id,
              title: 'Profile Updated',
              message: 'Your profile has been updated successfully.',
              type: 'success',
              read: false,
            });
          }}
          onCancel={() => setShowProfileEditor(false)}
        />
      );
    }

    if (showCourseBuilder) {
      return (
        <CourseBuilder
          course={editingCourse || undefined}
          onSave={(courseData) => {
            console.log('Saving course:', courseData);
            setShowCourseBuilder(false);
            setEditingCourse(null);
            addNotification({
              userId: user.id,
              title: 'Course Saved',
              message: `Course "${courseData.title}" has been saved successfully.`,
              type: 'success',
              read: false,
            });
          }}
          onCancel={() => {
            setShowCourseBuilder(false);
            setEditingCourse(null);
          }}
        />
      );
    }

    if (showQuizBuilder) {
      return (
        <QuizBuilder
          quiz={editingQuiz || undefined}
          courseId="1"
          onSave={(quizData) => {
            console.log('Saving quiz:', quizData);
            setShowQuizBuilder(false);
            setEditingQuiz(null);
            addNotification({
              userId: user.id,
              title: 'Quiz Saved',
              message: `Quiz "${quizData.title}" has been saved successfully.`,
              type: 'success',
              read: false,
            });
          }}
          onCancel={() => {
            setShowQuizBuilder(false);
            setEditingQuiz(null);
          }}
        />
      );
    }

    if (activeQuiz) {
      return (
        <QuizEngine
          quiz={activeQuiz}
          onComplete={(attempt) => {
            console.log('Quiz completed:', attempt);
            setActiveQuiz(null);
            addNotification({
              userId: user.id,
              title: 'Quiz Completed',
              message: `You scored ${attempt.score}% on "${activeQuiz.title}".`,
              type: attempt.score! >= activeQuiz.passingScore ? 'success' : 'warning',
              read: false,
            });
          }}
          onExit={() => setActiveQuiz(null)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'courses':
        return (
          <CourseList
            courses={mockCourses}
            onCreateCourse={() => {
              setEditingCourse(null);
              setShowCourseBuilder(true);
            }}
            onEditCourse={(course) => {
              setEditingCourse(course);
              setShowCourseBuilder(true);
            }}
            onDeleteCourse={(courseId) => {
              const deleted = deleteCourse(courseId);
              if (deleted) {
                console.log('Deleted course:', courseId);
                addNotification({
                  userId: user.id,
                  title: 'Course Deleted',
                  message: 'Course has been deleted successfully.',
                  type: 'success',
                  read: false,
                });
              }
            }}
            onEnrollCourse={(courseId) => {
              console.log('Enroll in course:', courseId);
              addNotification({
                userId: user.id,
                title: 'Enrollment Successful',
                message: 'You have successfully enrolled in the course.',
                type: 'success',
                read: false,
              });
            }}
            onViewCourse={(courseId) => {
              console.log('View course:', courseId);
            }}
          />
        );
      case 'analytics':
        return <AnalyticsDashboard userRole={user.role} />;
      case 'users':
        return (
          <UserManagement
            users={mockUsers}
            onCreateUser={(userData) => {
              const newUser = createUser(userData);
              console.log('Created user:', newUser);
              addNotification({
                userId: user.id,
                title: 'User Created',
                message: `User ${newUser.firstName} ${newUser.lastName} has been created successfully.`,
                type: 'success',
                read: false,
              });
            }}
            onUpdateUser={(userId, updates) => {
              const updatedUser = updateUser(userId, updates);
              console.log('Updated user:', updatedUser);
              addNotification({
                userId: user.id,
                title: 'User Updated',
                message: 'User has been updated successfully.',
                type: 'success',
                read: false,
              });
            }}
            onDeleteUser={(userId) => {
              const deleted = deleteUser(userId);
              if (deleted) {
                console.log('Deleted user:', userId);
                addNotification({
                  userId: user.id,
                  title: 'User Deleted',
                  message: 'User has been deleted successfully.',
                  type: 'success',
                  read: false,
                });
              }
            }}
            onToggleUserStatus={(userId) => {
              const userToUpdate = mockUsers.find(u => u.id === userId);
              if (userToUpdate) {
                updateUser(userId, { isActive: !userToUpdate.isActive });
                console.log('Toggled user status:', userId);
                addNotification({
                  userId: user.id,
                  title: 'User Status Updated',
                  message: `User has been ${userToUpdate.isActive ? 'deactivated' : 'activated'}.`,
                  type: 'info',
                  read: false,
                });
              }
            }}
          />
        );
      case 'notifications':
        return (
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDelete={deleteNotification}
          />
        );
      case 'messages':
        return (
          <MessageCenter
            currentUser={user}
            conversations={mockConversations}
            onSendMessage={(receiverId, content, type) => {
              console.log('Sending message:', { receiverId, content, type });
              addNotification({
                userId: user.id,
                title: 'Message Sent',
                message: 'Your message has been sent successfully.',
                type: 'success',
                read: false,
              });
            }}
          />
        );
      case 'quizzes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.role === 'student' ? 'My Quizzes' : 'Quiz Management'}
              </h1>
              {(user.role === 'admin' || user.role === 'teacher') && (
                <button
                  onClick={() => setShowQuizBuilder(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Quiz
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock quiz cards */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">React Fundamentals Quiz</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Test your knowledge of React basics</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">10 questions • 30 min</span>
                  <button
                    onClick={() => setActiveQuiz({
                      id: '1',
                      courseId: '1',
                      title: 'React Fundamentals Quiz',
                      description: 'Test your knowledge of React basics including components, props, and state.',
                      timeLimit: 30,
                      maxAttempts: 3,
                      passingScore: 70,
                      randomizeQuestions: true,
                      createdAt: new Date(),
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
                      ],
                    })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'certificates':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">React Fundamentals</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Completed on January 15, 2024</p>
                <button
                  onClick={() => {
                    // Navigate to certificate view
                    console.log('Viewing certificate');
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <CalendarView
            events={mockCalendarEvents}
            todos={mockTodoItems}
            onCreateEvent={(eventData) => {
              const newEvent = createCalendarEvent(eventData);
              console.log('Created event:', newEvent);
              addNotification({
                userId: user.id,
                title: 'Event Created',
                message: `Event "${newEvent.title}" has been created successfully.`,
                type: 'success',
                read: false,
              });
            }}
            onUpdateEvent={(id, updates) => {
              const updatedEvent = updateCalendarEvent(id, updates);
              console.log('Updated event:', updatedEvent);
              addNotification({
                userId: user.id,
                title: 'Event Updated',
                message: 'Event has been updated successfully.',
                type: 'success',
                read: false,
              });
            }}
            onDeleteEvent={(id) => {
              const deleted = deleteCalendarEvent(id);
              if (deleted) {
                console.log('Deleted event:', id);
                addNotification({
                  userId: user.id,
                  title: 'Event Deleted',
                  message: 'Event has been deleted successfully.',
                  type: 'success',
                  read: false,
                });
              }
            }}
            onCreateTodo={(todoData) => {
              const newTodo = createTodoItem(todoData);
              console.log('Created todo:', newTodo);
              addNotification({
                userId: user.id,
                title: 'Task Created',
                message: `Task "${newTodo.title}" has been created successfully.`,
                type: 'success',
                read: false,
              });
            }}
            onUpdateTodo={(id, updates) => {
              const updatedTodo = updateTodoItem(id, updates);
              console.log('Updated todo:', updatedTodo);
              if (updates.completed !== undefined) {
                addNotification({
                  userId: user.id,
                  title: updates.completed ? 'Task Completed' : 'Task Reopened',
                  message: `Task has been ${updates.completed ? 'completed' : 'reopened'}.`,
                  type: 'success',
                  read: false,
                });
              }
            }}
            onDeleteTodo={(id) => {
              const deleted = deleteTodoItem(id);
              if (deleted) {
                console.log('Deleted todo:', id);
                addNotification({
                  userId: user.id,
                  title: 'Task Deleted',
                  message: 'Task has been deleted successfully.',
                  type: 'success',
                  read: false,
                });
              }
            }}
          />
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
              <button
                onClick={() => setShowProfileEditor(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={user.avatar || `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={user.firstName}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={user.lastName}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user.role}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white capitalize"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{activeTab}</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">This feature is coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;