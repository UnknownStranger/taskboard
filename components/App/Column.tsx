import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Container, Box, TextField, ClickAwayListener, Grid, Typography } from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import TaskCard from './TaskCard';
import Delete from './Delete';

const styles = () =>
  createStyles({
    container: {
      backgroundColor: 'whitesmoke',
      minWidth: 350,
      maxWidth: 350,
      padding: 20,
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
  deleteTask: Function;
  deleteColumn: Function;
  editTitle: Function;
  editTask: Function;
}

interface ColumnState {
  id: string;
  title: string;
  tasks: Task[];
  isClicked?: boolean;
  isHovering?: boolean;
  isEditingTitle?: boolean;
}

class Column extends React.Component<Props, ColumnState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: props.column.id,
      title: props.column.title,
      tasks: props.tasks,
      isClicked: false,
      isHovering: false,
      isEditingTitle: false,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleGlobalEscape = this.handleGlobalEscape.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleTitleEditClick = this.handleTitleEditClick.bind(this);
    this.handleClickStopPropagation = this.handleClickStopPropagation.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      if (event.target.id === 'addTask') {
        const newTask = { id: this.generateUID(), content: event.target.value };
        const newTasks = [...this.state.tasks];
        newTasks.push(newTask);

        const column = this.props.column;

        column.taskIds.push(newTask.id);
        this.props.addTask(this.state, newTask, column);
      }
      if (event.target.id === 'editTitle') {
        this.props.editTitle(this.state.id, event.target.value);
        this.setState(() => ({
          title: event.target.value,
          isEditingTitle: false,
        }));
      }
    }
  }

  handleGlobalEscape(event) {
    if (event.key === 'Escape') {
      event.target.value = '';
      this.setState(() => ({ isClicked: false, isEditingTitle: false }));
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

  handleInputClick(event) {
    event.stopPropagation;
    if (event.defaultPrevented || event.target.id === 'addTask') {
      return;
    }
    this.setState(() => ({ isClicked: !this.state.isClicked }));
  }

  handleClickAway(event) {
    this.setState(() => ({
      isClicked: false,
      isEditingTitle: false,
    }));
  }

  handleDeleteClick(event) {
    event.stopPropagation();
    this.props.deleteColumn(this.state.id, this.props.index);
  }

  handleTitleEditClick(event) {
    event.stopPropagation();
    this.setState(() => ({
      isEditingTitle: !this.state.isEditingTitle,
    }));
  }

  handleClickStopPropagation(event) {
    event.stopPropagation();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleGlobalEscape);
  }

  render() {
    const { classes } = this.props;
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided: any) => (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <Container
              id='addTaskArea'
              onClick={this.handleInputClick}
              className={classes.container}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <Grid
                container
                direction='row'
                justify='center'
                alignItems='center'
                onMouseEnter={() =>
                  this.setState(() => ({
                    isHovering: true,
                  }))
                }
                onMouseLeave={() =>
                  this.setState(() => ({
                    isHovering: false,
                  }))
                }
              >
                <Grid
                  container
                  item
                  xs={10}
                  justify='center'
                  alignItems='center'
                  {...provided.dragHandleProps}
                >
                  {!this.state.isEditingTitle && (
                    <Typography
                      variant='h3'
                      {...provided.dragHandleProps}
                      onClick={this.handleTitleEditClick}
                    >
                      {this.state.title}
                    </Typography>
                  )}
                  {this.state.isEditingTitle && (
                    <TextField
                      id='editTitle'
                      label='Edit Title'
                      variant='outlined'
                      autoFocus={true}
                      {...provided.dragHandleProps}
                      onClick={this.handleClickStopPropagation}
                      onKeyDown={this.handleKeyDown}
                    />
                  )}
                </Grid>
                {this.state.isHovering && (
                  <Grid
                    container
                    item
                    xs={2}
                    justify='center'
                    alignItems='center'
                    onClick={this.handleDeleteClick}
                  >
                    <Delete size='75%' />
                  </Grid>
                )}
              </Grid>
              <Droppable droppableId={this.props.column.id} type='task'>
                {(provided: any) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    {this.props.tasks.map((task: Task, index: number) => (
                      <TaskCard
                        key={task.id}
                        taskContent={task.content}
                        parentColumnId={this.props.column.id}
                        taskId={task.id}
                        index={index}
                        deleteTask={this.props.deleteTask}
                        editTask={this.props.editTask}
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
                  autoFocus={true}
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
