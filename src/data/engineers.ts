export interface Engineer {
  id: string;
  rank: number;
  rankingChange: number; // Positive = improved (moved up), Negative = dropped (moved down), 0 = no change
  rankingHistory: Array<{ month: string; rank: number }>; // Historical ranking data
  name: string;
  gender: "man" | "woman";
  expertise: string;
  badgeColor: string;
  skills: string[];
  certifications: string[];
  bio: string;
  experience: string;
  location: string;
  projects: number;
  rating: number;
  profileImage: string;
  education: string[];
  awards: string[];
  careerHighlights: string[];
  email?: string;
  linkedin?: string;
  majorProjects: Array<{
    name: string;
    description: string;
    year: string;
  }>;
  certificationsDetailed: Array<{
    name: string;
    organization: string;
    year: string;
  }>;
}

export const engineers: Engineer[] = [
  {
    id: "1",
    rank: 1,
    rankingChange: 0,
    rankingHistory: [
      { month: "Jul", rank: 1 },
      { month: "Aug", rank: 1 },
      { month: "Sep", rank: 1 },
      { month: "Oct", rank: 1 },
      { month: "Nov", rank: 1 },
      { month: "Dec", rank: 1 }
    ],
    name: "عبدالله السعيد - Abdullah Al-Saeed",
    gender: "man",
    expertise: "Petroleum Engineering",
    badgeColor: "amber",
    skills: ["Enhanced Oil Recovery", "Reservoir Simulation", "Production Optimization", "Well Design", "Drilling Operations", "Petroleum Economics"],
    certifications: ["PhD Petroleum Engineering", "PE License", "SPE Distinguished Member", "PMP"],
    bio: "Abdullah Al-Saeed is a leading petroleum engineer with over 25 years of experience in the oil and gas industry. He has pioneered innovative enhanced oil recovery techniques that have increased production efficiency by 40% across major Saudi fields. His research in reservoir simulation has been published in over 50 international journals.",
    experience: "25",
    location: "Dhahran, Eastern Province",
    projects: 147,
    rating: 9.8,
    profileImage: "https://images.unsplash.com/photo-1736939763234-f176517e95ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "PhD in Petroleum Engineering - Stanford University (1998)",
      "MSc in Petroleum Engineering - King Fahd University (1993)",
      "BSc in Chemical Engineering - King Abdulaziz University (1990)"
    ],
    awards: [
      "SPE Regional Technical Achievement Award (2022)",
      "Saudi Excellence in Engineering Award (2020)",
      "Outstanding Petroleum Engineer of the Year (2018)",
      "Innovation in Energy Award (2015)"
    ],
    careerHighlights: [
      "Led $2.3B offshore drilling project completion 6 months ahead of schedule",
      "Developed proprietary EOR technique adopted industry-wide in Saudi Arabia",
      "Published 52 peer-reviewed papers in top petroleum engineering journals",
      "Mentored 35+ petroleum engineers who now hold senior positions"
    ],
    email: "abdullah.alsaeed@example.sa",
    linkedin: "linkedin.com/in/abdullah-alsaeed",
    majorProjects: [
      {
        name: "Ghawar Field Optimization Project",
        description: "Implemented advanced reservoir simulation techniques to optimize production in the world's largest oil field, resulting in 15% increase in recovery factor.",
        year: "2021-2023"
      },
      {
        name: "Offshore Platform Development",
        description: "Led engineering team for the construction and commissioning of a $2.3B offshore platform in the Arabian Gulf.",
        year: "2018-2020"
      },
      {
        name: "Enhanced Oil Recovery Research Initiative",
        description: "Pioneered CO2 injection techniques for mature fields, extending field life by 20+ years.",
        year: "2015-2017"
      }
    ],
    certificationsDetailed: [
      { name: "PhD in Petroleum Engineering", organization: "Stanford University", year: "1998" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "1995" },
      { name: "SPE Distinguished Member", organization: "Society of Petroleum Engineers", year: "2020" },
      { name: "Project Management Professional (PMP)", organization: "PMI", year: "2010" }
    ]
  },
  {
    id: "2",
    rank: 2,
    rankingChange: 3,
    rankingHistory: [
      { month: "Jul", rank: 8 },
      { month: "Aug", rank: 6 },
      { month: "Sep", rank: 5 },
      { month: "Oct", rank: 4 },
      { month: "Nov", rank: 3 },
      { month: "Dec", rank: 2 }
    ],
    name: "نورة الغامدي - Noura Al-Ghamdi",
    gender: "woman",
    expertise: "Civil Engineering",
    badgeColor: "blue",
    skills: ["Structural Design", "Infrastructure Planning", "Seismic Engineering", "BIM Technology", "Sustainable Construction", "Project Management"],
    certifications: ["MSc Structural Engineering", "PE License", "LEED AP", "PMP", "BIM Professional"],
    bio: "Noura Al-Ghamdi is a renowned civil engineer specializing in mega-infrastructure projects. She has been instrumental in designing and overseeing the construction of iconic structures across Saudi Arabia, including bridges, stadiums, and high-rise buildings. Her expertise in seismic engineering has set new safety standards in the kingdom.",
    experience: "18",
    location: "Riyadh, Riyadh Province",
    projects: 89,
    rating: 9.6,
    profileImage: "https://images.unsplash.com/photo-1625987306773-8b9e554b25e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "MSc in Structural Engineering - MIT (2008)",
      "BSc in Civil Engineering - King Saud University (2005)"
    ],
    awards: [
      "Arab Women Engineers Excellence Award (2023)",
      "Saudi Infrastructure Innovation Award (2021)",
      "Best Structural Design Award - ASCE (2019)"
    ],
    careerHighlights: [
      "Lead structural engineer for King Abdullah Financial District towers",
      "Designed seismic retrofit solutions for 50+ heritage buildings",
      "First Saudi woman to lead a billion-riyal infrastructure project",
      "Pioneered use of BIM technology in Saudi construction industry"
    ],
    email: "noura.alghamdi@example.sa",
    linkedin: "linkedin.com/in/noura-alghamdi",
    majorProjects: [
      {
        name: "King Abdullah Financial District",
        description: "Lead structural engineer for multiple high-rise towers in KAFD, implementing cutting-edge seismic design.",
        year: "2019-2022"
      },
      {
        name: "Riyadh Metro Stations",
        description: "Designed structural systems for 12 metro stations incorporating sustainable and aesthetic principles.",
        year: "2016-2019"
      },
      {
        name: "King Fahd Stadium Renovation",
        description: "Oversaw complete structural assessment and renovation of the iconic 68,000-capacity stadium.",
        year: "2014-2016"
      }
    ],
    certificationsDetailed: [
      { name: "MSc in Structural Engineering", organization: "MIT", year: "2008" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "2007" },
      { name: "LEED Accredited Professional", organization: "USGBC", year: "2012" },
      { name: "Project Management Professional (PMP)", organization: "PMI", year: "2015" },
      { name: "BIM Professional Certification", organization: "Autodesk", year: "2017" }
    ]
  },
  {
    id: "3",
    rank: 3,
    rankingChange: -1,
    rankingHistory: [
      { month: "Jul", rank: 3 },
      { month: "Aug", rank: 2 },
      { month: "Sep", rank: 2 },
      { month: "Oct", rank: 2 },
      { month: "Nov", rank: 2 },
      { month: "Dec", rank: 3 }
    ],
    name: "خالد العتيبي - Khaled Al-Otaibi",
    gender: "man",
    expertise: "Software Engineering",
    badgeColor: "purple",
    skills: ["Cloud Architecture", "AI/Machine Learning", "Cybersecurity", "Blockchain", "Full-Stack Development", "DevOps"],
    certifications: ["MSc Computer Science", "AWS Solutions Architect", "CISSP", "Google Cloud Professional", "Certified Ethical Hacker"],
    bio: "Khaled Al-Otaibi is a visionary software engineer who has led digital transformation initiatives across Saudi Arabia's public and private sectors. He specializes in cloud architecture and artificial intelligence, having developed several award-winning solutions that have modernized government services and enhanced cybersecurity infrastructure.",
    experience: "15",
    location: "Jeddah, Makkah Province",
    projects: 156,
    rating: 9.7,
    profileImage: "https://images.unsplash.com/photo-1615813967261-6cdcfc4c7edd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "MSc in Computer Science - Carnegie Mellon University (2011)",
      "BSc in Software Engineering - KFUPM (2008)"
    ],
    awards: [
      "Saudi Digital Innovation Award (2023)",
      "Arab AI Excellence Award (2022)",
      "Cybersecurity Professional of the Year (2020)",
      "Best Cloud Solution Award - AWS (2019)"
    ],
    careerHighlights: [
      "Architected national e-government platform serving 15M+ users",
      "Developed AI-powered fraud detection system saving SR 500M annually",
      "Led blockchain implementation for Saudi land registry system",
      "Created cybersecurity framework adopted by 200+ Saudi organizations"
    ],
    email: "khaled.alotaibi@example.sa",
    linkedin: "linkedin.com/in/khaled-alotaibi",
    majorProjects: [
      {
        name: "National Digital Services Platform",
        description: "Architected and implemented cloud-based platform consolidating 200+ government services with 99.99% uptime.",
        year: "2020-2023"
      },
      {
        name: "AI Fraud Detection System",
        description: "Developed machine learning system for financial fraud detection, achieving 98% accuracy rate.",
        year: "2019-2020"
      },
      {
        name: "Blockchain Land Registry",
        description: "Implemented distributed ledger technology for secure and transparent property transactions.",
        year: "2018-2019"
      }
    ],
    certificationsDetailed: [
      { name: "MSc in Computer Science", organization: "Carnegie Mellon University", year: "2011" },
      { name: "AWS Solutions Architect Professional", organization: "Amazon Web Services", year: "2018" },
      { name: "CISSP", organization: "ISC2", year: "2016" },
      { name: "Google Cloud Professional Architect", organization: "Google", year: "2019" },
      { name: "Certified Ethical Hacker", organization: "EC-Council", year: "2015" }
    ]
  }
];

// Export the engineers array as allEngineers for compatibility
export const allEngineers = engineers;
