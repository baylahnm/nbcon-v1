# 🎨 HeroUI Components Guide

**Last Updated:** October 10, 2025  
**Status:** Production Ready  
**HeroUI Version:** 2.8.5

---

## 📖 Table of Contents

1. [What is HeroUI?](#what-is-heroui)
2. [Installation Status](#installation-status)
3. [Available Components](#available-components)
4. [Getting Started](#getting-started)
5. [Component Examples](#component-examples)
6. [Best Practices](#best-practices)
7. [Integration with shadcn/ui](#integration-with-shadcnui)
8. [Theming & Customization](#theming--customization)

---

## 🎯 What is HeroUI?

**HeroUI** is a comprehensive UI library for React built on top of **Tailwind CSS** and **React Aria**, providing complete components with built-in logic, styles, and accessibility features.

### Key Differences from Other Libraries

**HeroUI vs TailwindCSS:**
- **TailwindCSS**: Provides atomic CSS classes for styling
- **HeroUI**: Provides complete React components with logic, styles, and accessibility

**HeroUI vs shadcn/ui:**
- **shadcn/ui**: Copy-paste component library (you own the code)
- **HeroUI**: npm-installed component library (managed externally)

**Both libraries can coexist!** Your project uses **both shadcn/ui and HeroUI** for maximum flexibility.

---

## ✅ Installation Status

HeroUI is **already installed and configured** in your project:

```json
// package.json
{
  "dependencies": {
    "@heroui/react": "2.8.5"
  }
}
```

### Configuration Applied

**1. Tailwind Config (`tailwind.config.ts`):**
```typescript
import { heroui } from "@heroui/react";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [heroui()],
}
```

**2. Provider Setup (`src/App.tsx`):**
```typescript
import { HeroUIProvider } from "@heroui/react";

const App = () => (
  <HeroUIProvider>
    {/* Your app */}
  </HeroUIProvider>
);
```

✅ **Ready to use!** No additional setup required.

---

## 📦 Available Components

HeroUI provides **210+ components** organized by category:

### Layout Components
- `Card` - Content containers
- `Divider` - Visual separators
- `Spacer` - Spacing utility
- `Modal` - Dialog overlays
- `Drawer` - Side panels

### Form Controls
- `Input` - Text inputs
- `Textarea` - Multi-line text
- `Select` - Dropdown selections
- `Checkbox` - Boolean inputs
- `Radio` - Single choice
- `Switch` - Toggle controls
- `Slider` - Range inputs
- `Number Input` - Numeric inputs
- `Input OTP` - One-time passwords
- `Date Picker` - Date selection
- `Time Input` - Time selection
- `Autocomplete` - Search with suggestions

### Navigation
- `Navbar` - Top navigation
- `Breadcrumbs` - Navigation trail
- `Tabs` - Tabbed interfaces
- `Pagination` - Page navigation
- `Link` - Styled links

### Data Display
- `Table` - Data tables
- `Avatar` - User images
- `Badge` - Status indicators
- `Chip` - Tags/labels
- `Tooltip` - Hover information
- `Code` - Code snippets
- `Image` - Optimized images
- `User` - User profile display

### Feedback
- `Alert` - Important messages
- `Toast` - Notifications
- `Progress` - Progress bars
- `Circular Progress` - Circular loaders
- `Skeleton` - Loading placeholders
- `Spinner` - Loading indicators

### Buttons
- `Button` - Action buttons
- `Button Group` - Grouped buttons

### Overlay
- `Popover` - Floating content
- `Dropdown` - Dropdown menus
- `Modal` - Dialog windows
- `Drawer` - Slide-out panels

### Advanced
- `Calendar` - Calendar picker
- `Date Range Picker` - Range selection
- `Listbox` - List selection
- `Scroll Shadow` - Scroll indicators
- `Snippet` - Code copying

---

## 🚀 Getting Started

### Basic Usage

**1. Import Component:**
```typescript
import { Button } from '@heroui/react';
```

**2. Use Component:**
```tsx
<Button color="primary">
  Click Me
</Button>
```

**That's it!** HeroUI handles all the styling and logic.

---

## 💡 Component Examples

### Buttons

```tsx
import { Button } from '@heroui/react';

// Primary Button
<Button color="primary">
  Primary Action
</Button>

// Secondary Button
<Button color="secondary" variant="bordered">
  Secondary Action
</Button>

// Success Button
<Button color="success" size="lg">
  Save Changes
</Button>

// Danger Button
<Button color="danger" variant="flat">
  Delete
</Button>

// Loading State
<Button isLoading color="primary">
  Loading...
</Button>

// Disabled State
<Button isDisabled>
  Disabled
</Button>

// Icon Button
<Button isIconOnly color="primary" aria-label="Save">
  <SaveIcon />
</Button>
```

**Available Props:**
- `color`: primary, secondary, success, warning, danger
- `variant`: solid, bordered, light, flat, faded, shadow, ghost
- `size`: sm, md, lg
- `radius`: none, sm, md, lg, full
- `isLoading`: boolean
- `isDisabled`: boolean
- `isIconOnly`: boolean

---

### Input Fields

```tsx
import { Input } from '@heroui/react';

// Basic Input
<Input
  type="email"
  label="Email"
  placeholder="Enter your email"
/>

// With Description
<Input
  label="Username"
  placeholder="Enter username"
  description="This will be your public username"
/>

// With Validation
<Input
  label="Email"
  placeholder="you@example.com"
  type="email"
  isInvalid={emailError}
  errorMessage={emailError && "Please enter a valid email"}
/>

// With Start/End Content
<Input
  label="Price"
  placeholder="0.00"
  startContent={
    <div className="pointer-events-none flex items-center">
      <span className="text-default-400 text-small">SAR</span>
    </div>
  }
/>

// Clearable Input
<Input
  isClearable
  label="Search"
  placeholder="Type to search..."
  onClear={() => console.log("input cleared")}
/>
```

---

### Cards

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react';

// Basic Card
<Card>
  <CardHeader>
    <h4 className="text-lg font-bold">Project Title</h4>
  </CardHeader>
  <CardBody>
    <p>Project description goes here...</p>
  </CardBody>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

// Hoverable Card
<Card isPressable onPress={() => console.log("card pressed")}>
  <CardBody>
    Click me!
  </CardBody>
</Card>

// Card with Image
<Card>
  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
    <h4 className="font-bold text-large">NEOM Project</h4>
  </CardHeader>
  <CardBody className="overflow-visible py-2">
    <img
      alt="Card background"
      className="object-cover rounded-xl"
      src="/images/project.jpg"
    />
  </CardBody>
</Card>
```

---

### Select Dropdown

```tsx
import { Select, SelectItem } from '@heroui/react';

// Basic Select
<Select 
  label="Select Project" 
  placeholder="Choose a project"
>
  <SelectItem key="neom" value="neom">
    NEOM Smart City
  </SelectItem>
  <SelectItem key="aramco" value="aramco">
    Saudi Aramco Refinery
  </SelectItem>
  <SelectItem key="redsea" value="redsea">
    Red Sea Marina
  </SelectItem>
</Select>

// With Description
<Select
  label="Priority"
  placeholder="Select priority"
  description="Set task priority level"
>
  <SelectItem key="high">High Priority</SelectItem>
  <SelectItem key="medium">Medium Priority</SelectItem>
  <SelectItem key="low">Low Priority</SelectItem>
</Select>

// Multiple Selection
<Select
  label="Skills"
  placeholder="Select skills"
  selectionMode="multiple"
>
  <SelectItem key="structural">Structural Analysis</SelectItem>
  <SelectItem key="autocad">AutoCAD</SelectItem>
  <SelectItem key="revit">Revit</SelectItem>
</Select>
```

---

### Modal Dialog

```tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@heroui/react';

function MyComponent() {
  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Action
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to proceed?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
```

---

### Tabs

```tsx
import { Tabs, Tab } from '@heroui/react';

<Tabs aria-label="Options">
  <Tab key="overview" title="Overview">
    <Card>
      <CardBody>
        Overview content goes here...
      </CardBody>
    </Card>
  </Tab>
  <Tab key="invoices" title="Invoices">
    <Card>
      <CardBody>
        Invoices content goes here...
      </CardBody>
    </Card>
  </Tab>
  <Tab key="expenses" title="Expenses">
    <Card>
      <CardBody>
        Expenses content goes here...
      </CardBody>
    </Card>
  </Tab>
</Tabs>

// With Icons
<Tabs>
  <Tab 
    key="dashboard" 
    title={
      <div className="flex items-center gap-2">
        <DashboardIcon />
        <span>Dashboard</span>
      </div>
    }
  >
    Dashboard content
  </Tab>
</Tabs>
```

---

### Avatar

```tsx
import { Avatar, AvatarGroup } from '@heroui/react';

// Basic Avatar
<Avatar 
  src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
  alt="User avatar"
/>

// Avatar with Fallback
<Avatar 
  name="Ahmed Al-Rashid" 
  showFallback
/>

// Avatar Sizes
<Avatar size="sm" src="..." />
<Avatar size="md" src="..." />
<Avatar size="lg" src="..." />

// Avatar Group
<AvatarGroup isBordered max={3}>
  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
</AvatarGroup>
```

---

### Badge & Chip

```tsx
import { Badge, Chip } from '@heroui/react';

// Badge
<Badge content="5" color="danger">
  <NotificationIcon />
</Badge>

<Badge content="99+" color="primary">
  Messages
</Badge>

// Chip
<Chip color="success" variant="flat">
  Active
</Chip>

<Chip color="warning" variant="bordered">
  Pending
</Chip>

<Chip 
  color="danger" 
  variant="dot"
  onClose={() => console.log("chip closed")}
>
  Removable
</Chip>

// Chip with Avatar
<Chip
  variant="flat"
  avatar={
    <Avatar 
      name="Ahmed" 
      size="sm" 
      getInitials={(name) => name.charAt(0)}
    />
  }
>
  Ahmed Al-Rashid
</Chip>
```

---

### Table

```tsx
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

const columns = [
  { key: "name", label: "NAME" },
  { key: "role", label: "ROLE" },
  { key: "status", label: "STATUS" },
];

const rows = [
  { key: "1", name: "Ahmed Al-Rashid", role: "Engineer", status: "Active" },
  { key: "2", name: "Sarah Johnson", role: "Manager", status: "Active" },
  { key: "3", name: "Mohammed Ali", role: "Designer", status: "Paused" },
];

<Table aria-label="Engineers table">
  <TableHeader columns={columns}>
    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
  </TableHeader>
  <TableBody items={rows}>
    {(item) => (
      <TableRow key={item.key}>
        {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
      </TableRow>
    )}
  </TableBody>
</Table>

// With Selection
<Table 
  selectionMode="multiple"
  onSelectionChange={(keys) => console.log(keys)}
>
  {/* ... */}
</Table>
```

---

### Progress & Spinner

```tsx
import { Progress, CircularProgress, Spinner } from '@heroui/react';

// Linear Progress
<Progress 
  value={65} 
  color="success"
  label="Project Completion"
  showValueLabel
/>

// Circular Progress
<CircularProgress
  value={75}
  color="warning"
  showValueLabel
  label="Loading..."
/>

// Spinner
<Spinner color="primary" size="lg" />

// Spinner with Label
<Spinner 
  label="Loading data..." 
  color="secondary"
/>
```

---

### Date & Time Pickers

```tsx
import { DatePicker, DateRangePicker, TimeInput } from '@heroui/react';

// Date Picker
<DatePicker 
  label="Select Date"
  onChange={(date) => console.log(date)}
/>

// Date Range Picker
<DateRangePicker 
  label="Project Duration"
  onChange={(range) => console.log(range)}
/>

// Time Input
<TimeInput 
  label="Start Time"
  onChange={(time) => console.log(time)}
/>
```

---

## 🎨 Best Practices

### 1. Component Composition

**✅ Good:**
```tsx
<Card>
  <CardHeader>
    <h3>Title</h3>
  </CardHeader>
  <CardBody>
    <Input label="Name" />
    <Button color="primary">Submit</Button>
  </CardBody>
</Card>
```

**❌ Avoid:**
```tsx
// Don't mix too many component libraries in one component
<Card> {/* HeroUI */}
  <div className="p-4"> {/* Manual styling */}
    <ShadcnInput /> {/* shadcn/ui */}
    <HeroButton /> {/* HeroUI */}
  </div>
</Card>
```

---

### 2. Consistent Styling

**Use HeroUI's built-in variants:**
```tsx
// Consistent with your brand
<Button color="primary" variant="solid">Primary</Button>
<Button color="primary" variant="bordered">Outlined</Button>
<Button color="primary" variant="light">Subtle</Button>
```

---

### 3. Accessibility

**Always include labels and aria attributes:**
```tsx
// ✅ Good
<Input 
  label="Email"
  aria-label="Email address"
  aria-describedby="email-description"
/>

// ❌ Avoid
<Input placeholder="Email" />
```

---

### 4. Form Handling

**Integrate with React Hook Form:**
```tsx
import { useForm } from 'react-hook-form';
import { Input, Button } from '@heroui/react';

function MyForm() {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email", { required: true })}
        label="Email"
        type="email"
      />
      <Button type="submit" color="primary">
        Submit
      </Button>
    </form>
  );
}
```

---

## 🔄 Integration with shadcn/ui

Your project uses **both HeroUI and shadcn/ui**. Here's how to use them together:

### When to Use Each

**Use HeroUI for:**
- ✅ Complex interactive components (Date Pickers, Autocomplete)
- ✅ Components needing animations (Modal, Drawer)
- ✅ Quick prototyping
- ✅ Components with built-in logic (Table with sorting)

**Use shadcn/ui for:**
- ✅ Fully customizable components (you own the code)
- ✅ Components matching specific design requirements
- ✅ Performance-critical components
- ✅ Components you need to modify extensively

### Example: Mixing Both

```tsx
// Engineer Dashboard Page
import { Card, Button } from '@heroui/react'; // HeroUI
import { toast } from '@/pages/1-HomePage/others/components/ui/sonner'; // shadcn/ui

function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* HeroUI Card */}
      <Card>
        <CardBody>
          <p>Total Earnings: 12,750 SAR</p>
        </CardBody>
      </Card>

      {/* shadcn/ui Toast */}
      <Button 
        color="primary"
        onPress={() => toast.success("Check-in successful!")}
      >
        Check In
      </Button>
    </div>
  );
}
```

---

## 🎨 Theming & Customization

### Default Colors

HeroUI uses Tailwind's color system:
- `primary` - Your brand color (green: `142 65% 47%`)
- `secondary` - Secondary brand color
- `success` - Success states
- `warning` - Warning states
- `danger` - Error/destructive states

### Custom Colors

**Override in `tailwind.config.ts`:**
```typescript
import { heroui } from "@heroui/react";

export default {
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#1e9e6b", // Your custom green
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#f31260",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
}
```

---

### Dark Mode

HeroUI automatically supports dark mode through Tailwind:

```tsx
// Component automatically adapts
<Card className="bg-content1">
  <CardBody>
    This card changes color in dark mode
  </CardBody>
</Card>
```

Your app already has dark mode configured! ✅

---

## 📚 Component Reference

### Quick Links

**Official Documentation:**
- HeroUI Docs: https://www.heroui.com/docs/guide/introduction
- Components: https://www.heroui.com/docs/components/button
- Themes: https://www.heroui.com/docs/customization/theme

**Useful Sections:**
- Installation: https://www.heroui.com/docs/guide/installation
- Forms: https://www.heroui.com/docs/guide/forms
- Dark Mode: https://www.heroui.com/docs/customization/dark-mode

---

## 🔧 Troubleshooting

### Common Issues

**1. Component Not Styled:**
```bash
# Make sure HeroUI content path is in tailwind.config.ts
content: [
  "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
]
```

**2. Provider Missing:**
```tsx
// Wrap app with HeroUIProvider
<HeroUIProvider>
  <App />
</HeroUIProvider>
```

**3. TypeScript Errors:**
```bash
# Make sure types are installed
pnpm add -D @types/react @types/react-dom
```

---

## 🎯 Real-World Examples

### Engineer Check-In Card

```tsx
import { Card, CardBody, CardHeader, Button, Badge } from '@heroui/react';
import { MapPin, Clock } from 'lucide-react';

function CheckInCard() {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">NEOM Smart City</p>
          <p className="text-small text-default-500">Section A - Foundation</p>
        </div>
        <Badge color="success" variant="flat">
          Active
        </Badge>
      </CardHeader>
      <CardBody>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Al Olaya, Riyadh</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4" />
          <span className="text-sm">8:00 AM - 4:00 PM</span>
        </div>
        <Button color="primary" className="w-full">
          Check In
        </Button>
      </CardBody>
    </Card>
  );
}
```

---

### Invoice Status Chip

```tsx
import { Chip } from '@heroui/react';

function InvoiceStatus({ status }: { status: string }) {
  const colorMap = {
    paid: 'success',
    pending: 'warning',
    overdue: 'danger',
    draft: 'default',
  };

  return (
    <Chip 
      color={colorMap[status] || 'default'}
      variant="flat"
      size="sm"
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Chip>
  );
}
```

---

### Job Application Form

```tsx
import { Input, Select, SelectItem, Textarea, Button } from '@heroui/react';

function JobApplicationForm() {
  return (
    <form className="space-y-4">
      <Input
        isRequired
        label="Full Name"
        placeholder="Enter your full name"
      />
      
      <Input
        isRequired
        type="email"
        label="Email"
        placeholder="you@example.com"
      />
      
      <Select 
        isRequired
        label="Experience Level"
        placeholder="Select your experience"
      >
        <SelectItem key="junior">Junior (0-2 years)</SelectItem>
        <SelectItem key="mid">Mid-level (3-5 years)</SelectItem>
        <SelectItem key="senior">Senior (6+ years)</SelectItem>
      </Select>
      
      <Textarea
        label="Cover Letter"
        placeholder="Tell us why you're a great fit..."
        minRows={4}
      />
      
      <Button type="submit" color="primary" className="w-full">
        Submit Application
      </Button>
    </form>
  );
}
```

---

## ✅ Summary

### What You Learned

- ✅ HeroUI is installed and ready to use
- ✅ 210+ components available
- ✅ Works alongside shadcn/ui
- ✅ Built-in accessibility and animations
- ✅ Full TypeScript support
- ✅ Dark mode compatible

### Next Steps

1. **Explore Components:** Try different HeroUI components in your pages
2. **Customize Theme:** Adjust colors to match your brand
3. **Read Docs:** Visit https://www.heroui.com for detailed examples
4. **Build Features:** Use HeroUI for new Engineer Portal features

---

## 🔗 Related Documentation

- **Main README** → [1-README.md](1-README.md)
- **Project Architecture** → [2-PROJECT_GUIDE.md](2-PROJECT_GUIDE.md)
- **Authentication** → [3-AUTH_GUIDE.md](3-AUTH_GUIDE.md)
- **Database Guide** → [4-DATABASE_GUIDE.md](4-DATABASE_GUIDE.md)
- **Engineer Portal Audit** → [8-ENGINEER_PORTAL_AUDIT_REPORT.md](8-ENGINEER_PORTAL_AUDIT_REPORT.md)

---

**HeroUI is ready to accelerate your UI development!** 🚀

Use it to build beautiful, accessible components faster while maintaining full control with shadcn/ui for custom needs.

---

## 📖 **COMPLETE HEROUI MASTERY GUIDE**

**Last Updated:** October 10, 2025  
**Learning Duration:** 40 minutes deep dive  
**Coverage:** All Getting Started, Frameworks, Customization, Components, API References

---

## 🎯 **1. GETTING STARTED - Complete Knowledge**

### **What is HeroUI?**

HeroUI is a UI library for React built on **TailwindCSS + React Aria**, providing:
- ✅ Complete components with logic, styles, and accessibility
- ✅ 210+ production-ready components
- ✅ Not a copy-paste library (npm-installed, managed externally)
- ✅ Works alongside shadcn/ui for maximum flexibility

### **Requirements:**
- React 18 or later
- Tailwind CSS v4
- Framer Motion 11.9 or later

### **Installation Methods:**

**1. Automatic (CLI - Recommended):**
```bash
npx heroui-cli@latest init
```

**2. Manual Installation:**
```bash
npm install @heroui/react framer-motion
```

**3. Individual Components:**
```bash
npx heroui-cli@latest add button card tabs
```

### **Basic Setup:**

**1. Configure Tailwind (`tailwind.config.ts`):**
```typescript
import { heroui } from "@heroui/react";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [heroui()],
}
```

**2. Wrap App with Provider (`src/App.tsx`):**
```typescript
import { HeroUIProvider } from "@heroui/react";

function App() {
  return (
    <HeroUIProvider>
      {/* Your app */}
    </HeroUIProvider>
  );
}
```

---

## 🚀 **2. FRAMEWORKS - Vite Integration (Your Stack!)**

### **Vite + HeroUI Setup:**

**Requirements:**
- Vite 2 or later
- React 18 or later
- Tailwind CSS v4
- Framer Motion 11.9+

**Installation Steps:**

**Option 1: HeroUI CLI (Recommended)**
```bash
pnpm create heroui-app@latest
# Select Vite when prompted
```

**Option 2: Manual Setup**
```bash
pnpm add @heroui/react framer-motion
```

**Configuration:**
```typescript
// tailwind.config.ts
import { heroui } from "@heroui/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  plugins: [heroui()],
}
```

**Provider Setup:**
```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {HeroUIProvider} from '@heroui/react';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>,
);
```

---

## 🎨 **3. CUSTOMIZATION - Complete Guide**

### **Theme Customization:**

HeroUI uses a **tw-colors based theming system**:

```typescript
// tailwind.config.ts
import { heroui } from "@heroui/react";

export default {
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#1e9e6b", // Your brand green
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#7828c8",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#17c964",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#f5a524",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#f31260",
              foreground: "#ffffff",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#1e9e6b",
              foreground: "#ffffff",
            },
            // ... dark theme colors
          },
        },
      },
    }),
  ],
}
```

### **Dark Mode:**

HeroUI supports both `light` and `dark` themes. Enable by adding `dark` class to root:

```tsx
// main.tsx or layout
import {HeroUIProvider} from "@heroui/react";

