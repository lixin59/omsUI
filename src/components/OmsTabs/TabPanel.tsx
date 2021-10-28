import React from 'react';
import Box from '@material-ui/core/Box';
import { TabPanelProps } from './interface';

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ height: '100%' }} p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
