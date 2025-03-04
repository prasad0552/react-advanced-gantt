import React, { useRef, useEffect } from 'react';
import { 
  addMonths, 
  startOfMonth,
  endOfMonth,
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
  format
} from 'date-fns';
import { toPng } from 'html-to-image';
import { GanttChartProps, GanttTask, TimelineUnit } from '../../types/gantt';
import { useGanttStore } from '../../store/ganttStore';
import GanttHeader from './GanttHeader';
import GanttTaskRow from './GanttTask';
import GanttTimeline from './GanttTimeline';
import { getEarliestStartDate, getLatestEndDate } from '../../utils/ganttUtils';

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  onTaskUpdate,
  onTaskClick,
  onTaskDoubleClick,
  onViewChange,
  viewOptions,
  theme = {
    primary: '#3b82f6',
    secondary: '#93c5fd',
    background: '#ffffff',
    text: '#374151',
    grid: '#e5e7eb',
    progress: '#2563eb',
    milestone: '#ef4444',
    currentDateLine: '#ef4444',
  },
}) => {
  const ganttRef = useRef<HTMLDivElement>(null);
  
  const {
    tasks: storeTasks,
    viewOptions: storeViewOptions,
    setTasks,
    updateTask,
    toggleTaskCollapse,
    setViewMode,
    setDateRange,
    setTimelinePosition,
    setCurrentDateLine,
    zoomIn,
    zoomOut,
  } = useGanttStore();

  // Initialize store with props
  useEffect(() => {
    setTasks(tasks);
    
    if (viewOptions) {
      if (viewOptions.viewMode) {
        setViewMode(viewOptions.viewMode);
      }
      
      // Calculate the full date range based on all tasks
      const earliestDate = getEarliestStartDate(tasks);
      const latestDate = getLatestEndDate(tasks);
      
      // Set the date range to encompass all tasks
      setDateRange(earliestDate, latestDate);
      
      // If specific dates are provided, use those instead
      if (viewOptions.startDate && viewOptions.endDate) {
        setDateRange(viewOptions.startDate, viewOptions.endDate);
      }

      // Set timeline position if provided
      if (viewOptions.timelinePosition) {
        setTimelinePosition(viewOptions.timelinePosition);
      }
      
      // Set current date line options if provided
      if (viewOptions.showCurrentDateLine !== undefined) {
        setCurrentDateLine(
          viewOptions.showCurrentDateLine, 
          viewOptions.currentDate || new Date()
        );
      }
    }
  }, [tasks, viewOptions, setTasks, setViewMode, setDateRange, setTimelinePosition, setCurrentDateLine]);

  // Generate time units based on view mode
  const timeUnits: TimelineUnit[] = (() => {
    const { viewMode, startDate, endDate } = storeViewOptions;
    
    if (viewMode === 'month') {
      // Get all months between start and end date
      return eachMonthOfInterval({ start: startDate, end: endDate })
        .map(monthStart => {
          const monthEnd = endOfMonth(monthStart);
          return {
            id: `m-${monthStart.getTime()}`,
            label: format(monthStart, 'MMM yyyy'),
            startDate: monthStart,
            endDate: monthEnd,
          };
        });
    } else if (viewMode === 'quarter') {
      // Get all quarters between start and end date
      return eachQuarterOfInterval({ start: startDate, end: endDate })
        .map(quarterStart => {
          const quarterEnd = endOfQuarter(quarterStart);
          return {
            id: `q-${quarterStart.getTime()}`,
            label: `Q${Math.floor(quarterStart.getMonth() / 3) + 1} ${quarterStart.getFullYear()}`,
            startDate: quarterStart,
            endDate: quarterEnd,
          };
        });
    } else {
      // Get all years between start and end date
      return eachYearOfInterval({ start: startDate, end: endDate })
        .map(yearStart => {
          const yearEnd = endOfYear(yearStart);
          return {
            id: `y-${yearStart.getTime()}`,
            label: `${yearStart.getFullYear()}`,
            startDate: yearStart,
            endDate: yearEnd,
          };
        });
    }
  })();

  const handleViewModeChange = (mode: 'month' | 'quarter' | 'year') => {
    setViewMode(mode);
    
    // Recalculate the date range based on all tasks when changing view mode
    const earliestDate = getEarliestStartDate(tasks);
    const latestDate = getLatestEndDate(tasks);
    
    // Ensure we have complete months, quarters or years
    let adjustedStartDate, adjustedEndDate;
    
    if (mode === 'month') {
      adjustedStartDate = startOfMonth(earliestDate);
      adjustedEndDate = endOfMonth(latestDate);
    } else if (mode === 'quarter') {
      adjustedStartDate = startOfQuarter(earliestDate);
      adjustedEndDate = endOfQuarter(latestDate);
    } else {
      adjustedStartDate = startOfYear(earliestDate);
      adjustedEndDate = endOfYear(latestDate);
    }
    
    setDateRange(adjustedStartDate, adjustedEndDate);
    onViewChange?.({ 
      ...storeViewOptions,
      viewMode: mode, 
      startDate: adjustedStartDate, 
      endDate: adjustedEndDate 
    });
  };

  const handleTimelinePositionChange = (position: 'top' | 'bottom') => {
    setTimelinePosition(position);
    onViewChange?.({
      ...storeViewOptions,
      timelinePosition: position
    });
  };
  
  const handleToggleCurrentDateLine = () => {
    const newValue = !storeViewOptions.showCurrentDateLine;
    setCurrentDateLine(newValue, storeViewOptions.currentDate);
    onViewChange?.({
      ...storeViewOptions,
      showCurrentDateLine: newValue
    });
  };

  const handleZoomIn = () => {
    zoomIn();
    onViewChange?.(storeViewOptions);
  };

  const handleZoomOut = () => {
    zoomOut();
    onViewChange?.(storeViewOptions);
  };

  // Handle task interactions
  const handleTaskClick = (task: GanttTask) => {
    onTaskClick?.(task);
  };

  const handleTaskDoubleClick = (task: GanttTask) => {
    onTaskDoubleClick?.(task);
  };

  const handleCollapseToggle = (taskId: string) => {
    toggleTaskCollapse(taskId);
  };

  // Export to PNG
  const handleExport = () => {
    if (ganttRef.current) {
      toPng(ganttRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'gantt-chart.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Error exporting Gantt chart:', error);
        });
    }
  };

  // Recalculate full timeline
  const handleRecalculateTimeline = () => {
    const earliestDate = getEarliestStartDate(tasks);
    const latestDate = getLatestEndDate(tasks);
    
    let adjustedStartDate, adjustedEndDate;
    
    if (storeViewOptions.viewMode === 'month') {
      adjustedStartDate = startOfMonth(earliestDate);
      adjustedEndDate = endOfMonth(latestDate);
    } else if (storeViewOptions.viewMode === 'quarter') {
      adjustedStartDate = startOfQuarter(earliestDate);
      adjustedEndDate = endOfQuarter(latestDate);
    } else {
      adjustedStartDate = startOfYear(earliestDate);
      adjustedEndDate = endOfYear(latestDate);
    }
    
    setDateRange(adjustedStartDate, adjustedEndDate);
    onViewChange?.({ 
      ...storeViewOptions, 
      startDate: adjustedStartDate, 
      endDate: adjustedEndDate 
    });
  };

  const timelinePosition = storeViewOptions.timelinePosition || 'bottom';
  
  // Calculate current date line position
  const getCurrentDatePosition = () => {
    if (!storeViewOptions.showCurrentDateLine || !storeViewOptions.currentDate) {
      return null;
    }
    
    const currentDate = storeViewOptions.currentDate;
    const { startDate, endDate } = storeViewOptions;
    
    // Check if current date is within the visible range
    if (currentDate < startDate || currentDate > endDate) {
      return null;
    }
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const currentPosition = ((currentDate.getTime() - startDate.getTime()) / totalDuration) * 100;
    
    return currentPosition;
  };
  
  const currentDatePosition = getCurrentDatePosition();

  return (
    <>
      <div 
        ref={ganttRef}
        className="border rounded shadow-sm overflow-auto bg-white"
        style={{ 
          color: theme.text,
          backgroundColor: theme.background,
        }}
      >
        <GanttHeader
          timeUnits={timeUnits}
          viewMode={storeViewOptions.viewMode}
          timelinePosition={timelinePosition}
          showCurrentDateLine={!!storeViewOptions.showCurrentDateLine}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onExport={handleExport}
          onViewModeChange={handleViewModeChange}
          onTimelinePositionChange={handleTimelinePositionChange}
          onToggleCurrentDateLine={handleToggleCurrentDateLine}
          onRecalculateTimeline={handleRecalculateTimeline}
          showNavigation={false}
        />
        
        {timelinePosition === 'top' && <GanttTimeline timeUnits={timeUnits} />}
        
        <div className="gantt-body relative">
          {/* Current date vertical line */}
          {currentDatePosition !== null && (
            <div 
              className="absolute top-0 bottom-0 w-px z-10"
              style={{ 
                left: `calc(${currentDatePosition}% + 256px)`, 
                backgroundColor: theme.currentDateLine || '#ef4444',
                borderLeft: `1px dashed ${theme.currentDateLine || '#ef4444'}`
              }}
            >
              <div 
                className="absolute top-0 left-0 transform -translate-x-1/2 bg-white text-xs px-1 rounded"
                style={{ color: theme.currentDateLine || '#ef4444' }}
              >
                {format(storeViewOptions.currentDate || new Date(), 'MMM d')}
              </div>
            </div>
          )}
          
          {storeTasks.map((task) => (
            <GanttTaskRow
              key={task.id}
              task={task}
              level={0}
              timeWidth={100 / timeUnits.length}
              startDate={storeViewOptions.startDate}
              endDate={storeViewOptions.endDate}
              onTaskClick={handleTaskClick}
              onTaskDoubleClick={handleTaskDoubleClick}
              onCollapseToggle={handleCollapseToggle}
            />
          ))}
        </div>
        
        {timelinePosition === 'bottom' && <GanttTimeline timeUnits={timeUnits} />}
      </div>
    </>
  );
};

export default GanttChart;