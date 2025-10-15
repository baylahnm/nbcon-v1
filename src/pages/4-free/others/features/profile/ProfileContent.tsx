import { useState } from "react";
import { useAuthStore } from "../../../../2-auth/others/stores/auth";
import { getUserDisplayName, getUserInitials } from "../../../../1-HomePage/others/lib/userUtils";
import { 
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  Shield,
  Award,
  GraduationCap,
  Briefcase,
  Star,
  Download,
  Upload,
  Edit,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  FileText,
  Globe,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/pages/1-HomePage/others/components/ui/avatar';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Label } from '@/pages/1-HomePage/others/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { Switch } from '@/pages/1-HomePage/others/components/ui/switch';
import { Separator } from '@/pages/1-HomePage/others/components/ui/separator';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';

import { EngineerProfile } from "./profiles/EngineerProfile";
import { FunctionalEngineerProfile } from "./profiles/FunctionalEngineerProfile";
import { ClientProfile } from "./profiles/ClientProfile";
import { EnterpriseProfile } from "./profiles/EnterpriseProfile";

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    city: string;
    province: string;
    bio: string;
    profileImage?: string;
  };
  professionalInfo: {
    title: string;
    company: string;
    experience: string;
    specialization: string[];
    sceNumber: string;
    sceStatus: "verified" | "pending" | "expired";
    licenses: License[];
    certifications: Certification[];
    languages: Language[];
  };
  portfolio: {
    projects: PortfolioProject[];
    skills: Skill[];
    achievements: Achievement[];
    reviews: Review[];
  };
  settings: {
    profileVisibility: "public" | "professional" | "private";
    showPhone: boolean;
    showEmail: boolean;
    jobNotifications: boolean;
    marketingEmails: boolean;
  };
}

interface License {
  id: string;
  name: string;
  issuer: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: "active" | "expired" | "pending";
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

interface Language {
  language: string;
  proficiency: "native" | "fluent" | "intermediate" | "basic";
}

interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  client: string;
  location: string;
  value: string;
  duration: string;
  status: "completed" | "ongoing" | "planning";
  images: string[];
  skills: string[];
}

interface Skill {
  name: string;
  level: number;
  category: "technical" | "software" | "management" | "communication";
  verified: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string;
  type: "award" | "certification" | "recognition" | "milestone";
}

interface Review {
  id: string;
  clientName: string;
  projectName: string;
  rating: number;
  comment: string;
  date: string;
}

