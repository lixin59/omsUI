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
        color: theme.palette.tag.main,
        backgroundColor: theme.palette.grey.A700,
        opacity: 1
      },
      '&$selected': {
        color: theme.palette.tag.main,
        fontSize: 18,
        boxShadow: `2px 1px 2px 1px ${theme.palette.boxShadowInset.main} inset`,
        backgroundColor: theme.palette.grey.A700,
        fontWeight: theme.typography.fontWeightMedium
      },
      '&:focus': {
        color: theme.palette.tag.main
      }
    },
    selected: {}
  })
)((props: StyledTabProps | TabTypeMap['props'] | any) => <Tab disableRipple {...props} />);

export default OmsTab;