<HeroUIProvider>
  <main className="dark text-foreground bg-background">
    <App />
  </main>
</HeroUIProvider>
```

**With next-themes integration:**
```tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/react";

<NextThemesProvider attribute="class" defaultTheme="dark">
  <HeroUIProvider>
    <App />
  </HeroUIProvider>
</NextThemesProvider>
```

### **Layout & Spacing:**

**Default Layout Tokens:**
```typescript
layout: {
  dividerWeight: "1px",        // Divider thickness
  disabledOpacity: 0.5,         // Disabled element opacity
  fontSize: {
    tiny: "0.75rem",            // 12px
    small: "0.875rem",          // 14px
    medium: "1rem",             // 16px
    large: "1.125rem",          // 18px
  },
  lineHeight: {
    tiny: "1rem",
    small: "1.25rem",
    medium: "1.5rem",
    large: "1.75rem",
  },
  radius: {
    small: "8px",
    medium: "12px",
    large: "14px",
  },
  borderWidth: {
    small: "1px",
    medium: "2px",
    large: "3px",
  },
}
```

---

## 💎 **4. MODERN DASHBOARD DESIGN PATTERNS (2025)**

### **Card Design Best Practices:**

**Modern Card Structure:**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react';

<Card
  className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50"
>
  <CardHeader className="flex items-center gap-4 pb-4">
    <div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-bold tracking-tight">Title</h3>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
  </CardHeader>
  <CardBody>
    <p className="text-3xl font-bold tracking-tight">$45,231</p>
    <p className="text-sm text-muted-foreground mt-1">Revenue this month</p>
  </CardBody>
</Card>
```

