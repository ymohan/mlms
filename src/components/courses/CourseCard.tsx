import React from 'react';
import { Course } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Clock, Users, Star, Play, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onView?: (courseId: string) => void;
  showActions?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, onView, showActions = true }) => {
  const { t } = useLanguage();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
            {t(`courses.${course.difficulty}`)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-black/50 text-white">
            ${course.price}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{course.description}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('courses.instructor')}: {course.instructor}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{course.duration}h</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{course.enrollment}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{course.rating}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {course.methodologies.slice(0, 3).map((methodology, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                {methodology}
              </span>
            ))}
            {course.methodologies.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{course.methodologies.length - 3} more
              </span>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-3">
            <button
              onClick={() => onView?.(course.id)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('common.view')}</span>
            </button>
            <button
              onClick={() => onEnroll?.(course.id)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>{t('courses.enrollCourse')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;