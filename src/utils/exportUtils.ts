import { User, Course, CalendarEvent, TodoItem } from '../types';

// Export to CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

// Export to Excel (simplified CSV with Excel-friendly format)
export const exportToExcel = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const excelContent = [
    headers.join('\t'),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (value instanceof Date) return value.toLocaleDateString();
        return value;
      }).join('\t')
    )
  ].join('\n');

  downloadFile(excelContent, `${filename}.xls`, 'application/vnd.ms-excel');
};

// Export to PDF (simplified text format)
export const exportToPDF = (data: any[], filename: string, title: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  let pdfContent = `${title}\n\n`;
  
  // Add headers
  pdfContent += headers.join(' | ') + '\n';
  pdfContent += headers.map(() => '---').join(' | ') + '\n';
  
  // Add data rows
  data.forEach(row => {
    pdfContent += headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (value instanceof Date) return value.toLocaleDateString();
      return String(value);
    }).join(' | ') + '\n';
  });

  downloadFile(pdfContent, `${filename}.txt`, 'text/plain');
};

// Helper function to download file
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Format user data for export
export const formatUsersForExport = (users: User[]) => {
  return users.map(user => ({
    ID: user.id,
    'First Name': user.firstName,
    'Last Name': user.lastName,
    Email: user.email,
    Role: user.role,
    Language: user.language,
    'Created At': user.createdAt.toLocaleDateString(),
    'Last Active': user.lastActive.toLocaleDateString(),
    Status: user.isActive ? 'Active' : 'Inactive',
  }));
};

// Format course data for export
export const formatCoursesForExport = (courses: Course[]) => {
  return courses.map(course => ({
    ID: course.id,
    Title: course.title,
    Instructor: course.instructor,
    Duration: `${course.duration} hours`,
    Difficulty: course.difficulty,
    Price: `$${course.price}`,
    Enrollment: course.enrollment,
    Rating: course.rating,
    Status: course.status,
    'Created At': course.createdAt.toLocaleDateString(),
    'Updated At': course.updatedAt.toLocaleDateString(),
  }));
};

// Format calendar events for export
export const formatEventsForExport = (events: CalendarEvent[]) => {
  return events.map(event => ({
    ID: event.id,
    Title: event.title,
    Description: event.description,
    Date: event.date.toLocaleDateString(),
    Time: event.date.toLocaleTimeString(),
    Type: event.type,
    'User ID': event.userId,
  }));
};

// Format todo items for export
export const formatTodosForExport = (todos: TodoItem[]) => {
  return todos.map(todo => ({
    ID: todo.id,
    Title: todo.title,
    Description: todo.description,
    'Due Date': todo.dueDate.toLocaleDateString(),
    Priority: todo.priority,
    Status: todo.completed ? 'Completed' : 'Pending',
    'User ID': todo.userId,
  }));
};

// Generate analytics report
export const generateAnalyticsReport = (data: any) => {
  const report = {
    'Report Generated': new Date().toLocaleString(),
    'Total Users': data.totalUsers || 0,
    'Active Users': data.activeUsers || 0,
    'Total Courses': data.totalCourses || 0,
    'Completion Rate': `${data.completionRate || 0}%`,
    'Average Rating': data.avgRating || 0,
    'Revenue': `$${data.revenue || 0}`,
  };

  return [report];
};