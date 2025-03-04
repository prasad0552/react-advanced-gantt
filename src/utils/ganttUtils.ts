import { GanttTask } from '../types/gantt';
import { format, differenceInDays, addDays } from 'date-fns';

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Format date for display
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

// Calculate task duration in days
export function getTaskDuration(task: GanttTask): number {
  return differenceInDays(task.endDate, task.startDate) + 1;
}

// Check if a task is a milestone (0 duration)
export function isMilestone(task: GanttTask): boolean {
  return getTaskDuration(task) === 1;
}

// Get all tasks as a flat array (including children)
export function flattenTasks(tasks: GanttTask[]): GanttTask[] {
  return tasks.reduce((acc: GanttTask[], task) => {
    acc.push(task);
    if (task.children && task.children.length > 0 && !task.collapsed) {
      acc.push(...flattenTasks(task.children));
    }
    return acc;
  }, []);
}

// Get the earliest start date from a list of tasks
export function getEarliestStartDate(tasks: GanttTask[]): Date {
  const flatTasks = flattenTasks(tasks);
  return flatTasks.reduce(
    (earliest, task) => (task.startDate < earliest ? task.startDate : earliest),
    flatTasks[0]?.startDate || new Date()
  );
}

// Get the latest end date from a list of tasks
export function getLatestEndDate(tasks: GanttTask[]): Date {
  const flatTasks = flattenTasks(tasks);
  return flatTasks.reduce(
    (latest, task) => (task.endDate > latest ? task.endDate : latest),
    flatTasks[0]?.endDate || addDays(new Date(), 30)
  );
}

// Convert a task to a CSV row
export function taskToCSV(task: GanttTask, level = 0): string {
  const indent = '\t'.repeat(level);
  const startDateStr = format(task.startDate, 'yyyy-MM-dd');
  const endDateStr = format(task.endDate, 'yyyy-MM-dd');
  
  return `${indent}${task.name},${startDateStr},${endDateStr},${task.progress}\n`;
}

// Export tasks to CSV
export function exportToCSV(tasks: GanttTask[]): string {
  let csv = 'Task Name,Start Date,End Date,Progress\n';
  
  function processTask(task: GanttTask, level: number) {
    csv += taskToCSV(task, level);
    
    if (task.children && task.children.length > 0 && !task.collapsed) {
      task.children.forEach((child) => processTask(child, level + 1));
    }
  }
  
  tasks.forEach((task) => processTask(task, 0));
  
  return csv;
}

// Convert base64 to Blob
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
}