import { Engineer } from './engineers';

export const remainingEngineers: Engineer[] = [
  {
    id: "6",
    rank: 6,
    rankingChange: 2,
    rankingHistory: [
      { month: "Aug 2024", rank: 8 },
      { month: "Sep 2024", rank: 7 },
      { month: "Oct 2024", rank: 7 },
      { month: "Nov 2024", rank: 6 },
      { month: "Dec 2024", rank: 6 },
      { month: "Jan 2025", rank: 6 }
    ],
    name: "نورا الغامدي / Noura Al-Ghamdi",
    gender: "woman",
    expertise: "Chemical Engineering",
    location: "Jeddah, Saudi Arabia",
    rating: 0.88,
    projects: 29,
    experience: "7 years",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    skills: ["Process Design", "Petrochemicals", "Process Safety", "Process Control", "Environmental Engineering", "Process Optimization"],
    certifications: ["PE License", "CCPS Member", "Process Safety Professional"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2019 },
      { name: "Process Safety Professional", org: "CCPS", year: 2021 },
      { name: "Environmental Management", org: "ISO", year: 2022 }
    ],
    majorProjects: [
      { name: "Petrochemical Complex Design", description: "Designed large-scale petrochemical facility", year: 2023 },
      { name: "Process Safety Implementation", description: "Implemented comprehensive safety systems", year: 2022 },
      { name: "Environmental Compliance", description: "Led environmental compliance initiatives", year: 2021 }
    ],
    education: ["MS Chemical Engineering - KFUPM", "BS Chemical Engineering - KSU"],
    bio: "Dedicated Chemical Engineer specializing in process design and safety. Committed to sustainable and safe industrial processes in the petrochemical sector.",
    email: "noura.alghamdi@example.com",
    linkedin: "https://linkedin.com/in/noura-alghamdi"
  },
  {
    id: "7",
    rank: 7,
    rankingChange: -1,
    rankingHistory: [
      { month: "Aug 2024", rank: 6 },
      { month: "Sep 2024", rank: 6 },
      { month: "Oct 2024", rank: 6 },
      { month: "Nov 2024", rank: 7 },
      { month: "Dec 2024", rank: 7 },
      { month: "Jan 2025", rank: 7 }
    ],
    name: "خالد المطيري / Khalid Al-Mutairi",
    gender: "man",
    expertise: "Aerospace Engineering",
    location: "Riyadh, Saudi Arabia",
    rating: 0.86,
    projects: 31,
    experience: "9 years",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    skills: ["Aircraft Design", "Aerodynamics", "Flight Dynamics", "Composite Materials", "Systems Engineering", "Avionics"],
    certifications: ["PE License", "AIAA Member", "FAA Certification"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2018 },
      { name: "AIAA Member", org: "AIAA", year: 2020 },
      { name: "FAA Aircraft Mechanic", org: "FAA", year: 2021 }
    ],
    majorProjects: [
      { name: "Commercial Aircraft Design", description: "Contributed to next-generation aircraft design", year: 2023 },
      { name: "Drone Technology", description: "Developed advanced drone systems", year: 2022 },
      { name: "Aerospace Materials", description: "Research in composite materials for aerospace", year: 2021 }
    ],
    education: ["MS Aerospace Engineering - KFUPM", "BS Mechanical Engineering - KSU"],
    bio: "Innovative Aerospace Engineer with expertise in aircraft design and advanced materials. Passionate about advancing aerospace technology in Saudi Arabia.",
    email: "khalid.almutairi@example.com",
    linkedin: "https://linkedin.com/in/khalid-almutairi"
  },
  {
    id: "8",
    rank: 8,
    rankingChange: 0,
    rankingHistory: [
      { month: "Aug 2024", rank: 8 },
      { month: "Sep 2024", rank: 8 },
      { month: "Oct 2024", rank: 8 },
      { month: "Nov 2024", rank: 8 },
      { month: "Dec 2024", rank: 8 },
      { month: "Jan 2025", rank: 8 }
    ],
    name: "ليلى العتيبي / Layla Al-Otaibi",
    gender: "woman",
    expertise: "Environmental Engineering",
    location: "Dammam, Saudi Arabia",
    rating: 0.84,
    projects: 27,
    experience: "6 years",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    skills: ["Water Treatment", "Air Quality", "Waste Management", "Environmental Impact Assessment", "Sustainability", "Climate Change"],
    certifications: ["PE License", "LEED AP", "Environmental Professional"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2020 },
      { name: "LEED Accredited Professional", org: "USGBC", year: 2021 },
      { name: "Environmental Professional", org: "NEBOSH", year: 2022 }
    ],
    majorProjects: [
      { name: "Water Treatment Plant", description: "Designed advanced water treatment facility", year: 2023 },
      { name: "Air Quality Monitoring", description: "Implemented city-wide air quality system", year: 2022 },
      { name: "Waste Management System", description: "Developed sustainable waste management", year: 2021 }
    ],
    education: ["MS Environmental Engineering - KFUPM", "BS Chemical Engineering - KSU"],
    bio: "Environmental Engineer dedicated to sustainable development and environmental protection. Specializing in water treatment and air quality management.",
    email: "layla.alotaibi@example.com",
    linkedin: "https://linkedin.com/in/layla-alotaibi"
  },
  {
    id: "9",
    rank: 9,
    rankingChange: 1,
    rankingHistory: [
      { month: "Aug 2024", rank: 10 },
      { month: "Sep 2024", rank: 9 },
      { month: "Oct 2024", rank: 9 },
      { month: "Nov 2024", rank: 9 },
      { month: "Dec 2024", rank: 9 },
      { month: "Jan 2025", rank: 9 }
    ],
    name: "يوسف الصباح / Yousef Al-Sabah",
    gender: "man",
    expertise: "Biomedical Engineering",
    location: "Riyadh, Saudi Arabia",
    rating: 0.82,
    projects: 25,
    experience: "8 years",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    skills: ["Medical Devices", "Biomechanics", "Biomaterials", "Medical Imaging", "Rehabilitation Engineering", "Healthcare Technology"],
    certifications: ["PE License", "BME Professional", "Medical Device Certification"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2019 },
      { name: "Biomedical Engineer", org: "BMES", year: 2021 },
      { name: "Medical Device Professional", org: "FDA", year: 2022 }
    ],
    majorProjects: [
      { name: "Prosthetic Limb Design", description: "Developed advanced prosthetic technology", year: 2023 },
      { name: "Medical Imaging System", description: "Designed improved imaging equipment", year: 2022 },
      { name: "Rehabilitation Device", description: "Created innovative rehabilitation tools", year: 2021 }
    ],
    education: ["MS Biomedical Engineering - KFUPM", "BS Electrical Engineering - KSU"],
    bio: "Biomedical Engineer focused on improving healthcare through innovative medical devices and rehabilitation technology. Committed to enhancing quality of life for patients.",
    email: "yousef.alsabah@example.com",
    linkedin: "https://linkedin.com/in/yousef-alsabah"
  },
  {
    id: "10",
    rank: 10,
    rankingChange: -2,
    rankingHistory: [
      { month: "Aug 2024", rank: 8 },
      { month: "Sep 2024", rank: 8 },
      { month: "Oct 2024", rank: 9 },
      { month: "Nov 2024", rank: 9 },
      { month: "Dec 2024", rank: 10 },
      { month: "Jan 2025", rank: 10 }
    ],
    name: "عائشة الراشد / Aisha Al-Rashid",
    gender: "woman",
    expertise: "Geotechnical Engineering",
    location: "Jeddah, Saudi Arabia",
    rating: 0.80,
    projects: 23,
    experience: "7 years",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    skills: ["Soil Mechanics", "Foundation Design", "Slope Stability", "Earthquake Engineering", "Geotechnical Investigation", "Ground Improvement"],
    certifications: ["PE License", "Geotechnical Engineer", "Earthquake Engineering"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2019 },
      { name: "Geotechnical Engineer", org: "ASCE", year: 2021 },
      { name: "Earthquake Engineering", org: "EERI", year: 2022 }
    ],
    majorProjects: [
      { name: "Foundation Design", description: "Designed foundations for high-rise buildings", year: 2023 },
      { name: "Slope Stabilization", description: "Stabilized unstable slopes in mountainous areas", year: 2022 },
      { name: "Earthquake Assessment", description: "Conducted seismic risk assessment", year: 2021 }
    ],
    education: ["MS Geotechnical Engineering - KFUPM", "BS Civil Engineering - KAU"],
    bio: "Geotechnical Engineer specializing in foundation design and earthquake engineering. Expert in soil mechanics and slope stability analysis for complex construction projects.",
    email: "aisha.alrashid@example.com",
    linkedin: "https://linkedin.com/in/aisha-alrashid"
  }
];

