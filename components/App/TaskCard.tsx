import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  ClickAwayListener,
  TextField,
} from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Delete from './Delete';

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
  parentColumnId: string;
  taskId: string;
  index: number;
  deleteTask: Function;
  editTask: Function;
}

interface TaskCardState {
  taskContent: string;
  isHovering?: boolean;
  isEditingCard?: boolean;
}

class TaskCard extends React.Component<Props, TaskCardState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      taskContent: this.props.taskContent,
      isHovering: false,
      isEditingCard: false,
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEscapeEdit = this.handleEscapeEdit.bind(this);
    this.handleCardEditClick = this.handleCardEditClick.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
    this.handleClickStopPropagation = this.handleClickStopPropagation.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      if (event.target.id === 'editCard') {
        this.props.editTask(this.props.taskId, event.target.value);
        this.setState(() => ({
          isEditingCard: false,
        }));
      }
    }
  }

  handleDeleteClick(event) {
    event.stopPropagation();
    this.props.deleteTask(this.props.taskId, this.props.index, this.props.parentColumnId);
  }

  handleCardEditClick(event) {
    event.stopPropagation();
    this.setState(() => ({
      isEditingCard: !this.state.isEditingCard,
    }));
  }

  handleEscapeEdit(event) {
    if (event.key === 'Escape') {
      this.setState(() => ({ isEditingCard: false }));
    }
  }

  handleClickAway(event) {
    this.setState(() => ({
      isEditingCard: false,
    }));
  }

  handleClickStopPropagation(event) {
    event.stopPropagation();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscapeEdit);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscapeEdit);
  }

  render() {
    const { classes } = this.props;
    return (
      <Draggable draggableId={this.props.taskId} index={this.props.index}>
        {(provided: any) => (
          <Card
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
            onClick={this.handleCardEditClick}
          >
            <ClickAwayListener onClickAway={this.handleClickAway}>
              <CardContent className={classes.taskCardContent}>
                <Grid container direction='row' justify='center' alignItems='center'>
                  <Grid container item xs={10} justify='center' alignItems='center'>
                    {!this.state.isEditingCard && (
                      <Typography className={classes.title} color='textSecondary'>
                        {this.props.taskContent}
                      </Typography>
                    )}
                    {this.state.isEditingCard && (
                      <TextField
                        id='editCard'
                        label='Edit Task'
                        variant='outlined'
                        autoFocus={true}
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
            </ClickAwayListener>
          </Card>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TaskCard);
