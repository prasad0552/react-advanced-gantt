# React Advanced Gantt

A powerful, customizable Gantt chart component for React applications with multi-year, multi-quarter, and monthly support.

## Features

- **Multiple View Modes**: Switch between month, quarter, and year views
- **Full Timeline View**: See all time periods in a single comprehensive view
- **Customizable Styling**: Adjust colors and appearance to match your brand
- **Export Capabilities**: Export to PNG for reports and presentations
- **Hierarchical Tasks**: Organize tasks with collapsible groups and subtasks
- **Configurable Timeline Position**: Display timeline at top or bottom of the chart
- **Current Date Indicator**: Visualize today's date or any reference date on the timeline
- **Progress Tracking**: Visualize completion percentage for each task

## Installation

```bash
npm install react-advanced-gantt
```

## Usage

```jsx
import React, { useState } from 'react';
import { GanttChart } from 'react-advanced-gantt';
import 'react-advanced-gantt/dist/style.css'; // Import styles

const App = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      name: 'Project Alpha',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 5, 30),
      progress: 30,
      color: '#3b82f6',
      children: [
        {
          id: '1.1',
          name: 'Planning Phase',
          startDate: new Date(2025, 0, 1),
          endDate: new Date(2025, 0, 15),
          progress: 100,
          parentId: '1',
        },
        // More tasks...
      ]
    },
    // More projects...
  ]);

  const handleTaskUpdate = (updatedTask) => {
    // Update the task in your state
    const updateTaskInArray = (tasks, updatedTask) => {
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

  return (
    <div className="container mx-auto p-4">
      <GanttChart
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskClick={(task) => console.log('Task clicked:', task)}
        viewOptions={{
          viewMode: 'month', // 'month', 'quarter', or 'year'
          startDate: new Date(2025, 0, 1),
          endDate: new Date(2025, 11, 31),
          timelinePosition: 'bottom', // 'top' or 'bottom'
          showCurrentDateLine: true, // Show a vertical line for the current date
          currentDate: new Date(), // Date to show the vertical line (defaults to today)
        }}
        theme={{
          primary: '#3b82f6',
          secondary: '#93c5fd',
          background: '#ffffff',
          text: '#374151',
          grid: '#e5e7eb',
          progress: '#2563eb',
          milestone: '#ef4444',
          currentDateLine: '#ef4444', // Color of the current date line
        }}
      />
    </div>
  );
};

export default App;
```

## Props

### GanttChart Props

| Prop | Type | Description |
|------|------|-------------|
| `tasks` | `GanttTask[]` | Array of tasks to display in the chart |
| `onTaskUpdate` | `(task: GanttTask) => void` | Callback when a task is updated |
| `onTaskClick` | `(task: GanttTask) => void` | Callback when a task is clicked |
| `onTaskDoubleClick` | `(task: GanttTask) => void` | Callback when a task is double-clicked |
| `onViewChange` | `(options: GanttViewOptions) => void` | Callback when the view changes |
| `viewOptions` | `Partial<GanttViewOptions>` | Options for the chart view |
| `theme` | `object` | Theme customization options |

### GanttTask Interface

```typescript
interface GanttTask {
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
```

### GanttViewOptions Interface

```typescript
interface GanttViewOptions {
  viewMode: 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  timelinePosition?: 'top' | 'bottom'; // Default is 'bottom'
  showCurrentDateLine?: boolean; // Whether to show the current date line
  currentDate?: Date; // Date to show the vertical line (defaults to today)
}
```

## Styling

The component uses Tailwind CSS classes by default. You can override these styles by providing your own CSS.

## License

MIT