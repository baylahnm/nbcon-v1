// Production-ready course data structure
// This file contains all types and seed data for the learning platform

export type Caption = {
  lang: string;
  label: string;
  vttUrl: string;
  default?: boolean;
};

export type Chapter = {
  title: string;
  start: number; // seconds
};

export type Lesson = {
  id: string;
  title: string;
  durationSec: number;
  videoUrl: string;
  thumbUrl?: string;
  captions: Caption[];
  chapters?: Chapter[];
  locked?: boolean;
  progressSec?: number;
  order: number;
  isCompleted?: boolean;
  isPreview?: boolean;
};

export type Section = {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
  duration?: string;
  completed?: boolean;
};

export type Instructor = {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  bio?: string;
  rating?: number;
  students?: number;
  courses?: number;
  specialties?: string[];
};

export type Resource = {
  id: string;
  title: string;
  type: 'pdf' | 'zip' | 'link' | 'doc' | 'code';
  size?: string;
  url: string;
  locked?: boolean;
};

export type QAThread = {
  id: string;
  author: { name: string; avatar?: string; role?: string };
  question: string;
  timestamp: string;
  lessonId?: string;
  answers: {
    id: string;
    author: { name: string; avatar?: string; role?: string };
    answer: string;
    timestamp: string;
    isInstructor?: boolean;
    helpful?: number;
  }[];
  replies: number;
};

export type Course = {
  id: string;
  title: string;
  summary: string;
  description: string;
  skills: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDurationSec: number;
  releasedAt: string;
  instructors: Instructor[];
  sections: Section[];
  related: Pick<Course, 'id' | 'title' | 'thumbnail' | 'rating' | 'students' | 'price' | 'duration'>[];
  enrolled?: boolean;
  tierRequired?: string;
  thumbnail: string;
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  requirements?: string[];
  learningOutcomes?: string[];
  certificate?: {
    available: boolean;
    issuer: string;
    note?: string;
  };
  duration: string;
  progress?: number;
  lastWatchedLessonId?: string;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
};

export type Note = {
  id: string;
  courseId: string;
  lessonId: string;
  t: number; // timestamp in seconds
  text: string;
  createdAt: string;
};

export type TranscriptLine = {
  t: number; // start time in seconds
  d: number; // duration in seconds
  text: string;
};

