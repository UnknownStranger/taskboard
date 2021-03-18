import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Box } from '@material-ui/core';
import Column from './Column';
import testData from './test-data';
import AddColumn from './AddColumn';

interface AppState {
  data: typeof testData;
}

interface Result {
  draggableId: string;
  type: string;
  reason: string;
  source: Source;
  destination?: Destination;
}

interface Source {
  droppableId: string;
  index: number;
}

interface Destination {
  droppableId: string;
  index: number;
}

interface Column {
  id: string;
  title: string;
  taskIds: [string];
}

class App extends React.Component<{}, AppState> {
  constructor(props: AppState) {
    super(props);
    this.state = {
      data: testData,
    };
    this.addTask = this.addTask.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.editTitle = this.editTitle.bind(this);
  }

  onDragEnd = (result: Result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    // if the user drops the card in its original position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = [...this.state.data.columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newData = {
        ...this.state.data,
        columnOrder: newColumnOrder,
      };

      this.setState(() => ({
        data: newData,
      }));
    }

    if (type === 'task') {
      const sourceColumn = { ...this.state.data.columns[source.droppableId] };
      let destinationColumn = { ...this.state.data.columns[destination.droppableId] };
      if (source.droppableId === destination.droppableId) {
        destinationColumn = sourceColumn;
      }
      const newSourceTaskIds = sourceColumn.taskIds;
      const newDestinationTaskIds = destinationColumn.taskIds;
      newSourceTaskIds.splice(source.index, 1);
      newDestinationTaskIds.splice(destination.index, 0, draggableId);

      const newSourceColumn = {
        ...sourceColumn,
        taskIds: newSourceTaskIds,
      };
      const newDestinationColumn = {
        ...destinationColumn,
        taskIds: newDestinationTaskIds,
      };

      const newData = {
        ...this.state.data,
        columns: {
          ...this.state.data.columns,
          [newSourceColumn.id]: newSourceColumn,
          [newDestinationColumn.id]: newDestinationColumn,
        },
      };

      this.setState(() => ({
        data: newData,
      }));
    }
  };

  // updating state when new tasks are added
  addTask(
    childState: { tasks: { id: string; task: string }[]; id: string },
    task: { id: string },
    column: Column,
  ) {
    const newTaskIds = [];
    childState.tasks.forEach((t: { id: string; task: string }) => {
      newTaskIds.push(t.id);
    });

    const newColumns = { ...this.state.data.columns };
    newColumns[childState.id] = column;

    const newTasks = { ...this.state.data.tasks };
    newTasks[task.id] = task;

    this.setState(() => ({
      data: { ...this.state.data, columns: newColumns, tasks: newTasks },
    }));
  }
  // updating state when new column is created
  addColumn(t: string, uid: string) {
    const newColumn = { id: uid, title: t, taskIds: [] };
    const newColumns = { ...this.state.data.columns };
    newColumns[uid] = newColumn;

    const newColumnOrder = [...this.state.data.columnOrder, uid];
    this.setState(() => ({
      data: { ...this.state.data, columnOrder: newColumnOrder, columns: newColumns },
    }));
  }

  deleteTask(id: string, index: number, parentId: string) {
    // removing task from column
    const editedColumn = { ...this.state.data.columns[parentId] };
    editedColumn.taskIds.splice(index, 1);
    const editedColumns = { ...this.state.data.columns, editedColumn };

    // removing task from task list object
    const editedTasks = { ...this.state.data.tasks };
    delete editedTasks[id];

    this.setState(() => ({
      data: { ...this.state.data, columns: editedColumns, tasks: editedTasks },
    }));
  }

  deleteColumn(id: string, index: number) {
    const editedColumnOrder = [...this.state.data.columnOrder];
    editedColumnOrder.splice(index, 1);

    const editedColumns = { ...this.state.data.columns };
    const tasksToRemove = editedColumns[id].taskIds;
    const editedTasks = { ...this.state.data.tasks };
    tasksToRemove.forEach((task: string) => {
      delete editedTasks[task];
    });
    delete editedColumns[id];

    this.setState(() => ({
      data: {
        ...this.state.data,
        columns: editedColumns,
        columnOrder: editedColumnOrder,
        tasks: editedTasks,
      },
    }));
  }

  editTitle(id: string, value: string) {
    const editedColumn = { ...this.state.data.columns[id], title: value };
    const editedColumns = { ...this.state.data.columns };
    editedColumns[id] = editedColumn;
    this.setState(() => ({
      data: { ...this.state.data, columns: editedColumns },
    }));
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={'columnContainer'} direction='horizontal' type='column'>
          {(provided: any) => (
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='left'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.state.data.columnOrder.map((columnId, index) => {
                const column = this.state.data.columns[columnId];
                const tasks = column.taskIds.map((taskId: string) => this.state.data.tasks[taskId]);
                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    addTask={this.addTask}
                    deleteColumn={this.deleteColumn}
                    deleteTask={this.deleteTask}
                    editTitle={this.editTitle}
                  />
                );
              })}
              {provided.placeholder}
              <AddColumn addColumn={this.addColumn} />
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default App;
