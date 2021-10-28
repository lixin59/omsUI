import React from 'react';
import { ActionCreator } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../store/action';
import BodyBox from '../../components/Bodybox';
import { hostInfo } from './typings';
import HostInfoCard from '../../components/HostInfoCard';
import { IState } from '../../store/interface';
import homeStyle from './homStyle';

type tDP = {
  deleteHost: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  hostList: hostInfo[],
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.data,
});
const mapDispatch: tDP = {
  deleteHost: actions.deleteHostInfo,
};

type tProps = tSP & tDP;

function Home(props: tProps) {
  const { hostList, deleteHost } = props;
  const classes = makeStyles(homeStyle)();
  return (
    <BodyBox>
      <div className={classes.home}>
        {hostList.map((i: hostInfo) => {
          return (
            <HostInfoCard hostInfo={i} key={i.id} deleteHost={deleteHost}/>
          );
        })}
      </div>
    </BodyBox>
  );
}

export default connect(
    mapStateToProps, // 把仓库的状态映射为组件的属性对象
    mapDispatch,
)(Home);
