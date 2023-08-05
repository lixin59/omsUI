import { put, take, race, call } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { hostActions } from '../store/action-types';
import { getHostsApi } from '../api/http/httpRequestApi';

export default function* hostInfoSaga() {
  try {
    while (true) {
      const { init, getList } = yield race({
        getList: take(actionType.WILL_GET_HOST_LIST),
        init: take(actionType.WILL_INIT_HOST)
      });
      if (getList) {
        const res = yield call(getHostsApi, getList?.value?.pageSize || 1000, getList?.value?.pageNo || 1);
        if (res.code !== '200') {
          return;
        }
        yield put({ type: hostActions.UPDATE_HOST_TOTAL, value: res?.data?.total });
        yield put({ type: hostActions.INIT, value: res?.data?.data });
      }
      if (init) {
        yield put({ type: hostActions.INIT, value: init.value });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
