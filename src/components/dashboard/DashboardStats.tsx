import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrendingUp, Users, BookOpen, Award, DollarSign, Clock } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { label: t('dashboard.totalUsers'), value: '1,234', icon: Users, color: 'bg-blue-500', change: '+12%' },
          { label: t('dashboard.activeCourses'), value: '89', icon: BookOpen, color: 'bg-green-500', change: '+5%' },
          { label: t('dashboard.completionRate'), value: '78%', icon: TrendingUp, color: 'bg-purple-500', change: '+3%' },
          { label: t('dashboard.revenue'), value: '$52,340', icon: DollarSign, color: 'bg-orange-500', change: '+18%' },
        ];
      case 'teacher':
        return [
          { label: 'My Courses', value: '12', icon: BookOpen, color: 'bg-blue-500', change: '+2' },
          { label: 'Total Students', value: '456', icon: Users, color: 'bg-green-500', change: '+23' },
          { label: 'Avg. Completion', value: '82%', icon: TrendingUp, color: 'bg-purple-500', change: '+5%' },
          { label: 'Hours Taught', value: '124', icon: Clock, color: 'bg-orange-500', change: '+8' },
        ];
      case 'student':
        return [
          { label: 'Enrolled Courses', value: '8', icon: BookOpen, color: 'bg-blue-500', change: '+2' },
          { label: 'Completed', value: '5', icon: Award, color: 'bg-green-500', change: '+1' },
          { label: 'Progress', value: '65%', icon: TrendingUp, color: 'bg-purple-500', change: '+12%' },
          { label: 'Study Hours', value: '47', icon: Clock, color: 'bg-orange-500', change: '+5' },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;