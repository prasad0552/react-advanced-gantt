import { create } from 'zustand';
import { GanttTask, GanttViewOptions } from '../types/gantt';
import { 
  addMonths, 
  addYears, 
  startOfMonth,
  endOfMonth,
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear 
} from 'date-fns';
import { getEarliestStartDate, getLatestEndDate } from '../utils/ganttUtils';

interface GanttState {
  tasks: GanttTask[];
  viewOptions: GanttViewOptions;
  setTasks: (tasks: GanttTask[]) => void;
  updateTask: (task: GanttTask) => void;
  toggleTaskCollapse: (taskId: string) => void;
  setViewMode: (viewMode: 'month' | 'quarter' | 'year') => void;
  setDateRange: (startDate: Date, endDate: Date) => void;
  setTimelinePosition: (position: 'top' | 'bottom') => void;
  setCurrentDateLine: (show: boolean, date?: Date) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

const defaultViewOptions: GanttViewOptions = {
  viewMode: 'quarter',
  startDate: startOfQuarter(new Date()),
  endDate: endOfQuarter(addMonths(new Date(), 3)),
  timelinePosition: 'bottom',
  showCurrentDateLine: true,
  currentDate: new Date(),
};

export const useGanttStore = create<GanttState>((set) => ({
  tasks: [],
  viewOptions: defaultViewOptions,
  
  setTasks: (tasks) => set((state) => {
    // When setting tasks, calculate the full date range
    if (tasks.length > 0) {
      const earliestDate = getEarliestStartDate(tasks);
      const latestDate = getLatestEndDate(tasks);
      
      let adjustedStartDate, adjustedEndDate;
      
      if (state.viewOptions.viewMode === 'month') {
        adjustedStartDate = startOfMonth(earliestDate);
        adjustedEndDate = endOfMonth(latestDate);
      } else if (state.viewOptions.viewMode === 'quarter') {
        adjustedStartDate = startOfQuarter(earliestDate);
        adjustedEndDate = endOfQuarter(latestDate);
      } else {
        adjustedStartDate = startOfYear(earliestDate);
        adjustedEndDate = endOfYear(latestDate);
      }
      
      return {
        tasks,
        viewOptions: {
          ...state.viewOptions,
          startDate: adjustedStartDate,
          endDate: adjustedEndDate,
        }
      };
    }
    
    return { tasks };
  }),
  
  updateTask: (updatedTask) => set((state) => ({
    tasks: updateTaskInArray(state.tasks, updatedTask),
  })),
  
  toggleTaskCollapse: (taskId) => set((state) => ({
    tasks: toggleTaskCollapseInArray(state.tasks, taskId),
  })),
  
  setViewMode: (viewMode) => set((state) => {
    const { startDate, endDate } = state.viewOptions;
    
    // When changing view mode, maintain the same overall date range
    // but adjust to complete months, quarters or years
    let newStartDate, newEndDate;
    
    if (viewMode === 'month') {
      newStartDate = startOfMonth(startDate);
      newEndDate = endOfMonth(endDate);
    } else if (viewMode === 'quarter') {
      newStartDate = startOfQuarter(startDate);
      newEndDate = endOfQuarter(endDate);
    } else {
      newStartDate = startOfYear(startDate);
      newEndDate = endOfYear(endDate);
    }
    
    return {
      viewOptions: {
        ...state.viewOptions,
        viewMode,
        startDate: newStartDate,
        endDate: newEndDate,
      },
    };
  }),
  
  setDateRange: (startDate, endDate) => set((state) => ({
    viewOptions: {
      ...state.viewOptions,
      startDate,
      endDate,
    },
  })),
  
  setTimelinePosition: (position) => set((state) => ({
    viewOptions: {
      ...state.viewOptions,
      timelinePosition: position,
    },
  })),
  
  setCurrentDateLine: (show, date) => set((state) => ({
    viewOptions: {
      ...state.viewOptions,
      showCurrentDateLine: show,
      currentDate: date || new Date(),
    },
  })),
  
  zoomIn: () => set((state) => {
    const { viewMode, startDate, endDate } = state.viewOptions;
    
    if (viewMode === 'year') {
      return {
        viewOptions: {
          ...state.viewOptions,
          viewMode: 'quarter',
          startDate: startOfQuarter(startDate),
          endDate: endOfQuarter(endDate),
        },
      };
    } else if (viewMode === 'quarter') {
      return {
        viewOptions: {
          ...state.viewOptions,
          viewMode: 'month',
          startDate: startOfMonth(startDate),
          endDate: endOfMonth(endDate),
        },
      };
    }
    
    return state;
  }),
  
  zoomOut: () => set((state) => {
    const { viewMode, startDate, endDate } = state.viewOptions;
    
    if (viewMode === 'month') {
      return {
        viewOptions: {
          ...state.viewOptions,
          viewMode: 'quarter',
          startDate: startOfQuarter(startDate),
          endDate: endOfQuarter(endDate),
        },
      };
    } else if (viewMode === 'quarter') {
      return {
        viewOptions: {
          ...state.viewOptions,
          viewMode: 'year',
          startDate: startOfYear(startDate),
          endDate: endOfYear(endDate),
        },
      };
    }
    
    return state;
  }),
}));

// Helper functions
function updateTaskInArray(tasks: GanttTask[], updatedTask: GanttTask): GanttTask[] {
  return tasks.map((task) => {
    if (task.id === updatedTask.id) {
      return { ...task, ...updatedTask };
    }
    
    if (task.children && task.children.length > 0) {
      return {
        ...task,
        children: updateTaskInArray(task.children, updatedTask),
      };
    }
    
    return task;
  });
}

function toggleTaskCollapseInArray(tasks: GanttTask[], taskId: string): GanttTask[] {
  return tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, collapsed: !task.collapsed };
    }
    
    if (task.children && task.children.length > 0) {
      return {
        ...task,
        children: toggleTaskCollapseInArray(task.children, taskId),
      };
    }
    
    return task;
  });
}