// Seed Data - Complete course with all required elements
export const seedCourse: Course = {
  id: '5',
  title: 'Building Information Modeling (BIM)',
  summary: 'Master BIM workflows and Revit for modern construction projects',
  description: 'This comprehensive course covers Building Information Modeling (BIM) from fundamentals to advanced implementation. Learn industry-standard Revit workflows, collaborative design processes, and how to leverage BIM for improved project delivery. Perfect for architects, engineers, and construction professionals looking to modernize their skillset.',
  skills: ['BIM', 'Revit', 'Construction', '3D Modeling', 'Collaboration', 'Clash Detection'],
  level: 'Intermediate',
  totalDurationSec: 43200, // 12 hours
  releasedAt: '2024-09-15',
  category: 'Software',
  tags: ['BIM', 'Revit', 'Construction', '3D Modeling'],
  rating: 4.5,
  students: 1567,
  price: 449,
  duration: '12 weeks',
  thumbnail: '/e-learning/Software/Building Information Modeling (BIM).jpg',
  enrolled: true,
  progress: 35,
  isTrending: true,
  lastWatchedLessonId: 'lesson-5',
  requirements: [
    'Basic understanding of construction drawings',
    'Computer with Windows 10 or later (for Revit)',
    'At least 16GB RAM recommended',
    'Revit software (trial version acceptable)'
  ],
  learningOutcomes: [
    'Create detailed 3D building models in Revit',
    'Set up and manage BIM workflows for projects',
    'Collaborate effectively using BIM 360',
    'Perform clash detection and coordination',
    'Generate construction documentation from models',
    'Understand BIM standards and best practices'
  ],
  certificate: {
    available: true,
    issuer: 'nbcon Learning Platform',
    note: 'Complete all lessons and pass the final assessment to earn your certificate'
  },
  instructors: [
    {
      id: 'instructor-1',
      name: 'Michael Rodriguez',
      avatar: '/api/placeholder/80/80',
      title: 'Senior BIM Manager',
      bio: 'Michael has over 12 years of experience implementing BIM on large-scale infrastructure projects. He has trained over 5,000 professionals worldwide and is a certified Autodesk instructor.',
      rating: 4.8,
      students: 8420,
      courses: 6,
      specialties: ['BIM Implementation', 'Revit', 'Construction Technology']
    }
  ],
  sections: [
    {
      id: 'section-1',
      title: 'Introduction to BIM',
      order: 1,
      duration: '2h 15m',
      completed: true,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Welcome & Course Overview',
          durationSec: 480, // 8 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 1,
          isPreview: true,
          isCompleted: true,
          progressSec: 480,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-1-en.vtt',
              default: true
            },
            {
              lang: 'ar',
              label: 'العربية',
              vttUrl: '/api/captions/lesson-1-ar.vtt'
            }
          ],
          chapters: [
            { title: 'Introduction', start: 0 },
            { title: 'What is BIM?', start: 120 },
            { title: 'Course Structure', start: 300 }
          ]
        },
        {
          id: 'lesson-2',
          title: 'BIM Fundamentals & Industry Standards',
          durationSec: 1200, // 20 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 2,
          isPreview: true,
          isCompleted: true,
          progressSec: 1200,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-2-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-3',
          title: 'Setting Up Your Revit Workspace',
          durationSec: 900, // 15 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 3,
          isCompleted: true,
          progressSec: 900,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-3-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-4',
          title: 'BIM Collaboration Tools Overview',
          durationSec: 720, // 12 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 4,
          isCompleted: true,
          progressSec: 720,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-4-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-5',
          title: 'Understanding BIM Levels (LOD)',
          durationSec: 1080, // 18 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 5,
          isCompleted: false,
          progressSec: 450, // partially watched
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-5-en.vtt',
              default: true
            }
          ],
          chapters: [
            { title: 'Introduction to LOD', start: 0 },
            { title: 'LOD 100-200', start: 300 },
            { title: 'LOD 300-400', start: 600 },
            { title: 'LOD 500 & Beyond', start: 900 }
          ]
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Revit Basics',
      order: 2,
      duration: '3h 30m',
      completed: false,
      lessons: [
        {
          id: 'lesson-6',
          title: 'Creating Your First Project',
          durationSec: 1500, // 25 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 6,
          isCompleted: false,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-6-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-7',
          title: 'Working with Walls & Doors',
          durationSec: 1800, // 30 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 7,
          isCompleted: false,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-7-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-8',
          title: 'Floors, Roofs & Ceilings',
          durationSec: 1620, // 27 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 8,
          isCompleted: false,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-8-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-9',
          title: 'Stairs & Railings',
          durationSec: 1380, // 23 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 9,
          isCompleted: false,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-9-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-10',
          title: 'Families & Components',
          durationSec: 2100, // 35 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 10,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-10-en.vtt',
              default: true
            }
          ]
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Advanced Modeling',
      order: 3,
      duration: '4h 20m',
      completed: false,
      lessons: [
        {
          id: 'lesson-11',
          title: 'Complex Geometry & Mass Modeling',
          durationSec: 1920, // 32 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 11,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-11-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-12',
          title: 'Site Design & Topography',
          durationSec: 1560, // 26 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 12,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-12-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-13',
          title: 'MEP Systems Integration',
          durationSec: 2400, // 40 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 13,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-13-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-14',
          title: 'Phasing & Construction Sequencing',
          durationSec: 1800, // 30 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 14,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-14-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-15',
          title: 'Rendering & Visualization',
          durationSec: 1920, // 32 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 15,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-15-en.vtt',
              default: true
            }
          ]
        }
      ]
    },
    {
      id: 'section-4',
      title: 'BIM Collaboration & Documentation',
      order: 4,
      duration: '2h 35m',
      completed: false,
      lessons: [
        {
          id: 'lesson-16',
          title: 'BIM 360 Setup & Workflows',
          durationSec: 1680, // 28 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 16,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-16-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-17',
          title: 'Clash Detection & Coordination',
          durationSec: 1920, // 32 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 17,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-17-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-18',
          title: 'Generating Construction Documents',
          durationSec: 1500, // 25 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 18,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-18-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-19',
          title: 'Sheets, Schedules & Annotations',
          durationSec: 1320, // 22 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 19,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-19-en.vtt',
              default: true
            }
          ]
        },
        {
          id: 'lesson-20',
          title: 'Final Project & Best Practices',
          durationSec: 1680, // 28 minutes
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          thumbUrl: '/e-learning/Software/Building Information Modeling (BIM).jpg',
          order: 20,
          isCompleted: false,
          locked: true,
          captions: [
            {
              lang: 'en',
              label: 'English',
              vttUrl: '/api/captions/lesson-20-en.vtt',
              default: true
            }
          ]
        }
      ]
    }
  ],
  related: [
    {
      id: '4',
      title: 'AutoCAD for Civil Engineers',
      thumbnail: '/e-learning/Software/AutoCAD for Civil Engineers.jpg',
      rating: 4.7,
      students: 3421,
      price: 149,
      duration: '4 weeks'
    },
    {
      id: '35',
      title: 'Revit Architecture',
      thumbnail: '/e-learning/Software/Revit Architecture.jpg',
      rating: 4.9,
      students: 3245,
      price: 399,
      duration: '12 weeks'
    },
    {
      id: '33',
      title: 'ETABS Structural Analysis',
      thumbnail: '/e-learning/Software/ETABS Structural Analysis.jpg',
      rating: 4.8,
      students: 1567,
      price: 349,
      duration: '10 weeks'
    },
    {
      id: '32',
      title: 'Engineering Drawing Standards',
      thumbnail: '/e-learning/Software/Engineering Drawing Standards.jpg',
      rating: 4.6,
      students: 1890,
      price: 159,
      duration: '5 weeks'
    },
    {
      id: '34',
      title: 'Project Management Software',
      thumbnail: '/e-learning/Software/Project Management Software.jpg',
      rating: 4.7,
      students: 2678,
      price: 249,
      duration: '8 weeks'
    },
    {
      id: '1',
      title: 'Advanced Structural Analysis',
      thumbnail: '/e-learning/Structural Engineering/Advanced Structural Analysis.jpg',
      rating: 4.8,
      students: 1247,
      price: 299,
      duration: '8 weeks'
    }
  ]
};

