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
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  groupList: GroupInfo[];
  tagList: TagInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  groupList: state.groupList,
  tagList: state.tagList
});
const mapDispatch: tDP = {
  initGroup: actions.initGroupInfo,
  initTag: actions.initTagInfo
};

type tProps = tSP & tDP;

function ModeTabs({ initGroup, initTag }: tProps) {
  const navigate = useNavigate();
  const hash = useLocation();

  useEffect(() => {
    if (hash.pathname === URL.group.root) {
      setValue(0);
      navigate(URL.group.groupTable);
    }
    if (hash.pathname === URL.group.groupTable) {
      setValue(0);
    }
    if (hash.pathname === URL.group.tagTable) {
      setValue(1);
    }
    if (hash.pathname === URL.group.privateKey) {
      setValue(2);
    }
    if (hash.pathname === URL.group.playbook) {
      setValue(3);
    }
    if (hash.pathname === URL.group.quick_command) {
      setValue(4);
    }
  }, [hash]);

  const pageList = [
    { label: '分组', index: 0, path: URL.group.groupTable },
    { label: '标签', index: 1, path: URL.group.tagTable },
    { label: '密钥', index: 2, path: URL.group.privateKey },
    { label: '剧本', index: 3, path: URL.group.playbook },
    { label: '快捷命令', index: 4, path: URL.group.quick_command }
  ];

  useEffect(() => {
    (async () => {
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

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <OmsTabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}>
        {pageList.map((p) => (
          <OmsTab key={p.index} label={p.label} component={NavLink} to={p.path} {...a11yProps(p.index)} />
        ))}
      </OmsTabs>
      {pageList.map((p) => (
        <TabPanel key={p.index} className={classes.TabPanel} value={value} index={p.index}>
          <Outlet />
        </TabPanel>
      ))}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatch)(ModeTabs);
