import { put, take, race, call } from 'redux-saga/effects';
import * as actionType from '../store/action-types';
import { jobActions } from '../store/action-types';
import { getJobsApi } from '../api/http/httpRequestApi';

export default function* jobInfoSaga() {
  try {
    while (true) {
      const { update } = yield race({
        update: take(actionType.WILL_INIT_Job)
        // toAdd: take(actionType.WILL_ADD_Job),
        // toDelete: take(actionType.WILL_DELETE_Job),
        // toEdit: take(actionType.WILL_EDIT_Job)
      });
      if (update) {
        const res = yield call(getJobsApi);
        if (res.code !== '200') {
          return;
        }
        yield put({ type: jobActions.INIT, value: res.data });
      }
      // if (toAdd) {
      //   console.log(toAdd);
      //   yield put({ type: jobActions.ADD, value: toAdd.value });
      // }
      // if (toDelete) {
      //   console.log(toDelete);
      //   yield put({ type: jobActions.DELETE, value: toDelete.value });
      // }
      // if (toEdit) {
      //   console.log(toEdit);
      //   yield put({ type: jobActions.EDIT, value: toEdit.value });
      // }
      // console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
