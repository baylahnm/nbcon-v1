// Widget Types and Interfaces for Dashboard Editor

export enum WidgetType {
  CHART = 'chart',
  STATS_CARD = 'stats_card',
  TABLE = 'table',
  AI_ASSISTANT = 'ai_assistant',
  JOB_LIST = 'job_list',
  FINANCIAL_OVERVIEW = 'financial_overview',
  TASK_LIST = 'task_list',
  QUICK_ACTIONS = 'quick_actions',
  CUSTOM_HTML = 'custom_html',
  CALENDAR = 'calendar',
  MESSAGES = 'messages',
  PROJECT_PROGRESS = 'project_progress'
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface WidgetConfig {
  [key: string]: any;
  title?: string;
  showTitle?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  dataSource?: string;
  refreshInterval?: number;
  height?: number;
  width?: number;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  config: WidgetConfig;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  description?: string;
  widgets: Widget[];
  gridConfig: {
    cols: number;
    rowHeight: number;
    margin: [number, number];
    containerPadding: [number, number];
    isDraggable: boolean;
    isResizable: boolean;
    isBounded: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetLibraryItem {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultConfig: WidgetConfig;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize: { w: number; h: number };
}

export interface EditModeState {
  isEditMode: boolean;
  selectedWidgetId: string | null;
  draggedWidgetId: string | null;
  showWidgetLibrary: boolean;
  showConfigPanel: boolean;
  gridSize: { cols: number; rows: number };
}

export interface DashboardEditorState {
  currentLayout: DashboardLayout | null;
  editMode: EditModeState;
  availableWidgets: WidgetLibraryItem[];
  history: {
    past: DashboardLayout[];
    future: DashboardLayout[];
  };
  isLoading: boolean;
  error: string | null;
}
