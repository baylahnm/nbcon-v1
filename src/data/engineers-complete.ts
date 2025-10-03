import { Engineer } from './engineers';

export const allEngineers: Engineer[] = [
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
    bio: "Sara Al-Zahrani is a leading expert in renewable energy and smart grid technologies. She has been at the forefront of Saudi Arabia's renewable energy transition, designing and implementing several large-scale solar and wind projects.",
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
      "Women in Energy Leadership Award (2019)"
    ],
    careerHighlights: [
      "Led engineering design for 2.6 GW solar power plant in Al-Faisaliah",
      "Developed smart grid integration protocols adopted nationally",
      "Published 40+ research papers on renewable energy systems"
    ],
    email: "sara.alzahrani@example.sa",
    linkedin: "linkedin.com/in/sara-alzahrani",
    majorProjects: [
      {
        name: "Al-Faisaliah Solar Power Plant",
        description: "Lead electrical engineer for one of the world's largest solar installations, delivering 2.6 GW capacity.",
        year: "2021-2023"
      }
    ],
    certificationsDetailed: [
      { name: "PhD in Electrical Engineering", organization: "UC Berkeley", year: "2006" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "2004" }
    ]
  },
  {
    id: "5",
    rank: 5,
    rankingChange: 0,
    rankingHistory: [
      { month: "Jul", rank: 5 },
      { month: "Aug", rank: 5 },
      { month: "Sep", rank: 4 },
      { month: "Oct", rank: 5 },
      { month: "Nov", rank: 5 },
      { month: "Dec", rank: 5 }
    ],
    name: "محمد الدوسري - Mohammed Al-Dosari",
    gender: "man",
    expertise: "Mechanical Engineering",
    badgeColor: "red",
    skills: ["HVAC Systems", "Thermal Engineering", "Manufacturing", "Robotics", "CAD/CAM", "Quality Control"],
    certifications: ["MSc Mechanical Engineering", "PE License", "Six Sigma Black Belt", "ASHRAE Certified"],
    bio: "Mohammed Al-Dosari is a distinguished mechanical engineer with extensive experience in industrial systems and manufacturing. He has revolutionized HVAC design for mega-projects in extreme desert conditions.",
    experience: "22",
    location: "Jubail, Eastern Province",
    projects: 112,
    rating: 9.4,
    profileImage: "https://images.unsplash.com/photo-1756412066323-a336d2becc10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "MSc in Mechanical Engineering - Georgia Tech (2004)",
      "BSc in Mechanical Engineering - KFUPM (2001)"
    ],
    awards: [
      "Saudi Manufacturing Excellence Award (2022)",
      "ASHRAE Technology Award (2020)",
      "Industrial Innovation Award (2018)"
    ],
    careerHighlights: [
      "Designed HVAC systems for 50+ mega projects including airports and stadiums",
      "Implemented robotics solutions increasing manufacturing efficiency by 60%",
      "Led quality management systems for Jubail Industrial City"
    ],
    email: "mohammed.aldosari@example.sa",
    linkedin: "linkedin.com/in/mohammed-aldosari",
    majorProjects: [
      {
        name: "King Khalid International Airport Expansion",
        description: "Designed comprehensive HVAC and mechanical systems for airport expansion handling 35M passengers annually.",
        year: "2020-2022"
      }
    ],
    certificationsDetailed: [
      { name: "MSc in Mechanical Engineering", organization: "Georgia Tech", year: "2004" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "2003" }
    ]
  },
  {
    id: "6",
    rank: 6,
    rankingChange: -2,
    rankingHistory: [
      { month: "Jul", rank: 4 },
      { month: "Aug", rank: 4 },
      { month: "Sep", rank: 3 },
      { month: "Oct", rank: 3 },
      { month: "Nov", rank: 4 },
      { month: "Dec", rank: 6 }
    ],
    name: "فيصل الشمري - Faisal Al-Shammari",
    gender: "man",
    expertise: "Chemical Engineering",
    badgeColor: "green",
    skills: ["Process Design", "Petrochemicals", "Catalysis", "Environmental Engineering", "Process Safety", "Optimization"],
    certifications: ["PhD Chemical Engineering", "PE License", "CSP", "Process Safety Expert"],
    bio: "Faisal Al-Shammari is an accomplished chemical engineer specializing in petrochemical processes and environmental sustainability. He has developed innovative catalytic processes that have reduced emissions while increasing efficiency.",
    experience: "19",
    location: "Yanbu, Al Madinah Province",
    projects: 78,
    rating: 9.6,
    profileImage: "https://images.unsplash.com/photo-1719561940606-ec38a36e5f18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "PhD in Chemical Engineering - Imperial College London (2007)",
      "MSc in Chemical Engineering - KAUST (2004)",
      "BSc in Chemical Engineering - King Fahd University (2001)"
    ],
    awards: [
      "AIChE Process Development Award (2023)",
      "Saudi Environmental Excellence Award (2021)",
      "Process Safety Innovation Award (2019)"
    ],
    careerHighlights: [
      "Developed catalytic process reducing CO2 emissions by 40% in petrochemical plants",
      "Led process safety initiatives across 30+ chemical facilities",
      "Published 35 research papers on sustainable chemical processes"
    ],
    email: "faisal.alshammari@example.sa",
    linkedin: "linkedin.com/in/faisal-alshammari",
    majorProjects: [
      {
        name: "Yanbu Petrochemical Complex Optimization",
        description: "Redesigned core processes for improved efficiency and reduced environmental impact across major facility.",
        year: "2021-2023"
      }
    ],
    certificationsDetailed: [
      { name: "PhD in Chemical Engineering", organization: "Imperial College London", year: "2007" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "2005" }
    ]
  },
  {
    id: "7",
    rank: 7,
    rankingChange: 1,
    rankingHistory: [
      { month: "Jul", rank: 9 },
      { month: "Aug", rank: 8 },
      { month: "Sep", rank: 8 },
      { month: "Oct", rank: 7 },
      { month: "Nov", rank: 8 },
      { month: "Dec", rank: 7 }
    ],
    name: "سلطان القحطاني - Sultan Al-Qahtani",
    gender: "man",
    expertise: "Civil Engineering",
    badgeColor: "blue",
    skills: ["Transportation Engineering", "Traffic Management", "Highway Design", "Urban Planning", "Pavement Engineering", "GIS"],
    certifications: ["MSc Transportation Engineering", "PE License", "PTOE", "Traffic Safety Professional"],
    bio: "Sultan Al-Qahtani is a leading transportation engineer who has shaped Saudi Arabia's modern highway and traffic systems. His innovative approaches to traffic management have reduced congestion in major cities by up to 35%.",
    experience: "17",
    location: "Dammam, Eastern Province",
    projects: 103,
    rating: 9.3,
    profileImage: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "MSc in Transportation Engineering - UC Davis (2009)",
      "BSc in Civil Engineering - King Saud University (2006)"
    ],
    awards: [
      "Transportation Innovation Award (2022)",
      "Saudi Urban Development Award (2020)",
      "Traffic Safety Excellence Award (2018)"
    ],
    careerHighlights: [
      "Designed intelligent traffic systems for Riyadh reducing congestion by 35%",
      "Led highway network expansion connecting major Saudi cities",
      "Implemented smart parking solutions in 5 major cities"
    ],
    email: "sultan.alqahtani@example.sa",
    linkedin: "linkedin.com/in/sultan-alqahtani",
    majorProjects: [
      {
        name: "Riyadh Intelligent Transportation System",
        description: "Designed and implemented smart traffic management system covering 850km of urban roads.",
        year: "2020-2022"
      }
    ],
    certificationsDetailed: [
      { name: "MSc in Transportation Engineering", organization: "UC Davis", year: "2009" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "2008" }
    ]
  },
  {
    id: "8",
    rank: 8,
    rankingChange: -3,
    rankingHistory: [
      { month: "Jul", rank: 6 },
      { month: "Aug", rank: 3 },
      { month: "Sep", rank: 7 },
      { month: "Oct", rank: 8 },
      { month: "Nov", rank: 5 },
      { month: "Dec", rank: 8 }
    ],
    name: "ناصر الحربي - Nasser Al-Harbi",
    gender: "man",
    expertise: "Petroleum Engineering",
    badgeColor: "amber",
    skills: ["Reservoir Engineering", "Well Testing", "Production Engineering", "Hydraulic Fracturing", "Well Completion", "Field Development"],
    certifications: ["MSc Petroleum Engineering", "PE License", "SPE Member", "Well Control Certified"],
    bio: "Nasser Al-Harbi is a seasoned petroleum engineer with deep expertise in reservoir characterization and production optimization. He has managed field development projects that have added billions of barrels to Saudi Arabia's proven reserves.",
    experience: "21",
    location: "Abqaiq, Eastern Province",
    projects: 134,
    rating: 9.5,
    profileImage: "https://images.unsplash.com/photo-1584940121258-c2553b66a739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "MSc in Petroleum Engineering - Texas A&M University (2005)",
      "BSc in Petroleum Engineering - KFUPM (2002)"
    ],
    awards: [
      "SPE Production Excellence Award (2022)",
      "Saudi Energy Sector Achievement Award (2019)",
      "Field Development Innovation Award (2016)"
    ],
    careerHighlights: [
      "Managed field development adding 5B barrels to proven reserves",
      "Optimized well completion procedures reducing costs by 30%",
      "Led reservoir characterization for 25+ major fields"
    ],
    email: "nasser.alharbi@example.sa",
    linkedin: "linkedin.com/in/nasser-alharbi",
    majorProjects: [
      {
        name: "Khurais Field Expansion",
        description: "Managed reservoir engineering for field expansion project, adding 5B barrels to reserves.",
        year: "2019-2022"
      }
    ],
    certificationsDetailed: [
      { name: "MSc in Petroleum Engineering", organization: "Texas A&M University", year: "2005" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "2004" }
    ]
  },
  {
    id: "9",
    rank: 9,
    rankingChange: 4,
    rankingHistory: [
      { month: "Jul", rank: 15 },
      { month: "Aug", rank: 14 },
      { month: "Sep", rank: 12 },
      { month: "Oct", rank: 11 },
      { month: "Nov", rank: 13 },
      { month: "Dec", rank: 9 }
    ],
    name: "عمر المطيري - Omar Al-Mutairi",
    gender: "man",
    expertise: "Software Engineering",
    badgeColor: "purple",
    skills: ["Mobile Development", "UX/UI Design", "Agile Methodologies", "React Native", "iOS/Android", "Product Management"],
    certifications: ["BSc Computer Science", "AWS Developer", "Scrum Master", "Google UX Designer"],
    bio: "Omar Al-Mutairi is an innovative software engineer and product leader who has created some of Saudi Arabia's most popular mobile applications. His user-centric approach and technical excellence have resulted in apps with millions of downloads.",
    experience: "12",
    location: "Riyadh, Riyadh Province",
    projects: 67,
    rating: 9.4,
    profileImage: "https://images.unsplash.com/photo-1660074127797-1c429fbb8cd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "BSc in Computer Science - King Saud University (2011)",
      "UX Design Certification - Google (2018)"
    ],
    awards: [
      "Best Mobile App Award - Saudi Tech Summit (2023)",
      "Innovation in Technology Award (2022)",
      "App Excellence Award (2020)"
    ],
    careerHighlights: [
      "Created mobile app with 5M+ downloads for government services",
      "Led product development for Saudi Arabia's top fintech app",
      "Pioneered accessibility features for Arabic-language apps"
    ],
    email: "omar.almutairi@example.sa",
    linkedin: "linkedin.com/in/omar-almutairi",
    majorProjects: [
      {
        name: "National Services Mobile App",
        description: "Led development of unified government services app used by 5M+ Saudi citizens.",
        year: "2021-2023"
      }
    ],
    certificationsDetailed: [
      { name: "BSc in Computer Science", organization: "King Saud University", year: "2011" },
      { name: "AWS Certified Developer", organization: "Amazon Web Services", year: "2017" }
    ]
  },
  {
    id: "10",
    rank: 10,
    rankingChange: 0,
    rankingHistory: [
      { month: "Jul", rank: 10 },
      { month: "Aug", rank: 11 },
      { month: "Sep", rank: 10 },
      { month: "Oct", rank: 9 },
      { month: "Nov", rank: 10 },
      { month: "Dec", rank: 10 }
    ],
    name: "أحمد العمري - Ahmed Al-Omari",
    gender: "man",
    expertise: "Aerospace Engineering",
    badgeColor: "blue",
    skills: ["Aircraft Design", "Aerodynamics", "Flight Control Systems", "Propulsion", "Avionics", "Structural Analysis"],
    certifications: ["MSc Aerospace Engineering", "PE License", "AIAA Member", "Aircraft Maintenance License"],
    bio: "Ahmed Al-Omari is a pioneering aerospace engineer contributing to Saudi Arabia's emerging aviation and space industry. He has worked on advanced aircraft design projects and played a key role in developing the kingdom's aerospace capabilities.",
    experience: "16",
    location: "Riyadh, Riyadh Province",
    projects: 72,
    rating: 9.3,
    profileImage: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
    education: [
      "MSc in Aerospace Engineering - Purdue University (2010)",
      "BSc in Mechanical Engineering - King Saud University (2007)"
    ],
    awards: [
      "Saudi Aerospace Innovation Award (2022)",
      "AIAA Young Engineer Award (2018)",
      "National Defense Technology Award (2016)"
    ],
    careerHighlights: [
      "Led design team for advanced unmanned aerial systems project",
      "Developed flight control algorithms improving aircraft stability by 40%",
      "Contributed to Saudi Space Agency satellite programs"
    ],
    email: "ahmed.alomari@example.sa",
    linkedin: "linkedin.com/in/ahmed-alomari",
    majorProjects: [
      {
        name: "Advanced UAV Development Program",
        description: "Led engineering team for development of long-range unmanned aerial systems for surveillance and monitoring.",
        year: "2021-2023"
      }
    ],
    certificationsDetailed: [
      { name: "MSc in Aerospace Engineering", organization: "Purdue University", year: "2010" },
      { name: "Professional Engineer (PE) License", organization: "Saudi Council of Engineers", year: "2009" }
    ]
  }
];
