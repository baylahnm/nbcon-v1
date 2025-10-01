# Project Structure Overview

## 🏗️ Architecture

```
nbcon-v1/
│
├── src/
│   │
│   ├── 📁 features/                    # Feature-based modules
│   │   ├── 📁 checkin/
│   │   │   └── CheckInContent.tsx      # ✅ Site check-in & geofencing
│   │   │
│   │   ├── 📁 support/
│   │   │   └── HelpSupportContent.tsx  # ✅ Help center & support
│   │   │
│   │   ├── 📁 messaging/
│   │   │   └── MessagesContent.tsx     # ✅ Messaging system
│   │   │
│   │   ├── 📁 settings/
│   │   │   └── SettingsContent.tsx     # ✅ User settings & preferences
│   │   │
│   │   ├── 📁 profile/
│   │   │   ├── ProfileContent.tsx      # ✅ Profile wrapper
│   │   │   └── 📁 profiles/
│   │   │       ├── EngineerProfile.tsx
│   │   │       ├── ClientProfile.tsx
│   │   │       └── EnterpriseProfile.tsx
│   │   │
│   │   ├── 📁 projects/
│   │   │   └── PostProjectButtonHandler.tsx  # ✅ Project actions
│   │   │
│   │   └── 📁 deliverables/
│   │       └── UploadDeliverableContent.tsx  # ✅ Upload system
│   │
│   ├── 📁 app/                         # App-level concerns
│   │   └── 📁 routing/
│   │       ├── RouteErrorBoundary.tsx  # ✅ Error handling
│   │       └── RouteFallback.tsx       # ✅ Loading states
│   │
│   ├── 📁 shared/                      # Shared/reusable code
│   │   └── 📁 components/
│   │       └── 📁 star-border/
│   │           ├── StarBorder.tsx      # ✅ Animated border
│   │           └── StarBorder.css
│   │
│   ├── 📁 components/                  # Legacy (backward compatibility)
│   │   ├── CheckInContent.tsx          # 🔄 Re-exports from features/
│   │   ├── HelpSupportContent.tsx      # 🔄 Re-exports from features/
│   │   ├── MessagesContent.tsx         # 🔄 Re-exports from features/
│   │   ├── ProfileContent.tsx          # 🔄 Re-exports from features/
│   │   ├── SettingsContent.tsx         # 🔄 Re-exports from features/
│   │   ├── PostProjectButtonHandler.tsx # 🔄 Re-exports from features/
│   │   ├── UploadDeliverableContent.tsx # 🔄 Re-exports from features/
│   │   ├── RouteErrorBoundary.tsx      # 🔄 Re-exports from app/
│   │   ├── RouteFallback.tsx           # 🔄 Re-exports from app/
│   │   ├── StarBorder.jsx              # 🔄 Re-exports from shared/
│   │   ├── StarBorder.css              # 📝 Legacy styles
│   │   │
│   │   ├── 📁 auth/                    # Existing auth components
│   │   ├── 📁 calendar/                # Existing calendar components
│   │   ├── 📁 dashboard/               # Existing dashboard components
│   │   ├── 📁 enterprise/              # Existing enterprise components
│   │   ├── 📁 jobs/                    # Existing jobs components
│   │   ├── 📁 layout/                  # Existing layout components
│   │   ├── 📁 learning/                # Existing learning components
│   │   ├── 📁 messaging/               # Existing messaging subcomponents
│   │   ├── 📁 profiles/                # 🔄 Re-exports from features/
│   │   ├── 📁 toolbar/                 # Existing toolbar components
│   │   └── 📁 ui/                      # Existing UI components
│   │
│   ├── 📁 pages/                       # Page components
│   ├── 📁 layouts/                     # Layout components
│   ├── 📁 routes/                      # Routing configuration
│   ├── 📁 hooks/                       # Custom React hooks
│   ├── 📁 stores/                      # State management
│   ├── 📁 lib/                         # Utilities & helpers
│   ├── 📁 types/                       # TypeScript types
│   └── 📁 config/                      # Configuration files
│
├── 📁 docs/                            # Documentation
│   ├── PROJECT_STRUCTURE.md            # This document
│   ├── REORGANIZATION_SUMMARY.md       # Reorganization guide
│   └── PostProjectRoutingGuide.md      # Routing documentation
│
└── 📁 supabase/                        # Supabase configuration
    ├── migrations/                     # Database migrations
    └── *.sql                           # RLS policy fixes
```

## 📊 Migration Guide

### ✅ Current State: Backward Compatible

All existing imports still work via re-exports:

```typescript
// Still works! ✅
import { CheckInContent } from "@/components/CheckInContent";
import { ProfileContent } from "@/components/ProfileContent";
import { SettingsContent } from "@/components/SettingsContent";
```

### 🔄 Future State: Direct Imports

Gradually update to use new paths:

```typescript
// New recommended imports ✨
import { CheckInContent } from "@/features/checkin/CheckInContent";
import { ProfileContent } from "@/features/profile/ProfileContent";
import { SettingsContent } from "@/features/settings/SettingsContent";
```

## 🎯 Organization Principles

### Features (`src/features/`)
- **Checkin**: Site attendance & geofencing
- **Support**: Help center & documentation
- **Messaging**: Communication system
- **Settings**: User preferences
- **Profile**: User profile management
- **Projects**: Project-related actions
- **Deliverables**: File upload system

### App (`src/app/`)
- **Routing**: Route-level concerns (errors, loading)

### Shared (`src/shared/`)
- **Components**: Reusable UI components
- **Utils**: Shared utilities (future)
- **Types**: Shared TypeScript types (future)

## 🔍 Key Benefits

| Benefit | Description |
|---------|-------------|
| 🎯 **Feature Isolation** | Each feature is self-contained |
| 🔄 **Zero Breaking Changes** | Re-exports maintain compatibility |
| 📦 **Code Splitting Ready** | Easy to lazy-load features |
| 🧹 **Clean Separation** | Clear boundaries between features |
| 📈 **Scalable** | Easy to add new features |
| 🔧 **Maintainable** | Related code lives together |

## 🚀 Next Steps

1. **Phase 1 (Optional)**: Update imports to new paths
2. **Phase 2 (Optional)**: Remove re-export files
3. **Phase 3 (Future)**: Implement code splitting
4. **Phase 4 (Future)**: Add feature-level tests

---

**Status**: ✅ Reorganization Complete | Build: ✅ Passing | Linting: ✅ Clean
