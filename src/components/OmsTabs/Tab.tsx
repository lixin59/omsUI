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
      'fontWeight': theme.typography.fontWeightRegular,
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
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        backgroundColor: '#e1e1e1',
        opacity: 1,
      },
      '&$selected': {
        color: '#1890ff',
        fontSize: 18,
        backgroundColor: '#e1e1e1',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#40a9ff',
      },
    },
    selected: {},
  }),
)((props: StyledTabProps | TabTypeMap['props']) => <Tab disableRipple {...props} />);

export default OmsTab;
