-- ============================================================
-- CREATE TEST GANTT PROJECT & TASKS
-- ============================================================
-- Purpose: Create sample project and tasks for testing Gantt Chart UI
-- User: Nasser Baylah (client)
-- User ID: ce839d18-2040-48e1-a72d-f831aea850e8
-- ============================================================

-- 1. Create Test Project
INSERT INTO gantt_projects (
  id,
  name,
  description,
  start_date,
  end_date,
  created_by,
  project_type,
  status,
  budget,
  currency,
  location
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Riyadh Office Complex',
  'Construction of a modern 5-story office building in Riyadh with complete MEP systems',
  '2025-03-01',
  '2025-12-31',
  'ce839d18-2040-48e1-a72d-f831aea850e8'::uuid,
  'commercial',
  'planning',
  2500000.00,
  'SAR',
  'Riyadh, Saudi Arabia'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = now();

-- 2. Create Sample Tasks for the Project
INSERT INTO gantt_tasks (
  id,
  project_id,
  title,
  description,
  start_date,
  end_date,
  duration,
  progress,
  parent_id,
  sort_order,
  is_milestone,
  is_critical_path,
  priority,
  task_type,
  crew_size,
  estimated_hours,
  cost_estimate
) VALUES 
  -- Phase 1: Site Preparation & Foundation
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Site Preparation & Foundation',
    'Complete site preparation including excavation and foundation work',
    '2025-03-01',
    '2025-04-30',
    60,
    0,
    NULL,
    1,
    false,
    true,
    'critical',
    'phase',
    8,
    480,
    350000
  ),
  -- Phase 2: Structural Framework
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Structural Framework',
    'Concrete columns, beams, and floor slabs for all 5 floors',
    '2025-05-01',
    '2025-07-31',
    92,
    0,
    NULL,
    2,
    false,
    true,
    'critical',
    'phase',
    12,
    1104,
    650000
  ),
  -- Phase 3: MEP Installation
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'MEP Installation',
    'Mechanical, Electrical, and Plumbing systems installation',
    '2025-08-01',
    '2025-10-15',
    76,
    0,
    NULL,
    3,
    false,
    true,
    'high',
    'phase',
    15,
    1140,
    550000
  ),
  -- Phase 4: Interior Finishing
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Interior Finishing',
    'Walls, ceilings, flooring, painting, and fixtures',
    '2025-10-16',
    '2025-12-15',
    61,
    0,
    NULL,
    4,
    false,
    false,
    'medium',
    'phase',
    10,
    610,
    400000
  ),
  -- Milestone: Project Completion
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Project Handover',
    'Final inspection, documentation, and client handover',
    '2025-12-16',
    '2025-12-31',
    15,
    0,
    NULL,
    5,
    true,
    true,
    'critical',
    'milestone',
    3,
    45,
    50000
  );

-- 3. Verify Creation
SELECT 
  'Project Created!' as status,
  id,
  name,
  start_date,
  end_date,
  budget,
  currency
FROM gantt_projects 
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

SELECT 
  'Tasks Created!' as status,
  COUNT(*) as task_count
FROM gantt_tasks 
WHERE project_id = '00000000-0000-0000-0000-000000000001'::uuid;

-- 4. Show All Tasks
SELECT 
  title,
  start_date,
  end_date,
  duration,
  priority,
  task_type,
  cost_estimate
FROM gantt_tasks 
WHERE project_id = '00000000-0000-0000-0000-000000000001'::uuid
ORDER BY sort_order;

