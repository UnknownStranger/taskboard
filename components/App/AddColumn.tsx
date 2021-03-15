import React from 'react';
import { Container, TextField } from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = () =>
  createStyles({
    container: {
      backgroundColor: 'whitesmoke',
      minWidth: 350,
      maxWidth: 350,
      paddingBottom: 20,
      paddingTop: 20,
      margin: 20,
      textAlign: 'center',
      alignSelf: 'flex-start',
    },
  });
interface Props extends WithStyles<typeof styles> {
  addColumn: Function;
}
class AddColumn extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      this.props.addColumn(event.target.value, this.generateUID());
      event.target.value = '';
    } else if (event.key === 'Escape') {
      event.target.value = '';
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

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container}>
        <TextField
          id='addColumn'
          label='Add Column'
          variant='outlined'
          onKeyDown={this.handleKeyDown}
        />
      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AddColumn);
