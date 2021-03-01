import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Container, Grid, Box, TextField } from '@material-ui/core';
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
  tasks: [Task];
  index: number;
}

interface ColumnState {
  title: string;
  tasks: [Task];
  isHovering: boolean;
}
class Column extends React.Component<Props, ColumnState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.column.title,
      tasks: props.tasks,
      isHovering: false,
    };
    // this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // handleKeyDown(event) {
  //   if (event.key === 'Enter') {
  //     const newTask = { id: 'test', content: event.target.value };
  //     this.state.tasks.push(newTask);
  //     console.log(`adding ${newTask}`);
  //     this.forceUpdate();
  //     event.target.value = '';
  //   }
  // }

  render() {
    const { classes } = this.props;
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided: any) => (
          <Container
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
            {/* {this.state.isHovering && (
              <TextField
                id='addTask'
                label='Add Task'
                variant='outlined'
                onKeyDown={this.handleKeyDown}
              />
            )} */}
          </Container>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Column);