// Sample resources for the course
export const seedResources: Resource[] = [
  {
    id: 'res-1',
    title: 'BIM Starter Template',
    type: 'zip',
    size: '12.5 MB',
    url: '/api/resources/bim-template.zip',
    locked: false
  },
  {
    id: 'res-2',
    title: 'Revit Keyboard Shortcuts Cheat Sheet',
    type: 'pdf',
    size: '2.1 MB',
    url: '/api/resources/shortcuts.pdf',
    locked: false
  },
  {
    id: 'res-3',
    title: 'BIM Execution Plan Template',
    type: 'doc',
    size: '1.8 MB',
    url: '/api/resources/bep-template.docx',
    locked: false
  },
  {
    id: 'res-4',
    title: 'Advanced Families Library',
    type: 'zip',
    size: '45.2 MB',
    url: '/api/resources/families.zip',
    locked: true
  },
  {
    id: 'res-5',
    title: 'Project Files & Exercise Materials',
    type: 'zip',
    size: '127 MB',
    url: '/api/resources/project-files.zip',
    locked: true
  }
];

// Sample Q&A threads
export const seedQAThreads: QAThread[] = [
  {
    id: 'qa-1',
    author: { name: 'Ahmed Al-Rashid', avatar: '/api/placeholder/40/40', role: 'Student' },
    question: 'What are the minimum system requirements for running Revit smoothly with large BIM models?',
    timestamp: '2 days ago',
    lessonId: 'lesson-3',
    replies: 2,
    answers: [
      {
        id: 'ans-1',
        author: { name: 'Michael Rodriguez', avatar: '/api/placeholder/40/40', role: 'Instructor' },
        answer: 'Great question! For optimal performance with large BIM models, I recommend at least 32GB RAM, a dedicated graphics card (NVIDIA RTX or similar), and an SSD. For the course exercises, 16GB RAM will work fine.',
        timestamp: '1 day ago',
        isInstructor: true,
        helpful: 15
      },
      {
        id: 'ans-2',
        author: { name: 'Sarah Johnson', avatar: '/api/placeholder/40/40', role: 'Student' },
        answer: 'I\'ve been running it on 16GB RAM and it works well for most projects. Just avoid opening too many views at once!',
        timestamp: '1 day ago',
        helpful: 8
      }
    ]
  },
  {
    id: 'qa-2',
    author: { name: 'Fatima Al-Otaibi', avatar: '/api/placeholder/40/40', role: 'Student' },
    question: 'How do I export my BIM model to IFC format for coordination with other disciplines?',
    timestamp: '5 days ago',
    lessonId: 'lesson-16',
    replies: 1,
    answers: [
      {
        id: 'ans-3',
        author: { name: 'Michael Rodriguez', avatar: '/api/placeholder/40/40', role: 'Instructor' },
        answer: 'We cover IFC export in detail in Lesson 16. The key is to set up your export settings correctly - I\'ll share a preset file in the Resources tab that you can import into Revit.',
        timestamp: '4 days ago',
        isInstructor: true,
        helpful: 12
      }
    ]
  },
  {
    id: 'qa-3',
    author: { name: 'Omar Hassan', avatar: '/api/placeholder/40/40', role: 'Student' },
    question: 'Can I use this course to prepare for the Autodesk Revit certification exam?',
    timestamp: '1 week ago',
    replies: 1,
    answers: [
      {
        id: 'ans-4',
        author: { name: 'Michael Rodriguez', avatar: '/api/placeholder/40/40', role: 'Instructor' },
        answer: 'Absolutely! This course covers all the topics in the Autodesk Certified Professional exam. I recommend taking practice tests after completing the course.',
        timestamp: '6 days ago',
        isInstructor: true,
        helpful: 20
      }
    ]
  }
];

