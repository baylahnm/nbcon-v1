import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Progress } from '../1-HomePage/others/components/ui/progress';
import { CourseCard } from './others/features/learning/components/CourseCard';
import { CourseSearch } from './others/features/learning/components/CourseSearch';
import { CourseProgress } from './others/features/learning/components/CourseProgress';
import { LearningPaths } from './others/features/learning/components/LearningPaths';
import { SkillAssessment } from './others/features/learning/components/SkillAssessment';
import { HorizontalScrollCards } from './others/features/learning/components/HorizontalScrollCards';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Award, 
  Users, 
  Search, 
  Filter,
  ChevronRight,
  Download,
  CheckCircle2,
  TrendingUp,
  Target,
  Calendar,
  Zap,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface Instructor {
  name: string;
  avatar: string;
  title: string;
  rating: number;
  bio?: string;
  students?: number;
  courses?: number;
  specialties?: string[];
}

interface CourseLecture {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  isCompleted: boolean;
  videoUrl: string;
}

interface CourseSection {
  id: string;
  title: string;
  duration: string;
  lectures: CourseLecture[];
  completed: boolean;
}

interface CourseReview {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  content: string;
  helpful: number;
  verified: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  instructor: Instructor;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  videoUrl?: string;
  progress?: number;
  completed?: boolean;
  category: string;
  tags: string[];
  isEnrolled?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  curriculum?: CourseSection[];
  requirements?: string[];
  learningOutcomes?: string[];
  reviews?: CourseReview[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  totalCourses: number;
  completedCourses: number;
  totalDuration: string;
  estimatedDuration: string;
  estimatedCompletion: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  progress: number;
  isEnrolled: boolean;
  isCompleted: boolean;
  category: string;
  skills: string[];
  prerequisites: string[];
  outcomes: string[];
  instructors: Instructor[];
  courses: PathCourse[];
  certificate?: {
    id: string;
    title: string;
    description: string;
  };
  price: number;
  originalPrice?: number;
  isPopular: boolean;
  isNew: boolean;
}

interface PathCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: string;
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
  instructor: Instructor;
  skills: string[];
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  status: 'completed' | 'in-progress' | 'not-started';
  completionDate?: string;
  expiryDate?: string;
  credentialId?: string;
  thumbnail: string;
}