**Key Card Features:**
- ✅ **Gradient Borders**: `border-2 solid transparent` + `backgroundImage` gradients
- ✅ **Layered Shadows**: `shadow-sm` → `shadow-md` → `shadow-xl` on hover
- ✅ **Ring Effects**: `ring-1 ring-primary/20` for depth
- ✅ **Hover Lift**: `-translate-y-0.5` for subtle elevation
- ✅ **Transition**: `transition-all duration-300` for smooth animations
- ✅ **Group Hover**: `group` + `group-hover:scale-110` for child elements

### **Button Hierarchy:**

```tsx
import { Button } from '@heroui/react';

// Primary Action
<Button 
  color="primary" 
  size="lg"
  className="shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
>
  <Icon className="h-5 w-5 mr-2" />
  Primary Action
</Button>

// Secondary Action
<Button 
  color="primary"
  variant="bordered"
  size="md"
  className="shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
>
  <Icon className="h-4 w-4 mr-2" />
  Secondary Action
</Button>

// Tertiary Action
<Button 
  variant="light" 
  size="sm"
  className="hover:bg-primary/10 transition-colors"
>
  Tertiary
</Button>
```

**Button Variants:**
- `solid` - Default filled button
- `bordered` - Outlined button
- `light` - Subtle background on hover
- `flat` - Solid light background
- `faded` - Similar to flat with opacity
- `shadow` - Elevated shadow style
- `ghost` - Transparent, hover shows background

