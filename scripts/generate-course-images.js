// Script to generate mock course images
// This script creates placeholder images for courses using a placeholder service

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Course categories and their images
const courseCategories = {
  'Structural Engineering': [
    'Advanced Structural Analysis',
    'Steel Design Fundamentals',
    'Concrete Design Principles',
    'Seismic Analysis Methods',
    'Foundation Engineering',
    'Bridge Design'
  ],
  'Project Management': [
    'Project Management Fundamentals',
    'Agile Project Management',
    'Risk Management',
    'Cost Control',
    'Quality Management',
    'Stakeholder Management'
  ],
  'Renewable Energy Systems': [
    'Renewable Energy Systems',
    'Solar Power Engineering',
    'Wind Energy Technology',
    'Energy Storage Solutions',
    'Smart Grid Systems',
    'Sustainable Energy Planning'
  ],
  'Safety': [
    'Construction Safety Management',
    'HSE Best Practices',
    'Risk Assessment',
    'Safety Training',
    'Emergency Response',
    'Workplace Safety'
  ],
  'Software': [
    'AutoCAD Fundamentals',
    'BIM Revit',
    'MATLAB Programming',
    'Python for Engineers',
    'Data Analysis Tools',
    'Engineering Software'
  ],
  'Electrical Engineering': [
    'Power Systems Analysis',
    'Electrical Design',
    'Control Systems',
    'Power Electronics',
    'Electrical Safety',
    'Smart Grid Technology'
  ],
  'Mechanical Engineering': [
    'Thermodynamics',
    'Fluid Mechanics',
    'Machine Design',
    'HVAC Systems',
    'Manufacturing Processes',
    'Quality Control'
  ]
};

// Color schemes for different categories
const categoryColors = {
  'Structural Engineering': '#8B4513', // Brown
  'Project Management': '#4A90E2', // Blue
  'Renewable Energy Systems': '#7ED321', // Green
  'Safety': '#F5A623', // Orange
  'Software': '#9013FE', // Purple
  'Electrical Engineering': '#FF6B6B', // Red
  'Mechanical Engineering': '#50E3C2', // Teal
};

// Generate placeholder image URLs
function generateImageUrl(title, category) {
  const color = categoryColors[category] || '#4A90E2';
  const encodedTitle = encodeURIComponent(title);
  const encodedColor = color.replace('#', '');
  
  // Using placeholder.com service with custom styling
  return `https://via.placeholder.com/400x225/${encodedColor}/FFFFFF?text=${encodedTitle}`;
}

// Create directory structure and generate image references
function generateCourseImages() {
  const baseDir = path.join(__dirname, '../public/e-learning');
  
  // Ensure base directory exists
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  const courseData = [];
  
  Object.entries(courseCategories).forEach(([category, courses]) => {
    const categoryDir = path.join(baseDir, category);
    
    // Create category directory if it doesn't exist
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    courses.forEach(course => {
      const imageUrl = generateImageUrl(course, category);
      const imagePath = path.join(categoryDir, `${course}.jpg`);
      
      courseData.push({
        id: course.toLowerCase().replace(/\s+/g, '-'),
        title: course,
        category,
        imageUrl,
        localPath: `/e-learning/${category}/${course}.jpg`,
        color: categoryColors[category]
      });
      
      console.log(`Generated: ${course} - ${imageUrl}`);
    });
  });
  
  // Write course data to JSON file for reference
  const outputPath = path.join(__dirname, '../public/e-learning/courses.json');
  fs.writeFileSync(outputPath, JSON.stringify(courseData, null, 2));
  
  console.log(`\nGenerated ${courseData.length} course images`);
  console.log(`Course data saved to: ${outputPath}`);
  
  return courseData;
}

// Alternative: Generate images using a different service
function generateAlternativeImages() {
  const services = [
    {
      name: 'picsum.photos',
      url: (width, height, seed) => `https://picsum.photos/seed/${seed}/${width}/${height}`
    },
    {
      name: 'placeholder.com',
      url: (width, height, text) => `https://via.placeholder.com/${width}x${height}/4A90E2/FFFFFF?text=${encodeURIComponent(text)}`
    },
    {
      name: 'dummyimage.com',
      url: (width, height, color, text) => `https://dummyimage.com/${width}x${height}/${color}/FFFFFF&text=${encodeURIComponent(text)}`
    }
  ];
  
  return services;
}

// Main execution
console.log('Generating course images...\n');
generateCourseImages();

export {
  generateCourseImages,
  courseCategories,
  categoryColors
};
