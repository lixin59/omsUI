import React from 'react';
import Box from '@material-ui/core/Box';
import { TabPanelProps } from './interface';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.grey[50]
  }
}));

function ChromeTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.box}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      <Box style={{ height: '100%', width: '100%' }} p={1}>
        {children}
      </Box>
    </div>
  );
}

export default ChromeTabPanel;
