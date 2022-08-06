import { call, take, race, put } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { tagActions } from '../store/action-types';
import { getGroupsApi } from '../api/http/httpRequestApi';

export default function* groupInfoSaga() {
  try {
    while (true) {
      const { update } = yield race({
        update: take(actionType.WILL_INIT_GROUP)
        // addGroup: take(actionType.WILL_ADD_GROUP),
        // deleteGroup: take(actionType.WILL_DELETE_GROUP),
        // editGroup: take(actionType.WILL_EDIT_GROUP),
      });
      if (update) {
        const res = yield call(getGroupsApi);
        if (res.code !== '200') {
          return;
        }
        yield put({ type: tagActions.INIT, value: res.data });
      }
      // if (addGroup) {
      //   console.log(addGroup);
      //   yield put({ type: groupActions.ADD_GROUP_INFO, value: addGroup.value });
      // }
      // if (deleteGroup) {
      //   console.log(deleteGroup);
      //   yield put({ type: groupActions.DELETE_GROUP_INFO, value: deleteGroup.value });
      // }
      // if (editGroup) {
      //   console.log(editGroup);
      //   yield put({ type: groupActions.EDIT_GROUP_INFO, value: editGroup.value });
      // }
      // console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