// Sample transcript for lesson 1
export const seedTranscript: TranscriptLine[] = [
  { t: 0, d: 4.5, text: 'Welcome to Building Information Modeling fundamentals.' },
  { t: 4.5, d: 6.2, text: 'My name is Michael Rodriguez, and I\'ll be your instructor for this course.' },
  { t: 10.7, d: 5.8, text: 'Over the next 12 weeks, we\'ll explore BIM from the ground up.' },
  { t: 16.5, d: 7.1, text: 'We\'ll start with the basics and progressively build your skills to an advanced level.' },
  { t: 23.6, d: 5.4, text: 'BIM, or Building Information Modeling, is revolutionizing the construction industry.' },
  { t: 29.0, d: 6.8, text: 'It\'s not just about 3D modeling - it\'s about intelligent, data-rich models.' },
  { t: 35.8, d: 7.2, text: 'These models contain information about every element in a building project.' },
  { t: 43.0, d: 5.9, text: 'From structural elements to MEP systems, and even construction scheduling.' },
  { t: 48.9, d: 6.5, text: 'In this course, you\'ll learn how to create, manage, and collaborate using BIM.' },
  { t: 55.4, d: 5.2, text: 'We\'ll be using Autodesk Revit as our primary tool.' },
  { t: 60.6, d: 7.3, text: 'Revit is the industry standard for BIM and is used on projects worldwide.' },
  { t: 67.9, d: 6.1, text: 'Don\'t worry if you\'ve never used Revit before - we start from the very beginning.' },
  { t: 74.0, d: 8.2, text: 'By the end of this course, you\'ll be able to create complex building models and generate construction documents.' },
  { t: 82.2, d: 5.7, text: 'You\'ll also understand BIM workflows and how to collaborate with other disciplines.' },
  { t: 87.9, d: 4.8, text: 'Let\'s take a quick look at what we\'ll cover in each section.' }
];

// Helper function to format duration in seconds to readable string
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Helper function to format time for video player (MM:SS or HH:MM:SS)
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const pad = (num: number) => String(num).padStart(2, '0');
  
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${pad(minutes)}:${pad(secs)}`;
}

// Calculate course progress
export function calculateCourseProgress(sections: Section[]): { completed: number; total: number; percentage: number } {
  let completedLessons = 0;
  let totalLessons = 0;
  
  sections.forEach(section => {
    section.lessons.forEach(lesson => {
      totalLessons++;
      if (lesson.isCompleted) {
        completedLessons++;
      }
    });
  });
  
  return {
    completed: completedLessons,
    total: totalLessons,
    percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  };
}

