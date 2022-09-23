import { put, take, race, call } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { quickCommandActions, WILL_INIT_QUICK_COMMAND } from '../store/action-types';
import { getQuickCommandList } from '../api/http/command';

export default function* quickCommandInfoSaga() {
  try {
    while (true) {
      const { init } = yield race({
        init: take(actionType.WILL_INIT_QUICK_COMMAND)
      });
      if (init) {
        const res = yield call(getQuickCommandList);
        if (res.code !== '200') {
          return;
        }
        yield put({ type: quickCommandActions.INIT, value: res.data });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
