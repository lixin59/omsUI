import { all } from 'redux-saga/effects';
import hostInfoSaga from './hostInfoSaga';
import groupInfoSaga from './groupInfoSaga';
import tagInfoSaga from './tagInfoSaga';

export function* defSaga() {
  yield all([hostInfoSaga(), groupInfoSaga(), tagInfoSaga()]);
}
