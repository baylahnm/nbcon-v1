# LoadingSpinner Component - Usage Guide

## Overview

A beautiful loading animation component that uses the nbcon logo with smooth rotation and pulse effects.

## Import

```tsx
import LoadingSpinner from '@/pages/1-HomePage/others/components/ui/loading-spinner';
import PageLoader from '@/pages/1-HomePage/others/components/ui/page-loader';
```

## Basic Usage

### 1. Inline Loader (Default)

```tsx
function MyComponent() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>Your content</div>
      )}
    </div>
  );
}
```

### 2. Custom Size

```tsx
{/* Small */}
<LoadingSpinner size="sm" />

{/* Medium (default) */}
<LoadingSpinner size="md" />

{/* Large */}
<LoadingSpinner size="lg" />

{/* Extra Large */}
<LoadingSpinner size="xl" />
```

### 3. Custom Text

```tsx
<LoadingSpinner text="Fetching data..." />
<LoadingSpinner text="Please wait..." />
<LoadingSpinner text="Processing..." />
```

### 4. Without Text

```tsx
<LoadingSpinner showText={false} />
```

### 5. Full Screen Overlay

```tsx
{/* Full screen centered loader */}
<LoadingSpinner fullScreen size="lg" text="Loading application..." />

{/* Or use the dedicated PageLoader */}
<PageLoader text="Loading page..." />
```

## Use Cases

### Page Transitions

```tsx
import { Suspense } from 'react';
import PageLoader from '@/pages/1-HomePage/others/components/ui/page-loader';

const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Data Fetching

```tsx
function DataComponent() {
  const { data, isLoading } = useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner text="Fetching data..." />
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
}
```

### Button Loading State

```tsx
function SubmitButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Button disabled={isSubmitting}>
      {isSubmitting ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" showText={false} />
          <span>Submitting...</span>
        </div>
      ) : (
        'Submit'
      )}
    </Button>
  );
}
```

### Card Loading State

```tsx
function ProjectCard() {
  const { project, isLoading } = useProject();

  return (
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" text="Loading project..." />
          </div>
        ) : (
          <div>{/* Project content */}</div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Modal/Dialog Loading

```tsx
function DataModal() {
  return (
    <Dialog>
      <DialogContent>
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" text="Loading details..." />
          </div>
        ) : (
          <div>{/* Modal content */}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `"Loading..."` | Loading text to display |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the spinner |
| `showText` | `boolean` | `true` | Show/hide loading text |
| `fullScreen` | `boolean` | `false` | Full screen centered overlay |

## Animations

### Rotation Animation
- **Duration:** 2 seconds per rotation
- **Easing:** Linear (constant speed)
- **Repeat:** Infinite

### Pulse/Scale Animation
- **Duration:** 1.5 seconds per pulse
- **Scale Range:** 1.0 → 1.1 → 1.0
- **Easing:** easeInOut (smooth)
- **Repeat:** Infinite

### Text Dots Animation
- **Duration:** 1.5 seconds
- **Effect:** Fading dots (...)
- **Repeat:** Infinite

## Styling

The component uses:
- ✅ Theme-aware colors (`bg-gradient-primary`, `text-muted-foreground`)
- ✅ Shadow effects (`shadow-lg shadow-primary/50`)
- ✅ Backdrop blur for full screen mode
- ✅ Responsive sizing
- ✅ Smooth Framer Motion animations

## Currently Used In

- ✅ **RouteFallback.tsx** - Page transition loading
- ✅ **Lazy-loaded pages** - Enterprise Analytics, Finance, Procurement

## Next Steps

Consider adding to:
- Dashboard data loading states
- Form submission states
- File upload progress
- Authentication flows
- API request states

