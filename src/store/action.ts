import * as actionType from './action-types';

const actions = {
  deleteHostInfo(value: number) {
    return { type: actionType.WILL_DELETE, value };
  },
  getValue() {
    return { type: actionType.GETDATA };
  },
};

export default actions;
