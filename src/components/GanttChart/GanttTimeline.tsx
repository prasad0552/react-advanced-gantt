import React from 'react';
import { TimelineUnit } from '../../types/gantt';

interface GanttTimelineProps {
  timeUnits: TimelineUnit[];
}

const GanttTimeline: React.FC<GanttTimelineProps> = ({ timeUnits }) => {
  return (
    <div className="flex border-b">
      <div className="w-64 min-w-64 border-r bg-gray-50 p-2 font-medium">
        Task
      </div>
      <div className="flex-1 flex">
        {timeUnits.map((unit) => (
          <div
            key={unit.id}
            className="border-r text-center p-2 font-medium"
            style={{ width: `${100 / timeUnits.length}%` }}
          >
            {unit.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttTimeline;