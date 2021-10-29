import * as actionType from './action-types';

const actions = {
  deleteHostInfo(value: number) {
    return { type: actionType.WILL_DELETE, value };
  },
  addHostInfo(value: any) {
    return { type: actionType.WILL_ADD, value };
  },
  getValue() {
    return { type: actionType.GETDATA };
  },
};

export default actions;
