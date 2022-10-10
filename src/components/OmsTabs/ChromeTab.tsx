import React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import { StyledTabProps } from './interface';
import { TabTypeMap } from '@material-ui/core/Tab';

const ChromeTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      opacity: 1,
      overflow: 'initial',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      borderTopLeftRadius: theme.spacing(1),
      borderTopRightRadius: theme.spacing(1),
      // color: theme.palette.tag.main,
      backgroundColor: theme.palette.grey[200],
      transition: '0.2s',
      [theme.breakpoints.up('md')]: {
        minWidth: 120
      },
      '&:before': {
        transition: '0.2s'
      },
      '&:not(:first-of-type)': {
        '&:before': {
          content: '" "',
          position: 'absolute',
          left: 0,
          display: 'block',
          height: 20,
          width: 1,
          zIndex: 1,
          marginTop: theme.spacing(0.5),
          backgroundColor: theme.palette.grey[500]
        }
      },
      '& + $selected:before': {
        opacity: 0
      },
      '&:hover': {
        '&:not($selected)': {
          backgroundColor: theme.palette.grey[300]
        },
        '&::before': {
          opacity: 0
        },
        '& + $root:before': {
          opacity: 0
        }
      }
    },
    selected: {
      backgroundColor: theme.palette.grey[50],
      color: theme.palette.primary.main,
      '& + $root': {
        zIndex: 1
      },
      '& + $root:before': {
        opacity: 0
      }
    },
    wrapper: {
      zIndex: 2,
      marginTop: theme.spacing(0.5),
      textTransform: 'initial'
    }
  })
)((props: StyledTabProps | TabTypeMap['props'] | any) => <Tab disableRipple {...props} />);

export default ChromeTab;
