import React from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const options = ['Delete'];

const ITEM_HEIGHT = 48;

export default function LongMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);

    if(event.currentTarget.textContent === 'Delete'){
      props.deleteClick();
    }
  };

  return (
    <div>
      <IconButton
        aria-label='more'
        aria-controls='long-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='long-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map(option => (
          <MenuItem key={option} selected={option === 'Delete'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
