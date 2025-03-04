import React, { useState } from 'react';
import GanttChart from './components/GanttChart/GanttChart';
import { GanttTask, GanttViewOptions } from './types/gantt';
import { addDays, addMonths, addWeeks } from 'date-fns';
import { Calendar, BarChart3, Settings, Plus } from 'lucide-react';
import { generateId } from './utils/ganttUtils';

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
          children: [
            {
              id: '1.2.1',
              name: 'UI/UX Design',
              startDate: addWeeks(today, 2),
              endDate: addWeeks(today, 4),
              progress: 80,
              parentId: '1.2',
            },
            {
              id: '1.2.2',
              name: 'Architecture Design',
              startDate: addWeeks(today, 3),
              endDate: addWeeks(today, 5),
              progress: 40,
              parentId: '1.2',
            }
          ]
        },
        {
          id: '1.3',
          name: 'Development Phase',
          startDate: addWeeks(today, 5),
          endDate: addMonths(today, 4),
          progress: 20,
          color: '#2563eb',
          parentId: '1',
          children: [
            {
              id: '1.3.1',
              name: 'Frontend Development',
              startDate: addWeeks(today, 5),
              endDate: addMonths(today, 3),
              progress: 30,
              parentId: '1.3',
            },
            {
              id: '1.3.2',
              name: 'Backend Development',
              startDate: addWeeks(today, 6),
              endDate: addMonths(today, 3.5),
              progress: 20,
              parentId: '1.3',
            },
            {
              id: '1.3.3',
              name: 'API Integration',
              startDate: addMonths(today, 3),
              endDate: addMonths(today, 4),
              progress: 0,
              parentId: '1.3',
            }
          ]
        },
        {
          id: '1.4',
          name: 'Testing Phase',
          startDate: addMonths(today, 4),
          endDate: addMonths(today, 5),
          progress: 0,
          color: '#1d4ed8',
          parentId: '1',
        },
        {
          id: '1.5',
          name: 'Deployment',
          startDate: addMonths(today, 5),
          endDate: addMonths(today, 6),
          progress: 0,
          color: '#1e40af',
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
        },
        {
          id: '2.3',
          name: 'Review',
          startDate: addMonths(today, 7),
          endDate: addMonths(today, 8),
          progress: 0,
          parentId: '2',
        }
      ]
    }
  ]);

  const [viewOptions, setViewOptions] = useState<GanttViewOptions>({
    viewMode: 'month',
    startDate: today,
    endDate: addMonths(today, 8), // Extended to show all tasks
    timelinePosition: 'bottom', // Default timeline position
    showCurrentDateLine: true, // Show current date line by default
    currentDate: today, // Use today as the current date
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
              <h1 className="text-2xl font-bold text-gray-800">Project Timeline</h1>
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
              currentDateLine: '#ef4444',
            }}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Multi-year, multi-quarter support</h3>
                <p className="text-gray-600 text-sm">Visualize projects spanning multiple years and quarters</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Full timeline view</h3>
                <p className="text-gray-600 text-sm">See all months, quarters, and years in a single comprehensive view</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Customizable styling</h3>
                <p className="text-gray-600 text-sm">Adjust colors and appearance to match your brand</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Export capabilities</h3>
                <p className="text-gray-600 text-sm">Export to PNG for reports and presentations</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Hierarchical tasks</h3>
                <p className="text-gray-600 text-sm">Organize tasks with collapsible groups and subtasks</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Current date indicator</h3>
                <p className="text-gray-600 text-sm">Visualize today's date or any reference date on the timeline</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;