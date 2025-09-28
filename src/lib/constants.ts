// Application constants and configuration

export const APP_NAME = 'nbcon';
export const APP_DESCRIPTION = 'Engineering Excellence Platform';

// Saudi Arabia cities for job location dropdowns
export const SAUDI_CITIES = [
  'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran',
  'Tabuk', 'Buraidah', 'Khamis Mushait', 'Abha', 'Najran', 'Jazan',
  'Yanbu', 'Al Jubail', 'Hail', 'Arar', 'Sakakah', 'Qatif', 'Taif'
];

// Engineering specializations
export const ENGINEERING_SPECIALIZATIONS = [
  'Civil Engineering', 'Structural Engineering', 'Mechanical Engineering',
  'Electrical Engineering', 'Environmental Engineering', 'Geotechnical Engineering',
  'Transportation Engineering', 'Water Resources Engineering', 'Construction Management',
  'Project Management', 'Building Services Engineering', 'Fire Safety Engineering'
];

// Job categories
export const JOB_CATEGORIES = [
  'Structural Engineering', 'Civil Engineering', 'Mechanical Engineering',
  'Electrical Engineering', 'Environmental Engineering', 'Geotechnical Engineering',
  'Transportation Engineering', 'Water Resources Engineering', 'Construction Management',
  'Building Inspection', 'Safety Assessment', 'Design Review'
];

// Job types
export const JOB_TYPES = [
  { value: 'fixed', label: 'Fixed Price Project' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'milestone', label: 'Milestone-Based' }
];

// Priority levels
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low Priority', color: 'text-muted-foreground' },
  { value: 'normal', label: 'Normal Priority', color: 'text-primary' },
  { value: 'high', label: 'High Priority', color: 'text-warning' },
  { value: 'emergency', label: 'Emergency', color: 'text-destructive' }
];

// Client types
export const CLIENT_TYPES = [
  { value: 'individual', label: 'Individual Property Owner' },
  { value: 'business', label: 'Small/Medium Business' },
  { value: 'enterprise', label: 'Large Corporation' },
];

// Budget ranges
export const BUDGET_RANGES = [
  'SAR 500 - 2,000', 'SAR 2,000 - 5,000', 'SAR 5,000 - 15,000',
  'SAR 15,000 - 50,000', 'SAR 50,000+'
];

// Job status options
export const JOB_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'disputed', label: 'Disputed' },
];

// Availability status options
export const AVAILABILITY_STATUSES = [
  { value: 'available', label: 'Available Now' },
  { value: 'busy', label: 'Busy' },
  { value: 'unavailable', label: 'Unavailable' }
];

// Default values
export const DEFAULTS = {
  CURRENCY: 'SAR',
  LANGUAGE: 'en',
  THEME: 'wazeer',
  SERVICE_RADIUS: 50,
  PAGE_SIZE: 20,
};

// Feature flags
export const FEATURES = {
  PHONE_AUTH: true,
  EMAIL_AUTH: true,
  MESSAGING: true,
  FILE_UPLOADS: false, // Coming soon
  PAYMENTS: false, // Coming soon
  NOTIFICATIONS: false, // Coming soon
};

// API endpoints and external services
export const EXTERNAL_SERVICES = {
  SCE_VERIFICATION: 'https://www.saudieng.org/', // Saudi Council of Engineers
  MAPS_API: 'https://maps.googleapis.com/maps/api/js',
};

// Validation rules
export const VALIDATION = {
  PHONE_REGEX: /^\+966[0-9]{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_BIO_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 2000,
  MIN_HOURLY_RATE: 50,
  MAX_HOURLY_RATE: 2000,
  MIN_BUDGET: 100,
  MAX_BUDGET: 1000000,
};

// UI constants
export const UI = {
  SIDEBAR_WIDTH: 240,
  SIDEBAR_COLLAPSED_WIDTH: 60,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
};