**Button Sizes:**
- `sm` - Compact (h-8, text-xs)
- `md` - Default (h-10, text-sm)
- `lg` - Prominent (h-12, text-base)

### **Stats Cards Pattern:**

```tsx
const stats = [
  { 
    icon: Eye, 
    label: 'Available Jobs', 
    count: 142,
    bgColor: 'bg-blue-500/10', 
    iconColor: 'text-blue-600',
    ringColor: 'ring-blue-500/20' 
  },
  { 
    icon: Send, 
    label: 'Applied', 
    count: 23,
    bgColor: 'bg-primary/10', 
    iconColor: 'text-primary',
    ringColor: 'ring-primary/20' 
  },
];

<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
  {stats.map((stat) => (
    <Card className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <CardBody className="p-5">
        <div className="flex items-center gap-4">
          <div className={`${stat.bgColor} p-3 rounded-xl ring-1 ${stat.ringColor} group-hover:scale-110 transition-transform`}>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold tracking-tight">{stat.count}</p>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  ))}
</div>
```

### **Horizontal Scroll Pattern (2025):**

```tsx
<div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-muted/30 via-muted/20 to-background border border-border/40 shadow-sm">
  {/* Section Header */}
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
        <Zap className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-bold text-lg">AI-Powered Insights</h3>
        <p className="text-xs text-muted-foreground">Swipe to explore</p>
      </div>
    </div>
    <Badge variant="outline">4 Tools</Badge>
  </div>

  {/* Scroll Container */}
  <div className="relative">
    {/* Left Arrow */}
    {showLeft && (
      <Button
        size="icon"
        variant="outline"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/98 backdrop-blur-md shadow-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
        onClick={scrollLeft}
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </Button>
    )}

    {/* Cards */}
    <div 
      ref={scrollRef}
      className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 py-6"
    >
      <div className="min-w-[400px] w-[400px] shrink-0 snap-start min-h-[520px]">
        <Card className="h-full flex flex-col justify-between">
          {/* Card content */}
        </Card>
      </div>
    </div>
  </div>
</div>
```

