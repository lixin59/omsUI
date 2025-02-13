import { put, take, race, call } from 'redux-saga/effects';
import { WILL_INIT_TUNNEL } from '../store/action-types';
import { tunnelActions } from '../store/action-types';
import { getTunnelsApi } from '../api/http/httpRequestApi';

export default function* tunnelInfoSaga() {
  try {
    while (true) {
      const { update } = yield race({
        update: take(WILL_INIT_TUNNEL)
        // toAdd: take(actionType.WILL_INIT_Tunnel),
        // toDelete: take(actionType.WILL_DELETE_Tunnel),
        // toEdit: take(actionType.WILL_EDIT_Tunnel)
      });
      if (update) {
        const res = yield call(getTunnelsApi);
        if (res.code !== '200') {
          return;
        }
        yield put({ type: tunnelActions.INIT, value: res.data });
      }
      // if (toAdd) {
      //   console.log(toAdd);
      //   yield put({ type: tunnelActions.ADD, value: toAdd.value });
      // }
      // if (toDelete) {
      //   console.log(toDelete);
      //   yield put({ type: tunnelActions.DELETE, value: toDelete.value });
      // }
      // if (toEdit) {
      //   console.log(toEdit);
      //   yield put({ type: tunnelActions.EDIT, value: toEdit.value });
      // }
      // console.log('正在更新数据');
    }
  } catch (err) {
    console.log(err);
  }
}
