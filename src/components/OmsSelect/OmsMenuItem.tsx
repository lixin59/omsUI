// import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

const StyledMenuItem = withStyles((theme) => ({
  root: {
    background: theme.palette.grey.A700,
    '&:hover': {
      backgroundColor: theme.palette.success.light
    },
    '&:focus': {
      backgroundColor: theme.palette.success.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    },
    '& .MuiListItem-root.Mui-selected, & .MuiListItem-root.Mui-selected:hover': {
      backgroundColor: '#d90229'
    }
  }
}))(MenuItem);


export default StyledMenuItem;
