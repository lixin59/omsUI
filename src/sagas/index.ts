import { all } from 'redux-saga/effects';
import hostInfoSaga from './hostInfoSaga';

export function* defSaga() {
  yield all([hostInfoSaga()]);
}
