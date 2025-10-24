# 🔧 Phase 2: Full Tool Integration Guide

**Created:** October 24, 2025  
**Status:** Ready to implement  
**Estimated Time:** 10 hours  
**Prerequisites:** Phase 1 Complete ✅

---

## 📋 Overview

This guide provides step-by-step instructions to integrate the remaining 5 AI Planning Tools with the unified project management system.

**Tools to Integrate:**
1. Project Charter Generator
2. WBS Builder
3. Risk Register
4. Stakeholder Mapper
5. Resource Planner

**Goal:** All tools load/save data from database for selected project, with full persistence.

---

## 🗄️ Database Migrations

### **Migration Files Created:**

**1. Charter Sections Table** ✅
- **File:** `supabase/migrations/20241024000001_project_charter_sections.sql`
- **Table:** `project_charter_sections`
- **Purpose:** Store 6 charter sections (Vision, Scope, Success Criteria, etc.)
- **Status:** ✅ Ready to apply

**2. Project Risks Table** ✅
- **File:** `supabase/migrations/20241024000002_project_risks.sql`
- **Table:** `project_risks`
- **Purpose:** Store risk data with probability×impact scoring
- **Status:** ✅ Ready to apply

**3. Project Stakeholders Table** ✅
- **File:** `supabase/migrations/20241024000003_project_stakeholders.sql`
- **Table:** `project_stakeholders`
- **Purpose:** Store stakeholder data with power/interest matrix
- **Status:** ✅ Ready to apply

### **How to Apply Migrations:**

**Option 1: Supabase Dashboard (Recommended)**
1. Open Supabase SQL Editor
2. Copy contents of each migration file
3. Paste and run one at a time
4. Verify success messages

**Option 2: Supabase CLI**
```bash
# Apply all migrations
supabase db push

# Or apply individually
supabase migration up
```

---

## 🛠️ Tool Integration Steps

### **1. Project Charter Generator** (2 hours)

**Current State:**
- Uses sample data in component state
- AI generates content but doesn't save
- Refreshing page loses all data

**Target State:**
- Load sections from `project_charter_sections` table
- Save content to database on edit
- AI-generated content persists
- Empty state when no project selected

**Implementation Steps:**

#### **Step 1.1: Create Charter Store**

**File:** `src/pages/4-free/others/features/ai-tools/stores/useCharterStore.ts`

```typescript
import { create } from 'zustand';
import { supabase } from '@/shared/supabase/client';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';

interface CharterSection {
  id: string;
  project_id: string;
  section_name: string;
  section_order: number;
  section_description: string;
  content: string;
  is_completed: boolean;
  ai_generated: boolean;
}

interface CharterStore {
  sections: CharterSection[];
  isLoading: boolean;
  error: string | null;
  
  loadSections: (projectId: string) => Promise<void>;
  updateSection: (sectionId: string, content: string) => Promise<void>;
  generateSection: (projectId: string, sectionName: string) => Promise<void>;
  toggleComplete: (sectionId: string) => Promise<void>;
}

export const useCharterStore = create<CharterStore>((set, get) => ({
  sections: [],
  isLoading: false,
  error: null,
  
  loadSections: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('project_charter_sections')
        .select('*')
        .eq('project_id', projectId)
        .order('section_order', { ascending: true });
      
      if (error) throw error;
      
      // If no sections, create default 6 sections
      if (!data || data.length === 0) {
        await get().initializeDefaultSections(projectId);
        return;
      }
      
      set({ sections: data, isLoading: false });
    } catch (error) {
      console.error('Error loading charter sections:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load sections',
        isLoading: false 
      });
    }
  },
  
  initializeDefaultSections: async (projectId: string) => {
    const defaultSections = [
      { name: 'Vision & Objectives', order: 1, description: 'Project vision, goals, and measurable objectives' },
      { name: 'Scope Overview', order: 2, description: 'What is included and excluded from the project' },
      { name: 'Success Criteria', order: 3, description: 'How success will be measured and evaluated' },
      { name: 'Key Stakeholders', order: 4, description: 'Stakeholder roles, responsibilities, and decision authority' },
      { name: 'Constraints & Assumptions', order: 5, description: 'Budget, schedule, resource, and regulatory constraints' },
      { name: 'Deliverables', order: 6, description: 'Major project deliverables and acceptance criteria' }
    ];
    
    const sections = defaultSections.map(s => ({
      project_id: projectId,
      section_name: s.name,
      section_order: s.order,
      section_description: s.description,
      content: '',
      is_completed: false,
      ai_generated: false
    }));
    
    const { data, error } = await supabase
      .from('project_charter_sections')
      .insert(sections)
      .select();
    
    if (error) throw error;
    set({ sections: data, isLoading: false });
  },
  
  updateSection: async (sectionId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('project_charter_sections')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', sectionId);
      
      if (error) throw error;
      
      set((state) => ({
        sections: state.sections.map(s => 
          s.id === sectionId ? { ...s, content } : s
        )
      }));
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  },
  
  generateSection: async (projectId: string, sectionName: string) => {
    // Call AI to generate content
    // Implementation depends on your AI service
    console.log('Generating section with AI:', sectionName);
  },
  
  toggleComplete: async (sectionId: string) => {
    try {
      const section = get().sections.find(s => s.id === sectionId);
      if (!section) return;
      
      const { error } = await supabase
        .from('project_charter_sections')
        .update({ is_completed: !section.is_completed })
        .eq('id', sectionId);
      
      if (error) throw error;
      
      set((state) => ({
        sections: state.sections.map(s => 
          s.id === sectionId ? { ...s, is_completed: !s.is_completed } : s
        )
      }));
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  }
}));
```

