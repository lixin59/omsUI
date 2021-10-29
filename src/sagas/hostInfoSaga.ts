import { put, take, race } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { hostActions } from '../store/action-types';
import { HostAction } from '../store/interface';

export default function* hostInfoSaga() {
  try {
    while (true) {
      const { addHost, deleteHost } = yield race({
        addHost: take(actionType.WILL_ADD),
        deleteHost: take(actionType.WILL_DELETE),
      });
      if (addHost) {
        console.log(addHost);
        yield put({ type: hostActions.ADD_HOST_INFO, value: addHost.value });
      }
      if (deleteHost) {
        console.log(deleteHost);
        yield put({ type: hostActions.DELETE_HOST_INFO, value: deleteHost.value });
      }
      // const data: HostAction = yield take(actionType.WILL_DELETE);
      // yield put({ type: hostActions.DELETE_HOST_INFO, value: data.value });
      console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
