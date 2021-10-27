import React, { ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import OmsTabs from '../../components/OmsTabs/Tabs';
import OmsTab from '../../components/OmsTabs/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

interface TabPanelProps {
  children?: ReactNode;
  index: any;
  value: any;
}

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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    'id': `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    indicator: {
      '& > span': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#4bce21',
      },
    },
  },
  tabs: {
    width: '200px',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

function ModeTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <OmsTabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        // indicatorColor="primary"
        // textColor="primary"
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <OmsTab label="上传文件" {...a11yProps(0)} />
        <OmsTab label="执行命令" {...a11yProps(1)} />
        <OmsTab label="Item Three" {...a11yProps(2)} />
        <OmsTab label="Item Four" {...a11yProps(3)} />
        <OmsTab label="Item Five" {...a11yProps(4)} />
        <OmsTab label="Item Six" {...a11yProps(5)} />
        <OmsTab label="Item Seven" {...a11yProps(6)} />
      </OmsTabs>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </div>
  );
}

export default ModeTabs;