#### **Step 1.2: Update ProjectCharterTool.tsx**

**Changes Needed:**

1. **Add imports:**
```typescript
import { useProjectStore } from '../../stores/useProjectStore';
import { useCharterStore } from '../stores/useCharterStore';
```

2. **Replace local state with store:**
```typescript
// Remove
const [sections, setSections] = useState([...]);

// Add
const { getSelectedProject } = useProjectStore();
const { sections, loadSections, updateSection, isLoading } = useCharterStore();
const project = getSelectedProject();
```

3. **Load sections on mount:**
```typescript
useEffect(() => {
  if (project?.id) {
    loadSections(project.id);
  }
}, [project?.id]);
```

4. **Update section content:**
```typescript
const handleContentChange = async (sectionId: string, content: string) => {
  try {
    await updateSection(sectionId, content);
    toast({ title: 'Saved', description: 'Section updated successfully' });
  } catch (error) {
    toast({ 
      title: 'Error', 
      description: 'Failed to save section', 
      variant: 'destructive' 
    });
  }
};
```

5. **Add empty state:**
```typescript
if (!project) {
  return (
    <div className="p-8 text-center">
      <p className="text-sm font-medium">No Project Selected</p>
      <p className="text-xs text-muted-foreground mb-4">
        Please select a project from the Planning Hub
      </p>
      <Button onClick={() => navigate('/free/ai-tools/planning')}>
        Go to Planning Hub
      </Button>
    </div>
  );
}
```

---

### **2. WBS Builder** (1 hour)

**Current State:**
- Uses hierarchical sample data
- Can't persist changes

**Target State:**
- Load tasks from `gantt_tasks` table (filtered by project_id)
- Build tree from `parent_id` relationships
- Save new nodes to database

**Implementation:**

**No new table needed** - Use existing `gantt_tasks` table:
- ✅ Has `project_id` foreign key
- ✅ Has `parent_id` for hierarchy
- ✅ Has `title`, `description`, `duration`
- ✅ Already has RLS policies

**Changes:**

1. **Import useProjectStore:**
```typescript
const { getSelectedProject } = useProjectStore();
const project = getSelectedProject();
```

2. **Load tasks from Gantt store:**
```typescript
const { tasks, loadProjectTasks, createTask } = useGanttStore();

useEffect(() => {
  if (project?.id) {
    loadProjectTasks(project.id);
  }
}, [project?.id]);
```

3. **Build tree structure:**
```typescript
const buildTree = (tasks: Task[]) => {
  const taskMap = new Map(tasks.map(t => [t.id, { ...t, children: [] }]));
  const roots: any[] = [];
  
  taskMap.forEach(task => {
    if (task.parent_id) {
      const parent = taskMap.get(task.parent_id);
      if (parent) {
        parent.children.push(task);
      }
    } else {
      roots.push(task);
    }
  });
  
  return roots;
};
```

4. **Add/Edit nodes:**
```typescript
const handleAddNode = async (parentId: string | null, title: string) => {
  await createTask({
    project_id: project.id,
    parent_id: parentId,
    title,
    task_type: 'phase' // or 'work_package', 'task'
  });
};
```

