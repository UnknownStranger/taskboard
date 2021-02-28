import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Container, Grid, Box } from '@material-ui/core';
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
class Column extends React.Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided: any) => (
            <Container
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
            </Container>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Column);
