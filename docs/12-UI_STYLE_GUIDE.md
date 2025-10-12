# 🎨 UI Style Guide - nbcon Design System

**Last Updated:** October 12, 2025  
**Version:** 2.0 ✨ (Product-Card & Interactive Popovers Added)  
**Status:** Production Standard

---

## 📖 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Cards](#cards)
5. [Product-Card Design Pattern](#product-card-design-pattern) ✨ NEW
6. [Interactive Popovers](#interactive-popovers) ✨ NEW
7. [Buttons](#buttons)
8. [Badges](#badges)
9. [Borders & Outlines](#borders--outlines)
10. [Spacing & Layout](#spacing--layout)
11. [Hover Effects & Animations](#hover-effects--animations)
12. [Icons](#icons)
13. [Shadows](#shadows)
14. [Responsive Design](#responsive-design)

---

## 🎯 Design Philosophy

### Core Principles

**1. Bauhaus-Inspired Modernism**
- Clean geometric forms
- Functional aesthetics
- Gradient borders for depth
- Primary color as visual anchor

**2. Consistent Typography**
- **16px (text-base)** for all titles and headers
- **12px (text-xs)** for all labels, badges, and buttons
- **14px (text-sm)** for body text
- Tracking-tight for bold text

**3. Subtle Motion**
- Gentle hover lifts (-translate-y-0.5)
- Icon scale transforms (scale-110)
- Smooth transitions (duration-300)
- No overwhelming animations

**4. Color-Coded Communication**
- Blue: Information/General
- Green: Success/Revenue
- Amber: Warning/Pending
- Purple: Profile/Personal
- Red: Danger/Urgent

---

## 🎨 Color System

### Primary Brand Color

**Primary Green:** `hsl(142 65% 47%)` → `#1e9e6b`

```css
/* Usage */
--primary: 142 65% 47%;
--primary-foreground: 0 0% 100%;
--primary-light: 142 60% 57%;
--primary-dark: 142 70% 37%;
```

**CSS Classes:**
```tsx
bg-primary                 // Solid background
text-primary              // Text color
border-primary            // Border color
ring-primary              // Ring/outline color
```

---

### Status Colors

**Success (Green):**
```css
--success: 156 68% 37%;
bg-green-500/10    // Background tint
text-green-600     // Text color
ring-green-500/20  // Ring border
```

**Warning (Amber):**
```css
--warning: 32 100% 42%;
bg-amber-500/10    // Background tint
text-amber-600     // Text color
ring-amber-500/20  // Ring border
```

**Danger (Red):**
```css
--destructive: 4 65% 48%;
bg-red-500/10      // Background tint
text-red-600       // Text color
ring-red-500/20    // Ring border
```

**Info (Blue):**
```css
--info: 217 92% 55%;
bg-blue-500/10     // Background tint
text-blue-600      // Text color
ring-blue-500/20   // Ring border
```

**Purple (Profile/Personal):**
```css
--purple: 270 95% 60%;
bg-purple-500/10   // Background tint
text-purple-600    // Text color
ring-purple-500/20 // Ring border
```

---

### Neutral Colors

```css
/* Light Mode */
--background: 0 0% 100%;          // White (#ffffff)
--foreground: 0 0% 6%;            // Near black (#0f0f0f)
--card: 0 0% 94%;                 // Light gray (#f0f0f0)
--muted: 0 0% 94%;                // Muted elements
--muted-foreground: 0 0% 45%;     // Muted text (#737373)
--border: 0 0% 90%;               // Default borders (#e5e5e5)

/* Dark Mode */
--background: 0 0% 0%;            // Black
--foreground: 0 0% 91%;           // Near white
--card: 0 0% 13%;                 // Dark gray
--muted-foreground: 0 0% 65%;     // Lighter gray
```

---

## 📝 Typography

### Typography Scale (Standardized)

**All typography MUST use these exact sizes:**

```tsx
// Page & Section Headers
text-base (16px) font-bold tracking-tight

// Card Titles
text-base (16px) font-bold

// Body Text
text-sm (14px) leading-relaxed

// Labels & Captions
text-xs (12px) font-medium

// Button Text
text-xs (12px)

// Badge Text
text-xs (12px)

// Stats/Numbers (Large)
text-3xl (30px) font-bold tracking-tight

// Stats/Numbers (Medium)
text-xl (20px) font-bold

// Micro Text (Timestamps, Fine Print)
text-[10px] or text-[11px]
```

### Font Families

```css
/* Body Text (Default) */
font-family: system-ui, -apple-system, sans-serif;

/* Serif Titles (Landing Page Only) */
font-family: 'Playfair Display', 'Crimson Text', serif;
```

### Typography Examples

```tsx
// Page Header
<h1 className="text-base font-bold tracking-tight flex items-center gap-3">
  <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
    <Icon className="h-7 w-7 text-primary" />
  </div>
  <span>Page Title</span>
</h1>

// Page Subtitle
<p className="text-xs text-muted-foreground">
  Subtitle or description text
</p>

// Section Title
<h2 className="text-base font-bold tracking-tight mb-3">
  Section Title
</h2>

// Card Title
<h3 className="font-bold text-base tracking-tight">
  Card Title
</h3>

// Body Text
<p className="text-sm leading-relaxed text-foreground/80">
  Description or body content goes here...
</p>

// Label
<label className="text-xs font-medium text-muted-foreground">
  Field Label
</label>

// Large Stat Number
<p className="text-3xl font-bold tracking-tight">
  1,234
</p>

// Medium Stat Number
<p className="text-xl font-bold">
  567
</p>
```

---

## 🃏 Cards

### Card Structure (Standard Pattern)

**Basic Card:**
```tsx
<Card className="border-border/50 gap-0">
  <CardHeader className="p-5 pb-3 border-b border-border/40">
    <div className="flex items-center gap-3">
      <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <CardTitle className="text-base font-bold tracking-tight">
          Card Title
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Card subtitle or description
        </p>
      </div>
    </div>
  </CardHeader>
  <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
    {/* Card content */}
  </CardContent>
</Card>
```

---

### Card with Bauhaus Gradient Border

**The signature card style for nbcon:**

```tsx
<div
  className="relative overflow-hidden transition-all duration-300"
  style={{
    border: '2px solid transparent',
    borderRadius: '0.5rem',
    backgroundImage: `
      linear-gradient(hsl(var(--card)), hsl(var(--card))),
      linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  }}
>
  <Card className="bg-transparent border-0">
    <CardContent className="p-5">
      {/* Content */}
    </CardContent>
  </Card>
</div>
```

**Key Properties:**
- **Border:** 2px solid transparent (required for gradient border)
- **Border Radius:** 0.5rem (8px)
- **Background:** Double gradient (content + border)
- **Gradient Start:** `hsl(var(--primary) / 0.15)` (15% opacity primary)
- **Gradient Angle:** 135deg (diagonal top-left to bottom-right)
- **Transition:** `transition-all duration-300`

---

### Card with Animated Gradient Border (Mouse Tracking)

**Advanced pattern for special cards:**

```tsx
const cardRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const card = cardRef.current;
  if (!card) return;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angle = Math.atan2(y - centerY, x - centerX);
    card.style.setProperty('--rotation', `${angle}rad`);
  };

  card.addEventListener('mousemove', handleMouseMove);
  return () => card.removeEventListener('mousemove', handleMouseMove);
}, []);

<div
  ref={cardRef}
  className="relative overflow-hidden transition-all duration-300"
  style={{
    '--rotation': '4.2rad',
    border: '2px solid transparent',
    borderRadius: '0.5rem',
    backgroundImage: `
      linear-gradient(hsl(var(--card)), hsl(var(--card))),
      linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  } as React.CSSProperties}
>
  {/* Card content */}
</div>
```

**Use Cases:** AI Assistant Widget, Special Feature Cards

---

### Card Variants

**1. Simple Card (No Border):**
```tsx
<Card className="border-border/50">
  <CardContent className="p-5">
    Simple content
  </CardContent>
</Card>
```

**2. Hoverable Card:**
```tsx
<Card className="cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/50">
  <CardContent className="p-5">
    Click me!
  </CardContent>
</Card>
```

**3. Nested Card (Within Card):**
```tsx
<Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50">
  <CardContent className="p-4 space-y-3">
    Nested card content
  </CardContent>
</Card>
```

**4. Empty State Card:**
```tsx
<div className="text-center py-8 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
    <Icon className="w-6 h-6 text-muted-foreground" />
  </div>
  <p className="text-sm font-medium mb-1">No items yet</p>
  <p className="text-xs text-muted-foreground">
    Your items will appear here
  </p>
</div>
```

---

### Card Padding Standards

```tsx
// Card Header
className="p-5 pb-3"               // 20px all sides, 12px bottom

// Card Content
className="p-5"                    // 20px all sides

// Nested Card
className="p-4"                    // 16px all sides

// Section Within Card
className="p-2.5"                  // 10px all sides

// Icon Container
className="p-3"                    // 12px for large icons
className="p-2.5"                  // 10px for medium icons
className="p-2"                    // 8px for small icons
```

---

## 🛍️ Product-Card Design Pattern

### Overview

The **Product-Card Design Pattern** is a modern, e-commerce-inspired card layout used for displaying jobs, projects, and other featured content. Introduced in the Jobs page redesign (October 2025).

**Key Features:**
- Hero image banner with gradient overlay
- Overlay badges for status/metadata
- Title and company on image
- Structured content sections
- Interactive Quick Insights buttons
- Dual action buttons in footer

---

### Complete Product-Card Structure

```tsx
<Card className="gap-0 w-full max-w-full overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-border/50 hover:border-primary/30">
  {/* 1. Hero Image Section */}
  <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
    <motion.img
      src={`/path/to/image.jpg`}
      alt="Title"
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/placeholder.svg';
      }}
    />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    
    {/* Status Badges (Top-Left) */}
    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
      <Badge className="bg-blue-500 hover:bg-blue-500/90 text-white border-0 shadow-lg">
        New
      </Badge>
      <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0 shadow-lg">
        Recommended
      </Badge>
      <Badge className="bg-emerald-500 hover:bg-emerald-500/90 text-white border-0 shadow-lg flex items-center gap-1">
        <Star className="h-3 w-3 fill-white" />
        4.8
      </Badge>
    </div>
    
    {/* Floating Action Button (Top-Right) */}
    <Button
      variant="secondary"
      size="icon"
      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
      onClick={(e) => e.stopPropagation()}
    >
      <Bookmark className="h-5 w-5" />
    </Button>
    
    {/* Title Overlay (Bottom) */}
    <div className="absolute bottom-4 left-4 right-4">
      <h3 className="font-bold text-2xl text-white drop-shadow-lg line-clamp-1">
        Job Title Here
      </h3>
      <button className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors mt-1">
        <Building className="h-4 w-4" />
        Company Name
      </button>
    </div>
  </div>

  {/* 2. Content Section */}
  <CardContent className="p-5">
    <div className="space-y-4">
      {/* Metadata Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold px-4 py-1.5 text-xs uppercase tracking-wider">
            FULL TIME
          </Badge>
          <div className="text-xs text-muted-foreground">
            Posted 2024-01-20
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <Clock className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
            Deadline: 2024-02-20
          </span>
          <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0 text-[10px] px-2 py-0.5">
            Apply Soon
          </Badge>
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <MapPin className="h-3.5 w-3.5" />
            <span>Location</span>
          </div>
          <div className="font-medium text-sm">Riyadh, Saudi Arabia</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>Experience</span>
          </div>
          <div className="font-medium text-sm">5+ years</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Salary</span>
          </div>
          <div className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
            12,000 - 20,000 SAR
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
        Detailed description of the job, project, or item. This text is truncated to 2 lines with ellipsis.
      </p>

      {/* Skills/Tags - Theme Colored */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">Required Skills</div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary">
            Project Management
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary">
            Leadership
          </button>
        </div>
      </div>

      {/* Quick Insights (4 Equal Buttons) */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">Quick Insights</div>
        <div className="flex items-center justify-between gap-2">
          <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-all border border-primary/20 group/icon">
            <Sparkles className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-primary transition-colors">AI Match</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-500/5 transition-all border border-green-500/20 group/icon">
            <Calculator className="h-5 w-5 text-green-600 group-hover/icon:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-green-600 transition-colors">Earnings</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-500/5 transition-all border border-orange-500/20 group/icon">
            <Target className="h-5 w-5 text-orange-600 group-hover/icon:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-orange-600 transition-colors">Skills Gap</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-purple-500/5 transition-all border border-purple-500/20 group/icon">
            <TrendingUp className="h-5 w-5 text-purple-600 group-hover/icon:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-purple-600 transition-colors">Similar Jobs</span>
          </button>
        </div>
      </div>
    </div>
  </CardContent>

  {/* 3. Footer Actions */}
  <CardFooter className="p-5 pt-0 flex gap-3">
    <Button 
      variant="outline"
      className="flex-1 font-semibold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
    >
      <Eye className="h-4 w-4 mr-2" />
      View Details
    </Button>
    <Button 
      className="flex-1 font-semibold bg-primary hover:bg-primary/90 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
    >
      <Zap className="h-4 w-4 mr-2" />
      Quick Apply
    </Button>
  </CardFooter>
</Card>
```

---

### Product-Card Key Specifications

**Image Section:**
- **Aspect Ratio:** `aspect-[21/9]` (panoramic, cinematic)
- **Overflow:** `overflow-hidden` (enables zoom effect)
- **Background Fallback:** `bg-gradient-to-br from-muted to-muted/50`
- **Image Hover:** `group-hover:scale-105` (zoom in on card hover)
- **Gradient Overlay:** `from-black/60 via-black/20 to-transparent` (ensures text readability)

**Badge Positioning:**
- **Top-Left:** Status badges (New, Recommended, Rating)
- **Top-Right:** Floating action button (Bookmark, Save, etc.)
- **Bottom:** Title and subtitle overlay on image

**Content Structure:**
- **Zero Gap:** `gap-0` on Card component (seamless sections)
- **Padding:** `p-5` (20px) for content and footer
- **Border Top/Bottom:** `border-y border-border/40` on key info grid

**Quick Insights Buttons:**
- **Layout:** `flex items-center justify-between gap-2`
- **Button Width:** `flex-1` (all buttons equal width)
- **No Default Background:** Only shows on hover
- **Icon Scale:** `group-hover/icon:scale-110`
- **Color-Coded:** Primary, Green, Orange, Purple

---

### Product-Card Variants

**1. Available Jobs (Open Status):**
```tsx
{/* Badges */}
<Badge className="bg-blue-500 hover:bg-blue-500/90 text-white border-0 shadow-lg">
  New
</Badge>
<Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0 shadow-lg">
  Recommended
</Badge>

{/* Image Path */}
src={`/e-jobs/Available Jobs/${job.title}.jpg`}

{/* Metadata */}
<div className="text-xs text-muted-foreground">
  Posted {job.postedDate}
</div>

{/* Footer Buttons */}
<Button>View Details</Button>
<Button>Quick Apply</Button>
```

**2. Applied Jobs:**
```tsx
{/* Badges */}
<Badge className="bg-blue-100 text-blue-800 hover:opacity-90 border-0 shadow-lg flex items-center gap-1">
  <Send className="h-3 w-3" />
  <span>Applied</span>
</Badge>

{/* Image Path */}
src={`/e-jobs/Applied/${job.title}.jpg`}

{/* Metadata */}
<div className="text-xs text-muted-foreground flex items-center gap-1">
  <Calendar className="h-3 w-3" />
  Applied {job.postedDate}
</div>

{/* Additional Content */}
<div className="border-t pt-4 mt-4">
  <ApplicationStatusTracker currentStage={2} />
</div>

{/* Footer Buttons */}
<Button>View Details</Button>
<Button variant="outline">View Application</Button>
```

**3. Shortlisted Jobs:**
```tsx
{/* Badges */}
<Badge className="bg-green-100 text-green-800 hover:opacity-90 border-0 shadow-lg flex items-center gap-1">
  <CheckCircle2 className="h-3 w-3" />
  <span>Shortlisted</span>
</Badge>

{/* Image Path */}
src={`/e-jobs/Shortlisted/${job.title}.jpg`}

{/* Metadata */}
<div className="text-xs text-muted-foreground flex items-center gap-1">
  <Calendar className="h-3 w-3" />
  Shortlisted {job.postedDate}
</div>

{/* Footer Buttons */}
<Button>View Details</Button>
<Button className="bg-green-600 hover:bg-green-700">Contact Client</Button>
```

**4. Bookmarked Items:**
```tsx
{/* Badges */}
<Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0 shadow-lg flex items-center gap-1">
  <Bookmark className="h-3 w-3 fill-white" />
  Bookmarked
</Badge>

{/* Bookmark Button (Always Filled) */}
<Button
  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all text-rose-500"
>
  <Bookmark className="h-5 w-5 fill-rose-500" />
</Button>

{/* Image Path */}
src={`/e-jobs/Bookmarked/${job.title}.jpg`}

{/* Footer Buttons */}
<Button>View Details</Button>
<Button>Quick Apply</Button>
```

---

### Hero Image Specifications

**Image Dimensions:**
- **Aspect Ratio:** 21:9 (Ultrawide/Panoramic)
- **Recommended Size:** 1920×820px or 1680×720px
- **Format:** JPG (optimized) or WebP
- **Quality:** 80-85% compression

**Gradient Overlay (MUST HAVE):**
```tsx
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
```
- **Direction:** Top to bottom (`bg-gradient-to-t`)
- **Bottom Opacity:** 60% black (`from-black/60`)
- **Middle Opacity:** 20% black (`via-black/20`)
- **Top Opacity:** Transparent

**Why Gradient?**
- Ensures white text is readable on any image
- Creates depth and visual hierarchy
- Professional, polished appearance

**Image Hover Effect:**
```tsx
className="group-hover:scale-105 transition-transform duration-500"
```
- **Scale:** 105% (subtle zoom)
- **Duration:** 500ms (smooth, not jarring)
- **Trigger:** Card hover (using `group` class)

**Fallback Handling:**
```tsx
onError={(e) => {
  (e.target as HTMLImageElement).src = '/placeholder.svg';
}}
```

---

### Floating Action Button Pattern

**Specifications:**
- **Size:** `h-10 w-10` (40×40px)
- **Shape:** `rounded-full` (perfect circle)
- **Background:** `bg-background/90 backdrop-blur-sm` (frosted glass effect)
- **Shadow:** `shadow-lg` (elevated appearance)
- **Hover:** `hover:scale-110` (grows on hover)
- **Position:** `absolute top-4 right-4`

**Implementation:**
```tsx
<Button
  variant="secondary"
  size="icon"
  className={`absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all ${
    isBookmarked ? 'text-rose-500' : ''
  }`}
  onClick={(e) => {
    e.stopPropagation(); // Prevent card click
  }}
>
  <Bookmark
    className={`h-5 w-5 ${isBookmarked ? 'fill-rose-500' : ''}`}
  />
</Button>
```

**Color States:**
- **Inactive:** Default foreground color
- **Active:** `text-rose-500` with `fill-rose-500`

---

### Title Overlay Pattern

**Structure:**
```tsx
<div className="absolute bottom-4 left-4 right-4">
  <h3 className="font-bold text-2xl text-white drop-shadow-lg line-clamp-1">
    {title}
  </h3>
  <button className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors mt-1">
    <Building className="h-4 w-4" />
    {company}
  </button>
</div>
```

**Key Properties:**
- **Title Size:** `text-2xl` (24px) - larger for hero section
- **Text Color:** `text-white` (always white on dark gradient)
- **Drop Shadow:** `drop-shadow-lg` (text outline for readability)
- **Line Clamp:** `line-clamp-1` (prevent overflow)
- **Subtitle Opacity:** `text-white/90` → `hover:text-white`

---

### Quick Insights Button Grid

**Layout:**
```tsx
<div className="flex items-center justify-between gap-2">
  {/* 4 equal-width buttons */}
</div>
```

**Individual Button:**
```tsx
<button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-all border border-primary/20 group/icon">
  <Sparkles className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-primary transition-colors">AI Match</span>
</button>
```

**Key Features:**
- **Equal Width:** `flex-1` on each button
- **Layout:** `flex flex-col items-center` (icon on top, text below)
- **Spacing:** `gap-2` (8px between icon and text)
- **Padding:** `p-3` (12px all sides)
- **No Default Background:** Transparent by default
- **Hover Background:** `hover:bg-{color}/5` (5% opacity tint)
- **Border:** Always visible, colored per category
- **Icon Scale:** `group-hover/icon:scale-110`
- **Text Size:** `text-[10px]` (very small, compact)

**Color Coding:**
1. **Primary** - AI/Smart features
2. **Green** - Money/Earnings
3. **Orange** - Skills/Progress
4. **Purple** - Recommendations/Similar

---

### Theme-Colored Skill Badges

**Pattern:**
```tsx
<button className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary">
  {skill}
</button>
```

**Specifications:**
- **Background:** `bg-primary/10` (10% opacity - subtle tint)
- **Text:** `text-primary` (full brand color)
- **Border:** `border border-primary/20` (20% opacity outline)
- **Padding:** `px-3 py-1.5` (12px horizontal, 6px vertical)
- **Shape:** `rounded-full` (pill shape)
- **Font:** `text-xs font-medium` (12px medium weight)

**Hover State:**
- **Background:** `hover:bg-primary` (solid primary color)
- **Text:** `hover:text-primary-foreground` (white)
- **Border:** `hover:border-primary` (solid primary border)

**Why This Pattern?**
- ✅ Consistent with theme colors
- ✅ Clear visual hierarchy
- ✅ Interactive (suggests clickability)
- ✅ Works in light/dark mode

---

### Metadata Compact Row Pattern

**Structure:**
```tsx
<div className="flex items-center justify-between gap-3">
  {/* Left Side - Type & Date */}
  <div className="flex items-center gap-3">
    <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold px-4 py-1.5 text-xs uppercase tracking-wider">
      FULL TIME
    </Badge>
    <div className="text-xs text-muted-foreground">
      Posted 2024-01-20
    </div>
  </div>
  
  {/* Right Side - Deadline Alert */}
  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
    <Clock className="h-3.5 w-3.5 text-amber-600" />
    <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
      Deadline: 2024-02-20
    </span>
    <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0 text-[10px] px-2 py-0.5">
      Apply Soon
    </Badge>
  </div>
</div>
```

**Benefits:**
- ✅ Space-efficient (all metadata on one line)
- ✅ Clear visual separation (left vs right)
- ✅ Important deadline info is prominent
- ✅ Compact badge sizing for density

---

### Key Info Grid (3-Column)

**Pattern:**
```tsx
<div className="grid grid-cols-3 gap-4 py-4 border-y border-border/40">
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
      <Icon className="h-3.5 w-3.5" />
      <span>Label</span>
    </div>
    <div className="font-medium text-sm">Value</div>
  </div>
  {/* Repeat for 2 more columns */}
</div>
```

**Specifications:**
- **Columns:** Always 3 (Location, Experience/Duration, Salary/Budget)
- **Gap:** `gap-4` (16px between columns)
- **Vertical Padding:** `py-4` (16px top/bottom)
- **Border:** `border-y border-border/40` (top & bottom borders)
- **Label Size:** `text-xs` (12px)
- **Value Size:** `text-sm` (14px)
- **Label Color:** `text-muted-foreground`
- **Value Weight:** `font-medium` or `font-semibold`

**Salary/Money Styling:**
```tsx
<div className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
  12,000 - 20,000 SAR
</div>
```
- Always use emerald color for money amounts
- Always `font-semibold`
- Always include currency

---

### Product-Card Animation Patterns

**Framer Motion Integration:**
```tsx
import { motion } from 'framer-motion';

<motion.img
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
/>
```

**Card-Level Hover Group:**
```tsx
<Card className="group ...">
  {/* Child elements can use group-hover: */}
  <img className="group-hover:scale-105 ..." />
  <Icon className="group-hover/icon:scale-110 ..." />
</Card>
```

**Named Groups for Nested Hovers:**
```tsx
<button className="group/icon ...">
  <Icon className="group-hover/icon:scale-110 ..." />
  <span className="group-hover/icon:text-primary ..." />
</button>
```

---

### Product-Card Usage Guidelines

**When to Use:**
- ✅ Job listings (all statuses)
- ✅ Project showcases
- ✅ Product catalogs
- ✅ Featured content
- ✅ Marketplace items
- ✅ Portfolio pieces

**When NOT to Use:**
- ❌ Simple data tables
- ❌ Form sections
- ❌ Stats cards
- ❌ Navigation cards
- ❌ Compact lists

**Image Requirements:**
- ✅ MUST have hero image
- ✅ MUST use gradient overlay
- ✅ MUST have fallback placeholder
- ✅ Recommended: 21:9 aspect ratio
- ✅ Optimize images (< 200KB)

---

## 🔄 Interactive Popovers

### Hybrid Hover/Click Popover Pattern

**Implementation:**
```tsx
import { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function JobInfoPopover({ trigger, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMode, setOpenMode] = useState<'hover' | 'click' | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const closeTimeoutRef = useRef<NodeJS.Timeout>();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTriggerMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
      setOpenMode('hover');
    }, 300); // 300ms delay before opening
  };

  const handleTriggerMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (openMode === 'hover') {
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setOpenMode(null);
      }, 200); // 200ms delay before closing
    }
  };

  const handleTriggerClick = () => {
    setIsOpen(true);
    setOpenMode('click');
  };

  const handleContentMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const handleContentMouseLeave = () => {
    if (openMode === 'hover') {
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setOpenMode(null);
      }, 200);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsOpen(false);
        setOpenMode(null);
      }
    }}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={handleTriggerMouseEnter}
          onMouseLeave={handleTriggerMouseLeave}
          onClick={handleTriggerClick}
        >
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        ref={contentRef}
        className="w-80 p-0 border-border/50 shadow-xl z-50"
        side="top"
        align="center"
        sideOffset={8}
        collisionPadding={20}
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
```

---

### Popover Specifications

**Width:**
- **Fixed Width:** `w-80` (320px) on PopoverContent
- **Inner Content:** Also `w-80` to match
- **Max Width:** Never exceed 384px (`w-96`)

**Positioning:**
- **Default Side:** `side="top"` (appears above trigger)
- **Alignment:** `align="center"` (centered on trigger)
- **Offset:** `sideOffset={8}` (8px gap from trigger)
- **Collision Padding:** `collisionPadding={20}` (20px from viewport edges)

**Z-Index:**
- **Popover:** `z-50` (above cards and content)
- **Dialog/Modal:** `z-[100]` (above popovers)

**Styling:**
- **Padding:** `p-0` on PopoverContent (let inner content control padding)
- **Border:** `border-border/50` (subtle outline)
- **Shadow:** `shadow-xl` (elevated appearance)
- **Background:** Uses `bg-popover` from theme

---

### Hover Behavior Specifications

**Hover Delays:**
- **Open Delay:** 300ms (prevents accidental triggers)
- **Close Delay:** 200ms (allows moving to popover content)

**Click Behavior:**
- **Immediate Open:** No delay on click
- **Persistent:** Stays open until Escape or outside click
- **Override Hover:** Click mode takes precedence

**Content Hover:**
- **Keep Open:** Popover stays open when hovering over content
- **Clear Timeout:** Cancel close timer when entering content
- **Resume Close:** Start close timer when leaving content (hover mode only)

---

### Mini-Card Content Pattern

**Structure:**
```tsx
<div className="w-80 p-4 space-y-4">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-primary h-8 w-8 flex items-center justify-center rounded-lg">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-sm">AI Match Score</h4>
        <p className="text-[10px] text-muted-foreground">Quick Analysis</p>
      </div>
    </div>
    <div className="text-2xl font-bold text-primary">85%</div>
  </div>

  {/* Content */}
  <div className="space-y-2">
    {/* Mini content here */}
  </div>

  {/* Footer CTA */}
  <Button size="sm" className="w-full text-xs">
    View Full Analysis →
  </Button>
</div>
```

**Specifications:**
- **Width:** `w-80` (320px - matches popover)
- **Padding:** `p-4` (16px all sides)
- **Spacing:** `space-y-4` (16px between sections)
- **Header Icon:** `h-8 w-8` (32×32px - smaller than card header)
- **Title:** `text-sm font-semibold` (14px)
- **Subtitle:** `text-[10px]` (10px - micro text)

---

## 🔘 Buttons

### Button Hierarchy

**Primary Button (Main Actions):**
```tsx
<Button 
  className="shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs"
>
  <Icon className="h-4 w-4 mr-2" />
  Primary Action
</Button>
```

**Secondary Button (Outlined):**
```tsx
<Button 
  variant="outline"
  size="sm"
  className="h-8 text-xs shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
>
  <Icon className="h-3.5 w-3.5 mr-1.5" />
  Secondary Action
</Button>
```

**Tertiary Button (Ghost):**
```tsx
<Button 
  variant="ghost"
  size="sm"
  className="h-8 text-xs hover:bg-primary/10 transition-colors"
>
  Tertiary Action
</Button>
```

**Icon-Only Button:**
```tsx
<Button
  variant="ghost"
  size="sm"
  className="h-8 w-8 p-0"
>
  <Icon className="h-4 w-4" />
</Button>
```

---

### Button Sizes (Standardized)

```tsx
// Small (Height: 32px)
size="sm" className="h-8 text-xs"

// Medium (Height: 36px - Default)
size="md" className="h-9 text-xs"

// Large (Height: 40px)
size="lg" className="h-10 text-sm"
```

---

### Button Variants

**1. Solid (Default Primary):**
```tsx
<Button>
  Default Button
</Button>
```

**2. Outline:**
```tsx
<Button variant="outline">
  Outline Button
</Button>
```

**3. Ghost:**
```tsx
<Button variant="ghost">
  Ghost Button
</Button>
```

**4. Link:**
```tsx
<Button variant="link">
  Link Button
</Button>
```

**5. Destructive:**
```tsx
<Button variant="destructive">
  Delete
</Button>
```

---

### Button with Icon Standards

**Icon Sizes by Button Size:**
```tsx
// Small button (h-8)
<Icon className="h-3.5 w-3.5 mr-1.5" />

// Medium button (h-9)
<Icon className="h-4 w-4 mr-2" />

// Large button (h-10)
<Icon className="h-5 w-5 mr-2" />
```

**Example:**
```tsx
<Button variant="outline" size="sm" className="h-8 text-xs">
  <Eye className="h-3.5 w-3.5 mr-1.5" />
  View Details
</Button>
```

---

## 🏷️ Badges

### Badge Standards

**Size:** Always `text-xs` (12px)

**Basic Badge:**
```tsx
<Badge variant="outline" className="font-medium">
  Badge Text
</Badge>
```

---

### Badge Variants by Status

**1. Success (Green):**
```tsx
<Badge 
  variant="outline" 
  className="bg-green-500/10 text-green-600 border-0 font-medium"
>
  ✓ On Track
</Badge>
```

**2. Warning (Amber):**
```tsx
<Badge 
  variant="outline" 
  className="bg-amber-500/10 text-amber-600 border-0 font-medium"
>
  ⚠ At Risk
</Badge>
```

**3. Danger (Red):**
```tsx
<Badge 
  variant="outline" 
  className="bg-red-500/10 text-red-600 border-0 font-medium"
>
  ✗ Delayed
</Badge>
```

**4. Info (Blue):**
```tsx
<Badge 
  variant="outline" 
  className="bg-blue-500/10 text-blue-600 border-0 font-medium"
>
  ℹ Info
</Badge>
```

**5. Primary (Brand Color):**
```tsx
<Badge 
  variant="secondary" 
  className="bg-primary/10 text-primary border-0 font-medium"
>
  Featured
</Badge>
```

---

### Badge Sizes

**Micro Badge (Counter):**
```tsx
<Badge 
  variant="secondary" 
  className="h-5 min-w-5 rounded-full px-2 text-xs font-normal bg-primary/10 text-primary border-0"
>
  3
</Badge>
```

**Small Badge (Status):**
```tsx
<Badge 
  variant="outline" 
  className="text-[10px] px-1.5 py-0 h-4"
>
  7 days
</Badge>
```

**Standard Badge:**
```tsx
<Badge variant="outline" className="text-xs">
  Standard
</Badge>
```

---

### Badge with Icon

```tsx
<Badge variant="secondary" className="bg-primary/10 text-primary border-0">
  <Zap className="h-3 w-3 mr-1" />
  Powered
</Badge>
```

---

## 📐 Borders & Outlines

### Border Styles

**Standard Border:**
```tsx
className="border border-border/50"
// or
className="border border-border/40"
```

**Separator Border:**
```tsx
className="border-b border-border/40"
// or
className="border-b border-border/30"
```

**Dashed Border (Empty States):**
```tsx
className="border-2 border-dashed border-border/50"
```

---

### Gradient Borders (Bauhaus Style)

**Standard Gradient Border:**
```css
border: 2px solid transparent;
border-radius: 0.5rem;
background-image: 
  linear-gradient(hsl(var(--card)), hsl(var(--card))),
  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%);
background-origin: border-box;
background-clip: padding-box, border-box;
```

**Implementation:**
```tsx
<div
  style={{
    border: '2px solid transparent',
    borderRadius: '0.5rem',
    backgroundImage: `
      linear-gradient(hsl(var(--card)), hsl(var(--card))),
      linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  }}
>
  {/* Content */}
</div>
```

**Border Radius Values:**
```tsx
rounded-sm  = 0.125rem (2px)
rounded     = 0.25rem  (4px)
rounded-md  = 0.375rem (6px)
rounded-lg  = 0.5rem   (8px)   ← Standard for cards
rounded-xl  = 0.75rem  (12px)  ← For icon containers
rounded-2xl = 1rem     (16px)  ← For modals
rounded-full = 9999px          ← For circles (avatars, badges)
```

---

### Ring (Outline) Effects

**Icon Container Rings:**
```tsx
className="ring-1 ring-primary/20"      // Subtle outline
className="ring-2 ring-primary/30"      // Medium outline
className="ring-4 ring-primary/30"      // Prominent outline (avatars)
```

**Focus Rings:**
```tsx
className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
```

---

## 📏 Spacing & Layout

### Spacing Scale (Tailwind)

**Gap (Between Elements):**
```tsx
gap-1  = 0.25rem (4px)   // Tight (skill tags, inline badges)
gap-2  = 0.5rem  (8px)   // Close (button groups, small items)
gap-3  = 0.75rem (12px)  // Comfortable (card header elements)
gap-4  = 1rem    (16px)  // Standard (grid items, sections)
gap-5  = 1.25rem (20px)  // Spacious (main sections)
gap-6  = 1.5rem  (24px)  // Generous (major sections)
gap-8  = 2rem    (32px)  // Very spacious (page sections)
```

**Padding (Inside Elements):**
```tsx
p-2   = 0.5rem  (8px)   // Compact (small icons, mini badges)
p-2.5 = 0.625rem(10px)  // Medium icons
p-3   = 0.75rem (12px)  // Icon containers
p-4   = 1rem    (16px)  // Nested cards, sections
p-5   = 1.25rem (20px)  // Standard cards, main content
p-6   = 1.5rem  (24px)  // Spacious sections
p-7   = 1.75rem (28px)  // Featured cards
p-8   = 2rem    (32px)  // Page containers
```

**Margin (Outside Elements):**
```tsx
mb-1    = 0.25rem (4px)   // Tight spacing
mb-1.5  = 0.375rem(6px)   // Small spacing
mb-2    = 0.5rem  (8px)   // Close spacing
mb-3    = 0.75rem (12px)  // Standard spacing
mb-4    = 1rem    (16px)  // Medium spacing
mb-5    = 1.25rem (20px)  // Spacious
mb-6    = 1.5rem  (24px)  // Very spacious
mb-8    = 2rem    (32px)  // Section spacing
```

---

### Layout Patterns

**Page Container:**
```tsx
<div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
  <div className="container mx-auto px-6 py-8 space-y-8">
    {/* Page content */}
  </div>
</div>
```

**Grid Layouts:**
```tsx
// 2-Column → 4-Column (Stats)
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

// 1-Column → 2-Column → 3-Column
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Main + Sidebar (2/3 + 1/3)
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">{/* Main */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

**Section Spacing:**
```tsx
<div className="space-y-4">   // Within cards (16px between items)
<div className="space-y-6">   // Between sections (24px)
<div className="space-y-8">   // Between major sections (32px)
```

---

### Container Widths

```tsx
// Full Width Container
<div className="container mx-auto px-6 py-8">

// Max Width Containers
<div className="max-w-md mx-auto">    // 448px - Forms, modals
<div className="max-w-lg mx-auto">    // 512px - Medium content
<div className="max-w-xl mx-auto">    // 576px - Wide content
<div className="max-w-2xl mx-auto">   // 672px - Very wide
<div className="max-w-4xl mx-auto">   // 896px - Full width
<div className="max-w-7xl mx-auto">   // 1280px - Max content
```

---

## ✨ Hover Effects & Animations

### Card Hover Effects

**Standard Card Hover:**
```tsx
className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
```

**Nested Card Hover:**
```tsx
className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
```

**Stat Card Hover:**
```tsx
className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
```

---

### Icon Hover Effects

**Icon Scale on Card Hover:**
```tsx
// Card wrapper
<Card className="group ...">

// Icon container
<div className="group-hover:scale-110 transition-transform">
  <Icon />
</div>
```

**Button Icon (No Scale):**
- Icons in buttons do NOT scale on hover
- Only icon containers in cards scale

---

### Button Hover Effects

**Primary Button:**
```tsx
className="shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
```

**Outline Button:**
```tsx
className="shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
```

**Ghost Button:**
```tsx
className="hover:bg-primary/10 transition-colors"
```

---

### Transition Standards

**Standard Transition:**
```tsx
className="transition-all duration-300"
```

**Color Transition Only:**
```tsx
className="transition-colors"
```

**Transform Transition Only:**
```tsx
className="transition-transform duration-300"
```

**Smooth Custom Transition:**
```tsx
style={{ transition: 'var(--transition-smooth)' }}
// or
className="ease-smooth" // cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🎯 Icons

### Icon Sizes by Context

**Page Header Icons:**
```tsx
<Icon className="h-7 w-7 text-primary" />
// Container: p-2.5 rounded-xl
```

**Card Header Icons:**
```tsx
<Icon className="h-6 w-6 text-white" />
// Container: h-[40px] w-[40px], solid bg-primary
```

**Section Title Icons:**
```tsx
<Icon className="h-5 w-5 text-primary" />
// Container: p-2.5 rounded-xl
```

**Stat Icons:**
```tsx
<Icon className="h-5 w-5 text-{color}" />
// Container: h-[32px] w-[32px]
```

**Button Icons (Small):**
```tsx
<Icon className="h-3.5 w-3.5 mr-1.5" />
// In sm buttons
```

**Button Icons (Medium):**
```tsx
<Icon className="h-4 w-4 mr-2" />
// In default buttons
```

**Inline Icons:**
```tsx
<Icon className="h-3 w-3" />    // Micro icons
<Icon className="h-3.5 w-3.5" /> // Small inline
<Icon className="h-4 w-4" />     // Standard inline
```

---

### Icon Container Patterns

**Standard Icon Container (Primary):**
```tsx
<div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
  <Icon className="h-5 w-5 text-primary" />
</div>
```

**Solid Icon Container (Card Header):**
```tsx
<div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
  <Icon className="h-6 w-6 text-white" />
</div>
```

**Small Icon Container:**
```tsx
<div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
  <Icon className="h-4 w-4 text-primary" />
</div>
```

**Color-Coded Icon Containers:**
```tsx
// Blue
<div className="bg-blue-500/10 p-3 rounded-xl ring-1 ring-blue-500/20">
  <Icon className="h-5 w-5 text-blue-600" />
</div>

// Amber
<div className="bg-amber-500/10 p-3 rounded-xl ring-1 ring-amber-500/20">
  <Icon className="h-5 w-5 text-amber-600" />
</div>

// Green
<div className="bg-green-500/10 p-3 rounded-xl ring-1 ring-green-500/20">
  <Icon className="h-5 w-5 text-green-600" />
</div>

// Purple
<div className="bg-purple-500/10 p-3 rounded-xl ring-1 ring-purple-500/20">
  <Icon className="h-5 w-5 text-purple-600" />
</div>
```

---

## 🌑 Shadows

### Shadow Hierarchy

**Resting State:**
```tsx
className="shadow-sm"
// 0 1px 3px 0 hsl(var(--primary) / 0.1)
```

**Subtle Elevation:**
```tsx
className="shadow-md"
// 0 4px 6px -1px hsl(var(--primary) / 0.1)
```

**Elevated:**
```tsx
className="shadow-lg"
// 0 10px 15px -3px hsl(var(--primary) / 0.1)
```

**Highly Elevated (Hover):**
```tsx
className="shadow-xl"
// 0 20px 25px -5px hsl(var(--primary) / 0.1)
```

**Dramatic Shadow (Navigation Arrows):**
```tsx
className="shadow-2xl"
// 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

---

### Shadow on Hover Patterns

**Card Shadow:**
```tsx
className="shadow-sm hover:shadow-lg transition-all duration-300"
```

**Button Shadow:**
```tsx
className="shadow-md hover:shadow-xl transition-all"
```

**Icon Container Shadow:**
```tsx
className="shadow-md" // Static, no hover change
```

---

## 📊 Component-Specific Patterns

### Stats Card Pattern

```tsx
<div
  className="relative overflow-hidden transition-all duration-300"
  style={{
    border: '2px solid transparent',
    borderRadius: '0.5rem',
    backgroundImage: `
      linear-gradient(hsl(var(--card)), hsl(var(--card))),
      linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  }}
>
  <Card className="bg-transparent border-0">
    <CardContent className="p-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Label
          </p>
        </div>
        <div>
          <p className="text-xl font-bold tracking-tight">Value</p>
          {trend && (
            <div className="flex items-center gap-1 text-xs mt-1.5 font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12%</span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

---

### Section Header Pattern

```tsx
<div className="flex items-center justify-between mb-5">
  <div className="flex items-center gap-3">
    <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h2 className="font-bold text-base tracking-tight">Section Title</h2>
      <p className="text-xs text-muted-foreground mt-0.5">
        Section description
      </p>
    </div>
  </div>
  <Badge variant="outline" className="font-medium">
    Count
  </Badge>
</div>
```

---

### Progress Bar Pattern

```tsx
<div>
  <div className="flex items-center justify-between text-xs mb-1.5">
    <span className="text-muted-foreground">Progress</span>
    <span className="font-medium">68%</span>
  </div>
  <Progress value={68} className="h-2" />
</div>
```

---

### Info Box Pattern (Muted Background)

```tsx
<div className="bg-muted/30 rounded-lg p-2.5 space-y-1">
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <Icon className="h-3 w-3" />
    <span>Label</span>
  </div>
  <p className="text-sm font-medium leading-tight">
    Content text
  </p>
</div>
```

---

## 🎭 Responsive Design

### Breakpoints

```tsx
// Mobile First Approach
sm:   640px   // Small tablets
md:   768px   // Tablets
lg:   1024px  // Laptops
xl:   1280px  // Desktops
2xl:  1536px  // Large desktops
```

### Common Responsive Patterns

**Grid Columns:**
```tsx
// 2 → 4 columns
className="grid grid-cols-2 lg:grid-cols-4 gap-4"

// 1 → 2 → 3 columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Main + Sidebar (Stacked → Side-by-side)
className="grid grid-cols-1 lg:grid-cols-3 gap-8"
```

**Text Sizes:**
```tsx
// Responsive heading
className="text-2xl md:text-3xl lg:text-4xl font-bold"

// Responsive description
className="text-sm md:text-base"
```

**Spacing:**
```tsx
// Responsive padding
className="px-4 md:px-6 lg:px-8"

// Responsive gap
className="gap-4 lg:gap-6"
```

**Visibility:**
```tsx
// Hide on mobile, show on desktop
className="hidden lg:block"

// Show on mobile, hide on desktop
className="block lg:hidden"
```

---

## 🎨 Background Gradients

### Page Backgrounds

```tsx
// Subtle gradient
className="bg-gradient-to-br from-background to-muted/10"

// Section background
className="bg-gradient-to-br from-muted/30 via-muted/20 to-background"
```

### Card Backgrounds

```tsx
// Default card (no gradient)
// Uses hsl(var(--card))

// Card content background (for contrast)
className="bg-background rounded-b-xl"
```

---

## 📋 Complete Component Examples

### Dashboard Stat Card (Complete)

```tsx
import { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, TrendingUp } from 'lucide-react';

function StatCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angle = Math.atan2(y - centerY, x - centerX);
      card.style.setProperty('--rotation', `${angle}rad`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300"
      style={{
        '--rotation': '4.2rad',
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      } as React.CSSProperties}
    >
      <Card className="cursor-pointer bg-transparent border-0">
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Active Projects
              </p>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">6</p>
              <div className="flex items-center gap-1 text-xs mt-1.5 font-medium text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Project Card (Complete)

```tsx
<Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50">
  <CardContent className="p-4 space-y-3">
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-tight line-clamp-1">
          NEOM Smart City Infrastructure
        </h4>
        <div className="flex items-center gap-2 mt-1.5">
          <Building className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground line-clamp-1">
            NEOM Company
          </span>
        </div>
      </div>
      <Badge 
        variant="outline" 
        className="bg-green-500/10 text-green-600 border-0 font-medium whitespace-nowrap"
      >
        On Track
      </Badge>
    </div>

    {/* Progress */}
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">68%</span>
      </div>
      <Progress value={68} className="h-2" />
    </div>

    {/* Info Box */}
    <div className="bg-muted/30 rounded-lg p-2.5 space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3" />
        <span>Next Milestone</span>
      </div>
      <p className="text-sm font-medium leading-tight">
        Foundation Analysis Report
      </p>
    </div>

    {/* Actions */}
    <div className="flex gap-2 pt-1">
      <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
        <Eye className="h-3 w-3 mr-1" />
        View
      </Button>
      <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
        <Upload className="h-3 w-3 mr-1" />
        Upload
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## 🎨 Design Tokens Reference

### CSS Variables (from index.css)

**Colors:**
```css
--primary: 142 65% 47%               /* Brand green */
--primary-foreground: 0 0% 100%      /* White text on primary */
--primary-light: 142 60% 57%         /* Lighter green */
--primary-dark: 142 70% 37%          /* Darker green */

--background: 0 0% 100%              /* Page background */
--foreground: 0 0% 6%                /* Primary text */
--card: 0 0% 94%                     /* Card background */
--card-foreground: 0 0% 6%           /* Card text */

--muted: 0 0% 94%                    /* Muted backgrounds */
--muted-foreground: 0 0% 45%         /* Muted text */

--border: 0 0% 90%                   /* Default border */
--input: 0 0% 90%                    /* Input border */
--ring: 142 65% 47%                  /* Focus rings */
```

**Shadows:**
```css
--shadow-soft: 0 1px 3px 0 hsl(var(--primary) / 0.1)
--shadow-medium: 0 4px 6px -1px hsl(var(--primary) / 0.1)
--shadow-large: 0 10px 15px -3px hsl(var(--primary) / 0.1)
--shadow-glow: 0 0 20px hsl(var(--primary) / 0.3)
```

**Transitions:**
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-bounce: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

**Border Radius:**
```css
--radius: 0.5rem                     /* 8px - Standard */
```

---

## 🛠️ Utility Classes Reference

### Text Utilities

```tsx
// Truncation
line-clamp-1                         // Single line
line-clamp-2                         // Two lines
line-clamp-3                         // Three lines
truncate                             // Ellipsis

// Line Height
leading-tight                        // 1.25
leading-normal                       // 1.5
leading-relaxed                      // 1.625

// Letter Spacing
tracking-tight                       // -0.025em (for bold text)
tracking-normal                      // 0
tracking-wide                        // 0.025em
```

### Opacity Utilities

```tsx
// Background Opacity
bg-primary/10                        // 10% opacity
bg-primary/20                        // 20% opacity
bg-green-500/10                      // Status colors at 10%

// Ring Opacity
ring-primary/20                      // 20% opacity
ring-green-500/20                    // Status ring at 20%

// Border Opacity
border-border/30                     // 30% opacity
border-border/40                     // 40% opacity (standard)
border-border/50                     // 50% opacity
```

---

## 📱 Mobile Responsiveness Standards

### Touch Targets

**Minimum touch target size: 44px × 44px**

```tsx
// Buttons
className="h-8"              // Desktop: 32px (OK with padding)
className="h-10"             // Mobile-friendly: 40px
className="h-12"             // Large touch: 48px

// Icon buttons (Always >= 44px)
className="h-10 w-10"        // 40px (with p-2 → 44px touch area)
className="h-12 w-12"        // 48px (preferred for mobile)
```

### Mobile Layouts

**Stack on Mobile:**
```tsx
className="flex flex-col lg:flex-row gap-4"
```

**Adjust Grid:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

**Hide/Show:**
```tsx
className="hidden lg:block"          // Desktop only
className="lg:hidden"                // Mobile only
```

---

## ✅ Design Checklist

### For Every New Component:

- [ ] **Typography:** Uses text-base (16px) for titles, text-xs (12px) for labels
- [ ] **Cards:** Uses Bauhaus gradient border OR standard border-border/50
- [ ] **Padding:** Cards use p-5, nested cards use p-4
- [ ] **Icons:** Proper size (h-5 w-5 for cards, h-4 w-4 for buttons)
- [ ] **Icon Containers:** bg-primary/10 with ring-1 ring-primary/20
- [ ] **Buttons:** text-xs for button text
- [ ] **Badges:** text-xs with appropriate color coding
- [ ] **Spacing:** Consistent gap-3, gap-4, or gap-5
- [ ] **Hover:** Includes hover:shadow-lg hover:-translate-y-0.5 transition-all
- [ ] **Transitions:** Uses duration-300
- [ ] **Responsive:** Works on mobile (grid-cols-1, flex-col)
- [ ] **Dark Mode:** Uses HSL color variables (not hard-coded colors)
- [ ] **Accessibility:** Proper ARIA labels, focus states, color contrast

---

## 🚀 Quick Reference

### Most Common Patterns

**1. Card Header with Icon:**
```tsx
<CardHeader className="p-5 pb-3 border-b border-border/40">
  <div className="flex items-center gap-3">
    <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <CardTitle className="text-base font-bold tracking-tight">Title</CardTitle>
      <p className="text-xs text-muted-foreground mt-0.5">Subtitle</p>
    </div>
  </div>
</CardHeader>
```

**2. Action Buttons Row:**
```tsx
<div className="flex gap-2 pt-1">
  <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
    <Icon className="h-3 w-3 mr-1" />
    Action 1
  </Button>
  <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
    <Icon className="h-3 w-3 mr-1" />
    Action 2
  </Button>
</div>
```

**3. Status Badge:**
```tsx
<Badge 
  variant="outline" 
  className="bg-green-500/10 text-green-600 border-0 font-medium"
>
  Active
</Badge>
```

**4. Stat Display:**
```tsx
<div>
  <p className="text-3xl font-bold tracking-tight">1,234</p>
  <p className="text-xs text-muted-foreground">Label</p>
</div>
```

---

## 🎯 Color-Coding Guidelines

### When to Use Each Color

**Primary (Green - #1e9e6b):**
- ✅ Main CTAs and actions
- ✅ Brand elements
- ✅ Navigation highlights
- ✅ Primary information

**Blue:**
- ✅ General information
- ✅ Available items
- ✅ Neutral actions
- ✅ Links

**Green (Success):**
- ✅ Success states
- ✅ Revenue/earnings
- ✅ Completed items
- ✅ Positive trends

**Amber (Warning):**
- ✅ Pending items
- ✅ Warnings
- ✅ Needs attention
- ✅ At-risk status

**Red (Danger):**
- ✅ Errors
- ✅ Destructive actions
- ✅ Overdue items
- ✅ Critical alerts

**Purple:**
- ✅ Profile-related
- ✅ Personal items
- ✅ Special features
- ✅ Premium elements

---

## 📚 Import Paths

### Component Imports

```tsx
// shadcn/ui Components
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';

// Icons
import { Icon1, Icon2 } from 'lucide-react';

// Navigation
import { Link } from 'react-router-dom';
```

---

## 🎨 Theme-Aware Styling

### Using HSL Variables (Dark Mode Compatible)

**✅ Correct (Theme-Aware):**
```tsx
<div className="bg-primary text-primary-foreground" />
<div style={{ color: 'hsl(var(--primary))' }} />
```

**❌ Wrong (Hard-Coded):**
```tsx
<div className="bg-[#1e9e6b] text-white" />
<div style={{ color: '#1e9e6b' }} />
```

---

## 🔄 Before/After Examples

### ❌ Before (Inconsistent)

```tsx
<div className="p-6 rounded-md border">
  <h2 className="text-lg font-semibold mb-4">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded">
    Click Me
  </button>
</div>
```

### ✅ After (Standardized)

```tsx
<Card className="border-border/50">
  <CardHeader className="p-5 pb-3 border-b border-border/40">
    <CardTitle className="text-base font-bold tracking-tight">
      Title
    </CardTitle>
  </CardHeader>
  <CardContent className="p-5">
    <Button className="text-xs">
      <Icon className="h-4 w-4 mr-2" />
      Click Me
    </Button>
  </CardContent>
</Card>
```

---

## 📐 Measurement Standards

### Size Standards (Exact Values)

| Element | Size | TailwindCSS | Pixels |
|---------|------|-------------|--------|
| **Card Header Icon** | Large | h-[40px] w-[40px] | 40×40px |
| **Stat Icon** | Medium | h-[32px] w-[32px] | 32×32px |
| **Page Icon** | Extra Large | h-7 w-7 | 28×28px |
| **Section Icon** | Medium | h-5 w-5 | 20×20px |
| **Button Icon (sm)** | Small | h-3.5 w-3.5 | 14×14px |
| **Button Icon (md)** | Medium | h-4 w-4 | 16×16px |
| **Inline Icon** | Micro | h-3 w-3 | 12×12px |
| **Icon Container Padding** | Variable | p-2, p-2.5, p-3 | 8px, 10px, 12px |

---

## 🎯 Common Mistakes to Avoid

### ❌ Don't Do This:

```tsx
// 1. Wrong typography sizes
<h1 className="text-2xl">Title</h1>                    // Should be text-base
<button className="text-sm">Button</button>           // Should be text-xs

// 2. Inconsistent padding
<Card><div className="p-6">                           // Should be p-5
<Card><div className="p-3">                           // Should be p-4 or p-5

// 3. Missing hover effects
<Card className="border">                             // Should have hover:shadow-lg hover:-translate-y-0.5

// 4. Hard-coded colors
<div className="bg-[#1e9e6b]">                        // Should use bg-primary
<div style={{ color: '#1e9e6b' }}>                    // Should use hsl(var(--primary))

// 5. Inconsistent spacing
<div className="gap-6">                               // Standard is gap-3, gap-4, or gap-5
<div className="mb-7">                                // Standard is mb-3, mb-4, or mb-5

// 6. Wrong icon sizes
<Icon className="h-6 w-6" />                          // Should match context (h-4 w-4, h-5 w-5, etc.)
```

### ✅ Do This Instead:

```tsx
// 1. Correct typography
<h1 className="text-base font-bold tracking-tight">Title</h1>
<Button className="text-xs">Button</Button>

// 2. Standard padding
<CardHeader className="p-5 pb-3">
<CardContent className="p-5">

// 3. Hover effects
<Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

// 4. Theme-aware colors
<div className="bg-primary text-primary-foreground" />
<div style={{ color: 'hsl(var(--primary))' }} />

// 5. Standard spacing
<div className="gap-4">
<div className="mb-5">

// 6. Context-appropriate icons
<Icon className="h-5 w-5" />  // In cards
<Icon className="h-4 w-4" />  // In buttons
```

---

## 🎨 Advanced Patterns

### Horizontal Scroll Container

```tsx
<div className="relative">
  {/* Navigation Arrows */}
  <Button
    size="sm"
    variant="outline"
    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/98 backdrop-blur-md shadow-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
  >
    <ChevronLeft className="h-6 w-6 text-primary" />
  </Button>

  {/* Scroll Container */}
  <div 
    className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 py-6"
  >
    <div className="min-w-[400px] w-[400px] shrink-0 snap-start">
      {/* Card content */}
    </div>
  </div>
</div>
```

---

### Backdrop Blur Pattern

```tsx
<div className="bg-background/98 backdrop-blur-md">
  {/* Content with blurred background */}
</div>
```

---

### Trend Indicators

```tsx
// Positive Trend
<div className="flex items-center gap-1 text-xs font-medium text-green-600">
  <TrendingUp className="h-3 w-3" />
  <span>+12%</span>
</div>

// Negative Trend
<div className="flex items-center gap-1 text-xs font-medium text-red-600">
  <TrendingDown className="h-3 w-3" />
  <span>-5%</span>
</div>
```

---

## 🎓 Best Practices Summary

### Typography
- ✅ **16px** for ALL titles (pages, sections, cards)
- ✅ **12px** for ALL labels, badges, buttons
- ✅ **14px** for body text
- ✅ `tracking-tight` for bold text
- ✅ `leading-relaxed` for body text

### Colors
- ✅ Use HSL variables: `hsl(var(--primary))`
- ✅ Status colors at 10% opacity for backgrounds
- ✅ Status colors at 20% opacity for rings
- ✅ Full color for text and borders

### Cards
- ✅ Bauhaus gradient border for special cards
- ✅ `p-5` for card headers and content
- ✅ `p-4` for nested cards
- ✅ `border-border/50` for standard borders
- ✅ `rounded-lg` (0.5rem) for card radius

### Buttons
- ✅ `text-xs` for ALL button text
- ✅ `h-8` for small, `h-9` for medium, `h-10` for large
- ✅ Icon sizes: `h-3.5 w-3.5` (sm), `h-4 w-4` (md)
- ✅ Icon margin: `mr-1.5` (sm), `mr-2` (md)

### Spacing
- ✅ `gap-3` or `gap-4` for card elements
- ✅ `gap-5` for section grids
- ✅ `space-y-4` for vertical stacks in cards
- ✅ `space-y-6` or `space-y-8` for page sections

### Hover Effects
- ✅ Cards: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- ✅ Icon containers: `group-hover:scale-110 transition-transform`
- ✅ Buttons: `shadow-md hover:shadow-xl`

---

## 🔗 Related Documentation

- **Main README** → [1-README.md](1-README.md)
- **Project Guide** → [2-PROJECT_GUIDE.md](2-PROJECT_GUIDE.md)
- **Component UI Guide** → [6-Components-UI.md](6-Components-UI.md)
- **Engineer Portal Audit** → [8-ENGINEER_PORTAL_AUDIT_REPORT.md](8-ENGINEER_PORTAL_AUDIT_REPORT.md)

---

---

## 🎯 Real-World Implementation Examples

### Complete Jobs Page (Product-Card Pattern)

**Location:** `src/pages/5-engineer/2-JobsPage.tsx`

**What Was Implemented:**
- ✅ 4 job tabs (Available, Applied, Shortlisted, Bookmarked)
- ✅ Product-card design across all tabs
- ✅ Hero images with 21:9 aspect ratio
- ✅ Gradient overlays for text readability
- ✅ Status-specific badges and colors
- ✅ 4 Quick Insights popovers (AI Match, Earnings, Skills Gap, Similar Jobs)
- ✅ Theme-colored skill badges
- ✅ Hybrid hover/click popover behavior
- ✅ Comprehensive "View Details" dialog
- ✅ Responsive tab-specific action buttons

**Key Learnings:**
1. **Image Paths by Status:**
   - Available: `/e-jobs/Available Jobs/`
   - Applied: `/e-jobs/Applied/`
   - Shortlisted: `/e-jobs/Shortlisted/`
   - Bookmarked: `/e-jobs/Bookmarked/`

2. **Gradient Overlay is Critical:**
   - Without gradient: Text unreadable on bright images
   - With gradient: Consistent readability across all images

3. **320px Popover Width:**
   - Perfect balance between content and space
   - `w-80` matches mobile-friendly sizing

4. **Quick Insights Layout:**
   - `flex-1` makes all buttons equal width
   - `justify-between` distributes space evenly
   - No default background keeps it clean

5. **Theme-Colored Badges:**
   - `bg-primary/10` + `text-primary` + `border-primary/20`
   - Better than muted colors for brand consistency

---

## 🎓 Design System Evolution

### Version History

**v2.0 (October 12, 2025)** ✨
- ✅ Added Product-Card Design Pattern
- ✅ Added Interactive Popovers section
- ✅ Added Hero Image specifications
- ✅ Added Quick Insights button grid pattern
- ✅ Added Theme-colored skill badges
- ✅ Added Metadata compact row pattern
- ✅ Added Mini-card content pattern
- ✅ Updated with Jobs page implementation examples

**v1.0 (Initial Release)**
- Bauhaus-inspired card patterns
- Typography standards (16px/12px/14px)
- Color system and status colors
- Button and badge hierarchy
- Spacing and layout guidelines

---

## 📚 Component Reference Files

### Where Each Pattern is Used

**Product-Card Design:**
- `src/pages/5-engineer/2-JobsPage.tsx` - All 4 tabs
- Future: Project showcase pages
- Future: Marketplace listings

**Interactive Popovers:**
- `src/pages/5-engineer/others/features/jobs/components/JobInfoPopover.tsx`
- `src/pages/5-engineer/others/features/jobs/components/mini-cards/` (4 mini-cards)

**Standard Cards (Bauhaus Border):**
- `src/pages/5-engineer/1-DashboardPage.tsx` - Stats cards
- Most dashboard pages across all portals

**Icon Containers:**
- Universal across all 710+ components

---

## ✅ Updated Design Checklist

### For Every New Component:

**Typography:**
- [ ] Uses `text-base` (16px) for titles
- [ ] Uses `text-xs` (12px) for labels/buttons
- [ ] Uses `text-sm` (14px) for body text
- [ ] Uses `tracking-tight` for bold text

**Cards:**
- [ ] Bauhaus gradient border OR product-card design OR standard `border-border/50`
- [ ] Padding: `p-5` for standard cards, `p-4` for nested
- [ ] `gap-0` for product-cards (seamless sections)

**Images (Product-Cards):**
- [ ] 21:9 aspect ratio (`aspect-[21/9]`)
- [ ] Gradient overlay (`from-black/60 via-black/20 to-transparent`)
- [ ] Fallback placeholder handling
- [ ] Zoom on hover (`group-hover:scale-105`)

**Popovers:**
- [ ] Fixed width `w-80` (320px)
- [ ] Position `side="top"` with `collisionPadding={20}`
- [ ] Hybrid hover/click behavior
- [ ] 300ms open delay, 200ms close delay

**Icons:**
- [ ] Proper size (h-5 w-5 for cards, h-4 w-4 for buttons)
- [ ] Icon containers: `bg-primary/10` with `ring-1 ring-primary/20`
- [ ] Scale on hover: `group-hover:scale-110` (containers only)

**Buttons:**
- [ ] `text-xs` for ALL button text
- [ ] Icon sizes match button size (h-3.5 for sm, h-4 for md)
- [ ] Proper hover effects (`hover:shadow-xl hover:-translate-y-0.5`)

**Badges:**
- [ ] `text-xs` or `text-[10px]` for compact badges
- [ ] Status color coding (blue/green/amber/red)
- [ ] Theme-colored badges use `bg-primary/10 text-primary border-primary/20`

**Spacing:**
- [ ] `gap-3` or `gap-4` for card elements
- [ ] `space-y-4` for vertical stacks
- [ ] `gap-2` for compact button groups

**Hover Effects:**
- [ ] Cards: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- [ ] Icon containers: `group-hover:scale-110 transition-transform`
- [ ] Buttons: `shadow-md hover:shadow-xl`

**Accessibility:**
- [ ] Proper ARIA labels
- [ ] Focus states (`focus-visible:ring-2`)
- [ ] Color contrast (WCAG AA minimum)
- [ ] Keyboard navigation support

**Dark Mode:**
- [ ] Uses HSL variables (`hsl(var(--primary))`)
- [ ] No hard-coded colors
- [ ] Text colors adapt (`text-foreground`, `text-muted-foreground`)

---

**This style guide ensures visual consistency across all 14 Engineer Portal pages and 710+ components!** 🎨

**Version:** 2.0  
**Maintained By:** Development Team  
**Last Review:** October 12, 2025  
**Latest Addition:** Product-Card Design Pattern & Interactive Popovers (Jobs Page Redesign)

