import React, { useState } from 'react';
import { Course, CourseContent } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Edit, 
  Trash2, 
  Plus,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Video,
  Image as ImageIcon,
  Music,
  Code
} from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  onEdit?: () => void;
  onDelete?: () => void;
  onEnroll?: () => void;
  onAddContent?: () => void;
  onEditContent?: (content: CourseContent) => void;
  onDeleteContent?: (contentId: string) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onEdit,
  onDelete,
  onEnroll,
  onAddContent,
  onEditContent,
  onDeleteContent,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeContent, setActiveContent] = useState<CourseContent | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);

  const canEdit = user?.role === 'admin' || (user?.role === 'teacher' && course.instructorId === user.id);
  const isEnrolled = true; // This would come from enrollment data

  const getContentIcon = (type: CourseContent['type']) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-600" />;
      case 'text': return <FileText className="w-5 h-5 text-green-600" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-purple-600" />;
      case 'audio': return <Music className="w-5 h-5 text-orange-600" />;
      case 'code': return <Code className="w-5 h-5 text-red-600" />;
      default: return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderContentViewer = () => {
    if (!activeContent) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getContentIcon(activeContent.type)}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeContent.title}
            </h3>
          </div>
          {canEdit && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEditContent?.(activeContent)}
                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteContent?.(activeContent.id)}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="content-viewer">
          {activeContent.type === 'video' && (
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <p>Video Player</p>
                <p className="text-sm opacity-75">{activeContent.content}</p>
              </div>
            </div>
          )}

          {activeContent.type === 'text' && (
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
                {activeContent.content}
              </div>
            </div>
          )}

          {activeContent.type === 'image' && (
            <div className="text-center">
              <img
                src={activeContent.content}
                alt={activeContent.title}
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            </div>
          )}

          {activeContent.type === 'audio' && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">Audio Player</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{activeContent.content}</p>
            </div>
          )}

          {activeContent.type === 'code' && (
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{activeContent.content}</code>
              </pre>
            </div>
          )}

          {activeContent.transcript && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Transcript</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{activeContent.transcript}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Course Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="relative h-64">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {t(`courses.${course.difficulty}`)}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="text-sm">{course.rating}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-lg opacity-90">By {course.instructor}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('courses.duration')}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{course.duration} hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('courses.enrollment')}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{course.enrollment.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Content</p>
                <p className="font-semibold text-gray-900 dark:text-white">{course.content.length} items</p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Teaching Methodologies</h3>
            <div className="flex flex-wrap gap-2">
              {course.methodologies.map((methodology, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                >
                  {methodology}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${course.price}
            </div>
            <div className="flex space-x-3">
              {canEdit && (
                <>
                  <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{t('common.edit')}</span>
                  </button>
                  <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('common.delete')}</span>
                  </button>
                </>
              )}
              {!isEnrolled && user?.role === 'student' && (
                <button
                  onClick={onEnroll}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{t('courses.enrollCourse')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Content</h3>
            {canEdit && (
              <button
                onClick={onAddContent}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {course.content.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No content available yet
              </p>
            ) : (
              course.content
                .sort((a, b) => a.order - b.order)
                .map((content, index) => (
                  <button
                    key={content.id}
                    onClick={() => setActiveContent(content)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeContent?.id === content.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
                        {index + 1}
                      </span>
                      {getContentIcon(content.type)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {content.title}
                        </p>
                        {content.duration && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDuration(content.duration)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))
            )}
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-2">
          {activeContent ? (
            renderContentViewer()
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select Content to View
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose an item from the course content list to start learning
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;