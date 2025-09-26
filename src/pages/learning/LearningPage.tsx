import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { R, RH } from "@/lib/routes";
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
  const navigate = useNavigate();
  const params = useParams();
  const { profile } = useAuthStore();
  const role = useMemo(() => profile?.role || 'engineer', [profile]);

  // Open deep links from URL params
  useEffect(() => {
    if (params.courseId) {
      setSelectedCourse({ id: params.courseId, title: "Course" });
      setCurrentView('course-detail');
    } else if (params.certificateId) {
      setSelectedCertificate({ id: params.certificateId, title: "Certificate" });
      setCurrentView('certificate');
    } else {
      setCurrentView('main');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.courseId, params.certificateId]);

  const handleViewCourse = (courseId: string, title: string, fromPage?: string) => {
    // Navigate to deep link route
    if (role === 'client') navigate(RH.client.learningCourse(courseId));
    else if (role === 'enterprise') navigate(RH.enterprise.teamProject ? `/enterprise/learning/${courseId}` : RH.engineer.learningCourse(courseId));
    else navigate(RH.engineer.learningCourse(courseId));
  };

  const handleStartCourse = (courseId: string, title: string, progress?: number, fromPage?: string) => {
    // Navigate to deep link, player handled inside page
    if (role === 'client') navigate(RH.client.learningCourse(courseId));
    else if (role === 'enterprise') navigate(`/enterprise/learning/${courseId}`);
    else navigate(RH.engineer.learningCourse(courseId));
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
    if (role === 'client') navigate(RH.client.learningCertificate(certificateId));
    else if (role === 'enterprise') navigate(`/enterprise/learning/certificates/${certificateId}`);
    else navigate(RH.engineer.learningCertificate(certificateId));
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedPath(null);
    setSelectedCourse(null);
    setSelectedCertificate(null);
    if (role === 'client') navigate(R.client.learning);
    else if (role === 'enterprise') navigate('/enterprise/learning');
    else navigate(R.engineer.learning);
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
