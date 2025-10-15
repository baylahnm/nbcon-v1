import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface InlineEditState {
  isEditMode: boolean;
  selectedComponent: string | null;
  showToolbar: boolean;
  toolbarPosition: { x: number; y: number };
  isDragging: boolean;
  dragPreview: any | null;
  hoveredDropZone: string | null;
}

interface InlineDashboardEditStore extends InlineEditState {
  // Actions
  toggleEditMode: () => void;
  setEditMode: (isEditMode: boolean) => void;
  selectComponent: (componentId: string | null) => void;
  showToolbarAt: (x: number, y: number) => void;
  hideToolbar: () => void;
  setDragging: (isDragging: boolean, preview?: any) => void;
  setHoveredDropZone: (zoneId: string | null) => void;
  
  // Component management
  addComponent: (type: string, position: { x: number; y: number }) => void;
  removeComponent: (componentId: string) => void;
  updateComponent: (componentId: string, updates: any) => void;
  
  // Layout management
  moveComponent: (componentId: string, newPosition: { x: number; y: number }) => void;
  resizeComponent: (componentId: string, newSize: { width: number; height: number }) => void;
}

const initialState: InlineEditState = {
  isEditMode: false,
  selectedComponent: null,
  showToolbar: false,
  toolbarPosition: { x: 0, y: 0 },
  isDragging: false,
  dragPreview: null,
  hoveredDropZone: null,
};

export const useInlineDashboardEditStore = create<InlineDashboardEditStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Toggle edit mode
      toggleEditMode: () => {
        const { isEditMode } = get();
        set({ 
          isEditMode: !isEditMode,
          selectedComponent: null,
          showToolbar: false,
          isDragging: false,
          dragPreview: null,
          hoveredDropZone: null
        });
      },

      // Set edit mode
      setEditMode: (isEditMode: boolean) => {
        set({ 
          isEditMode,
          selectedComponent: null,
          showToolbar: false,
          isDragging: false,
          dragPreview: null,
          hoveredDropZone: null
        });
      },

      // Select component
      selectComponent: (componentId: string | null) => {
        set({ selectedComponent: componentId });
      },

      // Show toolbar at position
      showToolbarAt: (x: number, y: number) => {
        set({ 
          showToolbar: true, 
          toolbarPosition: { x, y } 
        });
      },

      // Hide toolbar
      hideToolbar: () => {
        set({ showToolbar: false });
      },

      // Set dragging state
      setDragging: (isDragging: boolean, preview?: any) => {
        set({ 
          isDragging, 
          dragPreview: preview || null 
        });
      },

      // Set hovered drop zone
      setHoveredDropZone: (zoneId: string | null) => {
        set({ hoveredDropZone: zoneId });
      },

      // Add component
      addComponent: (type: string, position: { x: number; y: number }) => {
        // This will be implemented when we integrate with the dashboard editor store
        console.log('Adding component:', type, 'at position:', position);
      },

      // Remove component
      removeComponent: (componentId: string) => {
        // This will be implemented when we integrate with the dashboard editor store
        console.log('Removing component:', componentId);
      },

      // Update component
      updateComponent: (componentId: string, updates: any) => {
        // This will be implemented when we integrate with the dashboard editor store
        console.log('Updating component:', componentId, 'with:', updates);
      },

      // Move component
      moveComponent: (componentId: string, newPosition: { x: number; y: number }) => {
        // This will be implemented when we integrate with the dashboard editor store
        console.log('Moving component:', componentId, 'to:', newPosition);
      },

      // Resize component
      resizeComponent: (componentId: string, newSize: { width: number; height: number }) => {
        // This will be implemented when we integrate with the dashboard editor store
        console.log('Resizing component:', componentId, 'to:', newSize);
      },
    }),
    {
      name: 'inline-dashboard-edit-store'
    }
  )
);

export default useInlineDashboardEditStore;
