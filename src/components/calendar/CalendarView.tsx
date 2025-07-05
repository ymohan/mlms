import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CalendarEvent, TodoItem } from '../../types';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Search,
  Bell,
  Check,
  X
} from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  todos: TodoItem[];
  onCreateEvent: (event: Partial<CalendarEvent>) => void;
  onUpdateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  onDeleteEvent: (id: string) => void;
  onCreateTodo: (todo: Partial<TodoItem>) => void;
  onUpdateTodo: (id: string, updates: Partial<TodoItem>) => void;
  onDeleteTodo: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  todos,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    date: Date | null;
  }>({ show: false, x: 0, y: 0, date: null });
  const [filterType, setFilterType] = useState<'all' | 'class' | 'quiz' | 'assignment' | 'meeting'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: new Date(),
    type: 'event' as CalendarEvent['type'],
    location: '',
    allDay: false,
    reminder: 15,
  });

  // Todo form state
  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium' as TodoItem['priority'],
  });

  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType || 
                       (filterType === 'meeting' && event.type === 'event');
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-500';
      case 'quiz': return 'bg-red-500';
      case 'assignment': return 'bg-yellow-500';
      case 'meeting': return 'bg-green-500';
      default: return 'bg-purple-500';
    }
  };

  const getPriorityColor = (priority: TodoItem['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateEvent = () => {
    onCreateEvent({
      ...eventForm,
      userId: 'current-user-id', // This would come from auth context
    });
    setEventForm({
      title: '',
      description: '',
      date: new Date(),
      type: 'event',
      location: '',
      allDay: false,
      reminder: 15,
    });
    setShowEventModal(false);
  };

  const handleUpdateEvent = () => {
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventForm);
      setEditingEvent(null);
      setShowEventModal(false);
    }
  };

  const handleCreateTodo = () => {
    onCreateTodo({
      ...todoForm,
      userId: 'current-user-id', // This would come from auth context
      completed: false,
    });
    setTodoForm({
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
    });
    setShowTodoModal(false);
  };

  const handleUpdateTodo = () => {
    if (editingTodo) {
      onUpdateTodo(editingTodo.id, todoForm);
      setEditingTodo(null);
      setShowTodoModal(false);
    }
  };

  const openEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      type: event.type,
      location: '',
      allDay: false,
      reminder: 15,
    });
    setShowEventModal(true);
  };

  const openEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setTodoForm({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
    });
    setShowTodoModal(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleRightClick = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      date: date,
    });
  };

  const handleContextMenuAction = (action: 'event' | 'todo') => {
    if (contextMenu.date) {
      if (action === 'event') {
        setEventForm({
          ...eventForm,
          date: contextMenu.date,
        });
        setShowEventModal(true);
      } else {
        setTodoForm({
          ...todoForm,
          dueDate: contextMenu.date,
        });
        setShowTodoModal(true);
      }
    }
    setContextMenu({ show: false, x: 0, y: 0, date: null });
  };

  // Close context menu when clicking elsewhere
  React.useEffect(() => {
    const handleClick = () => {
      setContextMenu({ show: false, x: 0, y: 0, date: null });
    };
    
    if (contextMenu.show) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu.show]);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getTodosForDate = (date: Date) => {
    return filteredTodos.filter(todo => 
      todo.dueDate.toDateString() === date.toDateString()
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('calendar.today')}
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 ${
                date ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
              }`}
              onContextMenu={date ? (e) => handleRightClick(e, date) : undefined}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-2 ${
                    date.toDateString() === new Date().toDateString()
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  {/* Events for this date */}
                  <div className="space-y-1">
                    {getEventsForDate(date).slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={() => openEditEvent(event)}
                        className={`text-xs p-1 rounded cursor-pointer text-white ${getEventTypeColor(event.type)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    
                    {/* Todos for this date */}
                    {getTodosForDate(date).slice(0, 1).map(todo => (
                      <div
                        key={todo.id}
                        onClick={() => openEditTodo(todo)}
                        className={`text-xs p-1 rounded cursor-pointer border-l-2 ${getPriorityColor(todo.priority)}`}
                      >
                        <div className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={(e) => {
                              e.stopPropagation();
                              onUpdateTodo(todo.id, { completed: e.target.checked });
                            }}
                            className="w-3 h-3"
                          />
                          <span className={todo.completed ? 'line-through' : ''}>{todo.title}</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show more indicator */}
                    {(getEventsForDate(date).length + getTodosForDate(date).length) > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{(getEventsForDate(date).length + getTodosForDate(date).length) - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingEvents = filteredEvents
      .filter(event => event.date >= today && event.date <= nextWeek)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    const upcomingTodos = filteredTodos
      .filter(todo => todo.dueDate >= today && todo.dueDate <= nextWeek && !todo.completed)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('calendar.upcomingEvents')}
          </h3>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">{t('calendar.noEvents')}</p>
            ) : (
              upcomingEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => openEditEvent(event)}
                >
                  <div className={`w-3 h-3 rounded-full mt-2 ${getEventTypeColor(event.type)}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(event.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditEvent(event);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent(event.id);
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Todos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('common.todo')} Items
          </h3>
          <div className="space-y-3">
            {upcomingTodos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No pending tasks</p>
            ) : (
              upcomingTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`p-3 rounded-lg border-l-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${getPriorityColor(todo.priority)}`}
                  onClick={() => openEditTodo(todo)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => {
                        e.stopPropagation();
                        onUpdateTodo(todo.id, { completed: e.target.checked });
                      }}
                      className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                        {todo.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{todo.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {formatDate(todo.dueDate)}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          todo.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                          todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {todo.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditTodo(todo);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTodo(todo.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('calendar.myCalendar')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your schedule and tasks
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTodoModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => setShowEventModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('calendar.addEvent')}</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* View Selector */}
          <div className="flex space-x-2">
            {['month', 'agenda'].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === viewType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t(`calendar.${viewType}`)}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('common.all')}</option>
              <option value="class">{t('calendar.class')}</option>
              <option value="quiz">{t('calendar.quiz')}</option>
              <option value="assignment">{t('calendar.assignment')}</option>
              <option value="meeting">{t('calendar.meeting')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {view === 'month' ? renderMonthView() : renderAgendaView()}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingEvent ? t('calendar.editEvent') : t('calendar.addEvent')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('calendar.eventTitle')}
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('calendar.eventDescription')}
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('calendar.eventDate')}
                  </label>
                  <input
                    type="date"
                    value={eventForm.date.toISOString().split('T')[0]}
                    onChange={(e) => setEventForm({ ...eventForm, date: new Date(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('calendar.eventType')}
                  </label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as CalendarEvent['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="event">{t('calendar.event')}</option>
                    <option value="class">{t('calendar.class')}</option>
                    <option value="quiz">{t('calendar.quiz')}</option>
                    <option value="assignment">{t('calendar.assignment')}</option>
                    <option value="meeting">{t('calendar.meeting')}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setEditingEvent(null);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingEvent ? t('common.update') : t('common.create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Todo Modal */}
      {showTodoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingTodo ? 'Edit Task' : 'Add Task'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.title')}
                </label>
                <input
                  type="text"
                  value={todoForm.title}
                  onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.description')}
                </label>
                <textarea
                  value={todoForm.description}
                  onChange={(e) => setTodoForm({ ...todoForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={todoForm.dueDate.toISOString().split('T')[0]}
                    onChange={(e) => setTodoForm({ ...todoForm, dueDate: new Date(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={todoForm.priority}
                    onChange={(e) => setTodoForm({ ...todoForm, priority: e.target.value as TodoItem['priority'] })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowTodoModal(false);
                  setEditingTodo(null);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={editingTodo ? handleUpdateTodo : handleCreateTodo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTodo ? t('common.update') : t('common.create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleContextMenuAction('event')}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
          >
            Add Event
          </button>
          <button
            onClick={() => handleContextMenuAction('todo')}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
          >
            Add Task
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;