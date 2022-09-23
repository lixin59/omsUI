import { put, call, take } from 'redux-saga/effects';
import { INIT_APP_VERSION, WILL_INIT_APP_VERSION } from '../store/action-types';
import { getVersionApi } from '../api/http/httpRequestApi';

export default function* versionInfoSaga() {
  try {
    while (true) {
      yield take(WILL_INIT_APP_VERSION);
      const res = yield call(getVersionApi);
      yield put({ type: INIT_APP_VERSION, value: res });
    }
  } catch (err) {
    console.log('getVersion', err);
  }
}