interface CourseProgressData {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  thumbnail: string;
  progress: number;
  totalLectures: number;
  completedLectures: number;
  totalDuration: string;
  completedDuration: string;
  lastAccessed: string;
  nextLesson: {
    id: string;
    title: string;
    duration: string;
  };
  certificate?: {
    id: string;
    issuedDate: string;
    downloadUrl: string;
  };
  streak: number;
  estimatedCompletion: string;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  type: 'milestone' | 'streak' | 'completion' | 'speed';
}

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Structural Analysis',
    description: 'Master advanced techniques in structural analysis and design with industry-standard software',
    longDescription: 'This comprehensive course covers advanced structural analysis techniques used in modern engineering practice. You will learn finite element analysis, dynamic analysis, and advanced design methodologies. The course includes hands-on projects using industry-standard software like ANSYS, SAP2000, and ETABS.',
    instructor: {
      name: 'Dr. Ahmed Al-Rashid',
      avatar: '/api/placeholder/40/40',
      title: 'Professor of Structural Engineering',
      rating: 4.8,
      bio: 'Dr. Ahmed Al-Rashid is a structural engineering professor with over 15 years of experience in the field. He has worked on major infrastructure projects worldwide and has published numerous research papers.',
      students: 15420,
      courses: 8,
      specialties: ['Structural Analysis', 'Finite Element Method', 'Earthquake Engineering']
    },
    duration: '8 weeks',
    level: 'Advanced',
    rating: 4.8,
    students: 1247,
    price: 299,
    originalPrice: 399,
    thumbnail: '/e-learning/Structural Engineering/Advanced Structural Analysis.jpg',
    videoUrl: '/api/video/structural-analysis-intro',
    progress: 75,
    isEnrolled: true,
    isBestSeller: true,
    category: 'Structural Engineering',
    tags: ['Analysis', 'Design', 'Software'],
    curriculum: [
      {
        id: '1',
        title: 'Introduction to Advanced Analysis',
        duration: '2 hours',
        completed: true,
        lectures: [
          {
            id: '1-1',
            title: 'Course Overview and Learning Objectives',
            duration: '15 min',
            isPreview: true,
            isCompleted: true,
            videoUrl: '/api/video/intro'
          },
          {
            id: '1-2',
            title: 'Review of Basic Structural Concepts',
            duration: '45 min',
            isPreview: false,
            isCompleted: true,
            videoUrl: '/api/video/basic-concepts'
          }
        ]
      },
      {
        id: '2',
        title: 'Finite Element Analysis',
        duration: '4 hours',
        completed: false,
        lectures: [
          {
            id: '2-1',
            title: 'Introduction to FEA',
            duration: '30 min',
            isPreview: true,
            isCompleted: false,
            videoUrl: '/api/video/fea-intro'
          },
          {
            id: '2-2',
            title: 'Element Types and Meshing',
            duration: '45 min',
            isPreview: false,
            isCompleted: false,
            videoUrl: '/api/video/element-types'
          }
        ]
      }
    ],
    requirements: [
      'Basic knowledge of structural engineering',
      'Familiarity with mathematics and physics',
      'Computer with internet connection'
    ],
    learningOutcomes: [
      'Master advanced structural analysis techniques',
      'Apply finite element methods to real-world problems',
      'Design complex structural systems',
      'Use industry-standard software effectively'
    ],
    reviews: [
      {
        id: '1',
        user: {
          name: 'Sarah Johnson',
          avatar: '/api/placeholder/40/40'
        },
        rating: 5,
        date: '2 weeks ago',
        content: 'Excellent course! The instructor explains complex concepts clearly and provides practical examples.',
        helpful: 12,
        verified: true
      },
      {
        id: '2',
        user: {
          name: 'Mohammed Al-Hassan',
          avatar: '/api/placeholder/40/40'
        },
        rating: 4,
        date: '1 month ago',
        content: 'Very comprehensive course. The hands-on projects really help solidify the concepts.',
        helpful: 8,
        verified: true
      }
    ]
  },
  {
    id: '2',
    title: 'Project Management Fundamentals',
    description: 'Learn essential project management skills for engineers and construction professionals',
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      title: 'Project Management Expert',
      rating: 4.6
    },
    duration: '6 weeks',
    level: 'Beginner',
    rating: 4.6,
    students: 2156,
    price: 199,
    thumbnail: '/e-learning/Project Management/Project Management Fundamentals.jpg',
    completed: true,
    isEnrolled: true,
    isNew: true,
    category: 'Project Management',
    tags: ['PM', 'Planning', 'Leadership']
  },
  {
    id: '3',
    title: 'Renewable Energy Systems',
    description: 'Comprehensive guide to renewable energy technologies and sustainable engineering',
    instructor: {
      name: 'Dr. Mohammed Al-Zahrani',
      avatar: '/api/placeholder/40/40',
      title: 'Renewable Energy Specialist',
      rating: 4.9
    },
    duration: '10 weeks',
    level: 'Intermediate',
    rating: 4.9,
    students: 892,
    price: 399,
    thumbnail: '/e-learning/Renewable Energy Systems/Renewable Energy Systems.jpg',
    progress: 30,
    isEnrolled: true,
    isTrending: true,
    category: 'Energy Engineering',
    tags: ['Solar', 'Wind', 'Sustainability']
  },
  {
    id: '4',
    title: 'AutoCAD for Civil Engineers',
    description: 'Master AutoCAD for civil engineering design and drafting projects',
    instructor: {
      name: 'Lisa Chen',
      avatar: '/api/placeholder/40/40',
      title: 'CAD Design Instructor',
      rating: 4.7
    },
    duration: '4 weeks',
    level: 'Beginner',
    rating: 4.7,
    students: 3421,
    price: 149,
    originalPrice: 199,
    thumbnail: '/e-learning/Software/AutoCAD for Civil Engineers.jpg',
    isBestSeller: true,
    category: 'Best Sellers',
    tags: ['AutoCAD', 'Drafting', 'Design']
  },
  {
    id: '5',
    title: 'Building Information Modeling (BIM)',
    description: 'Learn BIM workflows and Revit for modern construction projects',
    instructor: {
      name: 'Michael Rodriguez',
      avatar: '/api/placeholder/40/40',
      title: 'BIM Specialist',
      rating: 4.5
    },
    duration: '12 weeks',
    level: 'Intermediate',
    rating: 4.5,
    students: 1567,
    price: 449,
    thumbnail: '/e-learning/Software/Building Information Modeling (BIM).jpg',
    isTrending: true,
    category: 'Software',
    tags: ['BIM', 'Revit', 'Construction']
  },
  {
    id: '6',
    title: 'Safety & Risk Management',
    description: 'Essential safety protocols and risk assessment for engineering projects',
    instructor: {
      name: 'Jennifer Kim',
      avatar: '/api/placeholder/40/40',
      title: 'Safety Consultant',
      rating: 4.8
    },
    duration: '3 weeks',
    level: 'Beginner',
    rating: 4.8,
    students: 2890,
    price: 99,
    originalPrice: 149,
    thumbnail: '/e-learning/Safety/Construction Safety Management.jpg',
    isNew: true,
    category: 'Safety',
    tags: ['Safety', 'Risk', 'Compliance']
  },
  {
    id: '7',
    title: 'Solar Panel Technology',
    description: 'Deep dive into photovoltaic systems, installation, and maintenance',
    instructor: {
      name: 'Dr. Fatima Al-Otaibi',
      avatar: '/api/placeholder/40/40',
      title: 'Solar Energy Expert',
      rating: 4.9
    },
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.9,
    students: 1834,
    price: 279,
    originalPrice: 349,
    thumbnail: '/e-learning/Renewable Energy Systems/Solar Panel Technology.jpg',
    isTrending: true,
    category: 'Renewable Energy',
    tags: ['Solar', 'PV', 'Installation']
  },
  {
    id: '8',
    title: 'Power Distribution Systems',
    description: 'Design and analysis of electrical power distribution networks',
    instructor: {
      name: 'Eng. Omar Hassan',
      avatar: '/api/placeholder/40/40',
      title: 'Electrical Engineer',
      rating: 4.7
    },
    duration: '10 weeks',
    level: 'Advanced',
    rating: 4.7,
    students: 1456,
    price: 329,
    thumbnail: '/e-learning/Electrical Engineering/Power Distribution.jpg',
    category: 'Electrical Engineering',
    tags: ['Power', 'Distribution', 'Grid']
  },
  {
    id: '9',
    title: 'Risk Management in Construction',
    description: 'Identify, assess, and mitigate risks in construction projects',
    instructor: {
      name: 'Sarah Al-Mansour',
      avatar: '/api/placeholder/40/40',
      title: 'Risk Management Consultant',
      rating: 4.6
    },
    duration: '6 weeks',
    level: 'Intermediate',
    rating: 4.6,
    students: 2234,
    price: 189,
    originalPrice: 249,
    thumbnail: '/e-learning/Project Management/Risk Management in Construction.jpg',
    isBestSeller: true,
    category: 'Project Management',
    tags: ['Risk', 'Management', 'Safety']
  },
  {
    id: '10',
    title: 'Fire Protection Systems',
    description: 'Design and implement fire safety systems for buildings',
    instructor: {
      name: 'Eng. Abdullah Al-Zahrani',
      avatar: '/api/placeholder/40/40',
      title: 'Fire Safety Engineer',
      rating: 4.8
    },
    duration: '7 weeks',
    level: 'Intermediate',
    rating: 4.8,
    students: 1678,
    price: 259,
    thumbnail: '/e-learning/Mechanical Engineering/Fire Protection Systems.jpg',
    category: 'Mechanical Engineering',
    tags: ['Fire Safety', 'Sprinklers', 'Code']
  },
  {
    id: '11',
    title: 'OSHA Standards and Compliance',
    description: 'Essential OSHA standards for construction site safety',
    instructor: {
      name: 'John Williams',
      avatar: '/api/placeholder/40/40',
      title: 'OSHA Compliance Expert',
      rating: 4.7
    },
    duration: '4 weeks',
    level: 'Beginner',
    rating: 4.7,
    students: 3145,
    price: 119,
    originalPrice: 169,
    thumbnail: '/e-learning/Safety/OSHA Standards and Compliance.jpg',
    isNew: true,
    category: 'Safety',
    tags: ['OSHA', 'Compliance', 'Standards']
  },
  {
    id: '12',
    title: 'Wind Energy Engineering',
    description: 'Design and optimize wind turbine systems for maximum efficiency',
    instructor: {
      name: 'Dr. Maria Garcia',
      avatar: '/api/placeholder/40/40',
      title: 'Wind Energy Specialist',
      rating: 4.9
    },
    duration: '9 weeks',
    level: 'Advanced',
    rating: 4.9,
    students: 967,
    price: 349,
    thumbnail: '/e-learning/Renewable Energy Systems/Wind Energy Engineering.jpg',
    isTrending: true,
    category: 'Renewable Energy',
    tags: ['Wind', 'Turbines', 'Power']
  },
  {
    id: '13',
    title: 'Building Automation Systems',
    description: 'Smart building controls and automation technologies',
    instructor: {
      name: 'Eng. Khalid Al-Mutairi',
      avatar: '/api/placeholder/40/40',
      title: 'Automation Engineer',
      rating: 4.6
    },
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.6,
    students: 1789,
    price: 249,
    originalPrice: 319,
    thumbnail: '/e-learning/Electrical Engineering/Building Automation.jpg',
    category: 'Electrical Engineering',
    tags: ['Automation', 'BMS', 'Controls']
  },
  {
    id: '14',
    title: 'Plumbing and Drainage Systems',
    description: 'Design efficient plumbing and drainage systems for buildings',
    instructor: {
      name: 'Eng. Nora Al-Salem',
      avatar: '/api/placeholder/40/40',
      title: 'Plumbing Engineer',
      rating: 4.5
    },
    duration: '6 weeks',
    level: 'Beginner',
    rating: 4.5,
    students: 2123,
    price: 159,
    thumbnail: '/e-learning/Mechanical Engineering/Plumbing and Drainage.jpg',
    category: 'Mechanical Engineering',
    tags: ['Plumbing', 'Drainage', 'Code']
  },
  {
    id: '15',
    title: 'Energy Storage Systems',
    description: 'Battery systems and energy storage solutions for renewable energy',
    instructor: {
      name: 'Dr. Hassan Al-Rashidi',
      avatar: '/api/placeholder/40/40',
      title: 'Energy Storage Expert',
      rating: 4.8
    },
    duration: '7 weeks',
    level: 'Advanced',
    rating: 4.8,
    students: 1234,
    price: 299,
    thumbnail: '/e-learning/Renewable Energy Systems/Energy Storage Systems.jpg',
    isBestSeller: true,
    category: 'Renewable Energy',
    tags: ['Batteries', 'Storage', 'Grid']
  },
  {
    id: '16',
    title: 'Electrical Safety Standards',
    description: 'Comprehensive guide to electrical safety codes and best practices',
    instructor: {
      name: 'Eng. Layla Al-Harbi',
      avatar: '/api/placeholder/40/40',
      title: 'Electrical Safety Specialist',
      rating: 4.7
    },
    duration: '5 weeks',
    level: 'Intermediate',
    rating: 4.7,
    students: 2567,
    price: 179,
    originalPrice: 229,
    thumbnail: '/e-learning/Electrical Engineering/Electrical Safety Standards.jpg',
    category: 'Electrical Engineering',
    tags: ['Safety', 'Code', 'Standards']
  },
  {
    id: '17',
    title: 'Contract Administration',
    description: 'Manage construction contracts effectively from award to closeout',
    instructor: {
      name: 'Mohammed Al-Ghamdi',
      avatar: '/api/placeholder/40/40',
      title: 'Contract Administrator',
      rating: 4.6
    },
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.6,
    students: 1890,
    price: 219,
    thumbnail: '/e-learning/Project Management/Contract Administration.jpg',
    category: 'Project Management',
    tags: ['Contracts', 'Admin', 'Legal']
  },
  {
    id: '18',
    title: 'Emergency Response Planning',
    description: 'Develop comprehensive emergency response plans for construction sites',
    instructor: {
      name: 'Eng. Aisha Al-Dosari',
      avatar: '/api/placeholder/40/40',
      title: 'Emergency Response Specialist',
      rating: 4.8
    },
    duration: '4 weeks',
    level: 'Beginner',
    rating: 4.8,
    students: 2678,
    price: 139,
    thumbnail: '/e-learning/Safety/Emergency Response Planning.jpg',
    isNew: true,
    category: 'Safety',
    tags: ['Emergency', 'Planning', 'Response']
  },
  {
    id: '19',
    title: 'Smart Grid Technologies',
    description: 'Modern smart grid systems and renewable energy integration',
    instructor: {
      name: 'Dr. Youssef Al-Khaldi',
      avatar: '/api/placeholder/40/40',
      title: 'Smart Grid Specialist',
      rating: 4.9
    },
    duration: '10 weeks',
    level: 'Advanced',
    rating: 4.9,
    students: 1123,
    price: 379,
    thumbnail: '/e-learning/Renewable Energy Systems/Smart Grid Technologies.jpg',
    isTrending: true,
    category: 'Renewable Energy',
    tags: ['Smart Grid', 'Technology', 'Integration']
  },
  {
    id: '20',
    title: 'Sustainable HVAC Solutions',
    description: 'Energy-efficient HVAC design for sustainable buildings',
    instructor: {
      name: 'Eng. Reem Al-Qahtani',
      avatar: '/api/placeholder/40/40',
      title: 'HVAC Specialist',
      rating: 4.7
    },
    duration: '9 weeks',
    level: 'Advanced',
    rating: 4.7,
    students: 1445,
    price: 309,
    originalPrice: 399,
    thumbnail: '/e-learning/Mechanical Engineering/Sustainable HVAC Solutions.jpg',
    category: 'Mechanical Engineering',
    tags: ['HVAC', 'Sustainable', 'Green']
  },
  {
    id: '21',
    title: 'Cost Estimation and Control',
    description: 'Accurate cost estimation and budget control for engineering projects',
    instructor: {
      name: 'Ahmed Al-Subai',
      avatar: '/api/placeholder/40/40',
      title: 'Cost Estimator',
      rating: 4.6
    },
    duration: '7 weeks',
    level: 'Intermediate',
    rating: 4.6,
    students: 2012,
    price: 199,
    thumbnail: '/e-learning/Project Management/Cost Estimation and Control.jpg',
    isBestSeller: true,
    category: 'Project Management',
    tags: ['Cost', 'Budget', 'Estimation']
  },
  {
    id: '22',
    title: 'Lighting Design Fundamentals',
    description: 'Architectural and engineering lighting design principles',
    instructor: {
      name: 'Eng. Lina Al-Shammari',
      avatar: '/api/placeholder/40/40',
      title: 'Lighting Design Engineer',
      rating: 4.5
    },
    duration: '6 weeks',
    level: 'Beginner',
    rating: 4.5,
    students: 1734,
    price: 169,
    thumbnail: '/e-learning/Electrical Engineering/Lighting Design.jpg',
    category: 'Electrical Engineering',
    tags: ['Lighting', 'Design', 'Code']
  },
  {
    id: '23',
    title: 'Incident Investigation Methods',
    description: 'Systematic approach to investigating workplace incidents',
    instructor: {
      name: 'Dr. Tariq Al-Harbi',
      avatar: '/api/placeholder/40/40',
      title: 'Incident Investigation Specialist',
      rating: 4.7
    },
    duration: '5 weeks',
    level: 'Intermediate',
    rating: 4.7,
    students: 1456,
    price: 179,
    thumbnail: '/e-learning/Safety/Incident Investigation.jpg',
    category: 'Safety',
    tags: ['Investigation', 'Incident', 'Analysis']
  },
  {
    id: '24',
    title: 'Sustainable Building Design',
    description: 'Green building principles and LEED certification preparation',
    instructor: {
      name: 'Dr. Hanan Al-Mutlaq',
      avatar: '/api/placeholder/40/40',
      title: 'Sustainable Design Expert',
      rating: 4.9
    },
    duration: '12 weeks',
    level: 'Advanced',
    rating: 4.9,
    students: 1567,
    price: 399,
    originalPrice: 499,
    thumbnail: '/e-learning/Renewable Energy Systems/Sustainable Building Design.jpg',
    isTrending: true,
    isBestSeller: true,
    category: 'Renewable Energy',
    tags: ['LEED', 'Sustainable', 'Green']
  },
  {
    id: '25',
    title: 'Building Energy Modeling',
    description: 'Energy simulation and modeling for building performance optimization',
    instructor: {
      name: 'Eng. Faisal Al-Dossary',
      avatar: '/api/placeholder/40/40',
      title: 'Energy Modeling Specialist',
      rating: 4.6
    },
    duration: '8 weeks',
    level: 'Advanced',
    rating: 4.6,
    students: 1234,
    price: 289,
    thumbnail: '/e-learning/Mechanical Engineering/Building Energy Modeling.jpg',
    category: 'Mechanical Engineering',
    tags: ['Energy', 'Modeling', 'Simulation']
  },
  {
    id: '26',
    title: 'Construction Planning and Scheduling',
    description: 'Master CPM, PERT, and modern scheduling techniques',
    instructor: {
      name: 'Eng. Sami Al-Anzi',
      avatar: '/api/placeholder/40/40',
      title: 'Scheduling Specialist',
      rating: 4.8
    },
    duration: '9 weeks',
    level: 'Intermediate',
    rating: 4.8,
    students: 2456,
    price: 239,
    originalPrice: 299,
    thumbnail: '/e-learning/Project Management/Construction Planning and Scheduling.jpg',
    isBestSeller: true,
    category: 'Project Management',
    tags: ['Scheduling', 'CPM', 'Planning']
  },
  {
    id: '27',
    title: 'Risk Assessment Techniques',
    description: 'Advanced risk assessment methodologies for engineering projects',
    instructor: {
      name: 'Dr. Nada Al-Hamad',
      avatar: '/api/placeholder/40/40',
      title: 'Risk Assessment Expert',
      rating: 4.7
    },
    duration: '6 weeks',
    level: 'Advanced',
    rating: 4.7,
    students: 1567,
    price: 229,
    thumbnail: '/e-learning/Safety/Risk Assessment Techniques.jpg',
    category: 'Safety',
    tags: ['Risk', 'Assessment', 'Analysis']
  },
  {
    id: '28',
    title: 'Renewable Energy Integration',
    description: 'Integrate renewable energy sources into existing power systems',
    instructor: {
      name: 'Dr. Ibrahim Al-Shehri',
      avatar: '/api/placeholder/40/40',
      title: 'Renewable Integration Specialist',
      rating: 4.8
    },
    duration: '11 weeks',
    level: 'Advanced',
    rating: 4.8,
    students: 1089,
    price: 359,
    thumbnail: '/e-learning/Electrical Engineering/Renewable Energy Integration.jpg',
    isTrending: true,
    category: 'Electrical Engineering',
    tags: ['Renewable', 'Integration', 'Grid']
  },
  {
    id: '29',
    title: 'Safety Equipment and PPE',
    description: 'Proper selection and use of personal protective equipment',
    instructor: {
      name: 'Eng. Huda Al-Qahtani',
      avatar: '/api/placeholder/40/40',
      title: 'Safety Equipment Specialist',
      rating: 4.6
    },
    duration: '3 weeks',
    level: 'Beginner',
    rating: 4.6,
    students: 3234,
    price: 89,
    originalPrice: 129,
    thumbnail: '/e-learning/Safety/Safety Equipment and PPE.jpg',
    isNew: true,
    category: 'Safety',
    tags: ['PPE', 'Safety', 'Equipment']
  },
  {
    id: '30',
    title: 'Mechanical Code Compliance',
    description: 'Understanding and applying mechanical codes in building design',
    instructor: {
      name: 'Eng. Waleed Al-Shammari',
      avatar: '/api/placeholder/40/40',
      title: 'Mechanical Code Expert',
      rating: 4.5
    },
    duration: '7 weeks',
    level: 'Intermediate',
    rating: 4.5,
    students: 1678,
    price: 219,
    thumbnail: '/e-learning/Mechanical Engineering/Mechanical Code Compliance.jpg',
    category: 'Mechanical Engineering',
    tags: ['Code', 'Compliance', 'Mechanical']
  },
  {
    id: '31',
    title: 'Agile Project Management',
    description: 'Apply agile methodologies to engineering and construction projects',
    instructor: {
      name: 'Sarah Thompson',
      avatar: '/api/placeholder/40/40',
      title: 'Agile Coach',
      rating: 4.7
    },
    duration: '6 weeks',
    level: 'Intermediate',
    rating: 4.7,
    students: 2345,
    price: 189,
    thumbnail: '/e-learning/Project Management/Agile Project Management.jpg',
    isTrending: true,
    category: 'Project Management',
    tags: ['Agile', 'Scrum', 'Sprint']
  },
  {
    id: '32',
    title: 'Engineering Drawing Standards',
    description: 'Master technical drawing standards and conventions for engineering projects',
    instructor: {
      name: 'Eng. David Miller',
      avatar: '/api/placeholder/40/40',
      title: 'Technical Drawing Instructor',
      rating: 4.6
    },
    duration: '5 weeks',
    level: 'Beginner',
    rating: 4.6,
    students: 1890,
    price: 159,
    thumbnail: '/e-learning/Software/Engineering Drawing Standards.jpg',
    category: 'Software',
    tags: ['Drawing', 'Standards', 'CAD']
  },
  {
    id: '33',
    title: 'ETABS Structural Analysis',
    description: 'Learn ETABS software for structural analysis and design of buildings',
    instructor: {
      name: 'Dr. Ahmed Khalil',
      avatar: '/api/placeholder/40/40',
      title: 'Structural Analysis Expert',
      rating: 4.8
    },
    duration: '10 weeks',
    level: 'Advanced',
    rating: 4.8,
    students: 1567,
    price: 349,
    originalPrice: 449,
    thumbnail: '/e-learning/Software/ETABS Structural Analysis.jpg',
    isBestSeller: true,
    category: 'Software',
    tags: ['ETABS', 'Structural', 'Analysis']
  },
  {
    id: '34',
    title: 'Project Management Software',
    description: 'Master project management tools including MS Project, Primavera, and more',
    instructor: {
      name: 'Jennifer Brown',
      avatar: '/api/placeholder/40/40',
      title: 'PM Software Trainer',
      rating: 4.7
    },
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.7,
    students: 2678,
    price: 249,
    thumbnail: '/e-learning/Software/Project Management Software.jpg',
    isTrending: true,
    category: 'Software',
    tags: ['PM Software', 'MS Project', 'Primavera']
  },
  {
    id: '35',
    title: 'Revit Architecture',
    description: 'Complete guide to Revit for architectural design and BIM workflows',
    instructor: {
      name: 'Architect Maria Garcia',
      avatar: '/api/placeholder/40/40',
      title: 'Architect & BIM Specialist',
      rating: 4.9
    },
    duration: '12 weeks',
    level: 'Intermediate',
    rating: 4.9,
    students: 3245,
    price: 399,
    originalPrice: 499,
    thumbnail: '/e-learning/Software/Revit Architecture.jpg',
    isBestSeller: true,
    category: 'Software',
    tags: ['Revit', 'Architecture', 'BIM']
  },
  {
    id: '36',
    title: 'Concrete Design Methods',
    description: 'Master concrete design principles and code requirements for structural engineering',
    instructor: {
      name: 'Dr. Hassan Al-Mutairi',
      avatar: '/api/placeholder/40/40',
      title: 'Concrete Design Specialist',
      rating: 4.7
    },
    duration: '9 weeks',
    level: 'Intermediate',
    rating: 4.7,
    students: 1890,
    price: 269,
    thumbnail: '/e-learning/Structural Engineering/Concrete Design Methods.jpg',
    category: 'Structural Engineering',
    tags: ['Concrete', 'Design', 'Codes']
  },
  {
    id: '37',
    title: 'Foundation Design Principles',
    description: 'Learn foundation design for various soil conditions and structural loads',
    instructor: {
      name: 'Prof. Saleh Al-Qahtani',
      avatar: '/api/placeholder/40/40',
      title: 'Professor of Geotechnical Engineering',
      rating: 4.8
    },
    duration: '8 weeks',
    level: 'Advanced',
    rating: 4.8,
    students: 1456,
    price: 299,
    originalPrice: 379,
    thumbnail: '/e-learning/Structural Engineering/Foundation Design Principles.jpg',
    isBestSeller: true,
    category: 'Structural Engineering',
    tags: ['Foundation', 'Geotechnical', 'Design']
  },
  {
    id: '38',
    title: 'Seismic Design and Analysis',
    description: 'Earthquake-resistant design and seismic analysis for buildings and structures',
    instructor: {
      name: 'Dr. Nora Al-Shehri',
      avatar: '/api/placeholder/40/40',
      title: 'Seismic Engineering Expert',
      rating: 4.9
    },
    duration: '10 weeks',
    level: 'Advanced',
    rating: 4.9,
    students: 1234,
    price: 349,
    thumbnail: '/e-learning/Structural Engineering/Seismic Design and Analysis.jpg',
    isTrending: true,
    category: 'Structural Engineering',
    tags: ['Seismic', 'Earthquake', 'Analysis']
  },
  {
    id: '39',
    title: 'Steel Structure Design',
    description: 'Comprehensive guide to steel structure design and connection details',
    instructor: {
      name: 'Eng. Khalid Al-Dosari',
      avatar: '/api/placeholder/40/40',
      title: 'Steel Design Engineer',
      rating: 4.6
    },
    duration: '11 weeks',
    level: 'Intermediate',
    rating: 4.6,
    students: 1678,
    price: 289,
    thumbnail: '/e-learning/Structural Engineering/Steel Structure Design.jpg',
    category: 'Structural Engineering',
    tags: ['Steel', 'Design', 'Connections']
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Senior Engineer Path',
    description: 'Complete path to become a senior engineer',
    longDescription: 'This learning path is designed for engineers who want to advance to senior positions. It covers advanced technical skills, leadership, project management, and industry best practices.',
    totalCourses: 12,
    completedCourses: 8,
    totalDuration: '6 months',
    estimatedDuration: '6 months',
    estimatedCompletion: 'June 2025',
    difficulty: 'Advanced',
    thumbnail: '/api/placeholder/300/200',
    progress: 67,
    isEnrolled: true,
    isCompleted: false,
    category: 'Career Development',
    skills: ['Leadership', 'Project Management', 'Advanced Technical Skills', 'Team Management'],
    prerequisites: [],
    outcomes: [],
    instructors: [],
    courses: [],
    price: 899,
    originalPrice: 1199,
    isPopular: true,
    isNew: false
  },
  {
    id: '2',
    title: 'Project Management Certification',
    description: 'Prepare for PMP certification',
    longDescription: 'Comprehensive preparation for the PMP certification exam.',
    totalCourses: 8,
    completedCourses: 3,
    totalDuration: '4 months',
    estimatedDuration: '4 months',
    estimatedCompletion: 'April 2025',
    difficulty: 'Intermediate',
    thumbnail: '/api/placeholder/300/200',
    progress: 38,
    isEnrolled: true,
    isCompleted: false,
    category: 'Project Management',
    skills: [],
    prerequisites: [],
    outcomes: [],
    instructors: [],
    courses: [],
    price: 599,
    isPopular: false,
    isNew: false
  }
];

