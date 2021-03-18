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
import Menu from './Menu';

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
  isEditingCard?: boolean;
}

class TaskCard extends React.Component<Props, TaskCardState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      taskContent: this.props.taskContent,
      isEditingCard: false,
    };
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEscapeEdit = this.handleEscapeEdit.bind(this);
    this.handleCardEditClick = this.handleCardEditClick.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.stopClickPropagation = this.stopClickPropagation.bind(this);
  }

  handleKeyDown(event: any) {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      if (event.target.id === 'editCard') {
        this.props.editTask(this.props.taskId, event.target.value);
        this.setState(() => ({
          isEditingCard: false,
        }));
      }
    }
  }

  handleDeleteClick() {
    this.props.deleteTask(this.props.taskId, this.props.index, this.props.parentColumnId);
  }

  handleCardEditClick() {
    this.setState(() => ({
      isEditingCard: !this.state.isEditingCard,
    }));
  }

  handleEscapeEdit(event: any) {
    if (event.key === 'Escape') {
      this.setState(() => ({ isEditingCard: false }));
    }
  }

  handleClickAway() {
    this.setState(() => ({
      isEditingCard: false,
    }));
  }

  stopClickPropagation(event) {
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
            onClick={this.handleCardEditClick}
          >
            <ClickAwayListener onClickAway={this.handleClickAway}>
              <CardContent className={classes.taskCardContent}>
                <Grid container direction='row' justify='space-between'>
                  <Grid container xs={10} justify='center' alignItems='center'>
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
                        onKeyDown={this.handleKeyDown}
                      />
                    )}
                  </Grid>
                  <Grid
                    container
                    xs={2}
                    style={{ margin: '-18px 0px' }}
                    onClick={this.stopClickPropagation}
                  >
                    <Menu deleteClick={this.handleDeleteClick}/>
                  </Grid>
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
