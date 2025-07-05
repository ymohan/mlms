import React, { useState } from 'react';
import { Course } from '../../types';
import CourseCard from './CourseCard';
import CourseDetail from './CourseDetail';
import { Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface CourseListProps {
  courses: Course[];
  onCreateCourse?: () => void;
  onEditCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onEnrollCourse?: (courseId: string) => void;
  onViewCourse?: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  onCreateCourse, 
  onEditCourse,
  onDeleteCourse,
  onEnrollCourse, 
  onViewCourse 
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterMethodology, setFilterMethodology] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filterDifficulty === 'all' || course.difficulty === filterDifficulty;
    
    const matchesMethodology = filterMethodology === 'all' || 
                               course.methodologies.some(method => method.toLowerCase().includes(filterMethodology.toLowerCase()));
    
    return matchesSearch && matchesDifficulty && matchesMethodology;
  });

  const getAllMethodologies = () => {
    const methodologies = new Set<string>();
    courses.forEach(course => {
      course.methodologies.forEach(method => methodologies.add(method));
    });
    return Array.from(methodologies);
  };

  const methodologies = getAllMethodologies();

  const handleViewCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setViewMode('detail');
    }
    onViewCourse?.(courseId);
  };

  const handleBackToList = () => {
    setSelectedCourse(null);
    setViewMode('list');
  };

  if (viewMode === 'detail' && selectedCourse) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBackToList}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>← Back to Courses</span>
        </button>
        <CourseDetail
          course={selectedCourse}
          onEdit={() => onEditCourse?.(selectedCourse)}
          onDelete={() => {
            onDeleteCourse?.(selectedCourse.id);
            handleBackToList();
          }}
          onEnroll={() => onEnrollCourse?.(selectedCourse.id)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('common.courses')}</h1>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button
            onClick={onCreateCourse}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('courses.createCourse')}</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search') + ' ' + t('common.courses').toLowerCase() + '...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">{t('common.all')} {t('courses.difficulty')}</option>
          <option value="beginner">{t('courses.beginner')}</option>
          <option value="intermediate">{t('courses.intermediate')}</option>
          <option value="advanced">{t('courses.advanced')}</option>
        </select>

        <select
          value={filterMethodology}
          onChange={(e) => setFilterMethodology(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">{t('common.all')} Methodologies</option>
          {methodologies.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredCourses.length} of {courses.length} {t('common.courses').toLowerCase()}
          </span>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={onEnrollCourse}
            onView={handleViewCourse}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No {t('common.courses').toLowerCase()} found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;