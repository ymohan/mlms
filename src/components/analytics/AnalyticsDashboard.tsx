import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, BookOpen, Award, DollarSign, Clock, Download, Filter } from 'lucide-react';

interface AnalyticsDashboardProps {
  userRole: 'admin' | 'teacher' | 'student';
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userRole }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'users' | 'courses' | 'revenue' | 'engagement'>('users');

  // Mock data - in real app, this would come from API
  const userGrowthData = [
    { date: '2024-01-01', users: 1200, newUsers: 45, activeUsers: 890 },
    { date: '2024-01-02', users: 1245, newUsers: 52, activeUsers: 920 },
    { date: '2024-01-03', users: 1297, newUsers: 38, activeUsers: 945 },
    { date: '2024-01-04', users: 1335, newUsers: 41, activeUsers: 967 },
    { date: '2024-01-05', users: 1376, newUsers: 55, activeUsers: 1012 },
    { date: '2024-01-06', users: 1431, newUsers: 48, activeUsers: 1034 },
    { date: '2024-01-07', users: 1479, newUsers: 62, activeUsers: 1089 },
  ];

  const courseCompletionData = [
    { course: 'React Fundamentals', completed: 85, enrolled: 120, completionRate: 71 },
    { course: 'JavaScript Advanced', completed: 72, enrolled: 98, completionRate: 73 },
    { course: 'Node.js Backend', completed: 58, enrolled: 85, completionRate: 68 },
    { course: 'UI/UX Design', completed: 62, enrolled: 89, completionRate: 70 },
    { course: 'Python Data Science', completed: 45, enrolled: 67, completionRate: 67 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000, subscriptions: 120, oneTime: 3000 },
    { month: 'Feb', revenue: 15000, subscriptions: 145, oneTime: 4200 },
    { month: 'Mar', revenue: 18000, subscriptions: 167, oneTime: 5100 },
    { month: 'Apr', revenue: 20000, subscriptions: 189, oneTime: 4800 },
    { month: 'May', revenue: 22000, subscriptions: 201, oneTime: 6200 },
    { month: 'Jun', revenue: 25000, subscriptions: 234, oneTime: 7100 },
  ];

  const engagementData = [
    { day: 'Mon', sessions: 1200, avgDuration: 45, pageViews: 3400 },
    { day: 'Tue', sessions: 1350, avgDuration: 52, pageViews: 3800 },
    { day: 'Wed', sessions: 1180, avgDuration: 48, pageViews: 3200 },
    { day: 'Thu', sessions: 1420, avgDuration: 55, pageViews: 4100 },
    { day: 'Fri', sessions: 1380, avgDuration: 51, pageViews: 3900 },
    { day: 'Sat', sessions: 980, avgDuration: 38, pageViews: 2800 },
    { day: 'Sun', sessions: 850, avgDuration: 35, pageViews: 2400 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 20, color: '#F59E0B' },
  ];

  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
        return [
          { label: 'Total Users', value: '1,479', icon: Users, color: 'bg-blue-500', change: '+12.5%', trend: 'up' },
          { label: 'Active Courses', value: '89', icon: BookOpen, color: 'bg-green-500', change: '+5.2%', trend: 'up' },
          { label: 'Revenue', value: '$25,000', icon: DollarSign, color: 'bg-purple-500', change: '+18.3%', trend: 'up' },
          { label: 'Avg. Completion', value: '71%', icon: Award, color: 'bg-orange-500', change: '+3.1%', trend: 'up' },
        ];
      case 'teacher':
        return [
          { label: 'My Students', value: '456', icon: Users, color: 'bg-blue-500', change: '+8.2%', trend: 'up' },
          { label: 'My Courses', value: '12', icon: BookOpen, color: 'bg-green-500', change: '+2', trend: 'up' },
          { label: 'Avg. Rating', value: '4.8', icon: Award, color: 'bg-purple-500', change: '+0.2', trend: 'up' },
          { label: 'Hours Taught', value: '124', icon: Clock, color: 'bg-orange-500', change: '+15', trend: 'up' },
        ];
      case 'student':
        return [
          { label: 'Courses Enrolled', value: '8', icon: BookOpen, color: 'bg-blue-500', change: '+2', trend: 'up' },
          { label: 'Completed', value: '5', icon: Award, color: 'bg-green-500', change: '+1', trend: 'up' },
          { label: 'Study Hours', value: '47', icon: Clock, color: 'bg-purple-500', change: '+12', trend: 'up' },
          { label: 'Avg. Score', value: '87%', icon: TrendingUp, color: 'bg-orange-500', change: '+5%', trend: 'up' },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  const exportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {userRole === 'admin' ? 'Platform-wide analytics and insights' :
             userRole === 'teacher' ? 'Your teaching performance and student progress' :
             'Your learning progress and achievements'}
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth / Student Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {userRole === 'admin' ? 'User Growth' : userRole === 'teacher' ? 'Student Progress' : 'Learning Progress'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedMetric('users')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedMetric === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setSelectedMetric('engagement')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedMetric === 'engagement' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Engagement
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="activeUsers" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="course" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="completionRate" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart (Admin only) */}
        {userRole === 'admin' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Device Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Courses</h3>
          <div className="space-y-4">
            {courseCompletionData.slice(0, 5).map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{course.course}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course.completed}/{course.enrolled} completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{course.completionRate}%</p>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New user registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
              { action: 'Course completed', user: 'Jane Smith', time: '15 minutes ago', type: 'completion' },
              { action: 'Quiz submitted', user: 'Mike Johnson', time: '1 hour ago', type: 'quiz' },
              { action: 'New course published', user: 'Sarah Wilson', time: '2 hours ago', type: 'course' },
              { action: 'Certificate issued', user: 'Alex Brown', time: '3 hours ago', type: 'certificate' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'completion' ? 'bg-green-500' :
                  activity.type === 'quiz' ? 'bg-yellow-500' :
                  activity.type === 'course' ? 'bg-purple-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;