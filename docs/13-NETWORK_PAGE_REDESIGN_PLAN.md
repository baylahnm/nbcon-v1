# 🌐 Engineer Network Page Redesign Plan

**Last Updated:** October 12, 2025  
**Version:** 1.0  
**Status:** Planning Phase  
**Reference:** Engineer Profile Page (`/engineer/profile`)

---

## 📖 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Dribbble Design Inspiration](#dribbble-design-inspiration)
4. [Redesign Goals](#redesign-goals)
5. [New Design System](#new-design-system)
6. [Component Breakdown](#component-breakdown)
7. [Implementation Plan](#implementation-plan)
8. [Technical Specifications](#technical-specifications)
9. [Data Structure](#data-structure)
10. [Timeline & Milestones](#timeline--milestones)

---

## 🎯 Executive Summary

### Mission
Redesign the Engineer Network Page (`/engineer/network`) to match the polished, modern aesthetic of the Engineer Profile Page while incorporating best-in-class professional networking patterns from Dribbble.

### Key Objectives
- ✅ Apply consistent UI style guide (12-UI_STYLE_GUIDE.md)
- ✅ Match Profile page card styling (gap-0, p-5 headers, Bauhaus borders)
- ✅ Enhance connection cards with richer information
- ✅ Improve tab-based navigation (Connections, Requests, Activity)
- ✅ Add advanced filtering and search capabilities
- ✅ Implement suggested connections AI feature
- ✅ Create engaging activity feed

---

## 📊 Current State Analysis

### Existing Features ✅
1. **Header Section**
   - Title: "My Network" with Users icon
   - Subtitle: "Build and manage your professional connections"
   - Action buttons: Refresh, Find Connections

2. **Stats Grid (6 Stats)**
   - Total connections: 247
   - This week: 8
   - Pending requests: 2
   - Mutual connections: 156
   - Profile views: 89
   - Endorsements: 34

3. **Tabs (3)**
   - Connections (3)
   - Requests (2) - with badge
   - Activity

4. **Connection Cards**
   - Basic info: Name, title, company, location
   - Metadata: Specialty, experience, mutual connections
   - Recent activity badge
   - Actions: Message button, More options menu

5. **Search & Filters**
   - Search bar
   - Specialty filter dropdown
   - Sort dropdown (Most Recent)

### Current Issues ❌
1. **Inconsistent card styling** - Not using updated gap-0, p-5 pattern
2. **No Bauhaus gradient borders** - Missing signature nbcon style
3. **Basic connection cards** - Lack visual hierarchy and engagement
4. **Limited filtering** - Only specialty and sort
5. **No suggested connections** - Missing AI-powered recommendations
6. **Basic activity feed** - Could be more engaging
7. **No visual indicators** - Connection strength, endorsements, etc.
8. **Header not updated** - Not using inline icon style

---

## 🎨 Dribbble Design Inspiration

### Key Patterns Observed

**1. LinkedIn-Style Network Page (Reza Design)**
- Clean card grid layout
- Rich user profiles with avatars
- Connection stats prominently displayed
- Tab-based navigation
- Suggested connections sidebar

**2. Dark Theme Network Visualization (George Railean)**
- Network graph visualization
- Modern dark UI
- Data-rich interface
- Connection strength indicators

**3. Job Network Feed (Helia Sadeghian)**
- Search-first approach
- Filter pills (All, Jobs, My posts, Mentions)
- Card-based content feed
- Time-based sorting

**4. Mobile Network UI (Milo Studio)**
- Avatar grid view option
- Story-style presentation
- Quick actions on profiles
- Smooth animations

### Design Takeaways
- ✅ **Card-based layout** - Clean, scannable
- ✅ **Rich avatars** - Large, prominent profile pictures
- ✅ **Quick actions** - Message, Connect, View Profile
- ✅ **Filter pills** - Easy filtering by category
- ✅ **Connection strength** - Visual indicators
- ✅ **Suggested connections** - AI-powered recommendations
- ✅ **Activity timeline** - Chronological feed
- ✅ **Search-first** - Prominent search bar

---

## 🎯 Redesign Goals

### Visual Consistency
1. Match Profile page header style (inline icon, text-xl, text-xs subtitle)
2. Apply Bauhaus gradient borders to main sections
3. Use gap-0, p-5 pb-3, border-b pattern for card headers
4. Update all cards to p-5 bg-background rounded-b-xl content
5. Standardize button sizes (h-7 text-[11px] for small actions)
6. Consistent icon sizing (h-5 w-5 for card headers, h-3 w-3 for buttons)

### Enhanced User Experience
1. **Richer connection cards** - More information, better hierarchy
2. **Visual connection strength** - Color-coded or progress-based
3. **Suggested connections** - AI-powered sidebar
4. **Advanced filters** - Location, company, specialty, connection strength
5. **Activity feed** - Timeline with rich content (posts, endorsements, projects)
6. **Quick actions** - One-click message, connect, endorse
7. **Grid/List toggle** - Different viewing modes
8. **Bulk actions** - Select multiple connections

### New Features
1. **Endorsement system** - Quick skill endorsements
2. **Connection notes** - Private notes on connections
3. **Tags/Categories** - Organize connections
4. **Export connections** - Download as CSV/PDF
5. **Connection requests with messages** - Context for requests
6. **Mutual connections display** - Show shared network
7. **Recently viewed** - Track profile visits
8. **Network growth chart** - Visualize growth over time

---

## 🎨 New Design System

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Header (p-4)                                            │
│ ┌─────────────┐                                        │
│ │🌐│ My Network                    [🔄][🔍][➕]       │
│ │  │ subtitle                                          │
│ └─────────────┘                                        │
├─────────────────────────────────────────────────────────┤
│ Stats Grid (gap-4) - 6 cards in 2 rows                 │
│ ┌────────┬────────┬────────┬────────┬────────┬────────┐│
│ │ 247    │ 8      │ 2      │ 156    │ 89     │ 34     ││
│ │ Total  │ Week   │ Pending│ Mutual │ Views  │ Endorse││
│ └────────┴────────┴────────┴────────┴────────┴────────┘│
├─────────────────────────────────────────────────────────┤
│ Main Content Area (Bauhaus border card)                │
│ ┌───────────────────────────────────────────────────┐  │
│ │ Tabs: [Connections] [Requests (2)] [Activity]     │  │
│ ├───────────────────────────────────────────────────┤  │
│ │ Search + Filters Row                               │  │
│ ├───────────────────────────────────────────────────┤  │
│ │ ┌───────────┐ ┌───────────┐ ┌───────────┐        │  │
│ │ │Connection │ │Connection │ │Connection │        │  │
│ │ │  Card  1  │ │  Card  2  │ │  Card  3  │        │  │
│ │ └───────────┘ └───────────┘ └───────────┘        │  │
│ │ ┌───────────┐ ┌───────────┐ ┌───────────┐        │  │
│ │ │Connection │ │Connection │ │Connection │        │  │
│ │ │  Card  4  │ │  Card  5  │ │  Card  6  │        │  │
│ │ └───────────┘ └───────────┘ └───────────┘        │  │
│ └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│ Suggested Connections Sidebar (Optional)                │
│ ┌───────────────────────────────────────────────────┐  │
│ │ AI-Powered Suggestions                             │  │
│ │ - Similar engineers                                │  │
│ │ - Mutual connections                               │  │
│ │ - Industry recommendations                         │  │
│ └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Breakdown

### 1. Page Header (Updated Style)

**Current:**
```tsx
<div className="flex items-center gap-3">
  <Users className="h-5 w-5 text-primary" />
  <div>
    <h1 className="text-xl font-bold tracking-tight">My Network</h1>
    <p className="text-xs text-muted-foreground">
      Build and manage your professional connections
    </p>
  </div>
</div>
```

**New (Matching Profile Style):**
```tsx
<div className="p-4">
  <div>
    <h1 className="text-xl font-bold flex items-center gap-2">
      <Users className="h-5 w-5 text-primary" />
      My Network
    </h1>
    <p className="text-xs text-muted-foreground">
      Build and manage your professional connections
    </p>
  </div>
  
  <div className="flex gap-2 mt-4">
    <Button variant="outline" size="sm" className="h-8 text-xs">
      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
      Refresh
    </Button>
    <Button variant="outline" size="sm" className="h-8 text-xs">
      <Search className="h-3.5 w-3.5 mr-1.5" />
      Search Network
    </Button>
    <Button className="h-8 text-xs">
      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
      Find Connections
    </Button>
  </div>
</div>
```

---

### 2. Network Stats Grid (Enhanced)

**New Design:**
```tsx
<div className="grid grid-cols-2 lg:grid-cols-6 gap-4 p-4">
  {stats.map((stat) => (
    <Card 
      key={stat.id}
      className="gap-0"
      style={{
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <CardContent className="p-4 bg-background rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
            <stat.icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
        {stat.trend && (
          <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>+{stat.trend}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  ))}
</div>
```

**Stats List:**
1. **Total Connections** - Users icon, blue/primary theme
2. **New This Week** - UserPlus icon, green theme, with trend
3. **Pending Requests** - Bell icon, amber theme, with badge
4. **Mutual Connections** - Heart icon, purple theme
5. **Profile Views** - Eye icon, blue theme
6. **Endorsements** - Award icon, green theme

---

### 3. Main Network Card (Bauhaus Style)

**New Container:**
```tsx
<Card
  className="gap-0 mt-4"
  style={{
    border: '2px solid transparent',
    borderRadius: '0.75rem',
    backgroundImage: `
      linear-gradient(hsl(var(--card)), hsl(var(--card))),
      linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  }}
>
  <CardHeader className="p-5 pb-3 border-b border-border/40">
    <Tabs>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="connections">
          Connections (247)
        </TabsTrigger>
        <TabsTrigger value="requests">
          Requests (2)
          <Badge className="ml-2">2</Badge>
        </TabsTrigger>
        <TabsTrigger value="activity">
          Activity
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </CardHeader>

  <CardContent className="p-5 space-y-5 bg-background rounded-b-xl">
    {/* Tab content here */}
  </CardContent>
</Card>
```

---

### 4. Enhanced Connection Card

**New Design (Product-Card Inspired):**

```tsx
<Card className="gap-0 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/50">
  {/* Header Section */}
  <CardHeader className="p-5 pb-3 border-b border-border/40">
    <div className="flex items-start justify-between gap-4">
      {/* Left: Avatar + Info */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <Avatar className="h-16 w-16 ring-2 ring-primary/20 shadow-md group-hover:ring-primary/40 transition-all">
          <AvatarImage src={connection.avatar} />
          <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
            {getUserInitials(connection.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Name + Verified Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold tracking-tight truncate">
              {connection.name}
            </h3>
            {connection.verified && (
              <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )}
          </div>

          {/* Title */}
          <p className="text-sm text-foreground/80 truncate mb-0.5">
            {connection.title}
          </p>

          {/* Company */}
          <button className="flex items-center gap-1.5 text-xs text-primary hover:underline transition-colors">
            <Building2 className="h-3 w-3" />
            {connection.company}
          </button>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            {connection.location}
          </div>

          {/* Connection Strength Indicator */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  connection.connectionStrength === 'strong' 
                    ? 'w-full bg-green-500' 
                    : connection.connectionStrength === 'medium'
                    ? 'w-2/3 bg-amber-500'
                    : 'w-1/3 bg-blue-500'
                }`}
              />
            </div>
            <span className="text-[10px] text-muted-foreground capitalize">
              {connection.connectionStrength} connection
            </span>
          </div>
        </div>
      </div>

      {/* Right: Connection Badge + Last Active */}
      <div className="flex flex-col items-end gap-2">
        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
          Connected
        </Badge>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {connection.lastActive}
        </div>
      </div>
    </div>
  </CardHeader>

  {/* Content Section */}
  <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
    {/* Metadata Grid */}
    <div className="grid grid-cols-3 gap-4 py-3 border-y border-border/40">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Target className="h-3.5 w-3.5" />
          <span>Specialty</span>
        </div>
        <div className="font-medium text-sm">{connection.specialty}</div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Experience</span>
        </div>
        <div className="font-medium text-sm">{connection.experience}</div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Users className="h-3.5 w-3.5" />
          <span>Mutual</span>
        </div>
        <div className="font-medium text-sm text-primary">
          {connection.mutualConnections} connections
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    {connection.recentActivity && (
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
        <Activity className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {connection.recentActivity}
        </p>
      </div>
    )}

    {/* Skills/Certifications Pills */}
    {connection.certifications && connection.certifications.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {connection.certifications.map((cert, idx) => (
          <button 
            key={idx}
            className="px-3 py-1 rounded-full text-[10px] font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            {cert}
          </button>
        ))}
      </div>
    )}

    {/* Quick Stats Row */}
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          <span>{connection.projects} projects</span>
        </div>
        <div className="flex items-center gap-1">
          <Award className="h-3 w-3" />
          <span>{connection.endorsements} endorsements</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Calendar className="h-3 w-3" />
        <span>Connected {formatDate(connection.connectionDate)}</span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2 pt-2">
      <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
        <MessageSquare className="h-3 w-3 mr-1" />
        Message
      </Button>
      <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
        <ExternalLink className="h-3 w-3 mr-1" />
        View Profile
      </Button>
      <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
        <Award className="h-3 w-3 mr-1" />
        Endorse
      </Button>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  </CardContent>
</Card>
```

**Key Features:**
- ✅ Larger avatar (16×16 with ring effect)
- ✅ Verified badge for SCE-licensed engineers
- ✅ Connection strength visual indicator
- ✅ 3-column metadata grid
- ✅ Recent activity callout box
- ✅ Certification badges (theme-colored)
- ✅ Quick stats row
- ✅ 4 action buttons (Message, View Profile, Endorse, More)

---

### 5. Connection Request Card

**Design:**
```tsx
<Card className="gap-0 border-l-4 border-l-primary hover:shadow-md transition-all">
  <CardContent className="p-4 bg-background rounded-xl">
    <div className="flex items-start justify-between gap-4">
      {/* Left: Requester Info */}
      <div className="flex items-start gap-3 flex-1">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
          <AvatarImage src={request.requester.avatar} />
          <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
            {getUserInitials(request.requester.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold truncate">
              {request.requester.name}
            </h4>
            {request.requester.verified && (
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {request.requester.title} @ {request.requester.company}
          </p>
          
          {/* Request Message */}
          {request.message && (
            <p className="text-xs text-foreground/70 mt-2 line-clamp-2">
              "{request.message}"
            </p>
          )}

          {/* Mutual Connections */}
          <div className="flex items-center gap-1 text-[10px] text-primary mt-2">
            <Users className="h-3 w-3" />
            <span>{request.mutualConnections} mutual connections</span>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            <span>{request.timestamp}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2 mt-4">
      <Button className="flex-1 h-7 text-[11px]">
        <UserCheck className="h-3 w-3 mr-1" />
        Accept
      </Button>
      <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px]">
        <X className="h-3 w-3 mr-1" />
        Decline
      </Button>
      <Button variant="ghost" size="sm" className="h-7 text-[11px]">
        <ExternalLink className="h-3 w-3 mr-1" />
        View Profile
      </Button>
    </div>
  </CardContent>
</Card>
```

**Key Features:**
- ✅ Left border accent (primary color)
- ✅ Requester message display
- ✅ Mutual connections count
- ✅ Timestamp
- ✅ 3 action buttons (Accept, Decline, View Profile)

---

### 6. Activity Feed Item

**Design:**
```tsx
<div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
  {/* Activity Icon (Color-coded) */}
  <div className={`${getActivityColor(activity.type).bg} p-2.5 rounded-full ring-1 ${getActivityColor(activity.type).ring}`}>
    <activity.icon className={`h-4 w-4 ${getActivityColor(activity.type).icon}`} />
  </div>

  {/* Activity Content */}
  <div className="flex-1 min-w-0">
    <div className="flex items-start justify-between gap-2 mb-1">
      <p className="text-sm leading-relaxed">
        <span className="font-semibold">{activity.user.name}</span>
        {' '}
        <span className="text-muted-foreground">{activity.content}</span>
      </p>
      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
        {activity.timestamp}
      </span>
    </div>

    {/* Related Content (if any) */}
    {activity.relatedTo && (
      <button className="text-xs text-primary hover:underline mt-1">
        {activity.relatedTo}
      </button>
    )}
  </div>

  {/* User Avatar (Small) */}
  <Avatar className="h-8 w-8 ring-1 ring-border">
    <AvatarImage src={activity.user.avatar} />
    <AvatarFallback className="text-xs">
      {getUserInitials(activity.user.name)}
    </AvatarFallback>
  </Avatar>
</div>
```

**Activity Types & Colors:**
- **Connection** - Blue (Users icon)
- **Project** - Green (Briefcase icon)
- **Certification** - Purple (Award icon)
- **Endorsement** - Amber (Star icon)
- **Post** - Primary (FileText icon)

---

### 7. Search & Filters Section

**Enhanced Design:**
```tsx
<div className="space-y-4">
  {/* Search Bar */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search connections by name, company, or specialty..."
      className="pl-10 h-10"
    />
  </div>

  {/* Filter Pills Row */}
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-xs font-medium text-muted-foreground">Filters:</span>
    
    {/* Specialty Filter */}
    <Select value={filters.specialty} onValueChange={(v) => setFilters({...filters, specialty: v})}>
      <SelectTrigger className="w-[180px] h-8 text-xs">
        <SelectValue placeholder="All Specialties" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Specialties</SelectItem>
        <SelectItem value="structural">Structural Engineering</SelectItem>
        <SelectItem value="electrical">Electrical Engineering</SelectItem>
        <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
        <SelectItem value="civil">Civil Engineering</SelectItem>
        <SelectItem value="project-mgmt">Project Management</SelectItem>
      </SelectContent>
    </Select>

    {/* Location Filter */}
    <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <SelectValue placeholder="All Locations" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Locations</SelectItem>
        <SelectItem value="riyadh">Riyadh</SelectItem>
        <SelectItem value="jeddah">Jeddah</SelectItem>
        <SelectItem value="dammam">Dammam</SelectItem>
        <SelectItem value="khobar">Khobar</SelectItem>
      </SelectContent>
    </Select>

    {/* Connection Strength Filter */}
    <Select value={filters.strength} onValueChange={(v) => setFilters({...filters, strength: v})}>
      <SelectTrigger className="w-[180px] h-8 text-xs">
        <SelectValue placeholder="All Connections" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Connections</SelectItem>
        <SelectItem value="strong">Strong Connections</SelectItem>
        <SelectItem value="medium">Medium Connections</SelectItem>
        <SelectItem value="weak">Weak Connections</SelectItem>
      </SelectContent>
    </Select>

    {/* Sort Order */}
    <Select value={filters.sort} onValueChange={(v) => setFilters({...filters, sort: v})}>
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Most Recent</SelectItem>
        <SelectItem value="alphabetical">Alphabetical</SelectItem>
        <SelectItem value="mutual">Most Mutual</SelectItem>
        <SelectItem value="active">Most Active</SelectItem>
      </SelectContent>
    </Select>

    {/* View Toggle */}
    <div className="ml-auto flex gap-1 border rounded-lg p-1">
      <Button 
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => setViewMode('grid')}
      >
        <LayoutGrid className="h-3 w-3" />
      </Button>
      <Button 
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => setViewMode('list')}
      >
        <List className="h-3 w-3" />
      </Button>
    </div>

    {/* Active Filters Display */}
    {hasActiveFilters && (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Active:</span>
        {Object.entries(filters).map(([key, value]) => 
          value !== 'all' && value ? (
            <Badge 
              key={key}
              variant="secondary"
              className="gap-1 text-[10px]"
            >
              {value}
              <button 
                onClick={() => clearFilter(key)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ) : null
        )}
        <Button 
          variant="ghost" 
          size="sm"
          className="h-6 text-[10px] text-muted-foreground"
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </div>
    )}
  </div>
</div>
```

---

### 8. Suggested Connections Sidebar (New)

**Design:**
```tsx
<Card
  className="gap-0"
  style={{
    border: '2px solid transparent',
    borderRadius: '0.75rem',
    backgroundImage: `
      linear-gradient(hsl(var(--card)), hsl(var(--card))),
      linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  }}
>
  <CardHeader className="p-5 pb-3 border-b border-border/40">
    <div className="flex items-center gap-3">
      <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div>
        <CardTitle className="text-base font-bold tracking-tight">
          People You May Know
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          AI-powered recommendations
        </p>
      </div>
    </div>
  </CardHeader>

  <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
    {suggestedConnections.map((suggestion) => (
      <div key={suggestion.id} className="flex items-start gap-3 pb-4 border-b border-border/30 last:border-0">
        <Avatar className="h-12 w-12 ring-1 ring-border">
          <AvatarImage src={suggestion.avatar} />
          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
            {getUserInitials(suggestion.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-semibold truncate">{suggestion.name}</h5>
          <p className="text-xs text-muted-foreground truncate">
            {suggestion.title}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-primary mt-1">
            <Users className="h-3 w-3" />
            <span>{suggestion.mutualConnections} mutual</span>
          </div>
          
          <div className="flex gap-1.5 mt-2">
            <Button size="sm" className="h-6 text-[10px] px-2">
              <UserPlus className="h-3 w-3 mr-1" />
              Connect
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    ))}

    <Button variant="outline" className="w-full h-7 text-[11px]">
      <Sparkles className="h-3 w-3 mr-1" />
      View All Suggestions
    </Button>
  </CardContent>
</Card>
```

---

## 🛠️ Implementation Plan

### Phase 1: Foundation (Day 1)

**1.1 Update Page Container & Header**
- ✅ Apply p-4 padding to main container
- ✅ Update header to inline icon style (text-xl, h-5 w-5 icon)
- ✅ Update action buttons to h-8 text-xs with h-3.5 w-3.5 icons
- **File:** `src/pages/5-engineer/6-NetworkPage.tsx`

**1.2 Refactor Stats Grid**
- ✅ Apply Bauhaus gradient border to each stat card
- ✅ Update to gap-0, p-4 padding
- ✅ Add trend indicators where applicable
- ✅ Reduce text sizes (text-2xl for numbers, text-xs for labels)

**1.3 Update Main Network Card Wrapper**
- ✅ Wrap Tabs + Content in Bauhaus gradient border Card
- ✅ Move TabsList to CardHeader with p-5 pb-3 border-b
- ✅ Apply CardContent with p-5 space-y-5 bg-background rounded-b-xl

---

### Phase 2: Connection Cards Redesign (Day 2)

**2.1 Enhanced Connection Card Component**
- Create new `NetworkConnectionCard` component
- Implement 3-column metadata grid
- Add connection strength visual indicator
- Add recent activity callout
- Add certification badges (theme-colored)
- Add quick stats row
- Update action buttons (4 buttons: Message, View Profile, Endorse, More)
- **File:** `src/pages/5-engineer/others/features/network/components/NetworkConnectionCard.tsx` (NEW)

**2.2 Connection Request Card Component**
- Create new `ConnectionRequestCard` component
- Add left border accent (primary color)
- Display request message
- Show mutual connections
- Add Accept/Decline buttons
- **File:** `src/pages/5-engineer/others/features/network/components/ConnectionRequestCard.tsx` (NEW)

**2.3 Activity Feed Item Component**
- Create new `ActivityFeedItem` component
- Color-coded activity icons
- Timeline-style layout
- Clickable related content
- **File:** `src/pages/5-engineer/others/features/network/components/ActivityFeedItem.tsx` (NEW)

---

### Phase 3: Advanced Features (Day 3)

**3.1 Search & Filters Enhancement**
- Create `NetworkFilters` component
- Add 4 filter dropdowns (Specialty, Location, Connection Strength, Sort)
- Add view toggle (Grid/List)
- Add active filters display with clear buttons
- **File:** `src/pages/5-engineer/others/features/network/components/NetworkFilters.tsx` (NEW)

**3.2 Suggested Connections Component**
- Create `SuggestedConnections` component
- Apply Bauhaus gradient border
- Compact suggestion cards
- Quick connect/dismiss actions
- AI badge indicator
- **File:** `src/pages/5-engineer/others/features/network/components/SuggestedConnections.tsx` (NEW)

**3.3 Connection Strength Calculation**
- Implement algorithm based on:
  - Mutual connections (40%)
  - Recent interactions (30%)
  - Common projects (20%)
  - Endorsements given/received (10%)
- **File:** `src/pages/5-engineer/others/features/network/utils/connectionStrength.ts` (NEW)

---

### Phase 4: Polish & Testing (Day 4)

**4.1 Animations & Transitions**
- Add Framer Motion for card entrance animations
- Implement skeleton loading states
- Add smooth tab transitions
- Hover effects on all interactive elements

**4.2 Empty States**
- No connections state
- No requests state
- No activity state
- Search no results state

**4.3 Responsive Design**
- Mobile: Single column, stacked stats
- Tablet: 2-column grid
- Desktop: 3-column grid
- Sidebar: Hide on mobile, show on desktop

**4.4 Testing**
- Browser testing (Chrome, Safari, Firefox, Edge)
- Responsive testing (mobile, tablet, desktop)
- Accessibility testing (keyboard navigation, screen readers)
- Performance testing (load time, scroll performance)

---

## 📐 Technical Specifications

### File Structure

```
src/pages/5-engineer/
└── 6-NetworkPage.tsx (MAIN PAGE - Update)
└── others/
    └── features/
        └── network/
            ├── components/
            │   ├── NetworkConnectionCard.tsx (NEW)
            │   ├── ConnectionRequestCard.tsx (NEW)
            │   ├── ActivityFeedItem.tsx (NEW)
            │   ├── NetworkFilters.tsx (NEW)
            │   ├── SuggestedConnections.tsx (NEW)
            │   ├── NetworkStatsGrid.tsx (NEW)
            │   └── ConnectionStrengthBadge.tsx (NEW)
            ├── utils/
            │   ├── connectionStrength.ts (NEW)
            │   ├── filterConnections.ts (NEW)
            │   └── sortConnections.ts (NEW)
            └── types/
                └── network.types.ts (NEW)
```

---

### Component Props & Interfaces

**NetworkConnectionCard Props:**
```typescript
interface NetworkConnectionCardProps {
  connection: NetworkConnection;
  onMessage: (connectionId: string) => void;
  onViewProfile: (connectionId: string) => void;
  onEndorse: (connectionId: string) => void;
  onRemove: (connectionId: string) => void;
  viewMode?: 'grid' | 'list';
}
```

**ConnectionRequestCard Props:**
```typescript
interface ConnectionRequestCardProps {
  request: ConnectionRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  onViewProfile: (userId: string) => void;
}
```

**ActivityFeedItem Props:**
```typescript
interface ActivityFeedItemProps {
  activity: NetworkActivity;
  onClickRelated?: (relatedId: string) => void;
}
```

**NetworkFilters Props:**
```typescript
interface NetworkFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalResults: number;
}

interface FilterState {
  search: string;
  specialty: string;
  location: string;
  connectionStrength: 'all' | 'strong' | 'medium' | 'weak';
  sort: 'recent' | 'alphabetical' | 'mutual' | 'active';
}
```

---

### Data Enhancements

**Add to NetworkConnection:**
```typescript
interface NetworkConnection {
  // ... existing fields
  
  // NEW FIELDS
  profileCompleteness: number; // 0-100
  responseRate: number; // 0-100 (how quickly they respond)
  projectCollaborations: number; // shared projects count
  tags: string[]; // custom tags (e.g., "NEOM", "Renewables", "Mentor")
  notes: string; // private notes
  lastInteraction: string; // last message/endorsement date
  connectionScore: number; // 0-100 (strength calculation)
  isStarred: boolean; // favorite connections
  skills: string[]; // top skills
  languages: string[]; // spoken languages
}
```

---

## 🎨 Design Specifications

### Color Coding

**Connection Strength:**
- **Strong** (80-100): Green `bg-green-500`
- **Medium** (50-79): Amber `bg-amber-500`
- **Weak** (0-49): Blue `bg-blue-500`

**Activity Types:**
- **New Connection**: Blue `bg-blue-500/10 text-blue-600`
- **Project Update**: Green `bg-green-500/10 text-green-600`
- **Certification**: Purple `bg-purple-500/10 text-purple-600`
- **Endorsement**: Amber `bg-amber-500/10 text-amber-600`
- **Post/Article**: Primary `bg-primary/10 text-primary`

**Request Status:**
- **Pending**: Amber badge
- **Accepted**: Green badge
- **Declined**: Red badge (hidden after 24h)

---

### Typography Scale

```tsx
// Page Header
text-xl font-bold          // "My Network"
text-xs text-muted-foreground  // Subtitle

// Stats Cards
text-2xl font-bold tracking-tight  // Numbers
text-xs text-muted-foreground      // Labels
text-[10px] font-medium            // Trends

// Connection Cards
text-base font-bold tracking-tight  // Name
text-sm text-foreground/80          // Title
text-xs text-primary                // Company (link)
text-xs text-muted-foreground       // Location/metadata
text-[10px] capitalize              // Connection strength label

// Activity Feed
text-sm leading-relaxed             // Activity text
text-[10px] text-muted-foreground   // Timestamps

// Buttons
text-[11px] (h-7 buttons)          // Small action buttons
text-xs (h-8 buttons)               // Medium buttons
```

---

### Spacing & Layout

```tsx
// Page Container
className="p-4 space-y-4"

// Stats Grid
className="grid grid-cols-2 lg:grid-cols-6 gap-4"

// Connections Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"

// Card Padding
CardHeader: "p-5 pb-3 border-b border-border/40"
CardContent: "p-5 space-y-4 bg-background rounded-b-xl"

// Nested Cards (Connections)
CardHeader: "p-5 pb-3 border-b border-border/40"
CardContent: "p-5 space-y-4 bg-background rounded-b-xl"
```

---

## 📋 Implementation Checklist

### Pre-Implementation
- [ ] Review current NetworkPage.tsx code
- [ ] Review Profile page components for reference
- [ ] Create new component folder structure
- [ ] Define TypeScript interfaces
- [ ] Set up mock data with enhanced fields

### Phase 1 Checklist
- [ ] Update page container padding to p-4
- [ ] Update header to inline icon style
- [ ] Update action buttons to h-8 text-xs
- [ ] Refactor stats grid with Bauhaus borders
- [ ] Add trend indicators to stats
- [ ] Wrap main content in Bauhaus card
- [ ] Move tabs to CardHeader

### Phase 2 Checklist
- [ ] Create NetworkConnectionCard component
- [ ] Implement 3-column metadata grid
- [ ] Add connection strength indicator
- [ ] Add recent activity callout
- [ ] Add certification badges
- [ ] Add quick stats row
- [ ] Update action buttons (4 buttons)
- [ ] Create ConnectionRequestCard component
- [ ] Create ActivityFeedItem component

### Phase 3 Checklist
- [ ] Create NetworkFilters component
- [ ] Add 4 filter dropdowns
- [ ] Add view toggle (grid/list)
- [ ] Add active filters display
- [ ] Create SuggestedConnections component
- [ ] Implement connection strength algorithm
- [ ] Add AI badge to suggestions

### Phase 4 Checklist
- [ ] Add Framer Motion animations
- [ ] Create skeleton loading states
- [ ] Add empty state components
- [ ] Test responsive breakpoints
- [ ] Test accessibility (keyboard nav)
- [ ] Test performance (load time)
- [ ] Browser testing (all major browsers)
- [ ] Update UI Style Guide documentation

---

## 🚀 Quick Start Commands

```bash
# Navigate to Network page directory
cd src/pages/5-engineer/others/features

# Create new network feature folder
mkdir -p network/components network/utils network/types

# Start implementing (suggested order)
1. Update 6-NetworkPage.tsx header & container
2. Create NetworkConnectionCard.tsx
3. Create ConnectionRequestCard.tsx
4. Create ActivityFeedItem.tsx
5. Create NetworkFilters.tsx
6. Create SuggestedConnections.tsx
```

---

## 📊 Success Metrics

### Design Quality
- ✅ All cards use gap-0, p-5 pattern
- ✅ All headers use Bauhaus gradient borders
- ✅ All buttons follow size standards (h-7, h-8)
- ✅ All icons follow size standards
- ✅ Typography matches UI Style Guide
- ✅ Spacing consistent with other pages

### User Experience
- ✅ Connection cards load < 500ms
- ✅ Search results instant (< 100ms)
- ✅ Smooth animations (60fps)
- ✅ Accessible (WCAG AA)
- ✅ Mobile-responsive
- ✅ No layout shifts

### Feature Completeness
- ✅ All 3 tabs functional (Connections, Requests, Activity)
- ✅ Search & 4 filters working
- ✅ Grid/List view toggle working
- ✅ Suggested connections displayed
- ✅ Connection strength calculated
- ✅ All action buttons functional

---

## 🎯 Design Patterns to Apply

### From Profile Page
1. **Card Header Pattern:**
   ```tsx
   gap-0
   CardHeader: p-5 pb-3 border-b border-border/40
   CardContent: p-5 space-y-4 bg-background rounded-b-xl
   ```

2. **Icon Container Pattern:**
   ```tsx
   bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md
   Icon: h-6 w-6 text-white
   ```

3. **Button Sizes:**
   ```tsx
   Small: h-7 text-[11px] with h-3 w-3 mr-1 icons
   Medium: h-8 text-xs with h-3.5 w-3.5 mr-1.5 icons
   ```

### From Jobs Page (Product-Card Pattern)
1. **Metadata Grid (3-Column):**
   ```tsx
   grid grid-cols-3 gap-4 py-3 border-y border-border/40
   ```

2. **Theme-Colored Badges:**
   ```tsx
   bg-primary/10 text-primary border border-primary/20
   hover:bg-primary hover:text-primary-foreground
   ```

3. **Quick Stats Row:**
   ```tsx
   flex items-center justify-between text-xs
   ```

---

## 🔄 Migration Strategy

### Backward Compatibility
- ✅ Preserve all existing functionality
- ✅ No breaking changes to data structure
- ✅ Maintain all event handlers
- ✅ Keep all TypeScript interfaces (extend, don't replace)

### Testing Strategy
1. **Unit Tests** - Test connection strength calculation
2. **Component Tests** - Test each new component
3. **Integration Tests** - Test tab switching, filtering, sorting
4. **E2E Tests** - Test full user flows (connect, message, endorse)
5. **Visual Regression** - Screenshot tests for design consistency

---

## 📚 Related Documentation

- **UI Style Guide** → [12-UI_STYLE_GUIDE.md](12-UI_STYLE_GUIDE.md)
- **Profile Page Reference** → `src/pages/5-engineer/15-ProfilePage.tsx`
- **Jobs Page Reference** → `src/pages/5-engineer/2-JobsPage.tsx`
- **Component Guide** → [6-Components-UI.md](6-Components-UI.md)

---

## 🎨 Visual References

### Dribbble Inspiration
1. **LinkedIn-Style Layout** - Clean card grid, rich profiles
2. **Dark Theme Network** - Modern, data-rich
3. **Job Network Feed** - Search-first, filter pills
4. **Mobile Network UI** - Avatar grid, smooth animations

### nbcon Design System
1. **Bauhaus Gradient Border** - Signature nbcon style
2. **Product-Card Pattern** - Jobs page inspiration
3. **Theme-Colored Badges** - Consistent color coding
4. **Icon Containers** - Solid primary background, white icons

---

## ✅ Definition of Done

### Design Checklist
- [ ] Header matches Profile page style
- [ ] All cards use Bauhaus gradient borders
- [ ] All cards use gap-0, p-5 pattern
- [ ] All buttons follow size standards
- [ ] All icons follow size standards
- [ ] Typography matches UI Style Guide
- [ ] Spacing consistent with other pages
- [ ] Colors use HSL variables (theme-aware)

### Feature Checklist
- [ ] Connections tab fully functional
- [ ] Requests tab fully functional
- [ ] Activity tab fully functional
- [ ] Search works across all fields
- [ ] All 4 filters working
- [ ] Grid/List view toggle working
- [ ] Suggested connections displaying
- [ ] Connection strength calculated
- [ ] All action buttons working
- [ ] Empty states implemented
- [ ] Loading states implemented

### Quality Checklist
- [ ] No console errors or warnings
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] All components tested
- [ ] Responsive on all breakpoints
- [ ] Accessible (keyboard + screen reader)
- [ ] Performance optimized (< 500ms load)
- [ ] Dark mode compatible

---

## 🚀 Next Steps

1. **Approve this plan** - Review and confirm redesign approach
2. **Create components** - Build new components step-by-step
3. **Test incrementally** - Test each phase before moving forward
4. **Document patterns** - Update UI Style Guide with new patterns
5. **Deploy** - Roll out to production after thorough testing

---

**This redesign will transform the Network page into a polished, professional networking hub that matches the quality of the Profile page!** 🌐✨

**Estimated Implementation Time:** 3-4 days  
**Complexity:** Medium-High  
**Dependencies:** None (all patterns already exist)  
**Risk Level:** Low (non-breaking changes)