### **Typography System:**

```tsx
// Page Headers
<h1 className="text-4xl font-bold flex items-center gap-3">
  <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
    <Icon className="h-7 w-7 text-primary" />
  </div>
  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
    Page Title
  </span>
</h1>

// Section Titles
<h2 className="text-2xl font-bold tracking-tight mb-2">Section Title</h2>

// Card Titles
<h3 className="font-bold text-xl tracking-tight">Card Title</h3>

// Stats/Numbers
<p className="text-3xl font-bold tracking-tight">1,234</p>

// Body Text
<p className="text-sm leading-relaxed text-foreground/80">Description text</p>

// Muted Text
<p className="text-sm font-medium text-muted-foreground">Secondary info</p>

// Labels
<label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Label</label>
```

### **Icon Container Pattern:**

```tsx
// Small Icon (Stats, Lists)
<div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
  <Icon className="h-4 w-4 text-primary" />
</div>

// Medium Icon (Cards, Headers)
<div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
  <Icon className="h-5 w-5 text-primary" />
</div>

// Large Icon (Page Headers)
<div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20">
  <Icon className="h-7 w-7 text-primary" />
</div>

// With Group Hover
<div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
  <Icon className="h-5 w-5 text-primary" />
</div>
```

### **Color-Coded Stats Pattern:**

```tsx
const statColors = {
  available: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-600',
    ring: 'ring-blue-500/20'
  },
  applied: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    ring: 'ring-primary/20'
  },
  shortlisted: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-600',
    ring: 'ring-amber-500/20'
  },
  bookmarked: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-600',
    ring: 'ring-purple-500/20'
  },
};
```

---

## 🧩 **5. COMPONENT MASTERY - 20+ Components**

### **Tables (Advanced):**

```tsx
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  getKeyValue,
  Spinner
} from '@heroui/react';

const columns = [
  { key: "name", label: "NAME" },
  { key: "role", label: "ROLE" },
  { key: "status", label: "STATUS" },
];

const rows = [
  { key: "1", name: "Ahmed", role: "Engineer", status: "Active" },
  { key: "2", name: "Sarah", role: "Manager", status: "Active" },
];

// With Selection, Sorting, Loading
<Table 
  aria-label="Example table"
  selectionMode="multiple"
  onSelectionChange={(keys) => console.log(keys)}
  sortDescriptor={sortDescriptor}
  onSortChange={setSortDescriptor}
>
  <TableHeader columns={columns}>
    {(column) => (
      <TableColumn 
        key={column.key}
        allowsSorting
      >
        {column.label}
      </TableColumn>
    )}
  </TableHeader>
  <TableBody 
    items={rows}
    loadingContent={<Spinner />}
    emptyContent={"No rows to display."}
  >
    {(item) => (
      <TableRow key={item.key}>
        {(columnKey) => (
          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
        )}
      </TableRow>
    )}
  </TableBody>
</Table>
```

### **Tabs (Modern):**

```tsx
import { Tabs, Tab, Card, CardBody } from '@heroui/react';

<Tabs 
  aria-label="Navigation"
  color="primary"
  variant="underlined"
  classNames={{
    tabList: "w-full grid grid-cols-4 gap-0",
    cursor: "w-full bg-primary",
    tab: "h-12",
  }}
>
  <Tab 
    key="available" 
    title={
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span>Available Jobs</span>
        <Badge size="sm" variant="flat" color="primary">12</Badge>
      </div>
    }
  >
    <Card>
      <CardBody>
        Available jobs content...
      </CardBody>
    </Card>
  </Tab>
</Tabs>
```

**Tab Variants:**
- `solid` - Filled background
- `underlined` - Bottom border (modern)
- `bordered` - Outlined
- `light` - Subtle background

### **Modal (Advanced):**

```tsx
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  useDisclosure 
} from '@heroui/react';

function Component() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Quick Apply
              </ModalHeader>
              <ModalBody>
                <p>Modal content here...</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
```

**Modal Sizes:**
- `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `full`

**Backdrop Options:**
- `opaque` - Solid overlay
- `blur` - Blurred background
- `transparent` - No backdrop

### **Dropdown (Context Menus):**

```tsx
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  DropdownSection
} from '@heroui/react';

<Dropdown>
  <DropdownTrigger>
    <Button variant="bordered">Actions</Button>
  </DropdownTrigger>
  <DropdownMenu aria-label="Actions">
    <DropdownSection title="Actions">
      <DropdownItem 
        key="edit"
        startContent={<EditIcon />}
        shortcut="⌘E"
      >
        Edit
      </DropdownItem>
      <DropdownItem 
        key="delete"
        color="danger"
        startContent={<DeleteIcon />}
      >
        Delete
      </DropdownItem>
    </DropdownSection>
  </DropdownMenu>
</Dropdown>
```

### **Skeleton (Loading States):**

```tsx
import { Card, CardBody, Skeleton } from '@heroui/react';

<Card>
  <CardBody className="space-y-3">
    <Skeleton className="rounded-lg">
      <div className="h-24 rounded-lg bg-default-300"></div>
    </Skeleton>
    <div className="space-y-2">
      <Skeleton className="w-3/5 rounded-lg">
        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
      </Skeleton>
      <Skeleton className="w-4/5 rounded-lg">
        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
      </Skeleton>
    </div>
  </CardBody>
</Card>
```

### **DatePicker (Calendar):**

```tsx
import { DatePicker } from '@heroui/react';

<DatePicker 
  label="Event Date"
  className="max-w-[284px]"
  showMonthAndYearPickers
  description="Select the event date"
/>

// Date Range
import { DateRangePicker } from '@heroui/react';

<DateRangePicker 
  label="Project Duration"
  className="max-w-xs"
  visibleMonths={2}
/>
```

---

## 📐 **6. LAYOUT PATTERNS**

### **Page Structure:**

```tsx
<div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
  <div className="container mx-auto px-6 py-8 space-y-8">
    {/* Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border/40">
      {/* Header content */}
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Stat cards */}
    </div>

    {/* Main Content */}
    <div className="space-y-6">
      {/* Content */}
    </div>
  </div>
</div>
```

### **Responsive Grid Systems:**

```tsx
// 2-Column → 4-Column
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

