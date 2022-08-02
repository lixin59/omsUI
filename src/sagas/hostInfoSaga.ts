import { put, take, race, call } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { hostActions } from '../store/action-types';
import { getHostsApi } from '../api/http/httpRequestApi';

export default function* hostInfoSaga() {
  try {
    while (true) {
      const { init, getList, addHost, deleteHost, editHost } = yield race({
        getList: take(actionType.WILL_GET_HOST_LIST),
        init: take(actionType.WILL_INIT_HOST),
        addHost: take(actionType.WILL_ADD),
        deleteHost: take(actionType.WILL_DELETE),
        editHost: take(actionType.WILL_EDIT_HOST)
      });
      if (getList) {
        const res = yield call(getHostsApi);
        if (res.code !== '200') {
          return;
        }
        yield put({ type: hostActions.INIT, value: res.data });
      }
      if (init) {
        yield put({ type: hostActions.INIT, value: init.value });
      }
      if (addHost) {
        // console.log(addHost);
        yield put({ type: hostActions.ADD_HOST_INFO, value: addHost.value });
      }
      if (deleteHost) {
        // console.log(deleteHost);
        yield put({ type: hostActions.DELETE_HOST_INFO, value: deleteHost.value });
      }
      if (editHost) {
        // console.log(editHost);
        yield put({ type: hostActions.EDIT_HOST_INFO, value: editHost.value });
      }
      console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
