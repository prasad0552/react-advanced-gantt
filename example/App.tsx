import React, { useState } from 'react';
import { GanttChart } from '../src';
import { GanttTask, GanttViewOptions } from '../src/types/gantt';
import { addDays, addMonths, addWeeks } from 'date-fns';
import { Calendar, BarChart3, Settings, Plus } from 'lucide-react';
import { generateId } from '../src/utils/ganttUtils';
import '../src/styles.css';

function App() {
  const today = new Date();
  
  // Sample data
  const [tasks, setTasks] = useState<GanttTask[]>([
    {
      id: '1',
      name: 'Project Alpha',
      startDate: today,
      endDate: addMonths(today, 6),
      progress: 30,
      color: '#3b82f6',
      children: [
        {
          id: '1.1',
          name: 'Planning Phase',
          startDate: today,
          endDate: addWeeks(today, 2),
          progress: 100,
          color: '#60a5fa',
          parentId: '1',
          children: [
            {
              id: '1.1.1',
              name: 'Requirements Gathering',
              startDate: today,
              endDate: addDays(today, 5),
              progress: 100,
              parentId: '1.1',
            },
            {
              id: '1.1.2',
              name: 'Stakeholder Approval',
              startDate: addDays(today, 6),
              endDate: addWeeks(today, 2),
              progress: 100,
              parentId: '1.1',
            }
          ]
        },
        {
          id: '1.2',
          name: 'Design Phase',
          startDate: addWeeks(today, 2),
          endDate: addWeeks(today, 5),
          progress: 60,
          color: '#93c5fd',
          parentId: '1',
        },
        {
          id: '1.3',
          name: 'Development Phase',
          startDate: addWeeks(today, 5),
          endDate: addMonths(today, 4),
          progress: 20,
          color: '#2563eb',
          parentId: '1',
        }
      ]
    },
    {
      id: '2',
      name: 'Project Beta',
      startDate: addMonths(today, 2),
      endDate: addMonths(today, 8),
      progress: 0,
      color: '#10b981',
      collapsed: true,
      children: [
        {
          id: '2.1',
          name: 'Planning',
          startDate: addMonths(today, 2),
          endDate: addMonths(today, 3),
          progress: 0,
          parentId: '2',
        },
        {
          id: '2.2',
          name: 'Implementation',
          startDate: addMonths(today, 3),
          endDate: addMonths(today, 7),
          progress: 0,
          parentId: '2',
        }
      ]
    }
  ]);

  const [viewOptions, setViewOptions] = useState<GanttViewOptions>({
    viewMode: 'month',
    startDate: today,
    endDate: addMonths(today, 8),
  });

  const handleTaskClick = (task: GanttTask) => {
    console.log('Task clicked:', task);
  };

  const handleTaskDoubleClick = (task: GanttTask) => {
    console.log('Task double-clicked:', task);
  };

  const handleViewChange = (options: GanttViewOptions) => {
    setViewOptions(options);
  };

  const handleTaskUpdate = (updatedTask: GanttTask) => {
    // Update the task in the tasks array
    const updateTaskInArray = (tasks: GanttTask[], updatedTask: GanttTask): GanttTask[] => {
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
    };
    
    setTasks(updateTaskInArray(tasks, updatedTask));
  };

  const addNewTask = () => {
    const newTask: GanttTask = {
      id: generateId(),
      name: 'New Task',
      startDate: today,
      endDate: addMonths(today, 1),
      progress: 0,
      color: '#3b82f6',
    };
    
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">React Advanced Gantt</h1>
              <p className="text-gray-600">Interactive Gantt Chart for Project Management</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={addNewTask}
                className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center"
              >
                <Plus size={18} className="mr-1" /> Add Task
              </button>
              <button className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100">
                <Calendar size={20} />
              </button>
              <button className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100">
                <BarChart3 size={20} />
              </button>
              <button className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100">
                <Settings size={20} />
              </button>
            </div>
          </div>
          
          <GanttChart
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onTaskDoubleClick={handleTaskDoubleClick}
            onViewChange={handleViewChange}
            onTaskUpdate={handleTaskUpdate}
            viewOptions={viewOptions}
            theme={{
              primary: '#3b82f6',
              secondary: '#93c5fd',
              background: '#ffffff',
              text: '#374151',
              grid: '#e5e7eb',
              progress: '#2563eb',
              milestone: '#ef4444',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;