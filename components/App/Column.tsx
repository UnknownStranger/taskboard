import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Container, Box, TextField, ClickAwayListener } from '@material-ui/core';
import TaskCard from './TaskCard';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = () =>
  createStyles({
    container: {
      backgroundColor: 'whitesmoke',
      minWidth: 350,
      maxWidth: 350,
      paddingBottom: 20,
      margin: 20,
      textAlign: 'center',
      alignSelf: 'flex-start',
    },
  });

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: [string];
}

interface Props extends WithStyles<typeof styles> {
  column: Column;
  tasks: Task[];
  index: number;
  addTask: Function;
}

interface ColumnState {
  id: string;
  title: string;
  tasks: Task[];
  isClicked?: boolean;
}

class Column extends React.Component<Props, ColumnState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: props.column.id,
      title: props.column.title,
      tasks: props.tasks,
      isClicked: false,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      const newTask = { id: this.generateUID(), content: event.target.value };
      const newTasks = [...this.state.tasks];
      newTasks.push(newTask);

      this.setState(() => ({ tasks: newTasks }));

      event.target.value = '';

      const column = this.props.column;
      column.taskIds.push(newTask.id);
      this.props.addTask(this.state, newTask, column);
    } else if (event.key === 'Escape') {
      event.target.value = '';
      this.setState(() => ({ isClicked: false }));
    }
  }

  generateUID() {
    const s4 = () =>
      Math.floor((1 + Math.random()) * 0x100000)
        .toString(16)
        .substring(1);
    const date = new Date().getTime().toString(16);
    return `${s4() + s4() + s4()}-${date}`;
  }

  handleClick(event) {
    event.stopPropagation;
    if (event.defaultPrevented || event.target.id === 'addTask') {
      return;
    }
    this.setState(() => ({ isClicked: !this.state.isClicked }));
  }

  handleClickAway(event) {
    this.setState(() => ({
      isClicked: false,
    }));
  }

  render() {
    const { classes } = this.props;
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided: any) => (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <Container
              id='addTaskArea'
              onClick={this.handleClick}
              className={classes.container}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <h1 {...provided.dragHandleProps}>{this.props.column.title}</h1>
              <Droppable droppableId={this.props.column.id} type='task'>
                {(provided: any) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    {this.props.tasks.map((task: Task, index: number) => (
                      <TaskCard
                        key={task.id}
                        taskContent={task.content}
                        taskId={task.id}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
              {this.state.isClicked && (
                <TextField
                  id='addTask'
                  label='Add Task'
                  variant='outlined'
                  onKeyDown={this.handleKeyDown}
                />
              )}
            </Container>
          </ClickAwayListener>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Column);
