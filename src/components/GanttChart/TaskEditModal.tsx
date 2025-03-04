import React, { useState, useEffect } from 'react';
import { GanttTask } from '../../types/gantt';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface TaskEditModalProps {
  task: GanttTask | null;
  onClose: () => void;
  onSave: (updatedTask: GanttTask) => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState('#3b82f6');

  useEffect(() => {
    if (task) {
      setName(task.name);
      setStartDate(format(task.startDate, 'yyyy-MM-dd'));
      setEndDate(format(task.endDate, 'yyyy-MM-dd'));
      setProgress(task.progress);
      setColor(task.color || '#3b82f6');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task) return;
    
    const updatedTask: GanttTask = {
      ...task,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      progress,
      color,
    };
    
    onSave(updatedTask);
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
              Progress: {progress}%
            </label>
            <input
              type="range"
              id="progress"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 border-0 p-0 mr-2"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;