import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Users,
  GraduationCap,
  ClipboardList,
  Bell,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: t('common.dashboard'), icon: LayoutDashboard },
      { id: 'courses', label: t('common.courses'), icon: BookOpen },
      { id: 'calendar', label: t('common.calendar'), icon: Calendar },
      { id: 'profile', label: t('common.profile'), icon: User },
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'analytics', label: t('common.analytics'), icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ],
      teacher: [
        { id: 'analytics', label: t('common.analytics'), icon: BarChart3 },
        { id: 'quizzes', label: 'Quizzes', icon: ClipboardList },
        { id: 'students', label: 'Students', icon: GraduationCap },
      ],
      student: [
        { id: 'quizzes', label: 'My Quizzes', icon: ClipboardList },
        { id: 'certificates', label: 'Certificates', icon: Award },
      ],
    };

    return [...commonItems, ...roleSpecificItems[user?.role || 'student']];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">LMS</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('common.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;