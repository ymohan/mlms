import React, { useState } from 'react';
import { Course, CourseContent } from '../../types';
import { Plus, Trash2, Save, Eye, Upload, Video, FileText, Image, Music, Code, GripVertical } from 'lucide-react';

interface CourseBuilderProps {
  course?: Course;
  onSave: (course: Partial<Course>) => void;
  onCancel: () => void;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ course, onSave, onCancel }) => {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [difficulty, setDifficulty] = useState<Course['difficulty']>(course?.difficulty || 'beginner');
  const [price, setPrice] = useState(course?.price || 0);
  const [thumbnail, setThumbnail] = useState(course?.thumbnail || '');
  const [methodologies, setMethodologies] = useState<string[]>(course?.methodologies || []);
  const [content, setContent] = useState<CourseContent[]>(course?.content || []);
  const [activeTab, setActiveTab] = useState<'details' | 'content'>('details');
  const [newMethodology, setNewMethodology] = useState('');

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

  const addMethodology = (methodology: string) => {
    if (!methodologies.includes(methodology)) {
      setMethodologies([...methodologies, methodology]);
    }
  };

  const removeMethodology = (methodology: string) => {
    setMethodologies(methodologies.filter(m => m !== methodology));
  };

  const addCustomMethodology = () => {
    if (newMethodology.trim() && !methodologies.includes(newMethodology.trim())) {
      setMethodologies([...methodologies, newMethodology.trim()]);
      setNewMethodology('');
    }
  };

  const addContent = (type: CourseContent['type']) => {
    const newContent: CourseContent = {
      id: Date.now().toString(),
      type,
      title: '',
      content: '',
      order: content.length + 1,
    };
    setContent([...content, newContent]);
    setActiveTab('content');
  };

  const updateContent = (index: number, updates: Partial<CourseContent>) => {
    const updatedContent = [...content];
    updatedContent[index] = { ...updatedContent[index], ...updates };
    setContent(updatedContent);
  };

  const deleteContent = (index: number) => {
    const updatedContent = content.filter((_, i) => i !== index);
    // Reorder remaining content
    updatedContent.forEach((item, i) => {
      item.order = i + 1;
    });
    setContent(updatedContent);
  };

  const moveContent = (index: number, direction: 'up' | 'down') => {
    const newContent = [...content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newContent.length) {
      [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
      // Update order
      newContent.forEach((item, i) => {
        item.order = i + 1;
      });
      setContent(newContent);
    }
  };

  const getContentIcon = (type: CourseContent['type']) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'text': return <FileText className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      case 'code': return <Code className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const handleSave = () => {
    const courseData: Partial<Course> = {
      id: course?.id || Date.now().toString(),
      title,
      description,
      difficulty,
      price,
      thumbnail,
      methodologies,
      content,
      instructor: course?.instructor || 'Current User', // This would come from auth context
      instructorId: course?.instructorId || 'current-user-id',
      enrollment: course?.enrollment || 0,
      rating: course?.rating || 0,
      status: 'pending',
      createdAt: course?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSave(courseData);
  };

  const isValid = title.trim() && description.trim() && methodologies.length > 0;

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
                Build an engaging learning experience for your students
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
                disabled={!isValid}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Course Details
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Course Content ({content.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what students will learn in this course..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teaching Methodologies *
                </label>
                
                {/* Selected Methodologies */}
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

                {/* Available Methodologies */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
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

                {/* Custom Methodology */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMethodology}
                    onChange={(e) => setNewMethodology(e.target.value)}
                    placeholder="Add custom methodology..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomMethodology()}
                  />
                  <button
                    onClick={addCustomMethodology}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Course Content
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addContent('video')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </button>
                  <button
                    onClick={() => addContent('text')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Text</span>
                  </button>
                  <button
                    onClick={() => addContent('image')}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Image className="w-4 h-4" />
                    <span>Image</span>
                  </button>
                  <button
                    onClick={() => addContent('audio')}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    <Music className="w-4 h-4" />
                    <span>Audio</span>
                  </button>
                </div>
              </div>

              {content.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Start building your course by adding content</p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => addContent('video')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Video
                    </button>
                    <button
                      onClick={() => addContent('text')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Text
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {content.map((item, index) => (
                    <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                            {getContentIcon(item.type)}
                          </div>
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => moveContent(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <button
                              onClick={() => moveContent(index, 'down')}
                              disabled={index === content.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              ↓
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 mr-4">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateContent(index, { title: e.target.value })}
                                placeholder="Content title..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <button
                              onClick={() => deleteContent(index)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {item.type === 'video' ? 'Video URL' : 
                                 item.type === 'image' ? 'Image URL' :
                                 item.type === 'audio' ? 'Audio URL' : 'Content'}
                              </label>
                              {item.type === 'text' ? (
                                <textarea
                                  value={item.content}
                                  onChange={(e) => updateContent(index, { content: e.target.value })}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter your content..."
                                />
                              ) : (
                                <input
                                  type="url"
                                  value={item.content}
                                  onChange={(e) => updateContent(index, { content: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                  placeholder={`Enter ${item.type} URL...`}
                                />
                              )}
                            </div>

                            {item.type === 'video' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Duration (minutes)
                                </label>
                                <input
                                  type="number"
                                  value={item.duration || ''}
                                  onChange={(e) => updateContent(index, { duration: Number(e.target.value) })}
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                  placeholder="Duration in minutes"
                                />
                              </div>
                            )}
                          </div>

                          {item.type === 'video' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Transcript (Optional)
                              </label>
                              <textarea
                                value={item.transcript || ''}
                                onChange={(e) => updateContent(index, { transcript: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="Add video transcript for accessibility..."
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;