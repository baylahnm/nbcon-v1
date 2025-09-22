// Enhanced Learning Data with Provider Information and Skills

interface Provider {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  type: 'enterprise' | 'university' | 'certification' | 'government';
}

interface EnhancedCourse {
  id: string;
  title: string;
  provider: Provider;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  rating: number;
  ratingCount: number;
  language: string[];
  hasCertificate: boolean;
  hasHandsOn: boolean;
  cpd: boolean;
  thumbnail: string;
  description: string;
  tags: string[];
  price: number; // SAR
  isBookmarked: boolean;
  popularity: number;
  skills: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  completionCriteria: {
    watchPercentage?: number;
    quizPassScore?: number;
  };
  enrolledCount?: number;
  trending?: boolean;
  newContent?: boolean;
  saudiSpecific?: boolean;
}

// Enhanced providers for Saudi engineering marketplace
export const sampleProviders: Provider[] = [
  {
    id: "neom-tech",
    name: "NEOM Tech Institute",
    logo: "/providers/neom-tech.png",
    verified: true,
    type: "enterprise"
  },
  {
    id: "aramco-training",
    name: "ARAMCO Training Institute",
    logo: "/providers/aramco.png",
    verified: true,
    type: "enterprise"
  },
  {
    id: "trsdc-academy",
    name: "TRSDC Engineering Academy",
    logo: "/providers/trsdc.png",
    verified: true,
    type: "enterprise"
  },
  {
    id: "sabic-institute",
    name: "SABIC Technical Institute",
    logo: "/providers/sabic.png",
    verified: true,
    type: "enterprise"
  },
  {
    id: "kau-engineering",
    name: "King Abdulaziz University",
    logo: "/providers/kau.png",
    verified: true,
    type: "university"
  },
  {
    id: "sce-academy",
    name: "Saudi Council of Engineers",
    logo: "/providers/sce.png",
    verified: true,
    type: "government"
  }
];

