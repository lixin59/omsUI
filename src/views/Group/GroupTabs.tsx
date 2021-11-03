import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OmsTabs from '../../components/OmsTabs/Tabs';
import OmsTab from '../../components/OmsTabs/Tab';
import TabPanel from '../../components/OmsTabs/TabPanel';
import Grouping from './Grouping';
import Tag from './Tag';
import styles from './style';
import { a11yProps } from '../../utils/index';
import { ActionCreator } from 'redux';
import { GroupInfo, IState, TagInfo } from '../../store/interface';
import actions from '../../store/action';
import { connect } from 'react-redux';

type tDP = {
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
  deleteGroup: actions.deleteGroupInfo,
  addGroup: actions.addGroupInfo,
  editGroup: actions.editGroupInfo,
  deleteTag: actions.deleteTagInfo,
  addTag: actions.addTagInfo,
  editTag: actions.editTagInfo
};

type tProps = tSP & tDP;

function ModeTabs({ groupList, tagList, addGroup,
  addTag, deleteGroup, deleteTag, editTag, editGroup
}: tProps) {
  const classes = makeStyles(styles)();
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
        <OmsTab label='分组' {...a11yProps(0)} />
        <OmsTab label='标签' {...a11yProps(1)} />
      </OmsTabs>
      <TabPanel className={classes.TabPanel} value={value} index={0}>
        <Grouping addGroup={addGroup} deleteGroup={deleteGroup} editGroup={editGroup} groupList={groupList}/>
      </TabPanel>
      <TabPanel className={classes.TabPanel} value={value} index={1}>
        <Tag deleteTag={deleteTag} addTag={addTag} editTag={editTag} tagList={tagList}/>
      </TabPanel>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatch
)(ModeTabs);