// Add 10 more engineers to complete 20 total
export const finalEngineers: Engineer[] = [
  {
    id: "11",
    rank: 11,
    rankingChange: 1,
    rankingHistory: [
      { month: "Aug 2024", rank: 12 },
      { month: "Sep 2024", rank: 11 },
      { month: "Oct 2024", rank: 11 },
      { month: "Nov 2024", rank: 11 },
      { month: "Dec 2024", rank: 11 },
      { month: "Jan 2025", rank: 11 }
    ],
    name: "عبدالله القحطاني / Abdullah Al-Qahtani",
    gender: "man",
    expertise: "Industrial Engineering",
    location: "Riyadh, Saudi Arabia",
    rating: 0.78,
    projects: 21,
    experience: "6 years",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    skills: ["Operations Research", "Supply Chain", "Quality Management", "Lean Manufacturing", "Process Improvement", "Data Analysis"],
    certifications: ["PE License", "Six Sigma Green Belt", "APICS Certified"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2020 },
      { name: "Six Sigma Green Belt", org: "ASQ", year: 2021 },
      { name: "APICS Certified", org: "APICS", year: 2022 }
    ],
    majorProjects: [
      { name: "Supply Chain Optimization", description: "Optimized supply chain for major retailer", year: 2023 },
      { name: "Process Improvement", description: "Implemented lean manufacturing principles", year: 2022 },
      { name: "Quality Management", description: "Developed quality control systems", year: 2021 }
    ],
    education: ["MS Industrial Engineering - KFUPM", "BS Industrial Engineering - KSU"],
    bio: "Industrial Engineer focused on process optimization and supply chain management. Expert in lean manufacturing and quality improvement methodologies.",
    email: "abdullah.alqahtani@example.com",
    linkedin: "https://linkedin.com/in/abdullah-alqahtani"
  },
  {
    id: "12",
    rank: 12,
    rankingChange: 0,
    rankingHistory: [
      { month: "Aug 2024", rank: 12 },
      { month: "Sep 2024", rank: 12 },
      { month: "Oct 2024", rank: 12 },
      { month: "Nov 2024", rank: 12 },
      { month: "Dec 2024", rank: 12 },
      { month: "Jan 2025", rank: 12 }
    ],
    name: "مريم الشمري / Mariam Al-Shammari",
    gender: "woman",
    expertise: "Materials Engineering",
    location: "Dammam, Saudi Arabia",
    rating: 0.76,
    projects: 19,
    experience: "5 years",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    skills: ["Materials Science", "Metallurgy", "Composite Materials", "Materials Testing", "Corrosion Engineering", "Nanotechnology"],
    certifications: ["PE License", "Materials Engineer", "NACE Certification"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2021 },
      { name: "Materials Engineer", org: "ASM International", year: 2022 },
      { name: "NACE Corrosion Engineer", org: "NACE", year: 2023 }
    ],
    majorProjects: [
      { name: "Advanced Materials Research", description: "Developed new composite materials", year: 2023 },
      { name: "Corrosion Prevention", description: "Implemented corrosion control systems", year: 2022 },
      { name: "Materials Testing Lab", description: "Established materials testing facility", year: 2021 }
    ],
    education: ["MS Materials Engineering - KFUPM", "BS Materials Engineering - KSU"],
    bio: "Materials Engineer specializing in advanced materials and corrosion engineering. Passionate about developing innovative materials for industrial applications.",
    email: "mariam.alshammari@example.com",
    linkedin: "https://linkedin.com/in/mariam-alshammari"
  },
  {
    id: "13",
    rank: 13,
    rankingChange: -1,
    rankingHistory: [
      { month: "Aug 2024", rank: 12 },
      { month: "Sep 2024", rank: 12 },
      { month: "Oct 2024", rank: 13 },
      { month: "Nov 2024", rank: 13 },
      { month: "Dec 2024", rank: 13 },
      { month: "Jan 2025", rank: 13 }
    ],
    name: "سعد العتيبي / Saad Al-Otaibi",
    gender: "man",
    expertise: "Transportation Engineering",
    location: "Riyadh, Saudi Arabia",
    rating: 0.74,
    projects: 17,
    experience: "6 years",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    skills: ["Traffic Engineering", "Highway Design", "Transportation Planning", "Public Transit", "Traffic Safety", "Urban Planning"],
    certifications: ["PE License", "PTOE", "Transportation Professional"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2020 },
      { name: "Professional Traffic Operations Engineer", org: "ITE", year: 2021 },
      { name: "Transportation Professional", org: "ITE", year: 2022 }
    ],
    majorProjects: [
      { name: "Highway Expansion", description: "Designed major highway expansion project", year: 2023 },
      { name: "Traffic Management System", description: "Implemented smart traffic management", year: 2022 },
      { name: "Public Transit Planning", description: "Planned new public transit routes", year: 2021 }
    ],
    education: ["MS Transportation Engineering - KFUPM", "BS Civil Engineering - KSU"],
    bio: "Transportation Engineer focused on improving mobility and traffic flow. Expert in highway design and public transportation planning.",
    email: "saad.alotaibi@example.com",
    linkedin: "https://linkedin.com/in/saad-alotaibi"
  },
  {
    id: "14",
    rank: 14,
    rankingChange: 2,
    rankingHistory: [
      { month: "Aug 2024", rank: 16 },
      { month: "Sep 2024", rank: 15 },
      { month: "Oct 2024", rank: 15 },
      { month: "Nov 2024", rank: 14 },
      { month: "Dec 2024", rank: 14 },
      { month: "Jan 2025", rank: 14 }
    ],
    name: "هند المطيري / Hind Al-Mutairi",
    gender: "woman",
    expertise: "Water Resources Engineering",
    location: "Jeddah, Saudi Arabia",
    rating: 0.72,
    projects: 15,
    experience: "5 years",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    skills: ["Hydrology", "Hydraulics", "Water Treatment", "Irrigation Systems", "Water Conservation", "Flood Management"],
    certifications: ["PE License", "Water Resources Engineer", "Irrigation Specialist"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2021 },
      { name: "Water Resources Engineer", org: "ASCE", year: 2022 },
      { name: "Irrigation Specialist", org: "IA", year: 2023 }
    ],
    majorProjects: [
      { name: "Water Treatment Plant", description: "Designed advanced water treatment facility", year: 2023 },
      { name: "Irrigation System", description: "Developed smart irrigation system", year: 2022 },
      { name: "Flood Management", description: "Implemented flood control measures", year: 2021 }
    ],
    education: ["MS Water Resources Engineering - KFUPM", "BS Civil Engineering - KAU"],
    bio: "Water Resources Engineer dedicated to sustainable water management. Specializing in water treatment and conservation technologies.",
    email: "hind.almutairi@example.com",
    linkedin: "https://linkedin.com/in/hind-almutairi"
  },
  {
    id: "15",
    rank: 15,
    rankingChange: -1,
    rankingHistory: [
      { month: "Aug 2024", rank: 14 },
      { month: "Sep 2024", rank: 14 },
      { month: "Oct 2024", rank: 15 },
      { month: "Nov 2024", rank: 15 },
      { month: "Dec 2024", rank: 15 },
      { month: "Jan 2025", rank: 15 }
    ],
    name: "فهد الدوسري / Fahad Al-Dosari",
    gender: "man",
    expertise: "Nuclear Engineering",
    location: "Riyadh, Saudi Arabia",
    rating: 0.70,
    projects: 13,
    experience: "4 years",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    skills: ["Nuclear Physics", "Radiation Safety", "Nuclear Reactors", "Nuclear Waste Management", "Nuclear Security", "Nuclear Medicine"],
    certifications: ["PE License", "Nuclear Engineer", "Radiation Safety Officer"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2022 },
      { name: "Nuclear Engineer", org: "ANS", year: 2023 },
      { name: "Radiation Safety Officer", org: "NRC", year: 2023 }
    ],
    majorProjects: [
      { name: "Nuclear Research Reactor", description: "Contributed to research reactor design", year: 2023 },
      { name: "Radiation Safety Program", description: "Developed comprehensive safety protocols", year: 2022 },
      { name: "Nuclear Medicine Equipment", description: "Designed medical imaging equipment", year: 2021 }
    ],
    education: ["MS Nuclear Engineering - KFUPM", "BS Physics - KSU"],
    bio: "Nuclear Engineer specializing in radiation safety and nuclear technology applications. Committed to safe and responsible nuclear technology development.",
    email: "fahad.aldosari@example.com",
    linkedin: "https://linkedin.com/in/fahad-aldosari"
  }
];

