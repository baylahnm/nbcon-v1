# 🔐 nbcon Authentication System

## Overview

A comprehensive, enterprise-grade authentication system built for the nbcon Saudi engineering marketplace. Features bilingual support (Arabic/English), SCE integration, role-based access control, and cultural considerations for Saudi professional standards.

## 🎯 Key Features

### 🔑 Core Authentication Components
- **AuthContent.tsx**: Main authentication interface with login/signup tabs
- **VerifyOTPContent.tsx**: Advanced 6-digit OTP verification system
- **RoleSelection.tsx**: Professional role selection (Engineer/Client/Enterprise)
- **ProfileSetup.tsx**: Comprehensive profile completion wizard
- **AuthenticationSystem.tsx**: Main orchestrator component
- **ProtectedRoute.tsx**: Route protection and access control

### 🌐 Bilingual Support
- Complete Arabic/English interface with proper RTL layout
- Language persistence across authentication flow
- Cultural considerations for Saudi professional norms
- Islamic principles integration

### 🇸🇦 Saudi Engineering Integration
- SCE (Saudi Council of Engineers) verification
- Saudi phone number validation (+966 format)
- Complete Saudi cities dropdown
- Professional engineering terminology
- Vision 2030 project context

### 🛡️ Security Features
- Enterprise-grade security with trust indicators
- Contact masking for privacy (phone/email)
- 5-minute OTP expiration with countdown timer
- Form validation with real-time feedback
- Secure localStorage integration

## 📁 File Structure

```
src/components/auth/
├── AuthContent.tsx              # Main auth interface
├── VerifyOTPContent.tsx         # OTP verification
├── RoleSelection.tsx            # Role selection
├── ProfileSetup.tsx             # Profile completion
├── AuthenticationSystem.tsx     # Main orchestrator
├── ProtectedRoute.tsx           # Route protection
└── README.md                    # This documentation

src/pages/auth/
├── EmailAuth.tsx               # Email authentication page
├── PhoneAuth.tsx               # Phone authentication page
├── VerifyOTP.tsx               # OTP verification page
├── RoleSelection.tsx           # Role selection page
└── ProfileSetup.tsx            # Profile setup page

src/stores/
└── auth.ts                     # Authentication state management

src/hooks/
└── useAuth.ts                  # Authentication hook
```

## 🚀 Usage

### Basic Authentication Flow

```tsx
import { AuthenticationSystem } from '@/components/auth/AuthenticationSystem';

function AuthPage() {
  const handleAuthComplete = (user) => {
    // Redirect to appropriate dashboard
    navigate(`/${user.role}`);
  };

  return (
    <AuthenticationSystem
      onAuthenticationComplete={handleAuthComplete}
      onBackToHome={() => navigate('/home')}
    />
  );
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/engineer" element={
        <ProtectedRoute requiredRole="engineer">
          <EngineerDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### Using Authentication Hook

```tsx
import { useAuth } from '@/hooks/useAuth';

