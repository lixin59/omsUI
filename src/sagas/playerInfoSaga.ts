import { put, take, race, call } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { playerActions, WILL_INIT_PLAYER } from '../store/action-types';
import { getPlayerListApi } from '../api/http/playbook';

export default function* playerInfoSaga() {
  try {
    while (true) {
      const { init } = yield race({
        init: take(actionType.WILL_INIT_PLAYER)
      });
      if (init) {
        const res = yield call(getPlayerListApi);
        if (res.code !== '200') {
          return;
        }
        yield put({ type: playerActions.INIT, value: res.data });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
