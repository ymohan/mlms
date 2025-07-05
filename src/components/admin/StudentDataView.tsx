import React, { useState } from 'react';
import { User, Course, Quiz, QuizAttempt } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  User as UserIcon, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  Download,
  Eye,
  Search,
  Filter,
  BarChart3,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF, formatUsersForExport } from '../../utils/exportUtils';

interface StudentDataViewProps {
  students: User[];
  courses: Course[];
  quizAttempts: QuizAttempt[];
  onViewStudent: (studentId: string) => void;
}

const StudentDataView: React.FC<StudentDataViewProps> = ({
  students,
  courses,
  quizAttempts,
  onViewStudent,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'individual'>('list');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && student.isActive) ||
                         (filterStatus === 'inactive' && !student.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const getStudentStats = (studentId: string) => {
    const studentAttempts = quizAttempts.filter(attempt => attempt.userId === studentId);
    const enrolledCourses = 5; // Mock data - would come from enrollment records
    const completedCourses = 3; // Mock data
    const avgScore = studentAttempts.length > 0 
      ? studentAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / studentAttempts.length 
      : 0;
    
    return {
      enrolledCourses,
      completedCourses,
      quizzesTaken: studentAttempts.length,
      avgScore: Math.round(avgScore),
      studyHours: Math.floor(Math.random() * 100) + 20, // Mock data
    };
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const exportData = formatUsersForExport(filteredStudents);
    const filename = `students_${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'csv':
        exportToCSV(exportData, filename);
        break;
      case 'excel':
        exportToExcel(exportData, filename);
        break;
      case 'pdf':
        exportToPDF(exportData, filename, 'Student Data Report');
        break;
    }
  };

  const renderIndividualView = () => {
    if (!selectedStudent) return null;
    
    const stats = getStudentStats(selectedStudent.id);
    const studentAttempts = quizAttempts.filter(attempt => attempt.userId === selectedStudent.id);
    
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setViewMode('list');
            setSelectedStudent(null);
          }}
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Back to Students List
        </button>

        {/* Student Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-6 mb-6">
            <img
              src={selectedStudent.avatar || `https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1`}
              alt="Student"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{selectedStudent.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedStudent.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {selectedStudent.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Joined {selectedStudent.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.enrolledCourses}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedCourses}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.quizzesTaken}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quizzes</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgScore}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Score</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.studyHours}h</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Study Time</p>
            </div>
          </div>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Quiz Attempts</h3>
          <div className="space-y-3">
            {studentAttempts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No quiz attempts yet</p>
            ) : (
              studentAttempts.slice(0, 5).map((attempt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Quiz #{attempt.quizId}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completed on {attempt.completedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      attempt.score >= 70 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {attempt.score}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Data</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and analyze student performance data
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredStudents.length} students
            </span>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => {
          const stats = getStudentStats(student.id);
          
          return (
            <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={student.avatar || `https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1`}
                  alt="Student"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                    student.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.enrolledCourses}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.avgScore}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Score</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.quizzesTaken}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quizzes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.studyHours}h</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Study Time</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedStudent(student);
                  setViewMode('individual');
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );

  return viewMode === 'individual' ? renderIndividualView() : renderListView();
};

export default StudentDataView;