---

### **3. Risk Register** (2 hours)

**Current State:**
- Sample risks in component
- 5×5 matrix visualization
- No persistence

**Target State:**
- Load risks from `project_risks` table
- Save new risks with probability/impact
- Heat map updates automatically

**Implementation Steps:**

#### **Step 3.1: Create Risk Store**

**File:** `src/pages/4-free/others/features/ai-tools/stores/useRiskStore.ts`

```typescript
import { create } from 'zustand';
import { supabase } from '@/shared/supabase/client';

interface Risk {
  id: string;
  project_id: string;
  title: string;
  description: string;
  category: string;
  probability: number; // 1-5
  impact: number; // 1-5
  risk_score: number; // probability × impact
  mitigation_strategy: string;
  status: string;
}

interface RiskStore {
  risks: Risk[];
  isLoading: boolean;
  
  loadRisks: (projectId: string) => Promise<void>;
  createRisk: (projectId: string, risk: Partial<Risk>) => Promise<void>;
  updateRisk: (riskId: string, updates: Partial<Risk>) => Promise<void>;
  deleteRisk: (riskId: string) => Promise<void>;
}

export const useRiskStore = create<RiskStore>((set) => ({
  risks: [],
  isLoading: false,
  
  loadRisks: async (projectId: string) => {
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase
        .from('project_risks')
        .select('*')
        .eq('project_id', projectId)
        .order('risk_score', { ascending: false });
      
      if (error) throw error;
      set({ risks: data || [], isLoading: false });
    } catch (error) {
      console.error('Error loading risks:', error);
      set({ isLoading: false });
    }
  },
  
  createRisk: async (projectId: string, risk: Partial<Risk>) => {
    try {
      const { data, error } = await supabase
        .from('project_risks')
        .insert([{ ...risk, project_id: projectId }])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        risks: [data, ...state.risks]
      }));
    } catch (error) {
      console.error('Error creating risk:', error);
      throw error;
    }
  },
  
  updateRisk: async (riskId: string, updates: Partial<Risk>) => {
    try {
      const { error } = await supabase
        .from('project_risks')
        .update(updates)
        .eq('id', riskId);
      
      if (error) throw error;
      
      set((state) => ({
        risks: state.risks.map(r => r.id === riskId ? { ...r, ...updates } : r)
      }));
    } catch (error) {
      console.error('Error updating risk:', error);
      throw error;
    }
  },
  
  deleteRisk: async (riskId: string) => {
    try {
      const { error } = await supabase
        .from('project_risks')
        .delete()
        .eq('id', riskId);
      
      if (error) throw error;
      
      set((state) => ({
        risks: state.risks.filter(r => r.id !== riskId)
      }));
    } catch (error) {
      console.error('Error deleting risk:', error);
      throw error;
    }
  }
}));
```

#### **Step 3.2: Update RiskRegisterTool.tsx**

**Changes:**

1. **Import stores:**
```typescript
import { useProjectStore } from '../../stores/useProjectStore';
import { useRiskStore } from '../stores/useRiskStore';
```

2. **Replace sample data:**
```typescript
const { getSelectedProject } = useProjectStore();
const { risks, loadRisks, createRisk, updateRisk, deleteRisk, isLoading } = useRiskStore();
const project = getSelectedProject();

useEffect(() => {
  if (project?.id) {
    loadRisks(project.id);
  }
}, [project?.id]);
```

3. **Update heat map to use real risks:**
```typescript
const getRisksForCell = (probability: number, impact: number) => {
  return risks.filter(r => r.probability === probability && r.impact === impact);
};
```

---

### **4. Stakeholder Mapper** (2 hours)

**Implementation:**

#### **Step 4.1: Create Stakeholder Store**

**File:** `src/pages/4-free/others/features/ai-tools/stores/useStakeholderStore.ts`

```typescript
interface Stakeholder {
  id: string;
  project_id: string;
  name: string;
  role: string;
  power_level: 'high' | 'low';
  interest_level: 'high' | 'low';
  engagement_strategy: string;
}

interface StakeholderStore {
  stakeholders: Stakeholder[];
  isLoading: boolean;
  
  loadStakeholders: (projectId: string) => Promise<void>;
  createStakeholder: (projectId: string, data: Partial<Stakeholder>) => Promise<void>;
  updateStakeholder: (id: string, updates: Partial<Stakeholder>) => Promise<void>;
  deleteStakeholder: (id: string) => Promise<void>;
}

// Implementation similar to RiskStore...
```