const sampleProfileData: ProfileData = {
  personalInfo: {
    firstName: "Nasser",
    lastName: "Baylah",
    email: "info@nbcon.app",
    phone: "+966 55 123 4567",
    dateOfBirth: "1988-03-15",
    nationality: "Saudi Arabian",
    city: "Riyadh",
    province: "Riyadh Province",
    bio: "Experienced structural engineer with 12+ years in large-scale infrastructure projects across Saudi Arabia. Specialized in seismic design, high-rise buildings, and mega-project development. Proven track record with NEOM, Aramco, and Red Sea Development projects.",
    profileImage: undefined
  },
  professionalInfo: {
    title: "Senior Structural Engineer",
    company: "Independent Consultant",
    experience: "12+ years",
    specialization: ["Structural Engineering", "Seismic Design", "High-Rise Buildings", "Infrastructure"],
    sceNumber: "SCE-SE-2024-789456",
    sceStatus: "verified",
    licenses: [
      {
        id: "1",
        name: "Professional Engineer License",
        issuer: "Saudi Council of Engineers",
        number: "PE-2024-789456",
        issueDate: "2024-01-15",
        expiryDate: "2026-01-15",
        status: "active"
      },
      {
        id: "2", 
        name: "Structural Design Certification",
        issuer: "Saudi Building Code Committee",
        number: "SDC-2023-456789",
        issueDate: "2023-08-20",
        expiryDate: "2025-08-20",
        status: "active"
      }
    ],
    certifications: [
      {
        id: "1",
        name: "ETABS Advanced Analysis",
        issuer: "Computers & Structures Inc.",
        issueDate: "2023-11-10",
        credentialId: "CSI-ETABS-2023-1567"
      },
      {
        id: "2",
        name: "Project Management Professional (PMP)",
        issuer: "Project Management Institute",
        issueDate: "2022-06-15",
        expiryDate: "2025-06-15",
        credentialId: "PMP-2022-891234"
      }
    ],
    languages: [
      { language: "Arabic", proficiency: "native" },
      { language: "English", proficiency: "fluent" },
      { language: "French", proficiency: "intermediate" }
    ]
  },
  portfolio: {
    projects: [
      {
        id: "1",
        name: "NEOM Smart City Infrastructure",
        description: "Structural design and analysis for Phase 1 smart city infrastructure including residential towers, commercial complexes, and transportation hubs.",
        client: "NEOM Development Company",
        location: "NEOM, Tabuk Province",
        value: "1,250,000 SAR",
        duration: "18 months",
        status: "completed",
        images: [],
        skills: ["Structural Design", "ETABS", "Seismic Analysis", "Project Management"]
      },
      {
        id: "2",
        name: "Aramco Headquarters Expansion",
        description: "Seismic retrofitting and structural enhancement of existing headquarters building to accommodate new wings and increased capacity.",
        client: "Saudi Aramco",
        location: "Dhahran, Eastern Province", 
        value: "850,000 SAR",
        duration: "12 months",
        status: "completed",
        images: [],
        skills: ["Retrofitting", "Seismic Design", "Steel Structures", "Code Compliance"]
      },
      {
        id: "3",
        name: "Red Sea Resort Foundation Systems",
        description: "Design of deep foundation systems for luxury resort development on challenging coastal terrain with environmental considerations.",
        client: "Red Sea Global",
        location: "Red Sea Coast",
        value: "680,000 SAR",
        duration: "8 months",
        status: "ongoing",
        images: [],
        skills: ["Foundation Design", "Coastal Engineering", "Environmental Engineering"]
      }
    ],
    skills: [
      { name: "Structural Analysis", level: 95, category: "technical", verified: true },
      { name: "ETABS", level: 90, category: "software", verified: true },
      { name: "AutoCAD", level: 88, category: "software", verified: true },
      { name: "Seismic Design", level: 92, category: "technical", verified: true },
      { name: "Project Management", level: 85, category: "management", verified: true },
      { name: "SAFE", level: 87, category: "software", verified: false },
      { name: "Team Leadership", level: 88, category: "management", verified: true },
      { name: "Client Relations", level: 90, category: "communication", verified: true }
    ],
    achievements: [
      {
        id: "1",
        title: "Excellence in Structural Engineering Award",
        description: "Recognized for outstanding contribution to NEOM Smart City project structural design innovations.",
        date: "2024-10-15",
        issuer: "Saudi Council of Engineers",
        type: "award"
      },
      {
        id: "2",
        title: "1000+ Successful Projects Milestone",
        description: "Completed over 1000 engineering projects across Saudi Arabia with 98.5% client satisfaction rate.",
        date: "2024-08-20",
        issuer: "nbcon Platform",
        type: "milestone"
      },
      {
        id: "3",
        title: "Safety Excellence Recognition",
        description: "Zero-incident safety record across all major projects with exemplary safety protocol implementation.",
        date: "2024-06-10",
        issuer: "Saudi Building Safety Council",
        type: "recognition"
      }
    ],
    reviews: [
      {
        id: "1",
        clientName: "Nasser Baylah",
        projectName: "NEOM Smart City Infrastructure",
        rating: 5,
        comment: "Exceptional structural analysis and design work. Nasser's attention to detail and innovative solutions exceeded our expectations. Highly recommended for complex infrastructure projects.",
        date: "2024-09-28"
      },
      {
        id: "2", 
        clientName: "Dr. Khalid Al-Mutairi",
        projectName: "Aramco Headquarters Expansion",
        rating: 5,
        comment: "Outstanding professional with deep expertise in seismic design. Delivered high-quality work on time and provided excellent technical guidance throughout the project.",
        date: "2024-07-15"
      },
      {
        id: "3",
        clientName: "Fatima Al-Zahra",
        projectName: "Red Sea Resort Foundation Systems",
        rating: 4,
        comment: "Great engineering skills and environmental consideration. Communication was excellent and all deliverables were of high standard.",
        date: "2024-11-05"
      }
    ]
  },
  settings: {
    profileVisibility: "professional",
    showPhone: true,
    showEmail: false,
    jobNotifications: true,
    marketingEmails: false
  }
};

export function ProfileContent() {
  const { profile, updateUser } = useAuthStore();
  
  // Role-based component rendering
  const renderRoleSpecificProfile = () => {
    switch (profile?.role) {
      case 'engineer':
        return <FunctionalEngineerProfile />;
      case 'client':
        return <ClientProfile />;
      case 'enterprise':
        return <EnterpriseProfile />;
      default:
        return <FunctionalEngineerProfile />; // Default to functional engineer profile
    }
  };

  return renderRoleSpecificProfile();
}

