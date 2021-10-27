import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import { StyledTabsProps } from './interface';
import { TabsTypeMap } from '@material-ui/core/Tabs';

const OmsTabs = withStyles({
  indicator: {
    backgroundColor: '#1890ff',
  },
})((props: StyledTabsProps | TabsTypeMap['props']) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export default OmsTabs;
