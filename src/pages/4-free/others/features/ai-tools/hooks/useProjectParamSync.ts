import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjectStore } from '../../../stores/useProjectStore';

/**
 * Bidirectional sync between URL ?project=<id> parameter and useProjectStore
 * 
 * Usage in tool components:
 * ```typescript
 * import { useProjectParamSync } from '../hooks/useProjectParamSync';
 * 
 * export default function MyTool() {
 *   useProjectParamSync(); // That's it!
 *   const { getSelectedProject } = useProjectStore();
 *   const project = getSelectedProject();
 *   // ...
 * }
 * ```
 * 
 * Features:
 * - On mount: Reads ?project=<id> from URL and selects it in store (if not already selected)
 * - On store change: Updates URL to match selectedProjectId (using replaceState, no reload)
 * - Enables direct links, bookmarks, and page refresh to work correctly
 * - Single source of truth: URL ↔ Store always in sync
 */
export function useProjectParamSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedProjectId, selectProject } = useProjectStore();

  // Effect 1: Sync URL → Store (on mount or when URL changes)
  useEffect(() => {
    const projectIdFromUrl = searchParams.get('project');
    
    // If URL has project ID and it's different from selected, update store
    if (projectIdFromUrl && projectIdFromUrl !== selectedProjectId) {
      selectProject(projectIdFromUrl);
    }
  }, [searchParams, selectedProjectId, selectProject]);

  // Effect 2: Sync Store → URL (when selected project changes)
  useEffect(() => {
    const currentUrlProject = searchParams.get('project');
    
    // If store has a project selected and URL doesn't match, update URL
    if (selectedProjectId && currentUrlProject !== selectedProjectId) {
      setSearchParams({ project: selectedProjectId }, { replace: true });
    }
    
    // If no project selected, remove project param from URL
    if (!selectedProjectId && currentUrlProject) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('project');
      setSearchParams(newParams, { replace: true });
    }
  }, [selectedProjectId, searchParams, setSearchParams]);
}

