import { useState } from "react";
import { LearningContent } from "@/components/learning/LearningContent";
import { LearningPathDetailContent } from "@/components/learning/LearningPathDetailContent";
import { CourseDetailContent } from "@/components/learning/CourseDetailContent";
import { CoursePlayerContent } from "@/components/learning/CoursePlayerContent";
import { CertificateContent } from "@/components/learning/CertificateContent";

type LearningPageView = 'main' | 'path-detail' | 'course-detail' | 'course-player' | 'certificate';

export default function LearningPage() {
  const [currentView, setCurrentView] = useState<LearningPageView>('main');
  const [selectedPath, setSelectedPath] = useState<{id: string, title: string} | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{id: string, title: string, progress?: number} | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<{id: string, title: string} | null>(null);

  const handleViewCourse = (courseId: string, title: string, fromPage?: string) => {
    console.log(`View course: ${courseId} - ${title} from ${fromPage}`);
    setSelectedCourse({ id: courseId, title });
    setCurrentView('course-detail');
  };

  const handleStartCourse = (courseId: string, title: string, progress?: number, fromPage?: string) => {
    console.log(`Start course: ${courseId} - ${title} with progress ${progress}% from ${fromPage}`);
    setSelectedCourse({ id: courseId, title, progress });
    setCurrentView('course-player');
  };

  const handleStartPath = (pathId: string, title: string) => {
    console.log(`Start path: ${pathId} - ${title}`);
    setSelectedPath({ id: pathId, title });
    setCurrentView('path-detail');
  };

  const handleStartAssessment = (assessmentId: string, title: string) => {
    console.log(`Start assessment: ${assessmentId} - ${title}`);
    // Navigate to assessment page
  };

  const handleViewCertificate = (certificateId: string, title: string) => {
    console.log(`View certificate: ${certificateId} - ${title}`);
    setSelectedCertificate({ id: certificateId, title });
    setCurrentView('certificate');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedPath(null);
    setSelectedCourse(null);
    setSelectedCertificate(null);
  };

  const handleStartCourseFromDetail = (courseId: string, title: string) => {
    setSelectedCourse({ id: courseId, title });
    setCurrentView('course-player');
  };

  if (currentView === 'path-detail' && selectedPath) {
    return (
      <LearningPathDetailContent
        pathId={selectedPath.id}
        pathTitle={selectedPath.title}
        onBack={handleBackToMain}
        onStartCourse={handleStartCourse}
        onViewCourse={handleViewCourse}
      />
    );
  }

  if (currentView === 'course-detail' && selectedCourse) {
    return (
      <CourseDetailContent
        courseId={selectedCourse.id}
        courseTitle={selectedCourse.title}
        onBack={handleBackToMain}
        onStartCourse={handleStartCourseFromDetail}
      />
    );
  }

  if (currentView === 'course-player' && selectedCourse) {
    return (
      <CoursePlayerContent
        courseId={selectedCourse.id}
        courseTitle={selectedCourse.title}
        progress={selectedCourse.progress || 0}
        onBack={handleBackToMain}
      />
    );
  }

  if (currentView === 'certificate' && selectedCertificate) {
    return (
      <CertificateContent
        certificateId={selectedCertificate.id}
        certificateTitle={selectedCertificate.title}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <LearningContent
      onViewCourse={handleViewCourse}
      onStartCourse={handleStartCourse}
      onStartPath={handleStartPath}
      onStartAssessment={handleStartAssessment}
      onViewCertificate={handleViewCertificate}
    />
  );
}
