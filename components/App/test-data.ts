const testData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Click in the column to display the input to create another task' },
    'task-2': { id: 'task-2', content: 'Click away or press escape to hide the input box' },
    'task-3': { id: 'task-3', content: 'Hover for delete icon, click to delete task or column' },
    'task-4': { id: 'task-4', content: 'Drag and drop to re-order columns or tasks' },
    'task-5': { id: 'task-5', content: 'Type a column title in the add column input on the right and press enter to create a new column' },
    'task-6': { id: 'task-6', content: 'Click a task or title to edit, escape or click away to cancel' },
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
