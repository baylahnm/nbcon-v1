# 🎯 Target Project Structure

## **Proposed Final Organization**

```
nbcon-v1/
├── src/
│   ├── features/                    # Feature-based modules (PRIMARY)
│   │   ├── auth/                   # Authentication system
│   │   │   ├── components/         # Auth-specific components
│   │   │   ├── guards/            # Route guards & protection
│   │   │   ├── hooks/             # Auth-related hooks
│   │   │   └── types/             # Auth types
│   │   │
│   │   ├── billing/               # Payment & subscription system
│   │   │   ├── components/        # Billing UI components
│   │   │   ├── hooks/            # Billing logic hooks
│   │   │   ├── services/         # Payment integrations
│   │   │   └── types/            # Billing types
│   │   │
│   │   ├── dashboard/             # Dashboard system
│   │   ├── finance/              # Financial management
│   │   ├── messaging/            # Communication system
│   │   ├── profile/              # User profiles
│   │   ├── projects/             # Project management
│   │   ├── jobs/                 # Job management
│   │   ├── analytics/            # Analytics & reporting
│   │   ├── browse/               # Browse & discovery
│   │   ├── ai/                   # AI features
│   │   ├── checkin/              # Site check-in
│   │   ├── deliverables/         # File uploads
│   │   ├── settings/             # User settings
│   │   └── support/              # Help & support
│   │
│   ├── shared/                   # Shared utilities & components
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/              # Base UI components (shadcn/ui)
│   │   │   └── common/          # Custom shared components
│   │   ├── hooks/               # Shared React hooks
│   │   ├── utils/               # Utility functions
│   │   ├── constants/           # App constants
│   │   └── types/               # Shared TypeScript types
│   │
│   ├── app/                     # App-level concerns
│   │   ├── routing/             # Route definitions & guards
│   │   ├── layouts/             # Layout components
│   │   └── providers/           # Context providers
│   │
│   ├── pages/                   # Page components (route handlers)
│   │   ├── auth/                # Authentication pages
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── enterprise/          # Enterprise-specific pages
│   │   └── [other roles]/       # Role-specific pages
│   │
│   ├── lib/                     # External integrations
│   │   ├── supabase/            # Supabase client & types
│   │   ├── stripe/              # Stripe integration
│   │   └── ai/                  # AI service clients
│   │
│   ├── stores/                  # Global state management
│   ├── config/                  # Configuration files
│   └── data/                    # Static data & mock data
│
├── supabase/                    # Backend configuration
│   ├── migrations/              # Database migrations
│   ├── functions/               # Edge functions
│   └── config.toml              # Supabase config
│
├── docs/                       # Documentation
│   ├── SETUP.md                # Setup instructions
│   ├── ARCHITECTURE.md         # System architecture
│   └── CONTRIBUTING.md         # Contribution guidelines
│
└── [config files]              # Root configuration
```

## **🎯 Organization Principles**

### **Feature-First Architecture**
- **Primary**: `src/features/[feature]/` - All feature-specific code
- **Secondary**: `src/shared/` - Cross-feature utilities
- **Tertiary**: `src/app/` - App-level routing & providers

### **File Naming Conventions**
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useUserProfile.ts`)
- **Utils**: camelCase (`formatCurrency.ts`)
- **Types**: PascalCase with `Type` suffix (`UserProfileType.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### **Import Path Conventions**
```typescript
// Feature imports
import { UserProfile } from '@/features/profile/components/UserProfile'
import { useUserProfile } from '@/features/profile/hooks/useUserProfile'

// Shared imports
import { Button } from '@/shared/components/ui/button'
import { formatCurrency } from '@/shared/utils/formatCurrency'

// App-level imports
import { AuthGuard } from '@/app/routing/AuthGuard'
```

## **🔄 Migration Strategy**

### **Phase 1: Consolidate Duplicates**
1. Remove re-export files from `src/components/`
2. Update all imports to use direct feature paths
3. Remove duplicate/unused files

### **Phase 2: Reorganize Features**
1. Move new billing files to proper feature structure
2. Consolidate auth components into `src/features/auth/`
3. Reorganize dashboard components

### **Phase 3: Clean Documentation**
1. Consolidate overlapping docs
2. Remove outdated implementation guides
3. Create comprehensive architecture docs

### **Phase 4: Automation**
1. Add lint rules for import path enforcement
2. Create scripts for dead code detection
3. Add pre-commit hooks for structure validation