#### **Step 4.2: Update StakeholderMapperTool.tsx**

**Changes:**

1. **Load stakeholders for project**
2. **Map to 2×2 matrix quadrants**
3. **Save new stakeholders to database**
4. **Update engagement strategies**

---

### **5. Resource Planner** (1 hour)

**Current State:**
- Sample team members
- Utilization tracking
- No persistence

**Target State:**
- Load resources from `gantt_resources` table
- Link to tasks via `gantt_task_assignments`
- Calculate utilization from assignments

**Implementation:**

**Use Gantt Store** (already has resource methods):
```typescript
const { 
  resources, 
  loadResourcesForProject, 
  createResource, 
  updateResource 
} = useGanttStore();

useEffect(() => {
  if (project?.id) {
    loadResourcesForProject(project.id);
  }
}, [project?.id]);
```

**Calculate Utilization:**
```typescript
const calculateUtilization = (resourceId: string) => {
  const assignments = taskAssignments.filter(a => a.resource_id === resourceId);
  const totalHours = assignments.reduce((sum, a) => sum + a.assigned_hours, 0);
  const availableHours = 40 * 4; // 40 hours/week × 4 weeks
  return Math.min((totalHours / availableHours) * 100, 100);
};
```

---

## 🎯 Universal Integration Pattern

### **Template for Any Tool:**

```typescript
// 1. Import stores
import { useProjectStore } from '../../stores/useProjectStore';
import { useToolSpecificStore } from '../stores/useToolSpecificStore';

function YourTool() {
  // 2. Get selected project
  const { getSelectedProject } = useProjectStore();
  const project = getSelectedProject();
  
  // 3. Get tool-specific data
  const { data, loadData, isLoading } = useToolSpecificStore();
  
  // 4. Load data when project selected
  useEffect(() => {
    if (project?.id) {
      loadData(project.id);
    }
  }, [project?.id]);
  
  // 5. Empty state when no project
  if (!project) {
    return <EmptyProjectState />;
  }
  
  // 6. Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // 7. Render tool with data
  return (
    <div>
      <h1>{project.name} - Your Tool</h1>
      {/* Tool UI with data */}
    </div>
  );
}
```

### **Empty Project State Component:**

