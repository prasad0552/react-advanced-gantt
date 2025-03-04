export interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  color?: string;
  children?: GanttTask[];
  collapsed?: boolean;
  parentId?: string;
  dependencies?: string[]; // IDs of tasks that this task depends on
}

export interface GanttViewOptions {
  viewMode: 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  timelinePosition?: 'top' | 'bottom';
  showCurrentDateLine?: boolean;
  currentDate?: Date;
}

export interface GanttChartProps {
  tasks: GanttTask[];
  onTaskUpdate?: (task: GanttTask) => void;
  onTaskClick?: (task: GanttTask) => void;
  onTaskDoubleClick?: (task: GanttTask) => void;
  onViewChange?: (options: GanttViewOptions) => void;
  viewOptions?: Partial<GanttViewOptions>;
  theme?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    grid: string;
    progress: string;
    milestone: string;
    currentDateLine?: string;
  };
}

export interface TimelineUnit {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
}