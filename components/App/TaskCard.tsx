import React from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Delete from './Delete';
import { green } from '@material-ui/core/colors';

const styles = () =>
  createStyles({
    taskCard: {
      backgroundColor: 'ghostwhite',
      margin: 20,
    },
    taskCardContent: {
      margin: 0,
      paddingTop: 20,
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

interface TaskCardState {
  isHovering?: boolean;
}

class TaskCard extends React.Component<Props, TaskCardState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isHovering: false,
    };
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleInputClick(event: { defaultPrevented: any; stopPropagation: () => void }) {
    if (event.defaultPrevented) {
      return;
    }
    event.stopPropagation();
  }

  handleDeleteClick(event) {
    event.stopPropagation();
    console.log(`clicked ${event.target}`);
  }

  render() {
    const { classes } = this.props;
    return (
      <Draggable draggableId={this.props.taskId} index={this.props.index}>
        {(provided: any) => (
          <Card
            onClick={this.handleInputClick}
            className={classes.taskCard}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
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
            <CardContent className={classes.taskCardContent}>
              <Grid container direction='row' justify='center' alignItems='center'>
                <Grid container item xs={10} justify='center' alignItems='center'>
                  <Typography className={classes.title} color='textSecondary'>
                    {this.props.taskContent}
                  </Typography>
                </Grid>
                {this.state.isHovering && (
                  <Grid
                    container
                    item
                    xs={2}
                    justify='flex-end'
                    alignItems='center'
                    style={{ margin: '-18px 0px' }}
                    onClick={this.handleDeleteClick}
                  >
                    <Delete size='50%' />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TaskCard);