```typescript
function EmptyProjectState() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/free/ai-tools/planning')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Planning Hub
        </Button>
        
        <Card className="border-border/50 mt-8">
          <CardContent className="p-12 text-center">
            <div className="bg-muted/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold mb-2">No Project Selected</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Please select or create a project to use this tool
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => navigate('/free/ai-tools/planning')}>
                <Layers className="h-4 w-4 mr-2" />
                Select Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## ✅ Integration Checklist

### **For Each Tool:**

**Before Integration:**
- [ ] Identify current data source (sample data, local state, etc.)
- [ ] Determine database table (existing or new)
- [ ] Review RLS policies
- [ ] Check for related tables (foreign keys)

**During Integration:**
- [ ] Create store (if new table needed)
- [ ] Import `useProjectStore`
- [ ] Replace sample data with store data
- [ ] Add `useEffect` to load data when project selected
- [ ] Update create/edit/delete to use store methods
- [ ] Add loading states
- [ ] Add empty project state
- [ ] Add error handling

**After Integration:**
- [ ] Test create/read/update/delete operations
- [ ] Verify RLS (can't access other users' data)
- [ ] Test empty states
- [ ] Verify data persists after refresh
- [ ] Check for linter errors
- [ ] Update documentation

---

## 🧪 Testing Strategy

### **Integration Tests (Per Tool):**

**Test 1: Load Data**
1. Select project in Planning Hub
2. Navigate to tool
3. Verify data loads from database
4. Check loading spinner appears then disappears

**Test 2: Create Data**
1. Click "Add [Item]" button
2. Fill form
3. Submit
4. Verify item appears immediately
5. Refresh page
6. Verify item still present

**Test 3: Update Data**
1. Edit existing item
2. Save changes
3. Verify updates in UI
4. Refresh page
5. Verify changes persisted

**Test 4: Delete Data**
1. Delete an item
2. Verify removed from UI
3. Refresh page
4. Verify not restored

**Test 5: Empty Project State**
1. Deselect project (or clear selection)
2. Navigate to tool
3. Verify empty state shows
4. Click "Select Project" button
5. Verify navigates back to Planning Hub

**Test 6: RLS Security**
1. Create item as User A
2. Sign in as User B
3. Try to access User A's project
4. Verify: Can't see project or data

---

## 📊 Progress Tracking

### **Integration Status:**

| Tool | Store Created | Tool Updated | Database Migrated | Tested | Status |
|------|--------------|--------------|-------------------|--------|--------|
| **Charter Generator** | ⏳ Pending | ⏳ Pending | ✅ Ready | ⏳ Pending | 🔜 TODO |
| **WBS Builder** | N/A (uses Gantt) | ⏳ Pending | ✅ Ready | ⏳ Pending | 🔜 TODO |
| **Risk Register** | ⏳ Pending | ⏳ Pending | ✅ Ready | ⏳ Pending | 🔜 TODO |
| **Stakeholder Mapper** | ⏳ Pending | ⏳ Pending | ✅ Ready | ⏳ Pending | 🔜 TODO |
| **Resource Planner** | N/A (uses Gantt) | ⏳ Pending | ✅ Ready | ⏳ Pending | 🔜 TODO |

**Overall Progress:** 0/5 tools integrated (Phase 2)

---

## 🎯 Success Criteria (Phase 2)

### **When Phase 2 is Complete:**

**All 6 Tools Will:**
- ✅ Load data from database for selected project
- ✅ Save changes back to database immediately
- ✅ Persist data across sessions
- ✅ Share same project selector
- ✅ Have empty states when no project selected
- ✅ Have loading states during data fetch
- ✅ Respect RLS (user isolation)
- ✅ Handle errors gracefully

**Users Will:**
- ✅ Create project once in Planning Hub
- ✅ Use same project across all 6 tools
- ✅ All data auto-saved to database
- ✅ Data persists forever
- ✅ Work seamlessly across tools

**Developers Will Have:**
- ✅ Consistent integration pattern
- ✅ Reusable components (CreateProjectDialog, etc.)
- ✅ Type-safe stores
- ✅ Clean architecture

---

## 📝 Documentation Updates Needed

**After Phase 2:**

1. **Update 5-AI_ASSISTANT_GUIDE.md:**
   - Add database integration for each tool
   - Document new stores
   - Update testing guide

2. **Update 6-CLIENT_FREE_PORTAL.md:**
   - Document new database tables
   - Update tool descriptions
   - Add persistence features

3. **Update CHANGELOG.md:**
   - Document Phase 2 completion
   - List all integrated tools
   - Add migration notes

4. **Update 0-README.md:**
   - Update project stats (new tables)
   - Update feature descriptions

---

## 🚀 Getting Started with Phase 2

### **Step 1: Apply Migrations**

```bash
# Run in Supabase SQL Editor
# Files in order:
# 1. supabase/migrations/20241024000001_project_charter_sections.sql
# 2. supabase/migrations/20241024000002_project_risks.sql
# 3. supabase/migrations/20241024000003_project_stakeholders.sql
```

### **Step 2: Integrate Tools (One at a Time)**

**Recommended Order:**
1. Charter Generator (most complex, set pattern)
2. Risk Register (similar to charter)
3. Stakeholder Mapper (similar to charter)
4. WBS Builder (uses existing table)
5. Resource Planner (uses existing table)

### **Step 3: Test Each Tool**

After each integration:
- [ ] Create test data
- [ ] Verify persistence
- [ ] Test RLS
- [ ] Check for errors

### **Step 4: End-to-End Test**

After all 5 tools:
- [ ] Create new project
- [ ] Use in all 6 tools
- [ ] Verify data in each tool
- [ ] Refresh and verify persistence
- [ ] Test as different users

---

## 📞 Need Help?

**Questions:**
- "How do I structure the Charter store?"
  → See Step 1.1 above

- "What if I want to use AI generation?"
  → Keep AI functions, but save results to database

- "How do I handle tool-specific data models?"
  → Create interface matching database schema

- "What about complex relationships?"
  → Use foreign keys and JOIN queries

**Common Issues:**
- **RLS blocking queries:** Verify project ownership in policy
- **Data not loading:** Check `project_id` foreign key
- **Type errors:** Match interface to database schema
- **Stale data:** Call `loadData()` on project change

---

**Ready to implement when you give the signal!** 🎯

**Estimated Completion:** 10 hours for all 5 tools

**Quality:** Will match Phase 1 standards (type-safe, tested, documented)


