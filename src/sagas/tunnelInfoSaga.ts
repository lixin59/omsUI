import { put, take, race } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { tunnelActions } from '../store/action-types';

export default function* tunnelInfoSaga() {
  try {
    while (true) {
      const { toAdd, toDelete, toEdit } = yield race({
        toAdd: take(actionType.WILL_ADD_Tunnel),
        toDelete: take(actionType.WILL_DELETE_Tunnel),
        toEdit: take(actionType.WILL_EDIT_Tunnel)
      });
      if (toAdd) {
        console.log(toAdd);
        yield put({ type: tunnelActions.ADD, value: toAdd.value });
      }
      if (toDelete) {
        console.log(toDelete);
        yield put({ type: tunnelActions.DELETE, value: toDelete.value });
      }
      if (toEdit) {
        console.log(toEdit);
        yield put({ type: tunnelActions.EDIT, value: toEdit.value });
      }
      console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