// Add final 5 engineers
export const lastEngineers: Engineer[] = [
  {
    id: "16",
    rank: 16,
    rankingChange: 0,
    rankingHistory: [
      { month: "Aug 2024", rank: 16 },
      { month: "Sep 2024", rank: 16 },
      { month: "Oct 2024", rank: 16 },
      { month: "Nov 2024", rank: 16 },
      { month: "Dec 2024", rank: 16 },
      { month: "Jan 2025", rank: 16 }
    ],
    name: "ريم العتيبي / Reem Al-Otaibi",
    gender: "woman",
    expertise: "Construction Engineering",
    location: "Dammam, Saudi Arabia",
    rating: 0.68,
    projects: 11,
    experience: "4 years",
    profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    skills: ["Construction Management", "Project Planning", "Cost Estimation", "Quality Control", "Safety Management", "Building Information Modeling"],
    certifications: ["PE License", "PMP", "Construction Manager"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2022 },
      { name: "Project Management Professional", org: "PMI", year: 2023 },
      { name: "Construction Manager", org: "CMAA", year: 2023 }
    ],
    majorProjects: [
      { name: "High-Rise Construction", description: "Managed construction of 50-story building", year: 2023 },
      { name: "Infrastructure Project", description: "Led major infrastructure development", year: 2022 },
      { name: "Quality Management", description: "Implemented quality control systems", year: 2021 }
    ],
    education: ["MS Construction Engineering - KFUPM", "BS Civil Engineering - KSU"],
    bio: "Construction Engineer focused on project management and quality control. Expert in large-scale construction projects and building information modeling.",
    email: "reem.alotaibi@example.com",
    linkedin: "https://linkedin.com/in/reem-alotaibi"
  },
  {
    id: "17",
    rank: 17,
    rankingChange: 1,
    rankingHistory: [
      { month: "Aug 2024", rank: 18 },
      { month: "Sep 2024", rank: 17 },
      { month: "Oct 2024", rank: 17 },
      { month: "Nov 2024", rank: 17 },
      { month: "Dec 2024", rank: 17 },
      { month: "Jan 2025", rank: 17 }
    ],
    name: "بندر القحطاني / Bandar Al-Qahtani",
    gender: "man",
    expertise: "Telecommunications Engineering",
    location: "Riyadh, Saudi Arabia",
    rating: 0.66,
    projects: 9,
    experience: "3 years",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    skills: ["Wireless Communications", "Network Design", "5G Technology", "Fiber Optics", "Satellite Communications", "Network Security"],
    certifications: ["PE License", "Cisco Certified", "Telecommunications Engineer"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2023 },
      { name: "Cisco Certified Network Professional", org: "Cisco", year: 2023 },
      { name: "Telecommunications Engineer", org: "IEEE", year: 2024 }
    ],
    majorProjects: [
      { name: "5G Network Deployment", description: "Led 5G network implementation", year: 2023 },
      { name: "Fiber Optic Network", description: "Designed city-wide fiber network", year: 2022 },
      { name: "Satellite Communications", description: "Developed satellite communication system", year: 2021 }
    ],
    education: ["MS Telecommunications Engineering - KFUPM", "BS Electrical Engineering - KSU"],
    bio: "Telecommunications Engineer specializing in wireless communications and network design. Expert in 5G technology and fiber optic systems.",
    email: "bandar.alqahtani@example.com",
    linkedin: "https://linkedin.com/in/bandar-alqahtani"
  },
  {
    id: "18",
    rank: 18,
    rankingChange: -1,
    rankingHistory: [
      { month: "Aug 2024", rank: 17 },
      { month: "Sep 2024", rank: 17 },
      { month: "Oct 2024", rank: 18 },
      { month: "Nov 2024", rank: 18 },
      { month: "Dec 2024", rank: 18 },
      { month: "Jan 2025", rank: 18 }
    ],
    name: "نورا الشمري / Noura Al-Shammari",
    gender: "woman",
    expertise: "Food Engineering",
    location: "Jeddah, Saudi Arabia",
    rating: 0.64,
    projects: 7,
    experience: "3 years",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    skills: ["Food Processing", "Food Safety", "Food Preservation", "Quality Control", "Food Packaging", "Nutritional Engineering"],
    certifications: ["PE License", "Food Safety Professional", "HACCP Certified"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2023 },
      { name: "Food Safety Professional", org: "IFST", year: 2023 },
      { name: "HACCP Certified", org: "HACCP", year: 2024 }
    ],
    majorProjects: [
      { name: "Food Processing Plant", description: "Designed food processing facility", year: 2023 },
      { name: "Food Safety System", description: "Implemented HACCP system", year: 2022 },
      { name: "Food Packaging Innovation", description: "Developed sustainable packaging", year: 2021 }
    ],
    education: ["MS Food Engineering - KFUPM", "BS Chemical Engineering - KSU"],
    bio: "Food Engineer specializing in food processing and safety. Committed to improving food quality and safety through innovative engineering solutions.",
    email: "noura.alshammari@example.com",
    linkedin: "https://linkedin.com/in/noura-alshammari"
  },
  {
    id: "19",
    rank: 19,
    rankingChange: 0,
    rankingHistory: [
      { month: "Aug 2024", rank: 19 },
      { month: "Sep 2024", rank: 19 },
      { month: "Oct 2024", rank: 19 },
      { month: "Nov 2024", rank: 19 },
      { month: "Dec 2024", rank: 19 },
      { month: "Jan 2025", rank: 19 }
    ],
    name: "عبدالرحمن المطيري / Abdulrahman Al-Mutairi",
    gender: "man",
    expertise: "Mining Engineering",
    location: "Riyadh, Saudi Arabia",
    rating: 0.62,
    projects: 5,
    experience: "2 years",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    skills: ["Mining Operations", "Mineral Processing", "Mine Safety", "Environmental Management", "Geological Survey", "Mine Planning"],
    certifications: ["PE License", "Mining Engineer", "Mine Safety Professional"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2024 },
      { name: "Mining Engineer", org: "SME", year: 2024 },
      { name: "Mine Safety Professional", org: "MSHA", year: 2024 }
    ],
    majorProjects: [
      { name: "Mining Operations", description: "Managed mining operations", year: 2023 },
      { name: "Mineral Processing", description: "Optimized mineral processing", year: 2022 },
      { name: "Mine Safety Program", description: "Developed safety protocols", year: 2021 }
    ],
    education: ["MS Mining Engineering - KFUPM", "BS Geological Engineering - KSU"],
    bio: "Mining Engineer focused on safe and efficient mining operations. Specializing in mineral processing and environmental management in mining.",
    email: "abdulrahman.almutairi@example.com",
    linkedin: "https://linkedin.com/in/abdulrahman-almutairi"
  },
  {
    id: "20",
    rank: 20,
    rankingChange: 1,
    rankingHistory: [
      { month: "Aug 2024", rank: 21 },
      { month: "Sep 2024", rank: 20 },
      { month: "Oct 2024", rank: 20 },
      { month: "Nov 2024", rank: 20 },
      { month: "Dec 2024", rank: 20 },
      { month: "Jan 2025", rank: 20 }
    ],
    name: "منى العتيبي / Mona Al-Otaibi",
    gender: "woman",
    expertise: "Agricultural Engineering",
    location: "Dammam, Saudi Arabia",
    rating: 0.60,
    projects: 3,
    experience: "2 years",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    skills: ["Irrigation Systems", "Agricultural Machinery", "Crop Production", "Soil Management", "Precision Agriculture", "Greenhouse Technology"],
    certifications: ["PE License", "Agricultural Engineer", "Precision Agriculture Specialist"],
    certificationsDetailed: [
      { name: "Professional Engineer", org: "Saudi Council of Engineers", year: 2024 },
      { name: "Agricultural Engineer", org: "ASABE", year: 2024 },
      { name: "Precision Agriculture Specialist", org: "PA", year: 2024 }
    ],
    majorProjects: [
      { name: "Smart Irrigation System", description: "Developed automated irrigation", year: 2023 },
      { name: "Greenhouse Design", description: "Designed modern greenhouse", year: 2022 },
      { name: "Precision Agriculture", description: "Implemented precision farming", year: 2021 }
    ],
    education: ["MS Agricultural Engineering - KFUPM", "BS Agricultural Engineering - KSU"],
    bio: "Agricultural Engineer dedicated to sustainable farming practices. Specializing in precision agriculture and smart irrigation systems.",
    email: "mona.alotaibi@example.com",
    linkedin: "https://linkedin.com/in/mona-alotaibi"
  }
];