// Enhanced courses with complete provider and skills information
export const enhancedSampleCourses: EnhancedCourse[] = [
  {
    id: "course-1",
    title: "NEOM Smart City Infrastructure Design",
    provider: sampleProviders[0], // NEOM Tech Institute
    category: "Smart Technologies",
    level: "intermediate",
    duration: 480,
    rating: 4.9,
    ratingCount: 67,
    language: ["en", "ar"],
    hasCertificate: true,
    hasHandsOn: true,
    cpd: true,
    thumbnail: "smart-city",
    description: "Cutting-edge smart city technologies and IoT implementation for mega projects like NEOM.",
    tags: ["Smart City", "IoT", "NEOM", "Innovation"],
    price: 1500,
    isBookmarked: false,
    popularity: 95,
    skills: ["Smart City Design", "IoT Systems", "Sustainable Engineering", "Urban Planning"],
    prerequisites: ["Basic Engineering Principles", "Project Management Fundamentals"],
    learningOutcomes: [
      "Design smart infrastructure for mega cities",
      "Implement IoT solutions in urban environments", 
      "Apply sustainability principles in city planning",
      "Integrate renewable energy systems"
    ],
    completionCriteria: {
      watchPercentage: 90,
      quizPassScore: 75
    },
    enrolledCount: 1247,
    trending: true,
    saudiSpecific: true
  },
  {
    id: "course-2", 
    title: "Aramco Process Safety Management",
    provider: sampleProviders[1], // ARAMCO Training Institute
    category: "Safety & Compliance",
    level: "advanced",
    duration: 360,
    rating: 4.9,
    ratingCount: 203,
    language: ["ar", "en"],
    hasCertificate: true,
    hasHandsOn: true,
    cpd: true,
    thumbnail: "safety-course",
    description: "Comprehensive safety protocols for construction sites in Saudi Arabia's challenging desert environment.",
    tags: ["Safety", "Desert", "OSHA", "Saudi Standards"],
    price: 950,
    isBookmarked: true,
    popularity: 98,
    skills: ["Process Safety", "Risk Assessment", "Emergency Response", "Saudi Safety Standards"],
    prerequisites: ["Basic Safety Training", "Industrial Experience"],
    learningOutcomes: [
      "Implement advanced process safety management",
      "Conduct comprehensive risk assessments",
      "Develop emergency response protocols",
      "Apply Saudi-specific safety regulations"
    ],
    completionCriteria: {
      watchPercentage: 95,
      quizPassScore: 80
    },
    enrolledCount: 2156,
    trending: true,
    saudiSpecific: true
  },
  {
    id: "course-3",
    title: "Red Sea Project Marine Engineering",
    provider: sampleProviders[2], // TRSDC Engineering Academy
    category: "Civil Engineering", 
    level: "intermediate",
    duration: 420,
    rating: 4.8,
    ratingCount: 134,
    language: ["en", "ar"],
    hasCertificate: true,
    hasHandsOn: true,
    cpd: true,
    thumbnail: "marine-engineering",
    description: "Advanced marine and coastal engineering techniques for luxury resort development in challenging Red Sea conditions.",
    tags: ["Marine Engineering", "Coastal", "Red Sea", "Resort Development"],
    price: 1200,
    isBookmarked: false,
    popularity: 89,
    skills: ["Marine Structures", "Coastal Protection", "Sustainable Tourism", "Environmental Engineering"],
    prerequisites: ["Coastal Engineering Basics", "Environmental Impact Assessment"],
    learningOutcomes: [
      "Design marine infrastructure for tourism projects",
      "Apply coastal protection techniques",
      "Integrate environmental sustainability",
      "Manage marine construction projects"
    ],
    completionCriteria: {
      watchPercentage: 85,
      quizPassScore: 70
    },
    enrolledCount: 892,
    newContent: true,
    saudiSpecific: true
  },
  {
    id: "course-4",
    title: "SABIC Petrochemical Plant Design Standards",
    provider: sampleProviders[3], // SABIC Technical Institute
    category: "Mechanical Engineering",
    level: "advanced",
    duration: 540,
    rating: 4.9,
    ratingCount: 178,
    language: ["ar", "en"],
    hasCertificate: true,
    hasHandsOn: true,
    cpd: true,
    thumbnail: "petrochemical-design",
    description: "Comprehensive petrochemical plant design following SABIC standards and Saudi environmental regulations.",
    tags: ["Petrochemical", "Plant Design", "SABIC", "Environmental Compliance"],
    price: 1800,
    isBookmarked: false,
    popularity: 92,
    skills: ["Plant Design", "Process Engineering", "Environmental Compliance", "Saudi Regulations"],
    prerequisites: ["Chemical Engineering Fundamentals", "Process Design Experience"],
    learningOutcomes: [
      "Design petrochemical processing facilities",
      "Apply SABIC design standards",
      "Ensure environmental compliance",
      "Optimize plant operations"
    ],
    completionCriteria: {
      watchPercentage: 90,
      quizPassScore: 85
    },
    enrolledCount: 1567,
    trending: false,
    saudiSpecific: true
  },
  {
    id: "course-5",
    title: "BIM for Saudi Construction Projects",
    provider: sampleProviders[4], // King Abdulaziz University
    category: "BIM & CAD",
    level: "intermediate",
    duration: 300,
    rating: 4.7,
    ratingCount: 245,
    language: ["en", "ar"],
    hasCertificate: true,
    hasHandsOn: true,
    cpd: true,
    thumbnail: "bim-construction",
    description: "Building Information Modeling techniques specifically adapted for Saudi construction standards and regulations.",
    tags: ["BIM", "Construction", "Saudi Standards", "Digital Twin"],
    price: 850,
    isBookmarked: false,
    popularity: 87,
    skills: ["BIM Modeling", "Construction Documentation", "Saudi Building Codes", "Project Coordination"],
    prerequisites: ["CAD Experience", "Construction Basics"],
    learningOutcomes: [
      "Create comprehensive BIM models",
      "Apply Saudi building standards",
      "Coordinate multi-disciplinary projects",
      "Generate construction documentation"
    ],
    completionCriteria: {
      watchPercentage: 80,
      quizPassScore: 75
    },
    enrolledCount: 1834,
    newContent: true,
    saudiSpecific: true
  },
  {
    id: "course-6",
    title: "SCE Professional Development Requirements",
    provider: sampleProviders[5], // Saudi Council of Engineers
    category: "Professional Development",
    level: "beginner",
    duration: 180,
    rating: 4.6,
    ratingCount: 567,
    language: ["ar", "en"],
    hasCertificate: true,
    hasHandsOn: false,
    cpd: true,
    thumbnail: "sce-requirements",
    description: "Essential CPD requirements and professional standards for engineers practicing in Saudi Arabia.",
    tags: ["SCE", "CPD", "Professional Standards", "Certification"],
    price: 450,
    isBookmarked: true,
    popularity: 94,
    skills: ["Professional Ethics", "Saudi Engineering Law", "CPD Management", "Career Development"],
    prerequisites: ["Engineering Degree"],
    learningOutcomes: [
      "Understand SCE professional requirements",
      "Manage CPD credits effectively",
      "Apply professional ethics",
      "Navigate Saudi engineering regulations"
    ],
    completionCriteria: {
      watchPercentage: 100,
      quizPassScore: 80
    },
    enrolledCount: 3245,
    trending: false,
    saudiSpecific: true
  },
  {
    id: "course-7",
    title: "Quick Safety Protocols for Site Engineers",
    provider: sampleProviders[5], // Saudi Council of Engineers
    category: "Safety & Compliance",
    level: "beginner",
    duration: 25,
    rating: 4.5,
    ratingCount: 324,
    language: ["ar", "en"],
    hasCertificate: true,
    hasHandsOn: false,
    cpd: true,
    thumbnail: "quick-safety",
    description: "Essential safety protocols every site engineer should know in 25 minutes.",
    tags: ["Safety", "Quick Learning", "Site Management"],
    price: 200,
    isBookmarked: false,
    popularity: 96,
    skills: ["Site Safety", "Risk Assessment", "Emergency Response"],
    prerequisites: [],
    learningOutcomes: [
      "Identify common site hazards",
      "Apply basic safety protocols",
      "Conduct safety briefings"
    ],
    completionCriteria: {
      watchPercentage: 100,
      quizPassScore: 70
    },
    enrolledCount: 2890,
    trending: true,
    newContent: false,
    saudiSpecific: true
  },
  {
    id: "course-8", 
    title: "Introduction to AutoCAD for Beginners",
    provider: sampleProviders[4], // King Abdulaziz University
    category: "BIM & CAD",
    level: "beginner",
    duration: 30,
    rating: 4.4,
    ratingCount: 456,
    language: ["en", "ar"],
    hasCertificate: true,
    hasHandsOn: true,
    cpd: false,
    thumbnail: "autocad-basics",
    description: "Quick introduction to AutoCAD fundamentals for engineering students.",
    tags: ["AutoCAD", "CAD", "Engineering Drawing", "Beginner"],
    price: 300,
    isBookmarked: false,
    popularity: 88,
    skills: ["CAD Drawing", "Technical Drawing", "2D Design"],
    prerequisites: [],
    learningOutcomes: [
      "Navigate AutoCAD interface",
      "Create basic 2D drawings",
      "Use essential drawing tools"
    ],
    completionCriteria: {
      watchPercentage: 85,
      quizPassScore: 70
    },
    enrolledCount: 1567,
    trending: false,
    newContent: true,
    saudiSpecific: false
  },
  {
    id: "course-9",
    title: "Digital Project Management for Engineers", 
    provider: sampleProviders[0], // NEOM Tech Institute
    category: "Project Management",
    level: "intermediate",
    duration: 28,
    rating: 4.7,
    ratingCount: 289,
    language: ["en"],
    hasCertificate: true,
    hasHandsOn: true,
    cpd: true,
    thumbnail: "digital-pm",
    description: "Modern digital tools and methodologies for engineering project management.",
    tags: ["Digital Tools", "Project Management", "Innovation", "Technology"],
    price: 750,
    isBookmarked: true,
    popularity: 92,
    skills: ["Digital PM Tools", "Agile Methodology", "Team Collaboration"],
    prerequisites: ["Basic Project Management"],
    learningOutcomes: [
      "Use digital PM platforms",
      "Apply agile methodologies", 
      "Manage remote engineering teams"
    ],
    completionCriteria: {
      watchPercentage: 90,
      quizPassScore: 75
    },
    enrolledCount: 1234,
    trending: true,
    newContent: true,
    saudiSpecific: false
  }
];

