import React from 'react';
import DashboardStats from './DashboardStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BookOpen, Users, Clock, TrendingUp, Star } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const coursePerformance = [
    { name: 'React Fundamentals', completion: 85, rating: 4.8, students: 120 },
    { name: 'JavaScript Advanced', completion: 72, rating: 4.6, students: 98 },
    { name: 'Node.js Backend', completion: 68, rating: 4.7, students: 85 },
    { name: 'Web Development', completion: 91, rating: 4.9, students: 156 },
  ];

  const weeklyProgress = [
    { day: 'Mon', completed: 12, started: 8 },
    { day: 'Tue', completed: 19, started: 15 },
    { day: 'Wed', completed: 15, started: 12 },
    { day: 'Thu', completed: 22, started: 18 },
    { day: 'Fri', completed: 18, started: 14 },
    { day: 'Sat', completed: 25, started: 20 },
    { day: 'Sun', completed: 16, started: 10 },
  ];

  const pendingTasks = [
    { task: 'Grade JavaScript Quiz #3', priority: 'high', due: '2024-01-20' },
    { task: 'Review React Project Submissions', priority: 'medium', due: '2024-01-22' },
    { task: 'Prepare Node.js Module 4', priority: 'low', due: '2024-01-25' },
    { task: 'Update Course Materials', priority: 'medium', due: '2024-01-23' },
  ];

  const recentFeedback = [
    { student: 'John Doe', course: 'React Fundamentals', rating: 5, comment: 'Excellent explanation of hooks!' },
    { student: 'Jane Smith', course: 'JavaScript Advanced', rating: 4, comment: 'Great examples, need more practice exercises.' },
    { student: 'Mike Johnson', course: 'Node.js Backend', rating: 5, comment: 'Perfect pace and clear instructions.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Course
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            New Quiz
          </button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coursePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="completion" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="started" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Tasks</h3>
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{task.task}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.due}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">{feedback.student}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{feedback.course}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;