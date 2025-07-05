import React, { useState, useCallback } from 'react';
import { Course, CourseContent } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Plus, 
  Trash2, 
  Save, 
  Upload, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Code,
  GripVertical,
  Link,
  Youtube,
  File,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

interface DragDropCourseBuilderProps {
  course?: Course;
  onSave: (course: Partial<Course>) => void;
  onCancel: () => void;
}

interface FileUpload {
  id: string;
  file: File;
  type: CourseContent['type'];
  progress: number;
  url?: string;
}

const DragDropCourseBuilder: React.FC<DragDropCourseBuilderProps> = ({ 
  course, 
  onSave, 
  onCancel 
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [difficulty, setDifficulty] = useState<Course['difficulty']>(course?.difficulty || 'beginner');
  const [price, setPrice] = useState(course?.price || 0);
  const [thumbnail, setThumbnail] = useState(course?.thumbnail || '');
  const [methodologies, setMethodologies] = useState<string[]>(course?.methodologies || []);
  const [content, setContent] = useState<CourseContent[]>(course?.content || []);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlForm, setUrlForm] = useState({ type: 'video' as CourseContent['type'], url: '', title: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableMethodologies = [
    'Total Physical Response (TPR)',
    'Natural Reading',
    'Joyful Learning',
    'Immersive Storytelling',
    'Interactive Learning',
    'Hands-on Practice',
    'Project-Based Learning',
    'Problem-Solving',
    'Code Review',
    'Peer Learning',
    'Real-world Applications',
    'Collaborative Learning',
    'Design Thinking',
    'Creative Problem Solving',
    'User-Centered Design',
    'Data-Driven Learning',
    'Case Studies',
    'Mobile-First Development',
    'Cross-Platform Learning',
  ];

  const getContentIcon = (type: CourseContent['type']) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-600" />;
      case 'text': return <FileText className="w-5 h-5 text-green-600" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-purple-600" />;
      case 'audio': return <Music className="w-5 h-5 text-orange-600" />;
      case 'code': return <Code className="w-5 h-5 text-red-600" />;
      default: return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Course description is required';
    }

    if (methodologies.length === 0) {
      newErrors.methodologies = 'At least one methodology is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null) return;

    const newContent = [...content];
    const draggedContent = newContent[draggedItem];
    
    // Remove dragged item
    newContent.splice(draggedItem, 1);
    
    // Insert at new position
    const insertIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
    newContent.splice(insertIndex, 0, draggedContent);
    
    // Update order
    newContent.forEach((item, index) => {
      item.order = index + 1;
    });
    
    setContent(newContent);
    setDraggedItem(null);
  };

  const handleFileUpload = useCallback((files: FileList, type: CourseContent['type']) => {
    Array.from(files).forEach(file => {
      // Validate file type
      const validTypes = {
        video: ['video/mp4', 'video/webm', 'video/ogg'],
        image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
        text: ['text/plain', 'text/markdown'],
        code: ['text/plain', 'application/javascript', 'text/html', 'text/css'],
      };

      if (type !== 'text' && type !== 'code' && !validTypes[type]?.some(validType => file.type.startsWith(validType.split('/')[0]))) {
        setErrors({ upload: `Invalid file type for ${type}` });
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setErrors({ upload: 'File size must be less than 100MB' });
        return;
      }

      const uploadId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newUpload: FileUpload = {
        id: uploadId,
        file,
        type,
        progress: 0,
      };

      setUploads(prev => [...prev, newUpload]);

      // Simulate file upload
      const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Create URL for the file (in real app, this would be the server response)
            const fileUrl = URL.createObjectURL(file);
            
            // Add to content
            const newContent: CourseContent = {
              id: uploadId,
              type,
              title: file.name.replace(/\.[^/.]+$/, ''),
              content: fileUrl,
              order: content.length + 1,
            };

            if (type === 'video' || type === 'audio') {
              // For media files, we could extract duration here
              newContent.duration = Math.floor(Math.random() * 600) + 60; // Mock duration
            }

            setContent(prev => [...prev, newContent]);
            setUploads(prev => prev.filter(upload => upload.id !== uploadId));
          }

          setUploads(prev => prev.map(upload => 
            upload.id === uploadId ? { ...upload, progress } : upload
          ));
        }, 100);
      };

      simulateUpload();
    });
  }, [content.length]);

  const handleDragDropUpload = (e: React.DragEvent, type: CourseContent['type']) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, type);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlForm.url.trim() || !urlForm.title.trim()) {
      setErrors({ url: 'URL and title are required' });
      return;
    }

    // Validate YouTube URL
    if (urlForm.type === 'video' && urlForm.url.includes('youtube.com')) {
      const videoId = urlForm.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (!videoId) {
        setErrors({ url: 'Invalid YouTube URL' });
        return;
      }
    }

    const newContent: CourseContent = {
      id: Date.now().toString(),
      type: urlForm.type,
      title: urlForm.title,
      content: urlForm.url,
      order: content.length + 1,
    };

    setContent(prev => [...prev, newContent]);
    setUrlForm({ type: 'video', url: '', title: '' });
    setShowUrlModal(false);
    setErrors({});
  };

  const addMethodology = (methodology: string) => {
    if (!methodologies.includes(methodology)) {
      setMethodologies([...methodologies, methodology]);
    }
  };

  const removeMethodology = (methodology: string) => {
    setMethodologies(methodologies.filter(m => m !== methodology));
  };

  const deleteContent = (index: number) => {
    const updatedContent = content.filter((_, i) => i !== index);
    updatedContent.forEach((item, i) => {
      item.order = i + 1;
    });
    setContent(updatedContent);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const courseData: Partial<Course> = {
      id: course?.id || Date.now().toString(),
      title,
      description,
      difficulty,
      price,
      thumbnail,
      methodologies,
      content,
      instructor: course?.instructor || 'Current User',
      instructorId: course?.instructorId || 'current-user-id',
      enrollment: course?.enrollment || 0,
      rating: course?.rating || 0,
      status: 'pending',
      createdAt: course?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSave(courseData);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {course ? 'Edit Course' : 'Create New Course'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Build an engaging learning experience with drag & drop functionality
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Course</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter course title"
              />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Course['difficulty'])}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Describe what students will learn in this course..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Teaching Methodologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teaching Methodologies *
            </label>
            
            {methodologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {methodologies.map((methodology) => (
                  <span
                    key={methodology}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                  >
                    {methodology}
                    <button
                      onClick={() => removeMethodology(methodology)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableMethodologies
                .filter(m => !methodologies.includes(m))
                .map((methodology) => (
                  <button
                    key={methodology}
                    onClick={() => addMethodology(methodology)}
                    className="text-left px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {methodology}
                  </button>
                ))}
            </div>
            {errors.methodologies && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.methodologies}</p>
            )}
          </div>

          {/* Content Builder */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Content
              </h3>
              <button
                onClick={() => setShowUrlModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Link className="w-4 h-4" />
                <span>Add URL</span>
              </button>
            </div>

            {/* Upload Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {[
                { type: 'video' as const, label: 'Video', icon: Video, color: 'blue' },
                { type: 'image' as const, label: 'Image', icon: ImageIcon, color: 'purple' },
                { type: 'audio' as const, label: 'Audio', icon: Music, color: 'orange' },
                { type: 'text' as const, label: 'Text', icon: FileText, color: 'green' },
                { type: 'code' as const, label: 'Code', icon: Code, color: 'red' },
              ].map(({ type, label, icon: Icon, color }) => (
                <div
                  key={type}
                  className={`border-2 border-dashed border-${color}-300 dark:border-${color}-700 rounded-lg p-6 text-center hover:border-${color}-400 dark:hover:border-${color}-600 transition-colors cursor-pointer`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDragDropUpload(e, type)}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    if (type === 'video') input.accept = 'video/*';
                    else if (type === 'image') input.accept = 'image/*';
                    else if (type === 'audio') input.accept = 'audio/*';
                    else if (type === 'text') input.accept = '.txt,.md';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handleFileUpload(files, type);
                    };
                    input.click();
                  }}
                >
                  <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400 mx-auto mb-2`} />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Drop files or click</p>
                </div>
              ))}
            </div>

            {/* Upload Progress */}
            {uploads.length > 0 && (
              <div className="mb-6 space-y-2">
                {uploads.map((upload) => (
                  <div key={upload.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getContentIcon(upload.type)}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {upload.file.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round(upload.progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content List */}
            <div className="space-y-3">
              {content.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Drag and drop files or click the upload areas above to add content
                  </p>
                </div>
              ) : (
                content.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                      draggedItem === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        {getContentIcon(item.type)}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {index + 1}.
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        {item.duration && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteContent(index)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add External Content
              </h3>
              <button
                onClick={() => setShowUrlModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content Type
                </label>
                <select
                  value={urlForm.type}
                  onChange={(e) => setUrlForm({ ...urlForm, type: e.target.value as CourseContent['type'] })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="video">Video (YouTube, Vimeo, etc.)</option>
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                  <option value="text">Text/Article</option>
                  <option value="code">Code Repository</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={urlForm.title}
                  onChange={(e) => setUrlForm({ ...urlForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={urlForm.url}
                    onChange={(e) => setUrlForm({ ...urlForm, url: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {urlForm.type === 'video' && urlForm.url.includes('youtube') && (
                    <Youtube className="absolute right-3 top-3 w-4 h-4 text-red-600" />
                  )}
                </div>
                {errors.url && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.url}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUrlModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {errors.upload && (
        <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{errors.upload}</span>
          <button
            onClick={() => setErrors({})}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DragDropCourseBuilder;