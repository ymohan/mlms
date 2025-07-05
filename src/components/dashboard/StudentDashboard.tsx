import React from 'react';
import DashboardStats from './DashboardStats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Play, Clock, Star, Award, BookOpen } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const progressData = [
    { week: 'Week 1', completed: 20, target: 25 },
    { week: 'Week 2', completed: 35, target: 40 },
    { week: 'Week 3', completed: 45, target: 50 },
    { week: 'Week 4', completed: 60, target: 65 },
    { week: 'Week 5', completed: 75, target: 80 },
    { week: 'Week 6', completed: 85, target: 90 },
  ];

  const skillsData = [
    { skill: 'JavaScript', progress: 85, color: '#F59E0B' },
    { skill: 'React', progress: 70, color: '#3B82F6' },
    { skill: 'Node.js', progress: 60, color: '#10B981' },
    { skill: 'CSS', progress: 90, color: '#8B5CF6' },
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'React Fundamentals',
      instructor: 'Sarah Johnson',
      progress: 75,
      duration: '2h 30m',
      thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      lastAccessed: '2 hours ago',
    },
    {
      id: 2,
      title: 'JavaScript Advanced',
      instructor: 'Mike Chen',
      progress: 45,
      duration: '3h 15m',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      lastAccessed: '1 day ago',
    },
    {
      id: 3,
      title: 'Node.js Backend',
      instructor: 'David Wilson',
      progress: 30,
      duration: '4h 45m',
      thumbnail: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      lastAccessed: '3 days ago',
    },
  ];

  const upcomingDeadlines = [
    { task: 'JavaScript Quiz #3', course: 'JavaScript Advanced', due: '2024-01-20', priority: 'high' },
    { task: 'React Project Submission', course: 'React Fundamentals', due: '2024-01-22', priority: 'medium' },
    { task: 'Node.js Assignment', course: 'Node.js Backend', due: '2024-01-25', priority: 'low' },
  ];

  const achievements = [
    { name: 'Fast Learner', description: 'Completed 3 courses in a month', icon: '⚡', earned: true },
    { name: 'Quiz Master', description: 'Scored 100% on 5 quizzes', icon: '🏆', earned: true },
    { name: 'Code Warrior', description: 'Submitted 10 coding assignments', icon: '💻', earned: false },
    { name: 'Community Helper', description: 'Helped 10 fellow students', icon: '🤝', earned: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse Courses
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Take Quiz
          </button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#6B7280" />
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
              <Line type="monotone" dataKey="target" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills Progress</h3>
          <div className="space-y-4">
            {skillsData.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.skill}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{skill.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progress}%`, backgroundColor: skill.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Courses</h3>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.instructor}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{course.duration}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{course.lastAccessed}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.progress}%</span>
                  </div>
                  <button className="mt-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    deadline.priority === 'high' ? 'bg-red-500' :
                    deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{deadline.task}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{deadline.course}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{deadline.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              achievement.earned 
                ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
            }`}>
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className={`font-medium ${
                  achievement.earned ? 'text-yellow-800 dark:text-yellow-300' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;