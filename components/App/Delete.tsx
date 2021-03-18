import React from 'react';

interface Props {
  size: string;
}

class Delete extends React.Component<Props> {
  render() {
    return (
      <img
        src={require('../../assets/literaltrash.svg')}
        alt='Trash Icon'
        style={{ width: this.props.size }}
      />
    );
  }
}

export default Delete;
