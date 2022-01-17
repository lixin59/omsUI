import React, { useEffect } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import OmsTabs from '../../components/OmsTabs/Tabs';
import OmsTab from '../../components/OmsTabs/Tab';
import TabPanel from '../../components/OmsTabs/TabPanel';
import { a11yProps } from '../../utils/index';
import { URL } from '../../router';

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

  const navigate = useNavigate();
  const hash = useLocation();

  useEffect(() => {
    if (hash.pathname === URL.mode) {
      setValue(0);
      navigate(URL.job);
    }
    if (hash.pathname === URL.job) {
      setValue(0);
    }
    if (hash.pathname === URL.tunnel) {
      setValue(1);
    }
    if (hash.pathname === URL.uploadFile) {
      setValue(2);
    }
    if (hash.pathname.includes(URL.webSSH)) {
      setValue(3);
    }
    if (hash.pathname === URL.command) {
      setValue(4);
    }
    if (hash.pathname === URL.fileBrowser) {
      setValue(5);
    }
  }, [hash]);

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
        <OmsTab label='任务管理' component={NavLink} to={URL.job} {...a11yProps(0)} />
        <OmsTab label='隧道管理' component={NavLink} to={URL.tunnel} {...a11yProps(1)} />
        <OmsTab label='上传文件' component={NavLink} to={URL.uploadFile} {...a11yProps(2)} />
        <OmsTab label='web SSH' component={NavLink} to={`${URL.webSSH}/0`} {...a11yProps(3)} />
        <OmsTab label='执行命令' component={NavLink} to={URL.command} {...a11yProps(4)} />
        <OmsTab label='文件浏览' component={NavLink} to={URL.fileBrowser} {...a11yProps(5)} />
        <OmsTab label='主机监控' component={NavLink} to={URL.hostMonitor} {...a11yProps(6)} />
      </OmsTabs>
      <TabPanel className={classes.TabPanel} value={value} index={0}>
        <Outlet/>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={1}>
        <Outlet/>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={2}>
        <Outlet/>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={3}>
        <Outlet/>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={4}>
        <Outlet/>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={5}>
        <Outlet/>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={6}>
        <Outlet/>
      </TabPanel>
    </div>
  );
}

export default ModeTabs;
