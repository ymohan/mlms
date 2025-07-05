import React, { useRef } from 'react';
import { Certificate, Course, User } from '../../types';
import { Download, Award, Calendar, User as UserIcon } from 'lucide-react';

interface CertificateGeneratorProps {
  certificate: Certificate;
  course: Course;
  user: User;
  onDownload: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  certificate,
  course,
  user,
  onDownload,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificate of Completion</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Congratulations on completing {course.title}!
              </p>
            </div>
            <button
              onClick={onDownload}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="p-8">
          <div
            ref={certificateRef}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-12 rounded-xl border-4 border-blue-200 dark:border-blue-800 relative overflow-hidden"
            style={{ aspectRatio: '4/3' }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full -translate-x-16 -translate-y-16 opacity-20" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-200 dark:bg-indigo-800 rounded-full translate-x-20 translate-y-20 opacity-20" />
            <div className="absolute top-1/2 right-0 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full translate-x-12 -translate-y-12 opacity-20" />

            {/* Content */}
            <div className="relative z-10 text-center h-full flex flex-col justify-center">
              {/* Header */}
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Certificate of Completion
                </h1>
                <div className="w-24 h-1 bg-blue-600 mx-auto" />
              </div>

              {/* Main Content */}
              <div className="mb-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  This is to certify that
                </p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                  has successfully completed the course
                </p>
                <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-6">
                  {course.title}
                </h3>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Completed on</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(certificate.issuedAt)}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-32 h-px bg-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Instructor</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {course.instructor}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm">Certificate ID</span>
                  </div>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {certificate.id.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Border Pattern */}
            <div className="absolute inset-4 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg pointer-events-none" />
          </div>
        </div>

        {/* Certificate Details */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Achievement</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Successfully completed all course requirements
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Duration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {course.duration} hours of learning
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <UserIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Verification</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verify at lms.example.com/verify
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;