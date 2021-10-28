import { put, take } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { hostActions } from '../store/action-types';
import { HostAction } from '../store/interface';

export default function* hostInfoSaga() {
  try {
    while (true) {
      const data: HostAction = yield take(actionType.WILL_DELETE);
      yield put({ type: hostActions.DELETE_HOST_INFO, value: data.value });
      console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
