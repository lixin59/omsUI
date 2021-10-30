import { put, take, race } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { groupActions } from '../store/action-types';

export default function* groupInfoSaga() {
  try {
    while (true) {
      const { addGroup, deleteGroup, editGroup } = yield race({
        addGroup: take(actionType.WILL_ADD_GROUP),
        deleteGroup: take(actionType.WILL_DELETE_GROUP),
        editGroup: take(actionType.WILL_EDIT_GROUP),
      });
      if (addGroup) {
        console.log(addGroup);
        yield put({ type: groupActions.ADD_GROUP_INFO, value: addGroup.value });
      }
      if (deleteGroup) {
        console.log(deleteGroup);
        yield put({ type: groupActions.DELETE_GROUP_INFO, value: deleteGroup.value });
      }
      if (editGroup) {
        console.log(editGroup);
        yield put({ type: groupActions.EDIT_GROUP_INFO, value: editGroup.value });
      }
      console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