// 1-Column → 2-Column → 3-Column
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Auto-fit Cards (Responsive)
<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
```

### **Section Headers:**

```tsx
<div className="flex items-center justify-between mb-5">
  <div className="flex items-center gap-3">
    <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h2 className="font-bold text-lg">Section Title</h2>
      <p className="text-xs text-muted-foreground">Description</p>
    </div>
  </div>
  <Badge variant="outline" className="font-medium">Count</Badge>
</div>
```

---

## 🎨 **7. VISUAL POLISH TECHNIQUES**

### **Shadow Hierarchy:**

```css
/* Resting */
shadow-sm: 0 2px 10px rgba(0,0,0,0.08)

/* Hover */
shadow-md: 0 4px 15px rgba(0,0,0,0.12)

/* Elevated/Primary */
shadow-xl: 0 6px 20px rgba(0,0,0,0.15) + 0 0 15px primary/20

/* Navigation Arrows */
shadow-2xl: 0 10px 40px rgba(0,0,0,0.2)
```

### **Gradient Techniques:**

```tsx
// Page Background
className="bg-gradient-to-br from-background via-background to-muted/20"

// Card Background
className="bg-gradient-to-br from-card to-card/50"

// Section Container
className="bg-gradient-to-br from-muted/30 via-muted/20 to-background"

// Text Gradient
className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"

// Gradient Border
style={{
  border: '2px solid transparent',
  backgroundImage: `
    linear-gradient(hsl(var(--card)), hsl(var(--card))),
    linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 50%)
  `,
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
}}
```

### **Hover & Interaction States:**

```tsx
// Card Hover
className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"

// Button Hover
className="shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"

// Icon Container Hover
className="group-hover:scale-110 transition-transform duration-300"

// Border Hover
className="hover:border-primary/30 transition-colors"

// Background Hover
className="hover:bg-primary/10 transition-colors"

// Multiple Effects
className="hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
```

### **Border & Ring Effects:**

```tsx
// Subtle Border
className="border border-border/40"

// Separator
className="border-b border-border/30"

// Ring (for depth)
className="ring-1 ring-primary/20"

// Focus Ring
className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
```

---

## 🎯 **8. MODERN DASHBOARD COMPONENTS**

### **Enhanced Stats Card:**

```tsx
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