function Dashboard() {
  const { user, isAuthenticated, logout, isEngineer } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      {isEngineer && <EngineerFeatures />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔄 Authentication Flow

### New User Registration
1. **Signup Form** → User fills comprehensive registration form
2. **OTP Verification** → 6-digit code sent via SMS/Email
3. **Role Selection** → Choose Engineer/Client/Enterprise role
4. **Profile Setup** → Complete professional profile
5. **Dashboard Redirect** → Redirected to role-specific dashboard

### Existing User Login
1. **Login Form** → Email/password authentication
2. **Dashboard Redirect** → Direct access to dashboard

### OTP Verification Process
- 6-digit code input with auto-focus and paste support
- 5-minute expiration with visual countdown
- Resend functionality after expiration
- Contact masking for security
- Auto-submit when all digits entered

## 🎨 Design System Integration

### Theme Colors
All components use the design system theme colors:
- `bg-primary`, `text-primary` for primary actions
- `bg-muted`, `text-muted-foreground` for secondary elements
- `bg-destructive`, `text-destructive` for errors
- Dark mode support with `dark:` variants

### Components Used
- **ShadCN/UI**: Button, Input, Card, Tabs, Select, Checkbox, Badge, Avatar
- **Lucide React**: Comprehensive icon set for all UI elements
- **Tailwind CSS**: Responsive design with mobile optimization

## 🔧 Technical Implementation

### State Management
- **Zustand**: Lightweight state management for authentication
- **Persist**: Automatic localStorage persistence
- **TypeScript**: Full type safety with comprehensive interfaces

### Form Validation
```tsx
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateSaudiPhone = (phone: string) => {
  const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
  return phoneRegex.test(phone);
};

const validateSCENumber = (sceNumber: string) => {
  const sceRegex = /^SCE-\d{5,6}$/;
  return sceRegex.test(sceNumber);
};
```

### API Integration
```tsx
// Mock API calls (replace with real API endpoints)
const handleLogin = async (loginData) => {
  setIsLoading(true);
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API
    const user = await authenticateUser(loginData);
    onAuthSuccess(user);
  } catch (error) {
    setErrors({ submit: 'Login failed. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};
```

## 🌍 Cultural Considerations

### Saudi Professional Standards
- Respectful language and professional etiquette
- Gender-appropriate networking guidelines
- Islamic principles integration
- Professional boundaries and cultural sensitivity

### Arabic Language Support
- Complete RTL (Right-to-Left) layout support
- Proper Arabic typography and spacing
- Cultural context in messaging and terminology
- Professional Arabic engineering terminology

## 🧪 Testing

### Development OTP Codes
For testing purposes, use these OTP codes:
- `123456` - Valid verification code
- `000000` - Valid verification code
- Any other 6-digit code - Shows error

### Test User Data
```tsx
const mockUser = {
  id: 'user_123',
  email: 'ahmed.alrashid@neom.com',
  name: 'Ahmed Al-Rashid',
  role: 'engineer',
  isVerified: true,
  sceNumber: 'SCE-67892',
  company: 'NEOM Development Authority',
  location: 'Riyadh, Saudi Arabia',
  phone: '+966501234567',
  language: 'en'
};
```

## 🔐 Security Best Practices

### Data Protection
- Contact information masking (phone/email)
- Secure localStorage with encryption
- Session timeout and automatic logout
- CSRF protection (implement in backend)

### Validation
- Client-side validation with server-side verification
- Input sanitization and XSS prevention
- Rate limiting for OTP requests
- Secure password requirements

## 🚀 Deployment

### Environment Variables
```env
REACT_APP_API_BASE_URL=https://api.nbcon.com
REACT_APP_OTP_SERVICE_URL=https://otp.nbcon.com
REACT_APP_SCE_VERIFICATION_URL=https://sce.nbcon.com
```

### Build Configuration
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "test:auth": "jest --testPathPattern=auth"
  }
}
```

## 📱 Mobile Optimization

### Touch-Friendly Interface
- Large input fields optimized for mobile
- Proper keyboard types (numeric for OTP)
- Gesture support and swipe interactions
- Responsive design for all screen sizes

### Performance
- Lazy loading of authentication components
- Optimized bundle size with code splitting
- Fast loading with skeleton screens
- Offline support with service workers

## 🔮 Future Enhancements

### Planned Features
- Biometric authentication (fingerprint/face)
- Social login integration (LinkedIn, Google)
- Multi-factor authentication options
- Advanced security analytics
- Enterprise SSO integration

### API Integration
- Real backend authentication endpoints
- SCE verification API integration
- SMS/Email OTP service integration
- User profile synchronization
- Role-based permission management

## 📞 Support

For technical support or questions about the authentication system:
- Email: tech@nbcon.com
- Documentation: https://docs.nbcon.com/auth
- GitHub Issues: https://github.com/nbcon/auth-system

---

**Built with ❤️ for the Saudi engineering community**
