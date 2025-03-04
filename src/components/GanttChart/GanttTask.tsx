import React, { useState } from 'react';
import { GanttTask as GanttTaskType } from '../../types/gantt';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface GanttTaskRowProps {
  task: GanttTaskType;
  level: number;
  timeWidth: number;
  startDate: Date;
  endDate: Date;
  onTaskClick: (task: GanttTaskType) => void;
  onTaskDoubleClick: (task: GanttTaskType) => void;
  onCollapseToggle: (taskId: string) => void;
}

const GanttTaskRow: React.FC<GanttTaskRowProps> = ({
  task,
  level,
  timeWidth,
  startDate,
  endDate,
  onTaskClick,
  onTaskDoubleClick,
  onCollapseToggle,
}) => {
  const hasChildren = task.children && task.children.length > 0;
  const totalDuration = endDate.getTime() - startDate.getTime();
  
  // Calculate position and width
  const taskStart = Math.max(task.startDate.getTime(), startDate.getTime());
  const taskEnd = Math.min(task.endDate.getTime(), endDate.getTime());
  
  const left = ((taskStart - startDate.getTime()) / totalDuration) * 100;
  const width = ((taskEnd - taskStart) / totalDuration) * 100;
  
  // Default color if not specified
  const barColor = task.color || '#3b82f6';
  
  return (
    <>
      <div className="flex border-b hover:bg-gray-50">
        <div 
          className="w-64 min-w-64 border-r p-2 flex items-center"
          style={{ paddingLeft: `${(level * 20) + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => onCollapseToggle(task.id)}
              className="mr-1 p-1 rounded hover:bg-gray-200"
            >
              {task.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          <span className="truncate flex-1">{task.name}</span>
        </div>
        
        <div className="flex-1 relative" style={{ height: '32px' }}>
          <div
            className="absolute top-0 bottom-0 my-auto rounded-sm cursor-pointer"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              backgroundColor: barColor,
              opacity: 0.8,
              height: '16px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            onClick={() => onTaskClick(task)}
            onDoubleClick={() => onTaskDoubleClick(task)}
          >
            <div 
              className="h-full rounded-sm" 
              style={{ 
                width: `${task.progress}%`, 
                backgroundColor: barColor,
                opacity: 1
              }} 
            />
            
            {width > 10 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                {task.progress}%
              </div>
            )}
          </div>
        </div>
      </div>
      
      {hasChildren && !task.collapsed && task.children?.map((childTask) => (
        <GanttTaskRow
          key={childTask.id}
          task={childTask}
          level={level + 1}
          timeWidth={timeWidth}
          startDate={startDate}
          endDate={endDate}
          onTaskClick={onTaskClick}
          onTaskDoubleClick={onTaskDoubleClick}
          onCollapseToggle={onCollapseToggle}
        />
      ))}
    </>
  );
};

export default GanttTaskRow;