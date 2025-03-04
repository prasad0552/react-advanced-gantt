// Export components
export { default as GanttChart } from './components/GanttChart/GanttChart';
export { default as GanttHeader } from './components/GanttChart/GanttHeader';
export { default as GanttTaskRow } from './components/GanttChart/GanttTask';
export { default as TaskEditModal } from './components/GanttChart/TaskEditModal';

// Export types
export type { GanttTask, GanttViewOptions, GanttChartProps, TimelineUnit } from './types/gantt';

// Export utils
export { 
  generateId, 
  formatDate, 
  getTaskDuration, 
  isMilestone, 
  flattenTasks,
  getEarliestStartDate,
  getLatestEndDate,
  exportToCSV
} from './utils/ganttUtils';

// Export store
export { useGanttStore } from './store/ganttStore';