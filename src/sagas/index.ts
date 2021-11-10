import { all } from 'redux-saga/effects';
import hostInfoSaga from './hostInfoSaga';
import groupInfoSaga from './groupInfoSaga';
import tagInfoSaga from './tagInfoSaga';
import jobInfoSaga from './JobInfoSaga';
import tunnelInfoSaga from './tunnelInfoSaga';

export function* defSaga() {
  yield all([jobInfoSaga(), tunnelInfoSaga(), hostInfoSaga(), groupInfoSaga(), tagInfoSaga()]);
}
