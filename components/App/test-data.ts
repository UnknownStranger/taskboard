const testData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Use the input at the bottom of a column to create another task' },
    'task-2': { id: 'task-2', content: 'Type a column title in the add column input on the right and press enter to create a new column' },
    'task-3': { id: 'task-3', content: 'Use the hamburger menu on the right to delete tasks or columns' },
    'task-4': { id: 'task-4', content: 'Drag and drop to re-order columns or tasks' },
    'task-5': { id: 'task-5', content: 'Click a task or title to edit' },
    'task-6': { id: 'task-6', content: 'Click away or press escape to hide the edit input for tasks and column titles' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'How To',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Continued',
      taskIds: ['task-5', 'task-6'],
    },
  },
  columnOrder: ['column-1', 'column-2'],
};

export default testData;