const mockCertifications: Certification[] = [
  {
    id: '1',
    title: 'Professional Engineer (PE) License',
    issuer: 'Saudi Council of Engineers',
    status: 'completed',
    completionDate: '2023-08-15',
    credentialId: 'PE-2023-001234',
    thumbnail: '/api/placeholder/100/100'
  },
  {
    id: '2',
    title: 'PMP Certification',
    issuer: 'Project Management Institute',
    status: 'in-progress',
    thumbnail: '/api/placeholder/100/100'
  },
  {
    id: '3',
    title: 'Autodesk Certified Professional',
    issuer: 'Autodesk',
    status: 'not-started',
    thumbnail: '/api/placeholder/100/100'
  }
];

const mockCourseProgress: CourseProgressData[] = [
  {
    id: '1',
    title: 'Advanced Structural Analysis',
    instructor: {
      name: 'Dr. Ahmed Al-Rashid',
      avatar: '/api/placeholder/40/40'
    },
    thumbnail: '/e-learning/Structural Engineering/Advanced Structural Analysis.jpg',
    progress: 75,
    totalLectures: 24,
    completedLectures: 18,
    totalDuration: '8 weeks',
    completedDuration: '6 weeks',
    lastAccessed: '2 days ago',
    nextLesson: {
      id: '19',
      title: 'Dynamic Analysis Fundamentals',
      duration: '45 min'
    },
    streak: 5,
    estimatedCompletion: 'Dec 15, 2024',
    achievements: [
      {
        id: '1',
        title: 'First Week Complete',
        description: 'Completed your first week of learning',
        icon: '🎯',
        unlockedAt: '2024-11-01',
        type: 'milestone'
      },
      {
        id: '2',
        title: '5 Day Streak',
        description: 'Learning for 5 consecutive days',
        icon: '🔥',
        unlockedAt: '2024-11-15',
        type: 'streak'
      }
    ]
  },
  {
    id: '2',
    title: 'Project Management Fundamentals',
    instructor: {
      name: 'Sarah Mitchell',
      avatar: '/api/placeholder/40/40'
    },
    thumbnail: '/e-learning/Project Management/Project Management Fundamentals.jpg',
    progress: 100,
    totalLectures: 16,
    completedLectures: 16,
    totalDuration: '6 weeks',
    completedDuration: '6 weeks',
    lastAccessed: '1 week ago',
    nextLesson: {
      id: '16',
      title: 'Course Review',
      duration: '30 min'
    },
    certificate: {
      id: 'cert-001',
      issuedDate: '2024-11-10',
      downloadUrl: '/api/certificates/cert-001.pdf'
    },
    streak: 0,
    estimatedCompletion: 'Completed',
    achievements: [
      {
        id: '3',
        title: 'Course Complete',
        description: 'Successfully completed the entire course',
        icon: '🏆',
        unlockedAt: '2024-11-10',
        type: 'completion'
      }
    ]
  },
  {
    id: '3',
    title: 'Renewable Energy Systems',
    instructor: {
      name: 'Prof. Michael Chen',
      avatar: '/api/placeholder/40/40'
    },
    thumbnail: '/e-learning/Renewable Energy Systems/Renewable Energy Systems.jpg',
    progress: 25,
    totalLectures: 20,
    completedLectures: 5,
    totalDuration: '10 weeks',
    completedDuration: '2.5 weeks',
    lastAccessed: '1 day ago',
    nextLesson: {
      id: '6',
      title: 'Solar Panel Technology',
      duration: '50 min'
    },
    streak: 3,
    estimatedCompletion: 'Feb 20, 2025',
    achievements: [
      {
        id: '4',
        title: 'Getting Started',
        description: 'Completed your first lesson',
        icon: '🚀',
        unlockedAt: '2024-11-12',
        type: 'milestone'
      }
    ]
  }
];

