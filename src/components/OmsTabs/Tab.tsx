import React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import { StyledTabProps } from './interface';
import { TabTypeMap } from '@material-ui/core/Tab';

const OmsTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'textTransform': 'none',
      'minWidth': 72,
      marginTop: '4px',
      marginBottom: '4px',
      'fontWeight': 400,
      'marginLeft': theme.spacing(2),
      'marginRight': theme.spacing(2),
      'borderRadius': '8px',
      'fontFamily': [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        backgroundColor: theme.palette.grey['50'],
        opacity: 1
      },
      '&$selected': {
        color: '#1890ff',
        fontSize: 18,
        backgroundColor: theme.palette.grey['100'],
        fontWeight: theme.typography.fontWeightMedium
      },
      '&:focus': {
        color: '#40a9ff'
      }
    },
    selected: {}
  })
)((props: StyledTabProps | TabTypeMap['props'] | any) => <Tab disableRipple {...props} />);

export default OmsTab;
