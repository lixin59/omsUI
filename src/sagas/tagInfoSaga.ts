import { put, take, race } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { tagActions } from '../store/action-types';

export default function* tagInfoSaga() {
  try {
    while (true) {
      const { addTag, deleteTag, editTag } = yield race({
        addTag: take(actionType.WILL_ADD_TAG),
        deleteTag: take(actionType.WILL_DELETE_TAG),
        editTag: take(actionType.WILL_EDIT_TAG),
      });
      if (addTag) {
        console.log(addTag);
        yield put({ type: tagActions.ADD_TAG_INFO, value: addTag.value });
      }
      if (deleteTag) {
        console.log(deleteTag);
        yield put({ type: tagActions.DELETE_TAG_INFO, value: deleteTag.value });
      }
      if (editTag) {
        console.log(editTag);
        yield put({ type: tagActions.EDIT_TAG_INFO, value: editTag.value });
      }
      console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