export default function LearningPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categories = ['all', 'Structural Engineering', 'Project Management', 'Energy Engineering', 'Software', 'Safety'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCourseEnroll = (courseId: string) => {
    console.log('Enrolling in course:', courseId);
    // Implement enrollment logic
  };

  const handleCourseView = (courseId: string) => {
    // Navigate to dynamic course page
    navigate(`/engineer/learning/course/${courseId}`);
  };

  const handleContinueLearning = (courseId: string, lessonId: string) => {
    console.log('Continuing learning:', courseId, lessonId);
    // Implement continue learning logic
  };

  const handleDownloadCertificate = (certificateId: string) => {
    console.log('Downloading certificate:', certificateId);
    // Implement certificate download logic
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header - Udemy Style */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Learning Center</h1>
            <p className="text-xs text-muted-foreground">Master engineering skills with expert-led courses</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1" />
            Certificates
          </Button>
          <Button className="h-8 text-xs bg-gradient-primary">
            <Target className="h-3.5 w-3.5 mr-1" />
            Learning Goals
          </Button>
        </div>
      </div>

      {/* Stats Cards - Udemy Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: 'Enrolled Courses',
            value: mockCourses.length,
            color: 'text-white',
            bgColor: 'bg-blue-500',
            trend: '+12%'
          },
          {
            icon: CheckCircle2,
            label: 'Completed',
            value: mockCourses.filter(c => c.completed).length,
            color: 'text-white',
            bgColor: 'bg-green-500',
            trend: '+8%'
          },
          {
            icon: Award,
            label: 'Certifications',
            value: mockCertifications.filter(c => c.status === 'completed').length,
            color: 'text-white',
            bgColor: 'bg-amber-500',
            trend: '+5%'
          },
          {
            icon: TrendingUp,
            label: 'Avg. Progress',
            value: '85%',
            color: 'text-white',
            bgColor: 'bg-purple-500',
            trend: '+3%'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden transition-all duration-300"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <Card className="bg-transparent border-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`${stat.bgColor} p-2.5 rounded-lg shadow-md`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Course Categories */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Browse Categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setSelectedCategory('all')}
          >
            All Courses
          </Button>
          {categories.slice(1).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Trending Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold">Trending Courses</h2>
        </div>
        <HorizontalScrollCards 
          className="w-full"
          cardsPerView={{
            mobile: 1.1,    // Show 1.1 cards on mobile (partial view of next)
            tablet: 2.1,    // Show 2.1 cards on tablet  
            desktop: 3.1,   // Show 3.1 cards on desktop
            wide: 4.1       // Show 4.1 cards on wide screens
          }}
        >
          {filteredCourses.filter(course => course.isTrending).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleCourseEnroll}
              onView={handleCourseView}
              layout="threeRow"
            />
          ))}
        </HorizontalScrollCards>
      </div>

      {/* Best Seller Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Best Sellers</h2>
        </div>
        <HorizontalScrollCards 
          className="w-full"
          cardsPerView={{
            mobile: 1.1,    // Show 1.1 cards on mobile (partial view of next)
            tablet: 2.1,    // Show 2.1 cards on tablet  
            desktop: 3.1,   // Show 3.1 cards on desktop
            wide: 4.1       // Show 4.1 cards on wide screens
          }}
        >
          {filteredCourses.filter(course => course.isBestSeller).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleCourseEnroll}
              onView={handleCourseView}
              layout="threeRow"
            />
          ))}
        </HorizontalScrollCards>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
        </TabsList>

        {/* My Courses Tab */}
        <TabsContent value="courses" className="mt-4 space-y-4">
          {/* Course Progress Tracking */}
          <CourseProgress
            courses={mockCourseProgress}
            onContinueLearning={handleContinueLearning}
            onDownloadCertificate={handleDownloadCertificate}
          />
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="paths" className="space-y-4">
          <LearningPaths
            paths={mockLearningPaths}
            onStartPath={(pathId) => console.log('Starting path:', pathId)}
            onContinuePath={(pathId, courseId) => console.log('Continuing path:', pathId, courseId)}
            onViewPath={(pathId) => console.log('Viewing path:', pathId)}
          />
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCertifications.map((cert) => (
              <Card key={cert.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <img 
                        src={cert.thumbnail} 
                        alt={cert.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{cert.title}</h3>
                        <Badge 
                          variant={
                            cert.status === 'completed' ? 'default' : 
                            cert.status === 'in-progress' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {cert.status === 'completed' ? 'Completed' : 
                           cert.status === 'in-progress' ? 'In Progress' : 
                           'Not Started'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{cert.issuer}</p>
                      {cert.completionDate && (
                        <p className="text-xs text-muted-foreground">Completed: {cert.completionDate}</p>
                      )}
                      {cert.credentialId && (
                        <p className="text-xs text-muted-foreground">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" className="w-full">
                      {cert.status === 'completed' ? 'View Certificate' : 
                       cert.status === 'in-progress' ? 'Continue' : 
                       'Start Certification'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Browse All Tab */}
        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleCourseEnroll}
                onView={handleCourseView}
                layout="threeRow"
              />
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Courses Found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or category filters</p>
              <Button onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}>
                Clear Filters
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Export mockCourses and Course type for use in CoursePage and other components
export { mockCourses };
export type { Course, Instructor, CourseSection, CourseLecture, CourseReview };