// Export all 20 engineers
export const allEngineers = [
  {
    id: "4",
    rank: 4,
    rankingChange: 2,
    rankingHistory: [
      { month: "Jul", rank: 7 },
      { month: "Aug", rank: 7 },
      { month: "Sep", rank: 6 },
      { month: "Oct", rank: 6 },
      { month: "Nov", rank: 5 },
      { month: "Dec", rank: 4 }
    ],
    name: "سارة الزهراني - Sara Al-Zahrani",
    gender: "woman",
    expertise: "Electrical Engineering",
    badgeColor: "yellow",
    skills: ["Power Systems", "Renewable Energy", "Smart Grid Technology", "High Voltage Engineering", "Energy Storage", "Grid Integration"],
    certifications: ["PhD Electrical Engineering", "PE License", "IEEE Senior Member", "Certified Energy Manager"],
    bio: "Sara Al-Zahrani is a leading expert in renewable energy and smart grid technologies. She has been at the forefront of Saudi Arabia's renewable energy transition, designing and implementing several large-scale solar and wind projects. Her research in energy storage solutions has contributed significantly to grid stability and efficiency.",
    experience: "20",
    location: "Riyadh, Riyadh Province",
    projects: 94,
    rating: 9.5,
    profileImage: "https://images.unsplash.com/photo-1698499352020-521e54040e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "PhD in Electrical Engineering - UC Berkeley (2006)",
      "MSc in Electrical Engineering - KAUST (2003)",
      "BSc in Electrical Engineering - King Saud University (2000)"
    ],
    awards: [
      "IEEE Power & Energy Society Award (2023)",
      "Saudi Renewable Energy Pioneer Award (2021)",
      "Women in Energy Leadership Award (2019)",
      "Clean Energy Innovation Award (2017)"
    ],
    careerHighlights: [
      "Led engineering design for 2.6 GW solar power plant in Al-Faisaliah",
      "Developed smart grid integration protocols adopted nationally",
      "Published 40+ research papers on renewable energy systems",
      "Advised Ministry of Energy on Vision 2030 renewable targets"
    ],
    email: "sara.alzahrani@example.sa",
    linkedin: "linkedin.com/in/sara-alzahrani",
    majorProjects: [
      {
        name: "Al-Faisaliah Solar Power Plant",
        description: "Lead electrical engineer for one of the world's largest solar installations, delivering 2.6 GW capacity.",
        year: "2021-2023"
      },
      {
        name: "National Smart Grid Initiative",
        description: "Designed and implemented smart grid infrastructure for major Saudi cities, improving efficiency by 30%.",
        year: "2018-2021"
      },
      {
        name: "Energy Storage Research Program",
        description: "Led research into battery storage solutions for grid stabilization and renewable integration.",
        year: "2015-2018"
      }
    ],
    certificationsDetailed: [
      { name: "PhD in Electrical Engineering", organization: "UC Berkeley", year: "2006" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "2004" },
      { name: "IEEE Senior Member", organization: "IEEE", year: "2015" },
      { name: "Certified Energy Manager", organization: "AEE", year: "2010" }
    ]
  }
];