// Recommendation categories for personalized content
export const recommendationCategories = {
  byRole: {
    engineer: ["Smart Technologies", "BIM & CAD", "Safety & Compliance", "Professional Development"],
    client: ["Project Management", "Contract Management", "Quality Assurance", "Professional Development"],
    enterprise: ["Team Management", "Strategic Planning", "Compliance", "Digital Transformation"],
    admin: ["Platform Management", "Analytics", "Compliance", "User Management"]
  },
  
  bySpecialty: {
    "Structural Engineering": ["Structural Analysis", "BIM & CAD", "Saudi Building Codes", "Seismic Design"],
    "Civil Engineering": ["Infrastructure", "Transportation", "Water Resources", "Urban Planning"],
    "Mechanical Engineering": ["HVAC Systems", "Plant Design", "Energy Systems", "Manufacturing"],
    "Electrical Engineering": ["Power Systems", "Smart Grid", "Renewable Energy", "Control Systems"],
    "Environmental Engineering": ["Sustainability", "Waste Management", "Water Treatment", "Environmental Compliance"]
  },
  
  trending: ["Smart City Design", "Sustainability", "Digital Transformation", "AI in Engineering"],
  
  saudiSpecific: ["Vision 2030", "NEOM Projects", "Saudi Building Codes", "Desert Engineering", "Cultural Considerations"]
};

// Generate recommendations based on user profile
export const generateRecommendations = (
  userRole: 'engineer' | 'client' | 'enterprise' | 'admin',
  userSpecialty: string,
  userLocation: string = 'Saudi Arabia'
) => {
  const recommendations = {
    forYou: enhancedSampleCourses.filter(course => 
      recommendationCategories.byRole[userRole].includes(course.category) ||
      (userSpecialty && recommendationCategories.bySpecialty[userSpecialty as keyof typeof recommendationCategories.bySpecialty]?.includes(course.category))
    ).slice(0, 6),
    
    trending: enhancedSampleCourses.filter(course => 
      course.trending && course.saudiSpecific
    ).slice(0, 6),
    
    newContent: enhancedSampleCourses.filter(course => 
      course.newContent
    ).slice(0, 6),
    
    saudiSpecific: enhancedSampleCourses.filter(course => 
      course.saudiSpecific
    ).slice(0, 6)
  };

  return recommendations;
};
