import { put, take, race, call } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { tagActions } from '../store/action-types';
import { getTagsApi } from '../api/http/httpRequestApi';

export default function* tagInfoSaga() {
  try {
    while (true) {
      const { update } = yield race({
        update: take(actionType.WILL_INIT_TAG)
        // addTag: take(actionType.WILL_ADD_TAG),
        // deleteTag: take(actionType.WILL_DELETE_TAG),
        // editTag: take(actionType.WILL_EDIT_TAG)
      });
      if (update) {
        const res = yield call(getTagsApi);
        if (res.code !== '200') {
          return;
        }
        yield put({ type: tagActions.INIT, value: res.data });
      }
      // if (addTag) {
      //   console.log(addTag);
      //   yield put({ type: tagActions.ADD_TAG_INFO, value: addTag.value });
      // }
      // if (deleteTag) {
      //   console.log(deleteTag);
      //   yield put({ type: tagActions.DELETE_TAG_INFO, value: deleteTag.value });
      // }
      // if (editTag) {
      //   console.log(editTag);
      //   yield put({ type: tagActions.EDIT_TAG_INFO, value: editTag.value });
      // }
      // console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