function StatCard({ icon: Icon, label, value, trend, color = 'blue' }: StatCardProps) {
  const colors = {
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-600', ring: 'ring-blue-500/20' },
    green: { bg: 'bg-green-500/10', icon: 'text-green-600', ring: 'ring-green-500/20' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-600', ring: 'ring-amber-500/20' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-600', ring: 'ring-purple-500/20' },
    red: { bg: 'bg-red-500/10', icon: 'text-red-600', ring: 'ring-red-500/20' },
  };

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      <CardBody className="p-5">
        <div className="flex items-center gap-4">
          <div className={`${colors[color].bg} p-3 rounded-xl ring-1 ${colors[color].ring} group-hover:scale-110 transition-transform`}>
            <Icon className={`h-5 w-5 ${colors[color].icon}`} />
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-sm font-medium text-muted-foreground mt-0.5">{label}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-3 w-3" />
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
```

### **Job/Item Card (Enhanced):**

```tsx
<Card 
  className="relative overflow-hidden transition-all duration-300"
  style={{
    border: '2px solid transparent',
    borderRadius: '0.5rem',
    backgroundImage: `
      linear-gradient(hsl(var(--card)), hsl(var(--card))),
      linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 50%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15), 0 0 15px hsl(var(--primary) / 0.2)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
  }}
>
  <CardBody className="p-7">
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <Briefcase className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-xl tracking-tight">Job Title</h3>
        <Badge variant="outline" className="ml-1">full time</Badge>
      </div>

      {/* Company */}
      <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5">
        <Building className="h-4 w-4" />
        Company Name
      </button>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground py-3 border-y border-border/30">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span>Location</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5" />
          <span>15,000 - 25,000 SAR</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
        Job description goes here...
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        <Chip size="sm" variant="flat" color="primary">React</Chip>
        <Chip size="sm" variant="flat" color="primary">TypeScript</Chip>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button 
          variant="bordered"
          className="flex-1 sm:flex-none shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button 
          color="primary"
          className="flex-1 sm:flex-none shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <Zap className="h-4 w-4 mr-2" />
          Quick Apply
        </Button>
      </div>
    </div>
  </CardBody>
</Card>
```

### **Form with Validation:**

```tsx
import { Input, Button, Textarea, Select, SelectItem } from '@heroui/react';
import { useForm } from 'react-hook-form';

function JobApplicationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("name", { required: true })}
        label="Full Name"
        placeholder="Enter your name"
        isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name && "Name is required"}
        description="As shown on your ID"
      />

      <Input
        {...register("email", { 
          required: true,
          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        })}
        type="email"
        label="Email"
        placeholder="you@example.com"
        isRequired
        isInvalid={!!errors.email}
        errorMessage={errors.email && "Valid email required"}
        startContent={
          <MailIcon className="text-default-400" />
        }
      />

      <Select
        {...register("experience")}
        label="Experience Level"
        placeholder="Select your experience"
        isRequired
      >
        <SelectItem key="junior">Junior (0-2 years)</SelectItem>
        <SelectItem key="mid">Mid-level (3-5 years)</SelectItem>
        <SelectItem key="senior">Senior (6+ years)</SelectItem>
      </Select>

      <Textarea
        {...register("cover")}
        label="Cover Letter"
        placeholder="Tell us why you're a great fit..."
        minRows={4}
        description="Optional but recommended"
      />

      <Button 
        type="submit" 
        color="primary" 
        className="w-full shadow-md hover:shadow-xl"
      >
        Submit Application
      </Button>
    </form>
  );
}
```

---

## 🎯 **9. DESIGN PRINCIPLES (Hero UI Philosophy)**

### **1. Simplicity and Usability**
> "Simplicity is the ultimate sophistication"

- Components are intuitive and easy to understand
- Minimal configuration required
- Sensible defaults that work out of the box
- Clear, consistent API across all components

### **2. Modular Design**
- Each component is a standalone module
- Import only what you need
- Leads to lighter applications and faster load times
- Tree-shaking friendly

### **3. Customization and Flexibility**
- Full Tailwind CSS integration
- Override styles easily via className
- Theme customization through plugin
- Custom variants for components

### **4. Consistent API**
- Same prop patterns across components
- `color`, `size`, `variant`, `radius` props
- `isDisabled`, `isLoading`, `isRequired` boolean flags
- Event handlers: `onPress`, `onChange`, `onSelectionChange`

### **5. Accessibility First**
- WCAG 2.1 Level AA compliant
- Keyboard navigation built-in
- Screen reader friendly
- ARIA labels and roles
- Focus management
- Reduced motion support

### **6. Component Slots**
- Flexible composition patterns
- `startContent`, `endContent` for inputs/buttons
- `CardHeader`, `CardBody`, `CardFooter` structure
- `DropdownSection` for grouping
- `TableHeader`, `TableBody`, `TableRow`, `TableCell`

---

## 🚀 **10. DASHBOARD DESIGN TRENDS 2025**

### **Key Trends:**

1. **Subtle Gradients** - Background depth without overwhelming
2. **Generous Spacing** - Breathing room (gap-5 to gap-8, p-6 to p-8)
3. **Micro-animations** - Subtle hover lifts, scale transforms
4. **Ring Effects** - Depth via rings instead of heavy shadows
5. **Icon Containers** - Icons in colored rounded containers
6. **Color-Coded Categories** - Different colors for different stat types
7. **Backdrop Blur** - `backdrop-blur-md` on overlays/modals
8. **Gradient Borders** - Subtle primary-colored borders
9. **Tracking Tight** - Tighter letter spacing on bold text
10. **Semantic Colors** - Use meaning (success=green, warning=amber, danger=red)

### **Spacing Scale (Tailwind):**

```
gap-1  = 0.25rem (4px)   - Tight (skill tags)
gap-2  = 0.5rem  (8px)   - Close (button groups)
gap-3  = 0.75rem (12px)  - Comfortable (card elements)
gap-4  = 1rem    (16px)  - Standard (grid items)
gap-5  = 1.25rem (20px)  - Spacious (sections)
gap-6  = 1.5rem  (24px)  - Generous (major sections)
gap-8  = 2rem    (32px)  - Very spacious (page sections)
```

### **Padding Scale:**

```
p-2   = 0.5rem  (8px)   - Compact (small icons)
p-3   = 0.75rem (12px)  - Medium (icon containers)
p-4   = 1rem    (16px)  - Standard (cards)
p-5   = 1.25rem (20px)  - Comfortable (enhanced cards)
p-6   = 1.5rem  (24px)  - Spacious (sections)
p-7   = 1.75rem (28px)  - Very spacious (featured cards)
p-8   = 2rem    (32px)  - Maximum (page containers)
```

### **Border Radius Scale:**

```
rounded-sm  = 0.125rem (2px)  - Subtle
rounded     = 0.25rem  (4px)  - Default
rounded-md  = 0.375rem (6px)  - Medium
rounded-lg  = 0.5rem   (8px)  - Large
rounded-xl  = 0.75rem  (12px) - Extra large (cards, containers)
rounded-2xl = 1rem     (16px) - Very large (modals)
rounded-full = 9999px         - Circular (avatars, icon buttons)
```

---

## 💡 **11. REAL-WORLD PATTERNS**

### **Dashboard Header:**

```tsx
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border/40">
  <div className="space-y-1.5">
    <h1 className="text-4xl font-bold flex items-center gap-3">
      <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
        <Briefcase className="h-7 w-7 text-primary" />
      </div>
      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        Page Title
      </span>
    </h1>
    <p className="text-muted-foreground text-base ml-14">Subtitle or description</p>
  </div>
  
  <div className="flex flex-wrap gap-2.5">
    <Button 
      variant="bordered"
      className="shadow-sm hover:shadow-md transition-all"
    >
      <Filter className="h-4 w-4 mr-2" />
      Filters
    </Button>
    <Button 
      color="primary"
      className="shadow-md hover:shadow-lg transition-all"
    >
      <Plus className="h-4 w-4 mr-2" />
      New Item
    </Button>
  </div>
</div>
```

### **Search Bar with Filters:**

```tsx
<div className="flex flex-col lg:flex-row gap-4">
  <Input
    type="search"
    placeholder="Search jobs by title, company, or skills..."
    startContent={<Search className="h-4 w-4 text-muted-foreground" />}
    isClearable
    className="flex-1"
    size="lg"
  />
  
  <div className="flex gap-2">
    <Select
      placeholder="All Locations"
      className="w-full lg:w-48"
      size="md"
    >
      <SelectItem key="riyadh">Riyadh</SelectItem>
      <SelectItem key="jeddah">Jeddah</SelectItem>
      <SelectItem key="dammam">Dammam</SelectItem>
    </Select>

    <Select
      placeholder="Job Type"
      className="w-full lg:w-48"
      size="md"
    >
      <SelectItem key="full">Full-time</SelectItem>
      <SelectItem key="part">Part-time</SelectItem>
      <SelectItem key="contract">Contract</SelectItem>
    </Select>
  </div>
</div>
```

### **Empty States:**

```tsx
import { Card, CardBody, Button } from '@heroui/react';

<Card className="border-dashed border-2 border-border">
  <CardBody className="text-center py-12">
    <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Inbox className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
    <p className="text-sm text-muted-foreground mb-6">
      Try adjusting your filters or search terms
    </p>
    <Button color="primary" variant="flat">
      Clear Filters
    </Button>
  </CardBody>
</Card>
```

### **Loading State:**

```tsx
import { Skeleton, Card, CardBody } from '@heroui/react';

<Card>
  <CardBody className="space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>
    </div>
    <Skeleton className="h-24 rounded-lg" />
    <div className="flex gap-2">
      <Skeleton className="h-10 w-32 rounded-md" />
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  </CardBody>
</Card>
```

---

## 🎯 **12. QUICK REFERENCE**

### **Most Used Dashboard Components:**

| Component | Use Case | Import |
|-----------|----------|--------|
| Button | Actions, CTAs | `@heroui/react` |
| Card | Content containers | `@heroui/react` |
| Input | Form fields | `@heroui/react` |
| Select | Dropdowns | `@heroui/react` |
| Table | Data display | `@heroui/react` |
| Tabs | Content organization | `@heroui/react` |
| Modal | Dialogs | `@heroui/react` |
| Badge | Counters, status | `@heroui/react` |
| Chip | Tags, labels | `@heroui/react` |
| Avatar | User images | `@heroui/react` |
| Progress | Loading bars | `@heroui/react` |
| Skeleton | Loading placeholders | `@heroui/react` |
| Dropdown | Context menus | `@heroui/react` |
| DatePicker | Date selection | `@heroui/react` |
| Navbar | Top navigation | `@heroui/react` |

### **Button Quick Guide:**

```tsx
// Hierarchy
<Button color="primary" size="lg">Primary</Button>
<Button color="primary" variant="bordered" size="md">Secondary</Button>
<Button variant="light" size="sm">Tertiary</Button>

// With Icons
<Button color="primary">
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>

// Icon Only
<Button isIconOnly color="primary" size="sm">
  <Settings className="h-4 w-4" />
</Button>

// States
<Button isLoading color="primary">Loading...</Button>
<Button isDisabled>Disabled</Button>

// Full Width
<Button color="primary" className="w-full">Full Width</Button>
```

### **Card Quick Guide:**

```tsx
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@heroui/react';

<Card>
  <CardHeader className="flex gap-3">
    <Avatar src="..." />
    <div>
      <p className="text-md font-semibold">Title</p>
      <p className="text-small text-default-500">Subtitle</p>
    </div>
  </CardHeader>
  
  <Divider />
  
  <CardBody>
    <p>Card content goes here...</p>
  </CardBody>
  
  <Divider />
  
  <CardFooter>
    <Button color="primary">Action</Button>
  </CardFooter>
</Card>

// Pressable Card
<Card isPressable onPress={() => console.log("clicked")}>
  <CardBody>
    Click me!
  </CardBody>
</Card>
```

---

## 📊 **13. COMPLETE COMPONENT API**

### **Common Props Across Components:**

**Color Prop:**
- `default`, `primary`, `secondary`, `success`, `warning`, `danger`

**Size Prop:**
- `sm`, `md`, `lg` (some have `xs` and `xl`)

**Variant Prop (Buttons, Cards, Inputs):**
- `solid`, `bordered`, `light`, `flat`, `faded`, `shadow`, `ghost`

**Radius Prop:**
- `none`, `sm`, `md`, `lg`, `full`

**Boolean States:**
- `isDisabled` - Disable interaction
- `isLoading` - Show loading state
- `isRequired` - Mark as required (forms)
- `isReadOnly` - Read-only state
- `isInvalid` - Error/validation state
- `isClearable` - Add clear button (inputs)

---

## 🎓 **14. LEARNING SUMMARY**

### **✅ Completed Learning Objectives:**

1. ✅ **Getting Started** - Installation, setup, basic usage
2. ✅ **Frameworks** - Vite integration (your stack!)
3. ✅ **Customization** - Themes, colors, dark mode
4. ✅ **Components** - 20+ components mastered
5. ✅ **API References** - Provider, CLI, common APIs
6. ✅ **Design Principles** - Simplicity, modularity, accessibility
7. ✅ **Modern Patterns** - 2025 dashboard design trends
8. ✅ **Real-World Examples** - Production-ready patterns

### **📚 Resources Explored:**

- Introduction & Philosophy
- Installation Guide
- CLI Commands
- Routing Patterns
- Form Handling
- Vite Integration
- Theme Customization
- Color System
- Dark Mode Implementation
- Table Component
- Tabs Component
- Progress Component
- Avatar Component
- Badge Component
- Modal Component
- Skeleton Component
- Dropdown Component
- DatePicker Component
- Input Component
- Select Component
- Autocomplete Component
- Navbar Component
- Drawer Component
- Design Principles

### **⚡ Key Takeaways:**

1. **HeroUI ≠ shadcn/ui** - They complement each other!
   - HeroUI: npm-installed, managed externally, complex components
   - shadcn/ui: copy-paste, you own the code, full customization

2. **TailwindCSS Powers Everything** - All HeroUI components use Tailwind classes

3. **React Aria Foundation** - Built-in accessibility, keyboard navigation

4. **Modular Architecture** - Install only what you need

5. **Modern Design System** - 2025 trends baked in (gradients, rings, backdrop blur)

6. **Performance Optimized** - Tree-shaking, lazy loading support

7. **Dark Mode Native** - Automatic theme adaptation

8. **Form Validation Built-in** - Labels, descriptions, error messages

---

**You now have complete HeroUI mastery for building modern, accessible, beautiful dashboards!** 🎓

---

Here's a **copy-paste prompt** you can use with any AI code tool to redesign your page using **HeroUI**.

---

**Prompt: HeroUI Redesign (Modern UI, Images, Hover, A11y, RTL/LTR)**

You are a senior React UI engineer. **Redesign the following page using HeroUI** (React) with a clean, modern look, subtle motion, and great UX.

**Inputs**

* Tech: React + TypeScript + Tailwind + **HeroUI** (`@heroui/react`) + **HeroUI Icons** (`@heroui/icons`) *(use only these UI libs)*
* Theme: use the **theme preset from system** for colors, radii, shadows
* Source page code (to transform):

```tsx
{PASTE_CURRENT_PAGE_CODE_HERE}
```

**Requirements**

1. Replace custom/styled divs with HeroUI primitives/components (e.g., `Navbar`, `Card`, `Button`, `Input`, `Tabs`, `Tooltip`, `Badge`, `Chip`, `Dropdown`, `Modal`, `Skeleton`).
2. Add **modern imagery** (hero + section visuals) with responsive `<Image/>` and **decorative icons** from `@heroui/icons` in headings, lists, and buttons. Use accessible alt text.

   * For demos, use Unsplash placeholders like: `https://images.unsplash.com/photo-...` (cover, contain, rounded-xl).
3. **Interaction polish**: hover/focus/pressed states (elevations, subtle scale, ring), micro-animations on cards and CTAs, tooltips for secondary actions, skeletons for loading.
4. **Layout**: responsive grid (mobile 1-col → md 2-col → lg 3/4-col), sticky CTA bar on small screens, consistent spacing (Tailwind `gap-*`, `py-*`), section headings with supporting text.
5. **Accessibility**: semantic landmarks, keyboard-focus visible, aria labels for icon-only buttons, color contrast AA, reduced motion respect.
6. **Internationalization & Direction**: support **EN (LTR) and AR (RTL)**; use logical CSS (no left/right), ensure icons with direction (chevrons/arrows) flip correctly.
7. **Performance**: lazy-load non-critical images, compress via query params if applicable, avoid large inline SVGs, prefer icon components.
8. **Empty/error states**: friendly copy, icon, and primary action; loading = Skeleton; error = inline Alert.
9. **No new dependencies beyond HeroUI + HeroUI Icons**. Keep code modular.

**Deliverables (exact format)**

* Output **only code blocks**, one per file, with the path header:

  ```tsx
  src/pages/RedesignedPage.tsx
  // code here
  ```

  ```tsx
  src/components/sections/Hero.tsx
  // code here
  ```
* Include: a) page component, b) small section components (Hero, Features, Gallery, Pricing/CTA as needed), c) minor hooks if used.
* Add test IDs: `data-testid="hero"`, `"feature-card"`, `"primary-cta"`.

**Visual/UX notes**

* Hero: headline + supporting text + primary/secondary CTA, background image with soft gradient overlay and subtle parallax/tilt on hover.
* Cards: icon top-left, title, short copy, link/CTA; hover = elevate + translate-y-1 + ring.
* Buttons: primary solid, secondary ghost/outlined, both with icon slots.
* Use Chips/Badges for statuses, Tabs/Accordion where dense content benefits.

**Acceptance checklist**

* Builds with `@heroui/react` + `@heroui/icons` only.
* Fully responsive, dark-mode friendly, RTL/LTR correct.
* Hover/focus states and animations present but subtle.
* Images and icons enhance scannability without clutter.
* No inline styles except tiny one-offs; prefer Tailwind classes.
* No dead code; components small and composable.

