import React, { useState } from 'react';
import { Certificate, Course, User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Award, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  User as UserIcon,
  FileText,
  Share2,
  Printer,
  Check,
  X
} from 'lucide-react';

interface CertificateViewerProps {
  certificates: Certificate[];
  courses: Course[];
  users: User[];
  onDownload: (certificateId: string) => void;
  onRevoke?: (certificateId: string) => void;
  onIssue?: (userId: string, courseId: string) => void;
}

const CertificateViewer: React.FC<CertificateViewerProps> = ({
  certificates,
  courses,
  users,
  onDownload,
  onRevoke,
  onIssue,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState({
    userId: '',
    courseId: '',
  });

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const canManage = isAdmin || isTeacher;

  // Filter certificates based on user role
  const userCertificates = user?.role === 'student' 
    ? certificates.filter(cert => cert.userId === user.id)
    : certificates;

  const filteredCertificates = userCertificates.filter(certificate => {
    const course = courses.find(c => c.id === certificate.courseId);
    const certUser = users.find(u => u.id === certificate.userId);
    
    const matchesSearch = course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certUser?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certUser?.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse === 'all' || certificate.courseId === filterCourse;
    const matchesUser = filterUser === 'all' || certificate.userId === filterUser;
    
    return matchesSearch && matchesCourse && matchesUser;
  });

  const handleIssueCertificate = () => {
    if (issueForm.userId && issueForm.courseId) {
      onIssue?.(issueForm.userId, issueForm.courseId);
      setIssueForm({ userId: '', courseId: '' });
      setShowIssueModal(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCertificatePreview = (certificate: Certificate) => {
    const course = courses.find(c => c.id === certificate.courseId);
    const certUser = users.find(u => u.id === certificate.userId);
    
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border-4 border-blue-200 dark:border-blue-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full -translate-x-16 -translate-y-16 opacity-20" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-200 dark:bg-indigo-800 rounded-full translate-x-20 translate-y-20 opacity-20" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Certificate of Completion
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6" />

          <p className="text-gray-700 dark:text-gray-300 mb-2">This is to certify that</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {certUser?.firstName} {certUser?.lastName}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">has successfully completed the course</p>
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
            {course?.title}
          </h3>

          <div className="flex justify-between items-end text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p>Completed on</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatDate(certificate.issuedAt)}
              </p>
            </div>
            <div>
              <p>Certificate ID</p>
              <p className="font-mono text-gray-900 dark:text-white">
                {certificate.id.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'student' ? 'My Certificates' : 'Certificate Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user?.role === 'student' 
              ? 'View and download your earned certificates'
              : 'Manage and issue certificates for completed courses'
            }
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowIssueModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Award className="w-4 h-4" />
            <span>Issue Certificate</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          {canManage && (
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              {users.filter(u => u.role === 'student').map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredCertificates.length} certificates
            </span>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map(certificate => {
          const course = courses.find(c => c.id === certificate.courseId);
          const certUser = users.find(u => u.id === certificate.userId);
          
          return (
            <div key={certificate.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                {canManage && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setSelectedCertificate(certificate)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Certificate"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {onRevoke && (
                      <button
                        onClick={() => onRevoke(certificate.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Revoke Certificate"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {course?.title}
              </h3>
              
              {canManage && (
                <div className="flex items-center space-x-2 mb-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {certUser?.firstName} {certUser?.lastName}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Issued on {formatDate(certificate.issuedAt)}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCertificate(certificate)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => onDownload(certificate.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No certificates found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.role === 'student' 
              ? 'Complete courses to earn certificates'
              : 'No certificates have been issued yet'
            }
          </p>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Certificate Preview
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onDownload(selectedCertificate.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {getCertificatePreview(selectedCertificate)}
            </div>
          </div>
        </div>
      )}

      {/* Issue Certificate Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Issue New Certificate
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student
                </label>
                <select
                  value={issueForm.userId}
                  onChange={(e) => setIssueForm({ ...issueForm, userId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a student</option>
                  {users.filter(u => u.role === 'student').map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course
                </label>
                <select
                  value={issueForm.courseId}
                  onChange={(e) => setIssueForm({ ...issueForm, courseId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleIssueCertificate}
                disabled={!issueForm.userId || !issueForm.courseId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Issue Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateViewer;