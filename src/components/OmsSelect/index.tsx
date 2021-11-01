import React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Select } from '@material-ui/core';
import { SelectProps } from '@material-ui/core/Select/Select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useMinimalSelectStyles } from './style';

const iconComponent = (props: any) => {
  return (
    <ExpandMoreIcon className={props.className + ' ' + minimalSelectClasses.icon}/>
  );
};

const minimalSelectClasses = useMinimalSelectStyles();

// FIXME paper ,list 属性的值为非空字符串？
const menuProps = {
  // classes: {
  //   paper: minimalSelectClasses.paper,
  //   list: minimalSelectClasses.list,
  // },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  // transformOrigin: {
  //   vertical: 'top',
  //   horizontal: 'left'
  // },
  getContentAnchorEl: null
};

const OmsSelect = withStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 100,
      // // background: 'white',
      color: theme.palette.success.main,
      fontWeight: 200,
      borderStyle: 'none',
      borderWidth: 2,
      borderRadius: 12,
      paddingLeft: 14,
      paddingTop: 12,
      paddingBottom: 14,
      boxShadow: '0px 5px 8px -3px rgba(0,0,0,0.14)',
      '&:focus': {
        borderRadius: 12,
        background: 'white',
        borderColor: theme.palette.success.main
      }
    },
    icon: {
      color: theme.palette.success.main,
      position: 'absolute',
      right: '4px',
      userSelect: 'none',
      pointerEvents: 'none'
    }
  })
)((props: SelectProps) => <Select disableUnderline IconComponent={iconComponent} MenuProps={menuProps}{...props} />);

export default OmsSelect;
