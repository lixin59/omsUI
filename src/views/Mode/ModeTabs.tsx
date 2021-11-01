import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import OmsTabs from '../../components/OmsTabs/Tabs';
import OmsTab from '../../components/OmsTabs/Tab';
import TabPanel from '../../components/OmsTabs/TabPanel';
import UploadFile from './UploadFile';
import { a11yProps } from '../../utils/index';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    width: '100%',
    indicator: {
      '& > span': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#4bce21'
      }
    }
  },
  TabPanel: {
    height: '100%',
    width: '100%'
  },
  tabs: {
    width: '240px',
    borderRight: `1px solid ${theme.palette.divider}`
  }
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
        orientation='vertical'
        variant='scrollable'
        value={value}
        // indicatorColor="primary"
        // textColor="primary"
        onChange={handleChange}
        aria-label='Vertical tabs example'
        className={classes.tabs}
      >
        <OmsTab label='上传文件' {...a11yProps(0)} />
        <OmsTab label='执行命令' {...a11yProps(1)} />
        <OmsTab label='Item Three' {...a11yProps(2)} />
        <OmsTab label='Item Four' {...a11yProps(3)} />
        <OmsTab label='Item Five' {...a11yProps(4)} />
        <OmsTab label='Item Six' {...a11yProps(5)} />
        <OmsTab label='Item Seven' {...a11yProps(6)} />
      </OmsTabs>
      <TabPanel className={classes.TabPanel} value={value} index={0}>
        <UploadFile/>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={2}>
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
