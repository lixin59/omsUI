import { put, take, race } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { jobActions } from '../store/action-types';

export default function* jobInfoSaga() {
  try {
    while (true) {
      const { toAdd, toDelete, toEdit } = yield race({
        toAdd: take(actionType.WILL_ADD_Job),
        toDelete: take(actionType.WILL_DELETE_Job),
        toEdit: take(actionType.WILL_EDIT_Job)
      });
      if (toAdd) {
        console.log(toAdd);
        yield put({ type: jobActions.ADD, value: toAdd.value });
      }
      if (toDelete) {
        console.log(toDelete);
        yield put({ type: jobActions.DELETE, value: toDelete.value });
      }
      if (toEdit) {
        console.log(toEdit);
        yield put({ type: jobActions.EDIT, value: toEdit.value });
      }
      console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
