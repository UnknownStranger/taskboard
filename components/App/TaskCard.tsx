import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = () =>
  createStyles({
    taskCard: {
      margin: 20,
      minWidth: 275,
      maxWidth: 275,
      padding: 0,
      backgroundColor: 'ghostwhite',
    },
    title: {
      verticalAlign: 'middle',
      fontSize: 14,
    },
  });

interface Props extends WithStyles<typeof styles> {
  taskContent: string;
  taskId: string;
  index: number;
}

class TaskCard extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event: { defaultPrevented: any; stopPropagation: () => void; }) {
    if (event.defaultPrevented) {
      return;
    }
    event.stopPropagation();
  }

  render() {
    const { classes } = this.props;
    return (
      <Draggable draggableId={this.props.taskId} index={this.props.index}>
        {(provided: any) => (
          <Card
            onClick={this.handleClick}
            className={classes.taskCard}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <CardContent>
              <Typography className={classes.title} color='textSecondary'>
                {this.props.taskContent}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TaskCard);
