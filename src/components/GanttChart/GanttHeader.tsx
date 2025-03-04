import React from 'react';
import { format } from 'date-fns';
import { TimelineUnit } from '../../types/gantt';
import { ZoomIn, ZoomOut, Download, RefreshCw, ArrowUp, ArrowDown, Calendar } from 'lucide-react';

interface GanttHeaderProps {
  timeUnits: TimelineUnit[];
  viewMode: 'month' | 'quarter' | 'year';
  timelinePosition: 'top' | 'bottom';
  showCurrentDateLine: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onExport: () => void;
  onViewModeChange: (mode: 'month' | 'quarter' | 'year') => void;
  onTimelinePositionChange: (position: 'top' | 'bottom') => void;
  onToggleCurrentDateLine: () => void;
  onRecalculateTimeline: () => void;
  showNavigation?: boolean;
}

const GanttHeader: React.FC<GanttHeaderProps> = ({
  timeUnits,
  viewMode,
  timelinePosition,
  showCurrentDateLine,
  onZoomIn,
  onZoomOut,
  onPrevious,
  onNext,
  onExport,
  onViewModeChange,
  onTimelinePositionChange,
  onToggleCurrentDateLine,
  onRecalculateTimeline,
  showNavigation = true,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center p-2 bg-white border-b">
        {showNavigation && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevious}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              onClick={onNext}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="flex border rounded overflow-hidden">
            <button
              onClick={() => onViewModeChange('month')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => onViewModeChange('quarter')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'quarter' ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => onViewModeChange('year')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'year' ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleCurrentDateLine}
            className={`p-1 rounded hover:bg-gray-100 ${showCurrentDateLine ? 'text-blue-500' : 'text-gray-500'}`}
            aria-label={showCurrentDateLine ? "Hide current date line" : "Show current date line"}
            title={showCurrentDateLine ? "Hide current date line" : "Show current date line"}
          >
            <Calendar size={18} />
          </button>
          <button
            onClick={() => onTimelinePositionChange(timelinePosition === 'top' ? 'bottom' : 'top')}
            className="p-1 rounded hover:bg-gray-100"
            aria-label={`Move timeline to ${timelinePosition === 'top' ? 'bottom' : 'top'}`}
            title={`Move timeline to ${timelinePosition === 'top' ? 'bottom' : 'top'}`}
          >
            {timelinePosition === 'top' ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
          </button>
          <button
            onClick={onRecalculateTimeline}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Recalculate Timeline"
            title="Recalculate Timeline"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={onZoomIn}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={onZoomOut}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={onExport}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Export"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GanttHeader;