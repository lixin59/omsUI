import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import OmsTabs from '../../components/OmsTabs/Tabs';
import OmsTab from '../../components/OmsTabs/Tab';
import TabPanel from '../../components/OmsTabs/TabPanel';
import styles from './style';
import { a11yProps } from '../../utils/index';
import { ActionCreator } from 'redux';
import { GroupInfo, IState, TagInfo } from '../../store/interface';
import actions from '../../store/action';
import { connect } from 'react-redux';
import { getGroupsApi, getTagsApi, HTTPResult } from '../../api/http/httpRequestApi';
import { URL } from '../../router';

type tDP = {
  initGroup: ActionCreator<any>;
  initTag: ActionCreator<any>;
  deleteGroup: ActionCreator<any>;
  addGroup: ActionCreator<any>;
  editGroup: ActionCreator<any>;
  deleteTag: ActionCreator<any>;
  addTag: ActionCreator<any>;
  editTag: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  groupList: GroupInfo[],
  tagList: TagInfo[]
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  groupList: state.groupList,
  tagList: state.tagList
});
const mapDispatch: tDP = {
  initGroup: actions.initGroupInfo,
  initTag: actions.initTagInfo,
  deleteGroup: actions.deleteGroupInfo,
  addGroup: actions.addGroupInfo,
  editGroup: actions.editGroupInfo,
  deleteTag: actions.deleteTagInfo,
  addTag: actions.addTagInfo,
  editTag: actions.editTagInfo
};

type tProps = tSP & tDP;

function ModeTabs({ initGroup, initTag
}: tProps) {
  const navigate = useNavigate();
  const hash = useLocation();

  useEffect(() => {
    if (hash.pathname === URL.group) {
      setValue(0);
      navigate(URL.groupTable);
    }
    if (hash.pathname === URL.groupTable) {
      setValue(0);
    }
    if (hash.pathname === URL.tagTable) {
      setValue(1);
    }
    if (hash.pathname === URL.privateKey) {
      setValue(2);
    }
  }, []);

  useEffect(() => {
    (async() => {
      const res = (await getGroupsApi()) as HTTPResult;
      const res1 = (await getTagsApi()) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      if (res1.code !== '200') {
        return;
      }
      initGroup(res.data);
      initTag(res1.data);
    })();
  }, []);

  const classes = makeStyles(styles)();
  const [value, setValue] = useState(0);

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
        <OmsTab label='分组' component={NavLink} to={URL.groupTable} {...a11yProps(0)} />
        <OmsTab label='标签' component={NavLink} to={URL.tagTable} {...a11yProps(1)} />
        <OmsTab label='密钥' component={NavLink} to={URL.privateKey} {...a11yProps(1)} />
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
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatch
)(ModeTabs);
